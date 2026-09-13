// The location generator: one real division, or a whole location written out,
// drawn from the outline a language's dataset carries.
//
// Nothing here invents. A draw is an index into a list of divisions the country
// itself published, and every option narrows that list rather than shaping what
// is drawn from it — which is what keeps a Korean 동 inside the 구 it belongs to.

import {
	collect,
	languagesWriting,
	lengthBounds,
	resolveLength,
	resolvePrefix,
	resolveRandom
} from '../_internal/generate.js';
import { outline } from '../_internal/parse.js';
import type { OutlineEntry } from '../_internal/parse.js';
import { pick, randInt, withRandom } from '../_internal/utils.js';
import { RAND_LOCATION_LENGTH_MAX } from '../constants.js';
import type {
	LocationDetail,
	LocationLanguage,
	LocationLevel,
	RandLocationUnitOptions
} from '../_types/global.js';
import {
	LOCATION_DATA,
	LOCATION_LANGUAGES,
	LOCATION_LEVELS,
	resolveLocationLanguage
} from './data/index.js';
import type { LocationLanguageData } from './data/types.js';

/**
 * What one draw hands back: a single division's name (`randCity`), or every
 * level down to it written out the way the language writes a location
 * (`randLocation`).
 */
export type LocationForm = 'unit' | 'path';

/**
 * The divisions one kind of draw may land on, with what each is written as. The
 * text is worked out once, because every length and `startsWith` filter reads it
 * and a US list is thirty-two thousand of them.
 */
type Pool = {
	data: LocationLanguageData;
	language: LocationLanguage;
	form: LocationForm;
	// `null` for the country, which the outline does not hold.
	entries: readonly (OutlineEntry | null)[];
	texts: readonly string[];
	shortest: number;
	longest: number;
	// The last narrowing asked of this pool, which is the one a loop of single
	// draws asks again: filtering thirty-two thousand names costs a millisecond,
	// and a caller drawing one at a time would pay it every call.
	narrowed?: { key: string; indexes: readonly number[] };
};

// Parsed once per dataset, on the first draw that needs it rather than at import:
// importing the package should not cost a split of every division it ships.
const entryCache = new WeakMap<LocationLanguageData, readonly OutlineEntry[]>();

function entriesOf(data: LocationLanguageData): readonly OutlineEntry[] {
	let entries = entryCache.get(data);

	if (!entries) {
		entries = outline(data.outline, data.levels.length);
		entryCache.set(data, entries);
	}

	return entries;
}

/** Which of the four levels an outline depth is, as an index into `LOCATION_LEVELS`. */
function rankOf(data: LocationLanguageData, depth: number): number {
	return LOCATION_LEVELS.indexOf(data.levels[depth]);
}

/**
 * The divisions a draw at `level` may land on.
 *
 * A single division is one at exactly that level, so a country without the level
 * has none. A location written out stops at the deepest level the country has at
 * or above the one asked for, and at any division with nothing inside it at that
 * depth: `randLocation({ level: 'city' })` has to be able to reach
 * 세종특별자치시, which has no 시·군·구 and whose branch stops at the region.
 */
function entriesAt(
	data: LocationLanguageData,
	form: LocationForm,
	level: LocationLevel
): readonly (OutlineEntry | null)[] {
	const wanted = LOCATION_LEVELS.indexOf(level);

	if (wanted === 0) {
		return [null];
	}

	const entries = entriesOf(data);

	if (form === 'unit') {
		return entries.filter((entry) => rankOf(data, entry.depth) === wanted);
	}

	let limit = -1;

	data.levels.forEach((_, depth) => {
		if (rankOf(data, depth) <= wanted) {
			limit = depth;
		}
	});

	return entries.filter(
		(entry) =>
			entry.depth === limit ||
			(entry.depth < limit && (entry.below === null || entry.below > limit))
	);
}

/** One result, built fresh per draw so a caller can never reach the pool's own arrays. */
function detailOf(pool: Pool, entry: OutlineEntry | null): LocationDetail {
	const { data } = pool;
	const named: Record<'region' | 'city' | 'district', string | null> = {
		region: null,
		city: null,
		district: null
	};

	if (!entry) {
		return {
			location: data.country,
			language: pool.language,
			level: 'country',
			country: data.country,
			...named
		};
	}

	data.levels.forEach((level, depth) => {
		named[level] = entry.path[depth] ?? null;
	});

	const parts = [data.country, ...entry.path].filter((part): part is string => part !== null);
	const name = entry.path[entry.depth] as string;

	return {
		location:
			pool.form === 'unit'
				? name
				: (data.order === 'largest-first' ? parts : parts.reverse()).join(data.joiner),
		language: pool.language,
		level: data.levels[entry.depth],
		country: data.country,
		...named
	};
}

// One pool per language, form and level, each built the first time it is drawn from.
const poolCache = new WeakMap<LocationLanguageData, Map<string, Pool>>();

function poolOf(language: LocationLanguage, form: LocationForm, level: LocationLevel): Pool {
	const data = LOCATION_DATA[language];
	let byKind = poolCache.get(data);

	if (!byKind) {
		byKind = new Map();
		poolCache.set(data, byKind);
	}

	const key = `${form}:${level}`;
	const cached = byKind.get(key);

	if (cached) {
		return cached;
	}

	const entries = entriesAt(data, form, level);
	const pool: Pool = { data, language, form, entries, texts: [], shortest: 0, longest: 0 };
	const texts = entries.map((entry) => detailOf(pool, entry).location);
	let shortest = Infinity;
	let longest = 0;

	// A loop rather than `Math.min(...lengths)`: spreading thirty-two thousand
	// arguments is close enough to the engine's limit to fail on the next dataset.
	for (const text of texts) {
		shortest = Math.min(shortest, text.length);
		longest = Math.max(longest, text.length);
	}

	pool.texts = texts;
	pool.shortest = texts.length ? shortest : 0;
	pool.longest = longest;
	byKind.set(key, pool);

	return pool;
}

/**
 * The indexes of a pool one call may draw from once `startsWith` and the length
 * range have had their say, or `null` for all of them when neither was asked.
 *
 * A range nothing in the pool fits is answered with the divisions closest to it
 * rather than with none, the way every other generator answers one — and an
 * overshoot counts half a character worse than an undershoot, because
 * `maxLength` is the bound a caller is usually holding to.
 */
function narrow(
	pool: Pool,
	prefix: string,
	minLength: number | undefined,
	maxLength: number | undefined
): readonly number[] | null {
	if (!prefix && minLength === undefined && maxLength === undefined) {
		return null;
	}

	const key = `${prefix}|${minLength}|${maxLength}`;

	if (pool.narrowed?.key === key) {
		return pool.narrowed.indexes;
	}

	const indexes = narrowAfresh(pool, prefix, minLength, maxLength);

	pool.narrowed = { key, indexes };

	return indexes;
}

function narrowAfresh(
	pool: Pool,
	prefix: string,
	minLength: number | undefined,
	maxLength: number | undefined
): readonly number[] {
	const lower = prefix.toLowerCase();
	const matching: number[] = [];

	pool.texts.forEach((text, index) => {
		if (!lower || text.toLowerCase().startsWith(lower)) {
			matching.push(index);
		}
	});

	if (minLength === undefined && maxLength === undefined) {
		return matching;
	}

	const [min, max] = lengthBounds(
		minLength,
		maxLength,
		pool.shortest,
		pool.longest,
		RAND_LOCATION_LENGTH_MAX
	);
	const missBy = (index: number) => {
		const length = pool.texts[index].length;

		return length < min ? min - length : length > max ? length - max + 0.5 : 0;
	};
	let best = Infinity;
	let closest: number[] = [];

	for (const index of matching) {
		const miss = missBy(index);

		if (miss < best) {
			best = miss;
			closest = [index];
		} else if (miss === best) {
			closest.push(index);
		}
	}

	return closest;
}

export function generateLocationDetails(
	form: LocationForm,
	level: LocationLevel,
	options: RandLocationUnitOptions = {}
): LocationDetail[] {
	const language = resolveLocationLanguage(options.language);
	const prefix = resolvePrefix(options.startsWith);
	const minLength = resolveLength(options.minLength);
	const maxLength = resolveLength(options.maxLength);

	// A language that cannot write the requested first character, and one with
	// nothing at the requested level, are out before a draw is made — so asking
	// every language for a 읍·면·동 draws Korean rather than spending half the
	// draws on English, which has none.
	const candidates = languagesWriting(language, LOCATION_LANGUAGES, prefix).flatMap((code) => {
		const pool = poolOf(code, form, level);
		const indexes = pool.entries.length ? narrow(pool, prefix, minLength, maxLength) : [];

		return indexes === null || indexes.length ? [{ pool, indexes }] : [];
	});

	if (!candidates.length) {
		return [];
	}

	return withRandom(resolveRandom(options.random), () =>
		collect(
			options,
			() => {
				const { pool, indexes } = pick(candidates);
				const index = indexes ? pick(indexes) : randInt(0, pool.entries.length - 1);

				return detailOf(pool, pool.entries[index]);
			},
			(detail) => detail.location
		)
	);
}

/** What every location generator does: a draw at one level, in one form. */
export function drawLocation(
	form: LocationForm,
	level: LocationLevel,
	options: RandLocationUnitOptions & { output?: 'value' | 'detail' }
): string[] | LocationDetail[] {
	const details = generateLocationDetails(form, level, options);

	return options.output === 'detail' ? details : details.map((detail) => detail.location);
}
