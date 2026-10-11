/**
 * Narrowing a list of place names by `startsWith` and a length range, shared by
 * every location generator. Kept apart from the outlines so that `randRegion`,
 * which narrows a list of a few dozen regions, reaches none of them.
 */

import { lengthBounds } from '../_internal/generate.js';
import { RAND_LOCATION_LENGTH_MAX } from '../constants.js';

/**
 * What a draw may land on, written out. The text is worked out once, because
 * every length and `startsWith` filter reads it and a US list is thirty-two
 * thousand of them.
 */
export type Texts = {
	texts: readonly string[];
	shortest: number;
	longest: number;
	// The texts in lower case, for `startsWith`, made the first time a prefix is
	// asked of the list rather than once per prefix.
	lower?: readonly string[];
	// The last narrowing asked of this list, which is the one a loop of single
	// draws asks again: filtering thirty-two thousand names costs a millisecond,
	// and a caller drawing one at a time would pay it every call.
	narrowed?: { key: string; indexes: readonly number[] };
};

/**
 * The indexes of a pool one call may draw from once `startsWith` and the length
 * range have had their say, or `null` for all of them when neither was asked.
 *
 * A range nothing in the pool fits is answered with the divisions closest to it
 * rather than with none, the way every other generator answers one — and an
 * overshoot counts half a character worse than an undershoot, because
 * `maxLength` is the bound a caller is usually holding to.
 */
export function narrow(
	pool: Texts,
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
	pool: Texts,
	prefix: string,
	minLength: number | undefined,
	maxLength: number | undefined
): readonly number[] {
	const lower = prefix.toLowerCase();
	const matching: number[] = [];

	if (lower) {
		pool.lower ??= pool.texts.map((text) => text.toLowerCase());
		pool.lower.forEach((text, index) => {
			if (text.startsWith(lower)) {
				matching.push(index);
			}
		});
	} else {
		pool.texts.forEach((_, index) => matching.push(index));
	}

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

/**
 * Whether what `narrow` kept of a pool lands inside the length range, rather
 * than being the closest it had. With every language in play, a language whose
 * places are all longer than the range is left out while another has one that
 * fits: `randLocation({ maxLength: 15 })` wrote an American place more than half
 * the time, all of them longer than fifteen.
 */
export function inRange(
	pool: Texts,
	indexes: readonly number[] | null,
	minLength: number | undefined,
	maxLength: number | undefined
): boolean {
	if (minLength === undefined && maxLength === undefined) {
		return true;
	}

	const [min, max] = lengthBounds(
		minLength,
		maxLength,
		pool.shortest,
		pool.longest,
		RAND_LOCATION_LENGTH_MAX
	);
	const length = pool.texts[indexes?.[0] ?? 0]?.length ?? 0;

	return length >= min && length <= max;
}
