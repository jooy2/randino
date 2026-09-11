// Small shared helpers. Internal only — nothing here is exported from the package.

/**
 * Where every draw in this package comes from, and the one place `Math.random`
 * is named.
 *
 * A source is ambient rather than threaded through every signature, because
 * every function here would have to carry it and hand it on: `randSentence`
 * alone reaches `pick` from some fifty places, through the word generator, the
 * name generator and the story planner. The library is synchronous from the
 * entry point down — there is no `await` anywhere in it — so nothing can
 * interleave between `withRandom` setting this and putting it back.
 */
let source: () => number = Math.random;

/**
 * One number in `[0, 1)`, from whatever source is in play.
 *
 * A source that hands back something else — `NaN`, a number out of range, the
 * wrong type — reads as `0` rather than as an index off the end of a pool. The
 * same reasoning the option resolvers use: a caller who got it wrong should not
 * be answered from somewhere that says nothing about what they got wrong.
 */
export function random(): number {
	const value = source();

	return typeof value === 'number' && value >= 0 && value < 1 ? value : 0;
}

/**
 * Run `body` with `next` as the source of randomness, and put the previous
 * source back afterwards — including when `body` throws, and including when
 * `next` is what threw.
 *
 * Restoring rather than clearing, because a generator can reach another one:
 * `randSentence` writes a person's name through `randName`, and the name is
 * meant to come from the same source the sentence did.
 */
export function withRandom<T>(next: (() => number) | undefined, body: () => T): T {
	if (!next) {
		return body();
	}

	const previous = source;

	source = next;

	try {
		return body();
	} finally {
		source = previous;
	}
}

/** Random entry of a non-empty array. */
export function pick<T>(items: readonly T[]): T {
	return items[Math.floor(random() * items.length)];
}

/**
 * Random entry of a non-empty array, drawn in proportion to `weightOf`. Falls
 * back to an even draw when every weight is zero, so a caller never has to check
 * that its weight table covers the pool.
 */
export function pickWeighted<T>(items: readonly T[], weightOf: (item: T) => number): T {
	let total = 0;

	for (const item of items) {
		total += Math.max(0, weightOf(item));
	}

	if (total <= 0) {
		return pick(items);
	}

	let roll = random() * total;

	for (const item of items) {
		roll -= Math.max(0, weightOf(item));

		if (roll < 0) {
			return item;
		}
	}

	return items[items.length - 1];
}

/** Random integer between `min` and `max`, both inclusive. */
export function randInt(min: number, max: number): number {
	return min + Math.floor(random() * (max - min + 1));
}

/** True with a `percent` chance (`0` never, `100` always). */
export function chance(percent: number): boolean {
	return random() * 100 < percent;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export function capitalizeFirst(value: string): string {
	return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

/** Random string of `length` characters drawn from `charset`. */
export function randToken(length: number, charset: string): string {
	let out = '';

	for (let i = 0; i < length; i += 1) {
		out += charset.charAt(Math.floor(random() * charset.length));
	}

	return out;
}
