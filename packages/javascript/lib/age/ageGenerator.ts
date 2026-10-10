// The age generator: a whole number of years, drawn along a curve shaped like a
// population rather than evenly over every age a person can be.
//
// Every option narrows the ages a draw may land on, and the curve says how
// likely each of them is. Nothing is fitted afterwards, so an age is always one
// the caller's range and groups allow.

import { collect, resolveCount, resolveRandom, resolveWhole } from '../_internal/generate.js';
import { pickWeighted, withRandom } from '../_internal/utils.js';
import { RAND_AGE_MAX } from '../constants.js';
import type { AgeDetail, AgeGroup, RandAgeOptions } from '../_types/global.js';
import {
	AGE_BANDS,
	AGE_CURVE,
	AGE_GROUPS,
	AGE_MAX_DEFAULT,
	resolveAgeGroups,
	resolveDistribution
} from './data/index.js';

/** How common `age` is on the curve, read off the straight line between the two points around it. */
export function curveWeight(age: number): number {
	for (let i = 1; i < AGE_CURVE.length; i += 1) {
		const [from, low] = AGE_CURVE[i - 1];
		const [to, high] = AGE_CURVE[i];

		if (age <= to) {
			return low + ((high - low) * (age - from)) / (to - from);
		}
	}

	return 0;
}

/** The group an age falls in. The bands cover every age, so one always answers. */
export function groupOf(age: number): AgeGroup {
	return AGE_GROUPS.find((group) => age <= AGE_BANDS[group][1]) ?? 'senior';
}

type Candidate = { age: number; weight: number };

/**
 * The ages one call may land on, each with how likely it is.
 *
 * Worked out once per call rather than per draw: it is at most a hundred and
 * twenty-one entries, and a call of ten thousand would otherwise read the curve
 * a million times over.
 */
function candidatesFor(options: RandAgeOptions): Candidate[] {
	const asked = resolveWhole(options.minAge, 0, 0, RAND_AGE_MAX);
	// Left out, `maxAge` is 100 — unless `minAge` is already past it, which asks
	// for the oldest ages there are rather than contradicting a bound nobody wrote.
	const maxAge = resolveWhole(
		options.maxAge,
		asked > AGE_MAX_DEFAULT ? RAND_AGE_MAX : AGE_MAX_DEFAULT,
		0,
		RAND_AGE_MAX
	);
	// A range the wrong way round keeps `maxAge`, the same way a length range
	// keeps `maxLength`: it is the bound a caller is usually holding to.
	const minAge = Math.min(asked, maxAge);
	const groups = resolveAgeGroups(options.group);
	const uniform = resolveDistribution(options.distribution) === 'uniform';
	const inRange: number[] = [];

	for (let age = minAge; age <= maxAge; age += 1) {
		inRange.push(age);
	}

	const grouped = inRange.filter((age) => groups.includes(groupOf(age)));
	// A group the range has no age of cannot be answered inside it, and the range
	// is the harder ask: it is a number the caller wrote, where a group is a name
	// for one. So the range wins, as though no group had been named.
	const ages = grouped.length ? grouped : inRange;

	return ages.map((age) => ({ age, weight: uniform ? 1 : curveWeight(age) }));
}

export function generateAgeDetails(options: RandAgeOptions = {}): AgeDetail[] {
	const candidates = candidatesFor(options);
	const unique = options.unique ?? false;
	// A unique call takes each age out once it is drawn, which deals the same odds
	// as drawing again on a repeat and stops when the ages run out, rather than
	// spending the whole attempt budget on repeats. An age the curve gives no weight
	// is left out of it, since a repeat would never have reached that age either.
	const weighted = candidates.filter((candidate) => candidate.weight > 0);
	const left = unique ? (weighted.length ? weighted : [...candidates]) : candidates;
	const count = unique ? Math.min(resolveCount(options.count), left.length) : options.count;

	return withRandom(resolveRandom(options.random), () =>
		collect(
			// Only the two options an age has: a `startsWith` slipped past the types
			// would otherwise filter ages by their first digit.
			{ count, unique },
			() => {
				const drawn = pickWeighted(left, (candidate) => candidate.weight);

				if (unique) {
					left.splice(left.indexOf(drawn), 1);
				}

				return { age: drawn.age, group: groupOf(drawn.age) };
			},
			(detail) => String(detail.age)
		)
	);
}
