// The name generator itself. Internal — `randomName` and `randomNameDetails` are
// the public entry points.
//
// - At the realistic end of `style`, names come out of the curated pools: whole
//   given names for CJK, given/surname pools for the other scripts.
// - Toward the abstract end they are invented instead — Latin and Cyrillic
//   scripts from syllable templates, CJK by combining given-name syllables.
// - The structure the caller asked for (surname, middle name, starting letter) is
//   always honoured. The length range is satisfied by re-drawing from the pools,
//   and only padded with extra middle names when no draw can reach the minimum.
// - Every name is produced in both scripts, native and romanized.

import { capitalizeFirst, chance, clamp, pick, pickWeighted, randInt } from '../_internal/utils.js';
import type { NameDetail, NameGender, NameLanguage, RandomNameOptions } from '../_types/global.js';
import {
	NAME_COUNT_MAX,
	NAME_DATA,
	NAME_LANGUAGES,
	NAME_LENGTH_MAX,
	NAME_LENGTH_MIN
} from './data/index.js';
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
	style: number;
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

/** A real CJK given name of exactly `length` syllables, or null when none qualifies. */
function curatedGiven(
	data: NameLanguageData,
	isMale: boolean,
	length: number,
	prefix: string
): Entry | null {
	const pool = isMale ? data.givenMale : data.givenFemale;

	if (!pool) {
		return null;
	}

	let candidates: NamePool = pool.filter((item) => nativeOf(item).length === length);

	if (prefix) {
		candidates = startingWith(candidates, prefix);
	}

	if (!candidates.length) {
		return null;
	}

	return pickEntry(candidates, data, 'given');
}

/**
 * How many syllables the given name should have. Inside the lengths the language
 * actually uses, follow its natural distribution. A range stretched past them is
 * a deliberate ask for names the language does not have — realism is gone either
 * way, so spread the draw over the whole range and leave the common lengths only
 * a bump, rather than capping at the longest length the table happens to list.
 */
function pickGivenLength(data: NameLanguageData, min: number, max: number): number {
	const weights = data.givenLenWeights;

	if (weights) {
		const stretched = max > Math.max(...Object.keys(weights).map(Number));
		const options: [number, number][] = [];

		for (let length = min; length <= max; length += 1) {
			const natural = weights[length] ?? 0;
			const weight = stretched ? Math.max(natural, STRETCHED_LEN_WEIGHT) : natural;

			if (weight > 0) {
				options.push([length, weight]);
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

	const length = pickGivenLength(data, min, max);
	const givenPrefix = leadsWithSurname ? '' : prefix;
	const drawGiven = () =>
		(chance(settings.style) ? null : curatedGiven(data, isMale, length, givenPrefix)) ??
		composeGiven(data, isMale, length, givenPrefix);

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

/** Draw one structurally complete space-separated name, ignoring the length range. */
function drawParts(data: NameLanguageData, settings: Settings, isMale: boolean): Parts {
	const givenPool = (isMale ? data.male : data.female)!;
	const leadsWithSurname = surnameLeads(data, settings.includeSurname);
	const givenPrefix = leadsWithSurname ? '' : settings.prefix;

	let given: Entry;

	if (data.syn && chance(settings.style)) {
		given = synthEntry(data, givenPrefix || undefined);
	} else if (givenPrefix) {
		given = leadEntry(data, givenPool, 'given', givenPrefix);
	} else {
		given = pickEntry(givenPool, data, 'given');
	}

	let surname: Entry | null = null;

	if (settings.includeSurname) {
		const surnamePrefix = leadsWithSurname ? settings.prefix : '';

		if (data.syn && chance(settings.style)) {
			surname = synthEntry(data, surnamePrefix || undefined);
		} else if (surnamePrefix) {
			surname = leadEntry(data, data.last, 'surname', surnamePrefix);
		} else {
			let native = nativeOf(pickPooled(data.last, data, 'surname'));

			if (data.roman === 'translit' && !isMale) {
				native = feminizeRu(native);
			}

			surname = { n: native, r: romanize(data.roman, native, 'surname') };
		}
	}

	const middles: Entry[] = [];

	if (settings.includeMiddleName && data.hasMiddle) {
		const middlePool = isMale ? (data.middleMale ?? givenPool) : (data.middleFemale ?? givenPool);
		// Languages without a dedicated middle-name pool reuse given names, so
		// re-draw rather than hand out "Levi Levi Cole".
		let middle = pickEntry(middlePool, data, 'given');

		for (let tries = 0; tries < 4 && middle.n === given.n; tries += 1) {
			middle = pickEntry(middlePool, data, 'given');
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

		const distance = length < minLength ? minLength - length : length - maxLength;

		if (distance < bestDistance) {
			bestDistance = distance;
			best = parts;
		}
	}

	const parts = best!;
	// Still short of the minimum: pad with extra given names, English-style.
	const givenPool = (isMale ? data.male : data.female)!;
	const required = parts.middles.length;
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
		const fresh = fits.filter((item) => !used.has(nativeOf(item)));
		const pad = pickEntry(fresh.length ? fresh : fits.length ? fits : givenPool, data, 'given');

		used.add(pad.n);
		parts.middles.push(pad);
	}

	// Padding can overshoot; drop pads back off, never the requested middle name.
	while (assemble(data, parts).n.length > maxLength && parts.middles.length > required) {
		const popped = parts.middles.pop()!;

		if (assemble(data, parts).n.length < minLength) {
			parts.middles.push(popped);
			break;
		}
	}

	return assemble(data, parts);
}

/**
 * Length range for one language: what the caller asked for, falling back to the
 * language's own natural range for whichever bound was left out.
 */
function lengthBounds(language: NameLanguage, settings: Settings): [number, number] {
	const [naturalMin, naturalMax] = nameLengthRange(
		language,
		settings.includeSurname,
		settings.includeMiddleName
	);
	const min = clamp(settings.minLength ?? naturalMin, NAME_LENGTH_MIN, NAME_LENGTH_MAX);
	const max = clamp(settings.maxLength ?? naturalMax, NAME_LENGTH_MIN, NAME_LENGTH_MAX);

	return [min, Math.max(min, max)];
}

function generateOne(language: NameLanguage, settings: Settings): NameDetail {
	const data = NAME_DATA[language];
	const gender: NameGender =
		settings.gender === 'all' ? (Math.random() < 0.5 ? 'male' : 'female') : settings.gender;
	const isMale = gender === 'male';
	const [min, max] = lengthBounds(language, settings);
	const entry =
		data.joiner === ''
			? generateCjk(data, settings, isMale, min, max)
			: generateSpaced(data, settings, isMale, min, max);

	return { native: entry.n, roman: entry.r, language, gender };
}

/** Resolve the caller's options into the settings a single name is built from. */
function resolveSettings(options: RandomNameOptions): Settings {
	return {
		gender: options.gender ?? 'all',
		includeSurname: options.includeSurname ?? true,
		includeMiddleName: options.includeMiddleName ?? false,
		minLength: options.minLength === undefined ? undefined : Math.floor(options.minLength),
		maxLength: options.maxLength === undefined ? undefined : Math.floor(options.maxLength),
		style: clamp(options.style ?? 0, 0, 100),
		prefix: (options.startsWith ?? '').trim().slice(0, 1)
	};
}

export function generateNameDetails(options: RandomNameOptions = {}): NameDetail[] {
	const language = options.language ?? 'all';
	const count = clamp(Math.floor(options.count ?? 1), 0, NAME_COUNT_MAX);
	const unique = options.unique ?? false;
	const settings = resolveSettings(options);
	const prefix = settings.prefix.toLowerCase();

	const seen = new Set<string>();
	const names: NameDetail[] = [];
	// Generous enough that a plain request always fills up, while still ending a
	// `unique` request whose pool has run out of combinations.
	const maxAttempts = count * 50 + 500;
	let attempts = 0;

	while (names.length < count && attempts < maxAttempts) {
		attempts += 1;

		const detail = generateOne(language === 'all' ? pick(NAME_LANGUAGES) : language, settings);

		if (!detail.native) continue;
		if (prefix && !detail.native.toLowerCase().startsWith(prefix)) continue;

		if (unique) {
			if (seen.has(detail.native)) continue;

			seen.add(detail.native);
		}

		names.push(detail);
	}

	return names;
}
