// The name generator itself. Internal — `randName` and `randNameDetails` are
// the public entry points.
//
// - At `realism: 'real'`, names come out of the curated pools: whole
//   given names for CJK, given/surname pools for the other scripts.
// - At `'invented'` they are built instead — Latin and Cyrillic
//   scripts from syllable templates, CJK by combining given-name syllables.
// - The structure the caller asked for (surname, middle name, starting letter) is
//   always honoured. The length range is satisfied by re-drawing from the pools;
//   a range no draw landed in is answered by drawing each part from the lengths
//   that can still reach it, and only then padded with extra middle names.
// - Every name is produced in both scripts, native and romanized.

import {
	collect,
	drawLanguage,
	lengthBounds,
	resolveLength,
	resolvePrefix,
	resolveRealism
} from '../_internal/generate.js';
import { capitalizeFirst, chance, clamp, pick, pickWeighted, randInt } from '../_internal/utils.js';
import type { NameDetail, NameGender, NameLanguage, RandNameOptions } from '../_types/global.js';
import { NAME_DATA, NAME_LANGUAGES } from './data/index.js';
import type { NameLanguageData, NamePool, NameToken, SyllableSet } from './data/types.js';
import { nameLengthRange } from './nameLengthRange.js';
import { romanize, romanizeHangul } from './romanize.js';

// One name part, or a whole name, in both scripts.
type Entry = { n: string; r: string };

type Parts = { given: Entry; surname: Entry | null; middles: Entry[] };

// Everything a single name needs, with defaults already applied. The length
// bounds stay optional here: left out, they are resolved per language, so mixing
// languages does not stretch a Korean name to fill a Spanish name's range.
type Settings = {
	gender: 'male' | 'female' | 'all';
	includeSurname: boolean;
	includeMiddleName: boolean;
	minLength?: number;
	maxLength?: number;
	// How often one part is invented rather than drawn, as a percentage.
	invent: number;
	prefix: string;
};

// How many draws to spend looking for a name that lands inside the length range
// before settling for the closest one found.
const FIT_ATTEMPTS = 12;

// Draw weight for given-name lengths the language itself never uses, on the same
// 0-100 scale as `givenLenWeights`. Only in play once the range is stretched past
// those lengths, where it also floors the natural weights so that no real length
// ends up rarer than an invented one.
const STRETCHED_LEN_WEIGHT = 40;

// Draw weight for a surname the language's frequency table leaves out, on the
// same tenths-of-a-percent scale the tables are written in. Only languages that
// have a table are affected; the rest keep drawing surnames evenly.
const LAST_WEIGHT_DEFAULT = 1;

const nativeOf = (item: string | NameToken): string => (typeof item === 'string' ? item : item.n);

/** Pool items whose native form begins with `prefix` (case-insensitive). */
function startingWith(pool: NamePool, prefix: string): NamePool {
	const lower = prefix.toLowerCase();

	return pool.filter((item) => nativeOf(item).toLowerCase().startsWith(lower));
}

/** The shortest and longest item a pool holds, in characters of the native form. */
function spanOf(pool: NamePool): [number, number] {
	const lengths = pool.map((item) => nativeOf(item).length);

	return [Math.min(...lengths), Math.max(...lengths)];
}

/**
 * How far a length falls outside the range. A score to rank names by rather than a
 * character count: overshooting scores half a character more than falling short by
 * the same amount, because `maxLength` is the bound a caller is usually holding to
 * — a field limit, a column width — where `minLength` only shapes how a name reads.
 */
function missBy(length: number, min: number, max: number): number {
	if (length < min) {
		return min - length;
	}

	if (length > max) {
		return length - max + 0.5;
	}

	return 0;
}

/**
 * Pool items between `low` and `high` characters long, or the ones closest to that
 * window when the pool holds none inside it.
 */
function lengthsBetween(pool: NamePool, low: number, high: number): NamePool {
	const missOf = (item: string | NameToken): number => missBy(nativeOf(item).length, low, high);
	const inside = pool.filter((item) => missOf(item) === 0);

	if (inside.length) {
		return inside;
	}

	const closest = Math.min(...pool.map(missOf));

	return pool.filter((item) => missOf(item) === closest);
}

/**
 * A pool narrowed to the lengths one part may take: `spent` is what the name
 * already costs, and `rest` the shortest and longest the parts behind it can
 * still total. A null `fit` hands the pool straight back, which is what every
 * draw outside the length fitting passes.
 */
function fitted(
	pool: NamePool,
	fit: readonly [number, number] | null,
	spent: number,
	rest: readonly [number, number]
): NamePool {
	if (!fit) {
		return pool;
	}

	return lengthsBetween(pool, fit[0] - spent - rest[1], fit[1] - spent - rest[0]);
}

/**
 * Draw one pool item. Surnames follow the language's own frequency table where it
 * has one, so 김 leads a fifth of the Korean names rather than a seventy-fifth,
 * and Nguyễn two Vietnamese names in five. Given names stay an even draw — a
 * curated pool is already a list of names in use, with no comparable skew.
 */
function pickPooled(
	pool: NamePool,
	data: NameLanguageData,
	part: 'surname' | 'given'
): string | NameToken {
	const table = part === 'surname' ? data.lastWeights : undefined;

	if (!table) {
		return pick(pool);
	}

	return pickWeighted(pool, (item) => table[nativeOf(item)] ?? LAST_WEIGHT_DEFAULT);
}

/** Pick one pool item as a native + romanized entry. */
function pickEntry(pool: NamePool, data: NameLanguageData, part: 'surname' | 'given'): Entry {
	const item = pickPooled(pool, data, part);

	if (typeof item !== 'string') {
		return { n: item.n, r: item.r };
	}

	return { n: item, r: romanize(data.roman, item, part) };
}

// --- Invented names ---------------------------------------------------------

/**
 * Build a pronounceable invented part from syllable templates. `prefix` replaces
 * the first onset, so a requested starting letter that no real name uses still
 * leads a name that reads naturally (Q -> "Quen").
 */
function synthToken(syn: SyllableSet, prefix?: string): string {
	const syllables = randInt(syn.minSyllables, syn.maxSyllables);
	let out = '';

	for (let i = 0; i < syllables; i += 1) {
		out += (i === 0 && prefix ? prefix.toLowerCase() : pick(syn.onset)) + pick(syn.vowel);

		if (i === syllables - 1) {
			out += pick(syn.coda);
		}
	}

	return capitalizeFirst(out);
}

function synthEntry(data: NameLanguageData, prefix?: string): Entry {
	const n = synthToken(data.syn!, prefix);

	return { n, r: romanize(data.roman, n, 'given') };
}

/**
 * Pick the part that leads the full name when the caller asked for a starting
 * character. Prefers a real name that already starts with it; otherwise invents
 * one (Latin/Cyrillic) or uses the character verbatim (CJK, where any syllable is
 * a usable name part — so 앙 + 지수 -> 앙지수).
 */
function leadEntry(
	data: NameLanguageData,
	pool: NamePool,
	part: 'surname' | 'given',
	prefix: string
): Entry {
	const matches = startingWith(pool, prefix);

	if (matches.length) {
		return pickEntry(matches, data, part);
	}

	if (data.syn) {
		return synthEntry(data, prefix);
	}

	return { n: prefix, r: romanize(data.roman, prefix, part) };
}

// --- CJK given names --------------------------------------------------------

/** Compose an invented CJK given name of exactly `length` syllables. */
function composeGiven(
	data: NameLanguageData,
	isMale: boolean,
	length: number,
	prefix: string
): Entry {
	const firstPool = (isMale ? data.firstMale : data.firstFemale)!;
	const restPool = (isMale ? data.restMale : data.restFemale)!;

	const matches = prefix ? startingWith(firstPool, prefix) : firstPool;
	const parts: (string | NameToken)[] = [matches.length ? pick(matches) : prefix];

	for (let i = 1; i < length; i += 1) {
		// Avoid immediately repeating the previous syllable (e.g. 敏敏).
		let part = pick(restPool);

		for (
			let tries = 0;
			tries < 3 && nativeOf(part) === nativeOf(parts[parts.length - 1]);
			tries += 1
		) {
			part = pick(restPool);
		}

		parts.push(part);
	}

	const n = parts.map(nativeOf).join('');

	if (data.roman === 'hangul') {
		return { n, r: capitalizeFirst(romanizeHangul(n)) };
	}

	// Kanji and hanzi carry their own reading, but a syllable the caller passed to
	// `startsWith` has none — fall back to the character itself rather than
	// dropping it from the romanization.
	const r = parts.map((part) => (typeof part === 'string' ? part : part.r)).join('');

	return { n, r: capitalizeFirst(r) };
}

/**
 * A real CJK given name that fits the length range, or null when the pool holds
 * none. The length follows the language's own distribution, but only over the
 * lengths the pool can actually serve: rolling a length first and then looking it
 * up would drop through to an invented name at `realism: 'real'` whenever the pool has
 * no real name of that length — Korean lists three-syllable given names in its
 * weights and holds none, so one name in twenty-five came out invented.
 */
function curatedGiven(
	data: NameLanguageData,
	isMale: boolean,
	min: number,
	max: number,
	prefix: string
): Entry | null {
	const pool = isMale ? data.givenMale : data.givenFemale;

	if (!pool) {
		return null;
	}

	let candidates: NamePool = pool.filter((item) => {
		const length = nativeOf(item).length;

		return length >= min && length <= max;
	});

	if (prefix) {
		candidates = startingWith(candidates, prefix);
	}

	if (!candidates.length) {
		return null;
	}

	const available = new Set(candidates.map((item) => nativeOf(item).length));
	const length = pickGivenLength(data, min, max, available);
	const fitting = candidates.filter((item) => nativeOf(item).length === length);

	return pickEntry(fitting.length ? fitting : candidates, data, 'given');
}

/**
 * How many syllables the given name should have. Inside the lengths the language
 * actually uses, follow its natural distribution. A range stretched past them is
 * a deliberate ask for names the language does not have — realism is gone either
 * way, so spread the draw over the whole range and leave the common lengths only
 * a bump, rather than capping at the longest length the table happens to list.
 *
 * `available` restricts the draw to the lengths a curated pool holds. Stretching
 * is off in that case: the pool, not the range, is what the caller gets.
 */
function pickGivenLength(
	data: NameLanguageData,
	min: number,
	max: number,
	available?: ReadonlySet<number>
): number {
	const weights = data.givenLenWeights;

	if (weights) {
		const stretched = !available && max > Math.max(...Object.keys(weights).map(Number));
		const options: [number, number][] = [];

		for (let length = min; length <= max; length += 1) {
			if (available && !available.has(length)) {
				continue;
			}

			const natural = weights[length] ?? 0;
			const weight = stretched ? Math.max(natural, STRETCHED_LEN_WEIGHT) : natural;

			if (weight > 0) {
				options.push([length, weight]);
			}
		}

		// A pool can hold a length the weight table does not list. Draw evenly over
		// what it holds rather than falling through to a fixed length outside it.
		if (!options.length && available) {
			for (const length of available) {
				options.push([length, 1]);
			}
		}

		const total = options.reduce((sum, [, weight]) => sum + weight, 0);

		if (total > 0) {
			let roll = Math.random() * total;

			for (const [length, weight] of options) {
				roll -= weight;

				if (roll <= 0) {
					return length;
				}
			}
		}
	}

	return clamp(2, min, max);
}

// --- Assembly ---------------------------------------------------------------

function assemble(data: NameLanguageData, parts: Parts): Entry {
	const sequence =
		data.order === 'family-first'
			? [parts.surname, ...parts.middles, parts.given]
			: [parts.given, ...parts.middles, parts.surname];
	const kept = sequence.filter((entry): entry is Entry => !!entry);

	return {
		n: kept.map((entry) => entry.n).join(data.joiner),
		r: kept.map((entry) => entry.r).join(' ')
	};
}

/** True when the surname is the part the full name starts with. */
function surnameLeads(data: NameLanguageData, includeSurname: boolean): boolean {
	return data.order === 'family-first' && includeSurname;
}

// --- Per-name generation ----------------------------------------------------

function generateCjk(
	data: NameLanguageData,
	settings: Settings,
	isMale: boolean,
	minLength: number,
	maxLength: number
): Entry {
	const { prefix } = settings;
	const leadsWithSurname = surnameLeads(data, settings.includeSurname);

	let surname: Entry | null = null;

	if (settings.includeSurname) {
		surname = leadsWithSurname
			? leadEntry(data, data.last, 'surname', prefix)
			: pickEntry(data.last, data, 'surname');
	}

	let surnameLength = surname ? surname.n.length : 0;
	let min = Math.max(1, minLength - surnameLength);
	let max = maxLength - surnameLength;

	if (max < min && surname) {
		// A multi-character surname alone overflows the range — drop it.
		surname = null;
		surnameLength = 0;
		min = Math.max(1, minLength);
		max = Math.max(min, maxLength);
	}

	max = Math.max(min, max);

	const givenPrefix = leadsWithSurname ? '' : prefix;
	const drawGiven = (): Entry => {
		if (!chance(settings.invent)) {
			const real = curatedGiven(data, isMale, min, max, givenPrefix);

			if (real) {
				return real;
			}
		}

		return composeGiven(data, isMale, pickGivenLength(data, min, max), givenPrefix);
	};

	// Re-draw when the given name repeats the surname syllable (서 + 서연 -> 서서연).
	let given = drawGiven();

	for (let tries = 0; tries < 4 && surname && given.n.startsWith(surname.n); tries += 1) {
		given = drawGiven();
	}

	return assemble(data, { given, surname, middles: [] });
}

/** Feminize a masculine Russian surname (Иванов -> Иванова, ...ский -> ...ская). */
function feminizeRu(surname: string): string {
	if (surname.endsWith('ский')) return `${surname.slice(0, -2)}ая`;
	if (surname.endsWith('ой')) return `${surname.slice(0, -2)}ая`;
	if (/[оеё]в$|ин$|ын$/.test(surname)) return `${surname}а`;

	return surname;
}

/**
 * Draw one structurally complete space-separated name.
 *
 * `fit` is the length range the whole name has to land in, and it is null for
 * every draw the length fitting makes on its own: an even draw over the pools is
 * what keeps each part's length distribution the language's own, and re-drawing is
 * how a range is normally met. A range here is the last resort, and it is spent
 * from left to right — each part is drawn from the lengths that still leave the
 * parts behind it able to reach it. Nothing is invented under one, because a
 * syllable template cannot be asked to come out a given length.
 */
function drawParts(
	data: NameLanguageData,
	settings: Settings,
	isMale: boolean,
	fit: readonly [number, number] | null = null
): Parts {
	const givenPool = (isMale ? data.male : data.female)!;
	const middlePool =
		settings.includeMiddleName && data.hasMiddle
			? isMale
				? (data.middleMale ?? givenPool)
				: (data.middleFemale ?? givenPool)
			: null;
	const leadsWithSurname = surnameLeads(data, settings.includeSurname);
	const givenPrefix = leadsWithSurname ? '' : settings.prefix;
	const invent = fit ? 0 : settings.invent;
	// Only a fitted draw measures the pools. They run to a few hundred entries, and
	// every attempt of a normal draw would pay for the scan.
	const gaps = fit
		? (settings.includeSurname ? data.joiner.length : 0) + (middlePool ? data.joiner.length : 0)
		: 0;
	const lastSpan: [number, number] = fit && settings.includeSurname ? spanOf(data.last) : [0, 0];
	const middleSpan: [number, number] = fit && middlePool ? spanOf(middlePool) : [0, 0];
	// Feminizing a Russian surname can add a character (Иванов -> Иванова), which
	// is a character the range has to account for before any pool is narrowed.
	const inflates = settings.includeSurname && data.roman === 'translit' && !isMale ? 1 : 0;

	let given: Entry;

	if (data.syn && chance(invent)) {
		given = synthEntry(data, givenPrefix || undefined);
	} else {
		const pool = fitted(givenPool, fit, gaps + inflates, [
			lastSpan[0] + middleSpan[0],
			lastSpan[1] + middleSpan[1]
		]);

		given = givenPrefix
			? leadEntry(data, pool, 'given', givenPrefix)
			: pickEntry(pool, data, 'given');
	}

	let surname: Entry | null = null;

	if (settings.includeSurname) {
		const surnamePrefix = leadsWithSurname ? settings.prefix : '';
		const pool = fitted(data.last, fit, gaps + given.n.length + inflates, middleSpan);

		if (data.syn && chance(invent)) {
			surname = synthEntry(data, surnamePrefix || undefined);
		} else if (surnamePrefix) {
			surname = leadEntry(data, pool, 'surname', surnamePrefix);
		} else {
			let native = nativeOf(pickPooled(pool, data, 'surname'));

			if (data.roman === 'translit' && !isMale) {
				native = feminizeRu(native);
			}

			surname = { n: native, r: romanize(data.roman, native, 'surname') };
		}
	}

	const middles: Entry[] = [];

	if (middlePool) {
		const spent = gaps + given.n.length + (surname ? surname.n.length : 0);
		const pool = fitted(middlePool, fit, spent, [0, 0]);
		// Languages without a dedicated middle-name pool reuse given names, so
		// re-draw rather than hand out "Levi Levi Cole".
		let middle = pickEntry(pool, data, 'given');

		for (let tries = 0; tries < 4 && middle.n === given.n; tries += 1) {
			middle = pickEntry(pool, data, 'given');
		}

		middles.push(middle);
	}

	return { given, surname, middles };
}

function generateSpaced(
	data: NameLanguageData,
	settings: Settings,
	isMale: boolean,
	minLength: number,
	maxLength: number
): Entry {
	// Re-draw rather than trim: shortening a name by dropping parts would throw
	// away the surname or middle name the caller explicitly asked for.
	let best: Parts | null = null;
	let bestDistance = Infinity;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		const parts = drawParts(data, settings, isMale);
		const length = assemble(data, parts).n.length;

		if (length >= minLength && length <= maxLength) {
			return assemble(data, parts);
		}

		const distance = missBy(length, minLength, maxLength);

		if (distance < bestDistance) {
			bestDistance = distance;
			best = parts;
		}
	}

	let parts = best!;
	// Every attempt missed. An even draw will not turn up `Ann Cox` or `Maximilian`
	// by chance when most of the pool is the wrong length, so draw each part from
	// the lengths that can still land inside the range — and keep that draw only if
	// it came closer than the twelve honest ones did.
	const aimed = drawParts(data, settings, isMale, [minLength, maxLength]);

	if (missBy(assemble(data, aimed).n.length, minLength, maxLength) < bestDistance) {
		parts = aimed;
	}

	// Still short of the minimum: pad with extra given names, English-style.
	const givenPool = (isMale ? data.male : data.female)!;
	const used = new Set([parts.given.n, ...parts.middles.map((entry) => entry.n)]);

	for (let guard = 0; guard < 16; guard += 1) {
		const length = assemble(data, parts).n.length;

		if (length >= minLength) {
			break;
		}

		// Pad with a part that still leaves the name inside the range, and that is
		// not in the name already — "Paul Paul Vincent Edwards" reads as a mistake.
		const room = maxLength - length - data.joiner.length;
		const fits = givenPool.filter((item) => nativeOf(item).length <= room);

		if (!fits.length) {
			// Nothing in the pool is short enough to add. Stop here: a name left a
			// few characters short of the minimum is closer to what was asked for
			// than one carrying a whole extra part past the maximum.
			break;
		}

		const fresh = fits.filter((item) => !used.has(nativeOf(item)));
		const pad = pickEntry(fresh.length ? fresh : fits, data, 'given');

		used.add(pad.n);
		parts.middles.push(pad);
	}

	return assemble(data, parts);
}

/**
 * Length range for one language: what the caller asked for, falling back to the
 * language's own natural range for whichever bound was left out.
 */
function boundsFor(language: NameLanguage, settings: Settings): [number, number] {
	const [naturalMin, naturalMax] = nameLengthRange(
		language,
		settings.includeSurname,
		settings.includeMiddleName
	);

	return lengthBounds(settings.minLength, settings.maxLength, naturalMin, naturalMax);
}

function generateOne(language: NameLanguage, settings: Settings): NameDetail {
	const data = NAME_DATA[language];
	const gender: NameGender =
		settings.gender === 'all' ? (Math.random() < 0.5 ? 'male' : 'female') : settings.gender;
	const isMale = gender === 'male';
	const [min, max] = boundsFor(language, settings);
	const entry =
		data.joiner === ''
			? generateCjk(data, settings, isMale, min, max)
			: generateSpaced(data, settings, isMale, min, max);

	return { native: entry.n, roman: entry.r, language, gender };
}

/** Resolve the caller's options into the settings a single name is built from. */
function resolveSettings(options: RandNameOptions): Settings {
	return {
		gender: options.gender ?? 'all',
		includeSurname: options.includeSurname ?? true,
		includeMiddleName: options.includeMiddleName ?? false,
		minLength: resolveLength(options.minLength),
		maxLength: resolveLength(options.maxLength),
		invent: resolveRealism(options.realism),
		prefix: resolvePrefix(options.startsWith)
	};
}

/**
 * One name in `language`, drawn the way `randName` would draw it.
 *
 * Internal, and the only way into this generator from outside `lib/name`:
 * `randSentence` writes a person's name where a sentence has room for one, and it
 * has no business resolving `randName`'s options itself.
 */
export function drawName(language: NameLanguage, options: RandNameOptions = {}): NameDetail {
	return generateOne(language, resolveSettings(options));
}

export function generateNameDetails(options: RandNameOptions = {}): NameDetail[] {
	const language = options.language ?? 'all';
	const settings = resolveSettings(options);

	return collect(
		options,
		() => generateOne(drawLanguage(language, NAME_LANGUAGES), settings),
		(detail) => detail.native
	);
}
