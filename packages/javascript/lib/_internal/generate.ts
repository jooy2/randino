// The parts every generator shares: resolving the options they all take, and the
// loop that draws until it has as many results as the caller asked for.
//
// `randName`, `randNickname` and `randWord` differ in what one draw produces and
// in nothing else about this — the same clamping, the same `startsWith` filter,
// the same `unique` bookkeeping and the same attempt budget. Written once here,
// a new generator gets all of it by calling `collect`.

import { RAND_COUNT_MAX, RAND_LENGTH_MAX, RAND_LENGTH_MIN } from '../constants.js';
import type { RandCommonOptions, RandRealism, RandVocabulary } from '../_types/global.js';
import { writesScript } from './script.js';
import { clamp, pick } from './utils.js';

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
	const number = Math.floor(Number(value));

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
	return INVENT_CHANCE[realism as RandRealism] ?? INVENT_CHANCE.real;
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
 * Draw until there are `count` results, discarding what the caller's filters
 * reject. `keyOf` is the string a result is filtered and deduplicated by — the
 * name, the nickname, the word.
 */
export function collect<T>(
	options: RandCommonOptions,
	draw: () => T,
	keyOf: (item: T) => string
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

	while (results.length < count && attempts < maxAttempts) {
		attempts += 1;

		const item = draw();
		const key = keyOf(item);

		if (!key) continue;
		if (prefix && !key.toLowerCase().startsWith(prefix)) continue;

		if (unique) {
			if (seen.has(key)) continue;

			seen.add(key);
		}

		results.push(item);
	}

	return results;
}
