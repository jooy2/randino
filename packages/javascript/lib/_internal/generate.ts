// The parts every generator shares: resolving the options they all take, and the
// loop that draws until it has as many results as the caller asked for.
//
// `randName`, `randNickname` and `randWord` differ in what one draw produces and
// in nothing else about this — the same clamping, the same `startsWith` filter,
// the same `unique` bookkeeping and the same attempt budget. Written once here,
// a new generator gets all of it by calling `collect`.

import { RAND_COUNT_MAX, RAND_LENGTH_MAX, RAND_LENGTH_MIN } from '../constants.js';
import type { RandCommonOptions, RandRealism } from '../_types/global.js';
import { clamp, pick } from './utils.js';

/** `count`, floored and clamped to what a generator will serve. */
export function resolveCount(count?: number): number {
	return clamp(Math.floor(count ?? 1), 0, RAND_COUNT_MAX);
}

/**
 * `startsWith` narrowed to the single character every generator matches on. One
 * character rather than a string: it is applied to the first *word* a result is
 * built from, and a two-character prefix would rule out most pools entirely.
 */
export function resolvePrefix(startsWith?: string): string {
	return (startsWith ?? '').trim().slice(0, 1);
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

/**
 * A length bound as a whole number, or `undefined` when the caller left it out —
 * which every generator answers by resolving the bound per language instead.
 */
export function resolveLength(value?: number): number | undefined {
	return value === undefined ? undefined : Math.floor(value);
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

	return [low, Math.max(low, high)];
}

/** The language one draw uses: the requested one, or any of them for `'all'`. */
export function drawLanguage<T extends string>(option: T | 'all', languages: readonly T[]): T {
	return option === 'all' ? pick(languages) : option;
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
