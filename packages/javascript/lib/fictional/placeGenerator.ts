// The fictional place generator: a country, a region, a city or a district of a
// world that does not exist, with or without the kind of place beside its name.
//
// A place is a name — drawn from the pools or invented, the way a fictional
// person's is — and maybe a kind out of `FICTIONAL_KINDS`, each language writing
// the kind in its own template. The name is spelled in all five scripts and the
// kind in all nine languages, so writing a place in another language is reading
// another column, the way it is for a name.

import { collect, resolveOptional, resolveRandom, resolveRealism } from '../_internal/generate.js';
import { rows } from '../_internal/parse.js';
import { chance, pick, withRandom } from '../_internal/utils.js';
import type {
	FictionalKindStyle,
	FictionalPlaceDetail,
	FictionalPlaceKind,
	LocationLevel,
	RandFictionalPlaceOptions,
	WordLanguage
} from '../_types/global.js';
import {
	FICTIONAL_KIND_CHANCE,
	FICTIONAL_KINDS,
	FICTIONAL_MIDDLE_CHANCE,
	FICTIONAL_PLACE_ENDINGS,
	FICTIONAL_PLACES,
	FICTIONAL_SYLLABLE_CHANCE
} from './data/index.js';
import { prefixIn, resolveBase, scriptOf } from './options.js';
import type { FictionalBase } from './options.js';
import {
	assemble,
	drawWord,
	halvesFor,
	makeCompound,
	makeGiven,
	pools,
	spanIn,
	spelledMatching
} from './pools.js';
import type { Room } from './pools.js';
import { LATIN, missBy, spelledRows } from './spelling.js';
import type { Spelling } from './spelling.js';

// Draws spent on one place before settling for the closest to the length range.
const FIT_ATTEMPTS = 12;

/** The letter each level goes by in the datasets' first cell. */
const LEVEL_LETTER: Readonly<Record<LocationLevel, string>> = {
	country: 'n',
	region: 'r',
	city: 'c',
	district: 'd'
};

/** Each language's two templates for a kind: the English word borrowed, and its own word. */
type Templates = Readonly<Record<WordLanguage, readonly [borrowed: string, translated: string]>>;

/** One kind of place, and how each language writes it. */
type Kind = {
	code: FictionalPlaceKind;
	levels: string;
	/** Whether a language borrows the kind's English word when `kindStyle` is left out. */
	borrowed: boolean;
	templates: Templates;
};

type PlacePools = {
	kinds: readonly Kind[];
	/** Each level's names, keyed by its letter. */
	stems: Readonly<Record<string, readonly Spelling[]>>;
	/** Each level's endings for an invented name, keyed by its letter. */
	endings: Readonly<Record<string, readonly Spelling[]>>;
};

let placePools: PlacePools | undefined;

function placeData(): PlacePools {
	if (!placePools) {
		const kinds = rows(FICTIONAL_KINDS).map((cells): Kind => {
			const [code, levels, style, en, ko, koT, ja, jaT, zh, ru, ruT, vi, es, it, de] = cells;

			return {
				code: code as FictionalPlaceKind,
				levels,
				borrowed: style === 'borrowed',
				templates: {
					en: [en, en],
					ko: [ko, koT],
					ja: [ja, jaT],
					zh: [zh, zh],
					ru: [ru, ruT],
					vi: [en, vi],
					es: [en, es],
					it: [en, it],
					de: [en, de]
				}
			};
		});
		const stems: Record<string, Spelling[]> = { n: [], r: [], c: [], d: [] };
		const endings: Record<string, Spelling[]> = { n: [], r: [] };

		for (const { cells, spelling } of spelledRows(FICTIONAL_PLACES)) {
			for (const letter of cells[0]) {
				stems[letter]?.push(spelling);
			}
		}

		// A district is named after a family as often as not, so it draws from the
		// surnames too; a surname the place pool already holds is one entry.
		const named = new Set(stems.d.map((stem) => stem[LATIN]));

		for (const surname of pools().surnames) {
			if (!named.has(surname[LATIN])) {
				stems.d.push(surname);
			}
		}

		for (const { cells, spelling } of spelledRows(FICTIONAL_PLACE_ENDINGS)) {
			for (const letter of cells[0]) {
				endings[letter]?.push(spelling);
			}
		}

		placePools = { kinds, stems, endings };
	}

	return placePools;
}

/** The template a language writes a kind in, `{}` standing for the name. */
function templateOf(kind: Kind, language: WordLanguage, style: FictionalKindStyle | null): string {
	const borrowed = style === null ? kind.borrowed : style === 'borrowed';

	return kind.templates[language][borrowed ? 0 : 1];
}

/** A template with the name written in. */
function fill(template: string, name: string): string {
	return template.split('{}').join(name);
}

type Settings = FictionalBase & {
	level: LocationLevel;
	/** `null` leaves the kind to chance. */
	kind: boolean | null;
	style: FictionalKindStyle | null;
	invent: number;
};

/** A name invented for a place on `level`, out of syllables or out of two halves. */
function makeStem(
	level: LocationLevel,
	script: number,
	prefix: string,
	room: Room
): Spelling | null {
	const letter = LEVEL_LETTER[level];

	if (!chance(FICTIONAL_SYLLABLE_CHANCE[level])) {
		return makeCompound(letter, script, prefix, room);
	}

	// A district built from syllables is named like a person: `Kalira Park`.
	if (level === 'district') {
		return makeGiven(chance(50) ? 'female' : 'male', script, prefix, room);
	}

	const { heads, middles } = pools();
	const endings = placeData().endings[letter];

	return assemble(
		chance(FICTIONAL_MIDDLE_CHANCE) ? [heads, middles, endings] : [heads, endings],
		script,
		prefix,
		room
	);
}

// What a name for a place on each level can come out at in each script, for the
// names the pools hold, the invented ones, or both, as `realism` draws them.
const stemSpanCache = /*#__PURE__*/ new Map<string, readonly [number, number]>();

function stemSpan(level: LocationLevel, script: number, invent: number): readonly [number, number] {
	const key = `${level}|${script}|${invent}`;
	let span = stemSpanCache.get(key);

	if (!span) {
		const letter = LEVEL_LETTER[level];
		const { heads, middles, ends } = pools();
		const { fronts, backs } = halvesFor(letter);
		const shapes: (readonly Spelling[])[][] = [];

		if (invent > 0 && FICTIONAL_SYLLABLE_CHANCE[level] < 100) {
			shapes.push([fronts, backs]);
		}

		if (invent > 0 && FICTIONAL_SYLLABLE_CHANCE[level] > 0) {
			const closing =
				level === 'district' ? [...ends.male, ...ends.female] : placeData().endings[letter];

			shapes.push([heads, closing], [heads, middles, closing]);
		}

		span = spanIn(invent < 100 ? placeData().stems[letter] : [], shapes, script);
		stemSpanCache.set(key, span);
	}

	return span;
}

const kindCache = /*#__PURE__*/ new Map<LocationLevel, readonly Kind[]>();

/** The kinds a place on `level` may be. */
function kindsOn(level: LocationLevel): readonly Kind[] {
	let kinds = kindCache.get(level);

	if (!kinds) {
		const letter = LEVEL_LETTER[level];

		kinds = placeData().kinds.filter((kind) => kind.levels.includes(letter));
		kindCache.set(level, kinds);
	}

	return kinds;
}

/** What a place on `level` in `language` can come out at, with or without a kind. */
function rangeOf(language: WordLanguage, settings: Omit<Settings, keyof FictionalBase>) {
	const [low, high] = stemSpan(settings.level, scriptOf(language), settings.invent);
	const overheads = kindsOn(settings.level).map(
		(kind) => templateOf(kind, language, settings.style).length - 2
	);
	const withKind = settings.kind !== false;
	const withoutKind = settings.kind !== true;

	return [
		withoutKind ? low : low + Math.min(...overheads),
		withKind ? high + Math.max(...overheads) : high
	] as const;
}

/** The kind written beside a place, or `null` for none. */
function chooseKind(language: WordLanguage, settings: Settings): Kind | null {
	const kinds = kindsOn(settings.level);

	if (!settings.bounds) {
		return (settings.kind ?? chance(FICTIONAL_KIND_CHANCE[settings.level])) ? pick(kinds) : null;
	}

	// A kind whose template leaves no name able to land inside the range is passed
	// over while another one leaves some, and when the range can only be met with a
	// kind or only without one, a kind left to chance is decided by the range.
	const [low, high] = stemSpan(settings.level, scriptOf(language), settings.invent);
	const [min, max] = settings.bounds;
	const fitting = kinds.filter((kind) => {
		const overhead = templateOf(kind, language, settings.style).length - 2;

		return overhead + high >= min && overhead + low <= max;
	});
	const bare = high >= min && low <= max;
	const include =
		settings.kind ??
		(fitting.length && !bare
			? true
			: !fitting.length && bare
				? false
				: chance(FICTIONAL_KIND_CHANCE[settings.level]));

	return include ? pick(fitting.length ? fitting : kinds) : null;
}

/** One place and the string it is told apart from others by, whatever language it is written in. */
type Drawn = { detail: FictionalPlaceDetail; key: string };

function draft(language: WordLanguage, settings: Settings): Drawn | null {
	const script = scriptOf(language);
	const prefix = prefixIn(settings.prefix, script);
	const kind = chooseKind(language, settings);
	const overhead = kind ? templateOf(kind, language, settings.style).length - 2 : 0;
	const room: Room = settings.bounds
		? [settings.bounds[0] - overhead, settings.bounds[1] - overhead]
		: null;
	const letter = LEVEL_LETTER[settings.level];
	const stem = drawWord(
		spelledMatching(placeData().stems[letter], script, prefix),
		() => makeStem(settings.level, script, prefix, room),
		settings.invent,
		script,
		prefix,
		room
	);

	// A kind the name already says is drawn again: `Port Galeport`, `Highmoor Moors`.
	if (!stem || (kind && stem[LATIN].toLowerCase().includes(kind.code.replace(/s$/, '')))) {
		return null;
	}

	const write = (code: WordLanguage) => {
		const name = stem[scriptOf(code)];

		return kind ? fill(templateOf(kind, code, settings.style), name) : name;
	};
	const forms: Partial<Record<WordLanguage, string>> = {};

	for (const code of settings.forms) {
		forms[code] = write(code);
	}

	return {
		detail: {
			place: write(language),
			name: stem[script],
			kind: kind?.code ?? null,
			level: settings.level,
			language,
			forms
		},
		key: `${stem[LATIN]}|${kind?.code ?? ''}`
	};
}

function generateOne(language: WordLanguage, settings: Settings): Drawn | null {
	let best: Drawn | null = null;
	let bestMiss = Infinity;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		const drawn = draft(language, settings);

		if (!drawn) {
			continue;
		}

		const miss = settings.bounds
			? missBy(drawn.detail.place.length, settings.bounds[0], settings.bounds[1])
			: 0;

		if (miss === 0) {
			return drawn;
		}

		if (miss < bestMiss) {
			best = drawn;
			bestMiss = miss;
		}
	}

	return best;
}

const KIND_STYLES: readonly FictionalKindStyle[] = ['borrowed', 'translated'];

export function generateFictionalPlaceDetails(
	level: LocationLevel,
	options: RandFictionalPlaceOptions = {}
): FictionalPlaceDetail[] {
	const own = {
		level,
		kind: typeof options.includeKind === 'boolean' ? options.includeKind : null,
		style: resolveOptional(options.kindStyle, KIND_STYLES),
		invent: resolveRealism(options.realism)
	};
	const settings: Settings = {
		...resolveBase(options, (language) => rangeOf(language, own)),
		...own
	};

	if (!settings.languages.length) {
		return [];
	}

	const results = withRandom(resolveRandom(options.random), () =>
		collect(
			// `startsWith` is the place's name, not its kind, and is checked as each
			// place is drawn: `Kingdom of Edlin` starts with `E`.
			{ count: options.count, unique: options.unique },
			() => generateOne(pick(settings.languages), settings),
			(drawn) => drawn?.detail.place ?? '',
			(drawn) => drawn?.key ?? ''
		)
	);

	return results.flatMap((drawn) => (drawn ? [drawn.detail] : []));
}
