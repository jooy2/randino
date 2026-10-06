import { resolveMany, resolveOption } from '../../_internal/generate.js';
import { RAND_AGE_MAX } from '../../constants.js';
import type { AgeDistribution, AgeGroup } from '../../_types/global.js';

// The groups an age can fall in, youngest first.
export const AGE_GROUPS: readonly AgeGroup[] = ['child', 'teen', 'adult', 'senior'];

/**
 * The ages each group covers, both ends included. They meet without a gap and
 * run from `0` to `RAND_AGE_MAX`, so every age the generator can return is in
 * exactly one of them.
 */
export const AGE_BANDS: Record<AgeGroup, readonly [number, number]> = {
	child: [0, 12],
	teen: [13, 19],
	adult: [20, 64],
	senior: [65, RAND_AGE_MAX]
};

/**
 * How many people are a given age, relative to the most common ages, as
 * `[age, weight]` points: every age between two points is drawn on the straight
 * line between them.
 *
 * It is the shape of a population rather than any one country's census, and it
 * is written by hand rather than measured. A census would be a dataset with its
 * own terms, and no country's shape is the one a sample wants anyway: Korea's
 * peaks in its fifties and Nigeria's at birth. This one peaks from 25 to 35,
 * sits lower for children, eases down through middle age and falls away past
 * seventy, which is what a set of sample people usually looks like:
 *
 * | Ages      | Share  |
 * | --------- | ------ |
 * | 0 to 12   | 10.7%  |
 * | 13 to 19  | 9.0%   |
 * | 20 to 39  | 33.8%  |
 * | 40 to 64  | 33.7%  |
 * | 65 to 100 | 12.9%  |
 * | 80 to 100 | 2.2%   |
 *
 * The shares are over the default range of `0` to `100`. The line reaches zero
 * at `RAND_AGE_MAX`, so that age is only drawn when nothing else is in range.
 */
export const AGE_CURVE: readonly (readonly [number, number])[] = [
	[0, 35],
	[10, 55],
	[18, 80],
	[25, 100],
	[35, 100],
	[45, 85],
	[55, 75],
	[65, 60],
	[70, 50],
	[75, 30],
	[80, 18],
	[85, 9],
	[90, 4],
	[95, 1],
	[100, 0.3],
	[110, 0.02],
	[RAND_AGE_MAX, 0]
];

/**
 * What `maxAge` is when it is left out: a centenarian is already a rare draw. A
 * `minAge` above it moves the default to `RAND_AGE_MAX` instead.
 */
export const AGE_MAX_DEFAULT = 100;

export const AGE_DISTRIBUTIONS: readonly AgeDistribution[] = ['population', 'uniform'];

/** The caller's `group` as the groups it names, or every group for `'all'` and anything unknown. */
export function resolveAgeGroups(group: unknown): readonly AgeGroup[] {
	return resolveMany(group, AGE_GROUPS, AGE_GROUPS);
}

/** The caller's `distribution`, or `'population'` for one this package does not know. */
export function resolveDistribution(distribution: unknown): AgeDistribution {
	return resolveOption(distribution, AGE_DISTRIBUTIONS, 'population');
}
