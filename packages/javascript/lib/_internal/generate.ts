// The parts every generator shares: resolving the options they all take, and the
// loop that draws until it has as many results as the caller asked for.
//
// `randName`, `randNickname` and `randWord` differ in what one draw produces and
// in nothing else about this — the same clamping, the same `startsWith` filter,
// the same `unique` bookkeeping and the same attempt budget. Written once here,
// a new generator gets all of it by calling `collect`, or `collectFrom` when it
// can list every result it may return.

import {
	RAND_COUNT_MAX,
	RAND_LENGTH_MAX,
	RAND_LENGTH_MIN,
	SYSTEM_PLATFORMS
} from '../constants.js';
import type {
	RandCommonOptions,
	RandRealism,
	RandVocabulary,
	SystemPlatform
} from '../_types/global.js';
import { writesScript } from './script.js';
import { clamp, pick, random } from './utils.js';

/**
 * A whole number, or `undefined` for anything that is not one.
 *
 * TypeScript rules a `NaN` out of every option that takes a number; a JavaScript
 * caller can still pass one, and `NaN` is the value that does not announce
 * itself — it compares false against every bound it is checked against, so a
 * generator handed one quietly produced nothing, or reached `new Array(NaN)` and
 * threw from somewhere that says nothing about which option was wrong.
 */
function whole(value: unknown): number | undefined {
	const number = finite(value);

	return number === undefined ? undefined : Math.floor(number);
}

/**
 * A finite number, or `undefined` for anything that is not one — `whole` without
 * the floor, for a bound that may fall between two whole numbers: half a
 * gigabyte is 512 MB.
 */
export function finite(value: unknown): number | undefined {
	// Only a number, or a string that spells one, is a number here. `Number` reads
	// `null`, `''` and `[]` as `0`, which made `count: null` an empty result and
	// `maxAge: null` an age of zero, where the other two packages read a null as
	// an option left out.
	const numeric =
		typeof value === 'number' ||
		typeof value === 'bigint' ||
		typeof value === 'boolean' ||
		(typeof value === 'string' && value.trim() !== '');
	const number = numeric ? Number(value) : NaN;

	return Number.isFinite(number) ? number : undefined;
}

/** `count`, floored and clamped to what a generator will serve. */
export function resolveCount(count?: number): number {
	return clamp(whole(count) ?? 1, 0, RAND_COUNT_MAX);
}

/** A count of its own, for the options that carry one — `sentences`. */
export function resolveWhole(value: unknown, fallback: number, min: number, max: number): number {
	return clamp(whole(value) ?? fallback, min, max);
}

/**
 * A caller's option narrowed to a value the generator knows, or the default it
 * falls back to.
 *
 * The same reasoning as `resolveRealism`: the type rules the wrong value out,
 * and a JavaScript caller can still pass one. Answering that with a crash from
 * inside a pool lookup — `Cannot read properties of undefined (reading 'nouns')`
 * — names neither the option nor the value, so every option that takes one of a
 * fixed set falls back instead.
 */
export function resolveOption<T extends string>(
	value: unknown,
	allowed: readonly T[],
	fallback: T
): T {
	return allowed.includes(value as T) ? (value as T) : fallback;
}

/**
 * The same, for an option whose absence means something of its own: a `style`
 * left out is a level drawn per result rather than a default level. An unknown
 * value reads as absent, which is the only answer that keeps "left out" and
 * "wrong" apart without inventing a level the caller did not ask for.
 */
export function resolveOptional<T extends string>(value: unknown, allowed: readonly T[]): T | null {
	return allowed.includes(value as T) ? (value as T) : null;
}

/**
 * The same for an option that takes one value or several. Unknown entries are
 * dropped, and a list left with none of them falls back the way a single value
 * does.
 */
export function resolveMany<T extends string>(
	value: unknown,
	allowed: readonly T[],
	fallback: readonly T[]
): readonly T[] {
	const listed = typeof value === 'string' ? [value] : Array.isArray(value) ? value : [];
	const known = listed.filter((each): each is T => allowed.includes(each as T));

	return known.length ? known : fallback;
}

/**
 * The caller's source of randomness, or `undefined` for the package's own. A
 * value that is not a function reads as absent, the way every other option the
 * types rule out does.
 */
export function resolveRandom(value: unknown): (() => number) | undefined {
	return typeof value === 'function' ? (value as () => number) : undefined;
}

/**
 * `startsWith` narrowed to the single character every generator matches on. One
 * character rather than a string: it is applied to the first *word* a result is
 * built from, and a two-character prefix would rule out most pools entirely.
 */
export function resolvePrefix(startsWith?: string): string {
	return typeof startsWith === 'string' ? startsWith.trim().slice(0, 1) : '';
}

// How often a part is invented rather than drawn, per level, as a percentage.
const INVENT_CHANCE: Record<RandRealism, number> = {
	real: 0,
	mixed: 50,
	invented: 100
};

/**
 * `realism` as the chance of inventing one part, which is what every generator
 * actually asks of it. A level the type rules out but a JavaScript caller can
 * still pass falls back to the default rather than throwing.
 */
export function resolveRealism(realism?: RandRealism): number {
	return typeof realism === 'string' && Object.hasOwn(INVENT_CHANCE, realism)
		? INVENT_CHANCE[realism]
		: INVENT_CHANCE.real;
}

const VOCABULARIES: readonly RandVocabulary[] = ['basic', 'common', 'full'];

/**
 * `vocabulary` as one of the three levels, which is what `randWord`,
 * `randNickname` and `randSentence` narrow their noun pools by. A level the type
 * rules out but a JavaScript caller can still pass falls back to the default —
 * every word — rather than throwing.
 */
export function resolveVocabulary(vocabulary?: RandVocabulary): RandVocabulary {
	return VOCABULARIES.includes(vocabulary as RandVocabulary) ? vocabulary! : 'full';
}

/**
 * A length bound as a whole number, or `undefined` when the caller left it out —
 * which every generator answers by resolving the bound per language instead.
 */
export function resolveLength(value?: number): number | undefined {
	return value === undefined ? undefined : whole(value);
}

/**
 * A caller's length bounds against a natural range, clamped to what is allowed.
 *
 * `ceiling` is the highest bound the generator will serve, and only
 * `randSentence` passes one of its own: a sentence is many words where every
 * other generator produces at most three, so `RAND_LENGTH_MAX` would cut most of
 * them in half.
 */
export function lengthBounds(
	min: number | undefined,
	max: number | undefined,
	naturalMin: number,
	naturalMax: number,
	ceiling: number = RAND_LENGTH_MAX
): [number, number] {
	const low = clamp(min ?? naturalMin, RAND_LENGTH_MIN, ceiling);
	const high = clamp(max ?? naturalMax, RAND_LENGTH_MIN, ceiling);

	// A range the wrong way round is a caller contradicting themselves, and the
	// bound that survives is `maxLength` — the one they are usually holding to,
	// a field limit or a column width, where `minLength` only shapes how a result
	// reads. `[30, 5]` used to read as `[30, 30]`, which is the other way about.
	return [Math.min(low, high), high];
}

/**
 * The platforms a call may draw from: the one named, or both for `'all'` and for
 * anything this package does not know.
 */
export function resolvePlatforms(platform: unknown): readonly SystemPlatform[] {
	return SYSTEM_PLATFORMS.includes(platform as SystemPlatform)
		? [platform as SystemPlatform]
		: SYSTEM_PLATFORMS;
}

// The latest year a catalog bound is read up to. A year of four digits is as far
// as anything here is dated, and nothing in a catalog comes close to either end.
const YEAR_MAX = 9999;

/**
 * `minYear` and `maxYear` as the years a catalog draw may come from, both ends
 * included. A bound left out is no bound, and a range the wrong way round keeps
 * `maxYear`, the way a length range keeps `maxLength`: it is the one a caller
 * usually means — "as of 2015" — where `minYear` only trims the old end.
 */
export function resolveYears(minYear: unknown, maxYear: unknown): [number, number] {
	const high = resolveWhole(maxYear, YEAR_MAX, 0, YEAR_MAX);

	return [Math.min(resolveWhole(minYear, 0, 0, YEAR_MAX), high), high];
}

/** The language one draw uses: the requested one, or any of them for `'all'`. */
export function drawLanguage<T extends string>(option: T | 'all', languages: readonly T[]): T {
	return option === 'all' ? pick(languages) : option;
}

/**
 * The languages a draw may come from once `startsWith` has had its say: the
 * requested one, or every one of them for `'all'`, minus the ones that do not
 * write the requested character's script.
 *
 * A character a language does not write is a character it can never lead a
 * result with, and a generator asked for one anyway used to answer with the
 * character glued to the front — `randName({ language: 'ko', startsWith: 'Q' })`
 * came back `Q대겸`, which is a Latin letter and a Korean given name in one
 * string and a name in neither language.
 *
 * Empty when nothing can answer, which the generators pass on as no results at
 * all. That is the same answer `unique` already gives when a pool runs out:
 * fewer results than were asked for, rather than results that are not what was
 * asked for.
 */
export function languagesWriting<T extends string>(
	option: T | 'all',
	languages: readonly T[],
	prefix: string
): readonly T[] {
	const wanted = option === 'all' ? languages : [option];

	return prefix ? wanted.filter((code) => writesScript(code, prefix)) : wanted;
}

/**
 * The languages among `languages` whose own range of lengths meets the range the
 * caller asked for, or every one of them when none does.
 *
 * With every language in play, a range only some of them can reach was answered
 * by the rest with the closest result they had: `randWord({ maxLength: 1 })`
 * kept to one character a quarter of the time, because only the CJK languages
 * write a word that short. A language that cannot meet the range is left out,
 * the way `languagesWriting` leaves out one that cannot write `startsWith`; when
 * none can, every language is kept and each answers with its closest.
 */
export function languagesFitting<T extends string>(
	languages: readonly T[],
	minLength: number | undefined,
	maxLength: number | undefined,
	rangeOf: (code: T) => readonly [number, number]
): readonly T[] {
	if (languages.length < 2 || (minLength === undefined && maxLength === undefined)) {
		return languages;
	}

	const low = minLength ?? 0;
	const high = maxLength ?? Infinity;
	const fitting = languages.filter((code) => {
		const [min, max] = rangeOf(code);

		return max >= low && min <= high;
	});

	return fitting.length ? fitting : languages;
}

// How many draws in a row may add nothing before `collect` stops: twenty for each
// result found so far, and never fewer than two thousand. With k results found, a
// pool drawn evenly that holds one more gives it one draw in k + 1, and twenty
// times k draws in a row miss it about twice in a billion; the floor gives the
// same odds to a result one draw in a hundred finds. Only a call of more than
// thirty results ever reaches the floor, since a smaller one runs out of attempts
// first. A pool drawn by weight can still stop short of a result far rarer than
// the rest, which is why a catalog draws through `collectFrom` instead.
const COLLECT_STALL = 2000;
const COLLECT_STALL_PER_RESULT = 20;

/**
 * Draw until there are `count` results, discarding what the caller's filters
 * reject. `keyOf` is the string a result is filtered and deduplicated by — the
 * name, the nickname, the word. `uniqueOf` deduplicates by another string where
 * the one handed back is not the one `startsWith` reads: a romanized name is
 * returned in Latin letters and matched against the native first character.
 */
export function collect<T>(
	options: RandCommonOptions,
	draw: () => T,
	keyOf: (item: T) => string,
	uniqueOf: (item: T) => string = keyOf
): T[] {
	const count = resolveCount(options.count);
	const prefix = resolvePrefix(options.startsWith).toLowerCase();
	const unique = options.unique ?? false;

	const seen = new Set<string>();
	const results: T[] = [];
	// Generous enough that a plain request always fills up, while still ending a
	// `unique` request whose pool has run out of combinations.
	const maxAttempts = count * 50 + 500;
	let attempts = 0;
	let missed = 0;

	// A run of draws that adds nothing is a pool with nothing new left in it, and the
	// budget above was spent all the same: `randWord({ language: 'vi', startsWith:
	// 'ư', unique: true, count: 2000 })` found its 270 words and went on for a
	// hundred thousand draws. A result still to be found is missed only when it
	// fails to come up that many draws in a row, and the run grows with what has
	// been found: a fixed two thousand left one of the 249 countries out about once
	// in three thousand calls.
	while (
		results.length < count &&
		attempts < maxAttempts &&
		missed < Math.max(COLLECT_STALL, COLLECT_STALL_PER_RESULT * results.length)
	) {
		attempts += 1;
		missed += 1;

		const item = draw();
		const key = keyOf(item);

		if (!key) continue;
		if (prefix && !key.toLowerCase().startsWith(prefix)) continue;

		if (unique) {
			const once = uniqueOf(item);

			if (seen.has(once)) continue;

			seen.add(once);
		}

		results.push(item);
		missed = 0;
	}

	return results;
}

/** What a catalog builds one result from, and how likely that result is against the others. */
export type Outcome<E> = { entry: E; weight: number };

// How many sets of options a catalog keeps the outcomes of. A caller asks with a
// handful; one who moves a year range call by call would otherwise keep a list
// for every range, so the lists are let go at this many and listed again.
const OUTCOMES_KEPT = 64;

/**
 * The outcomes a catalog lists for one set of options: listed the first time a
 * call asks with it, and kept for the calls after. Without it a call of one
 * result listed the whole catalog to draw it, which made `randOs()` twice as
 * slow as the draw it replaced. `key` has to name every option the list depends
 * on, and nothing a result is only written by — a maker in front of a model is
 * `keyOf`'s business, not the list's.
 */
export function keptOutcomes<E>(
	kept: Map<string, readonly Outcome<E>[]>,
	key: string,
	list: () => Outcome<E>[]
): readonly Outcome<E>[] {
	return keep(kept, key, list);
}

/**
 * What `make` works out for one set of options, kept for the calls after under
 * `key`, which has to name every option the value depends on. A table is let go
 * at `OUTCOMES_KEPT` keys and filled again, so a caller who moves an option call
 * by call does not keep a value for every one of them.
 */
export function keep<V>(kept: Map<string, V>, key: string, make: () => V): V {
	let value = kept.get(key);

	if (value === undefined) {
		if (kept.size >= OUTCOMES_KEPT) {
			kept.clear();
		}

		value = make();
		kept.set(key, value);
	}

	return value;
}

/**
 * `collect` for a generator that can list every result it may return — a
 * catalog, where a draw only picks. Each result comes up as often as its weight
 * says, and two outcomes with the same `keyOf` are one result, as likely as the
 * two of them together. `build` writes the result out of the entry it came up
 * on, once for each time it comes up, so no two results are the same object.
 *
 * A `unique` call takes each result out as it comes up, which deals the same
 * odds as drawing again on a repeat and stops exactly when the list runs out.
 * `collect` can only guess that from a run of draws that found nothing new, and
 * a list drawn by weight beat the guess: `randOs` asked for every release came
 * back short one call in six, even once the run grew with what had been found.
 */
export function collectFrom<E, T>(
	options: RandCommonOptions,
	outcomes: readonly Outcome<E>[],
	keyOf: (entry: E) => string,
	build: (entry: E) => T
): T[] {
	const count = resolveCount(options.count);
	const prefix = resolvePrefix(options.startsWith).toLowerCase();
	const unique = options.unique ?? false;

	if (prefix) {
		const fitting = outcomes.filter(({ entry }) => keyOf(entry).toLowerCase().startsWith(prefix));

		return dealFrom(prepare(fitting), count, unique, keyOf, build)!;
	}

	// Without a `startsWith` a key is read only for what comes up — one for a call of
	// one, rather than the whole catalog's. A result whose key is empty is never
	// returned, so an entry written as nothing sends the call back to deal from the
	// entries that are written as something.
	const keyed = (entry: E) => keyOf(entry) || null;

	return (
		dealFrom(prepare(outcomes), count, unique, keyed, build) ??
		dealFrom(
			prepare(outcomes.filter(({ entry }) => keyOf(entry) !== '')),
			count,
			unique,
			keyOf,
			build
		)!
	);
}

/**
 * A list of outcomes made ready to draw from: the ones that can come up, and the
 * running total of their weights, so a draw is a search rather than a walk down
 * the list. `totals` is `null` when every weight is the same, and a draw is then
 * an index.
 */
type Prepared<E> = { pool: readonly Outcome<E>[]; totals: readonly number[] | null };

// Kept with the list itself, so a list a catalog keeps is made ready once and one
// put together for a single call goes when the call does.
const preparedLists = new WeakMap<readonly Outcome<unknown>[], Prepared<unknown>>();

function prepare<E>(outcomes: readonly Outcome<E>[]): Prepared<E> {
	const cached = preparedLists.get(outcomes);

	if (cached) {
		return cached as Prepared<E>;
	}

	// An outcome of no weight never comes up, unless none has any, when each is as
	// likely as the next — the way `pickWeighted` reads a table of zeros.
	const weighted = outcomes.filter(({ weight }) => weight > 0);
	const pool = weighted.length ? weighted : outcomes.map(({ entry }) => ({ entry, weight: 1 }));
	let total = 0;
	const totals = pool.every(({ weight }) => weight === pool[0].weight)
		? null
		: pool.map(({ weight }) => (total += weight));
	const made: Prepared<E> = { pool, totals };

	preparedLists.set(outcomes, made);

	return made;
}

/** One index of a prepared pool, drawn by its weight. */
function drawIndex<E>({ pool, totals }: Prepared<E>): number {
	if (totals === null) {
		return Math.floor(random() * pool.length);
	}

	const roll = random() * totals[totals.length - 1];
	let low = 0;
	let high = totals.length - 1;

	while (low < high) {
		const middle = (low + high) >> 1;

		if (totals[middle] > roll) {
			high = middle;
		} else {
			low = middle + 1;
		}
	}

	return low;
}

// How many repeats in a row a unique call draws through before it deals out what
// is left. Drawing again is cheaper while most of the list is still to come, and
// dealing is cheaper once nearly every draw is a repeat.
const UNIQUE_REPEATS = 16;

/**
 * The draw `collectFrom` makes once the outcomes are the ones it may return:
 * `null` when one of them turns out to have no key, which only a list it has not
 * read every key of can hold.
 */
function dealFrom<E, T>(
	prepared: Prepared<E>,
	count: number,
	unique: boolean,
	keyed: (entry: E) => string | null,
	build: (entry: E) => T
): T[] | null {
	const { pool } = prepared;
	const results: T[] = [];

	if (!pool.length) {
		return results;
	}

	// Each entry's key, read the first time it comes up.
	const keys: (string | null | undefined)[] = [];
	const keyAt = (index: number) => (keys[index] ??= keyed(pool[index].entry));

	if (!unique) {
		while (results.length < count) {
			const index = drawIndex(prepared);

			if (keyAt(index) === null) return null;

			results.push(build(pool[index].entry));
		}

		return results;
	}

	const seen = new Set<string>();
	let repeats = 0;

	while (results.length < count && repeats < UNIQUE_REPEATS) {
		const index = drawIndex(prepared);
		const key = keyAt(index);

		if (key === null) return null;

		if (seen.has(key)) {
			repeats += 1;
			continue;
		}

		seen.add(key);
		results.push(build(pool[index].entry));
		repeats = 0;
	}

	if (results.length >= count) {
		return results;
	}

	// The rest is dealt out of what is left. Each entry waits a time drawn at the
	// rate of its weight, and they come up in the order a draw that skips repeats
	// would find them: the next is each one's by its share of the weight left, the
	// way it was for every draw before. That holds from here as it did from the
	// start, since a wait drawn this way does not remember how long it has run.
	const left: { index: number; key: string; at: number }[] = [];

	for (let index = 0; index < pool.length; index += 1) {
		const key = keyAt(index);

		if (key === null) return null;
		if (seen.has(key)) continue;

		left.push({ index, key, at: -Math.log(1 - random()) / pool[index].weight });
	}

	left.sort((a, b) => a.at - b.at);

	for (const { index, key } of left) {
		if (results.length >= count) break;
		if (seen.has(key)) continue;

		seen.add(key);
		results.push(build(pool[index].entry));
	}

	return results;
}
