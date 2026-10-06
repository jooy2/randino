import assert from 'assert';
import { describe, it } from 'node:test';
import { AGE_GROUPS, RAND_AGE_MAX, RAND_COUNT_MAX, randAge } from '../dist/index.js';
import type { AgeGroup } from '../dist/index.js';
// Internal, but they are what an age is checked against: the bands say which
// group an age is in, and the curve is what the draw follows.
import { AGE_BANDS, AGE_CURVE } from '../dist/age/data/index.js';

const SAMPLE = 60;
// Large enough that a share is within a point or two of the curve's, so the
// distribution can be asserted with room to spare rather than by luck.
const LARGE = 6000;

function inBand(age: number, group: AgeGroup): boolean {
	const [low, high] = AGE_BANDS[group];

	return age >= low && age <= high;
}

/** The share of `ages` from `low` to `high`, as a percentage. */
function share(ages: number[], low: number, high: number): number {
	return (100 * ages.filter((age) => age >= low && age <= high).length) / ages.length;
}

describe('Age', () => {
	it('randAge returns one whole number by default', () => {
		const ages = randAge();

		assert.strictEqual(ages.length, 1);
		assert.ok(Number.isInteger(ages[0]));
	});

	it('returns exactly `count` ages', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randAge({ count }).length, count);
		}

		assert.strictEqual(randAge({ count: -3 }).length, 0);
		assert.strictEqual(randAge({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('the default range is 0 to 100', () => {
		for (const age of randAge({ count: LARGE })) {
			assert.ok(age >= 0 && age <= 100, String(age));
		}
	});

	it('every age is inside minAge and maxAge', () => {
		for (const [minAge, maxAge] of [
			[18, 30],
			[0, 0],
			[65, 65],
			[100, 120]
		]) {
			for (const age of randAge({ minAge, maxAge, count: SAMPLE })) {
				assert.ok(age >= minAge && age <= maxAge, `${age} outside ${minAge}..${maxAge}`);
			}
		}
	});

	it('the bounds are clamped, and a range the wrong way round keeps maxAge', () => {
		for (const age of randAge({ minAge: -10, maxAge: 500, count: SAMPLE })) {
			assert.ok(age >= 0 && age <= RAND_AGE_MAX, String(age));
		}

		assert.deepStrictEqual(randAge({ minAge: 30, maxAge: 5, count: 5 }), [5, 5, 5, 5, 5]);
		// A fractional bound is floored, the way `count` is.
		assert.deepStrictEqual(randAge({ minAge: 41.9, maxAge: 41.2, count: 3 }), [41, 41, 41]);
	});

	it('group narrows the ages to its band', () => {
		for (const group of AGE_GROUPS) {
			for (const detail of randAge({ group, count: SAMPLE, output: 'detail' })) {
				assert.strictEqual(detail.group, group);
				assert.ok(inBand(detail.age, group), `${detail.age} is not ${group}`);
			}
		}

		for (const age of randAge({ group: ['child', 'senior'], count: SAMPLE })) {
			assert.ok(inBand(age, 'child') || inBand(age, 'senior'), String(age));
		}
	});

	it('a group narrows the range rather than replacing it', () => {
		for (const age of randAge({ group: 'adult', maxAge: 30, count: SAMPLE })) {
			assert.ok(age >= 20 && age <= 30, String(age));
		}
	});

	it('a group the range has no age of leaves the range to answer', () => {
		for (const age of randAge({ group: 'senior', minAge: 20, maxAge: 40, count: SAMPLE })) {
			assert.ok(age >= 20 && age <= 40, String(age));
		}
	});

	it('the detail reports the group the age is in', () => {
		for (const detail of randAge({ count: SAMPLE * 5, output: 'detail' })) {
			assert.ok(inBand(detail.age, detail.group), `${detail.age} is not ${detail.group}`);
		}
	});

	it('the bands cover every age once, and the curve spans them', () => {
		let next = 0;

		for (const group of AGE_GROUPS) {
			const [low, high] = AGE_BANDS[group];

			assert.strictEqual(low, next, `${group} does not start where the last band ended`);
			assert.ok(high >= low);
			next = high + 1;
		}

		assert.strictEqual(next, RAND_AGE_MAX + 1);
		assert.strictEqual(AGE_CURVE[0][0], 0);
		assert.deepStrictEqual(AGE_CURVE[AGE_CURVE.length - 1], [RAND_AGE_MAX, 0]);

		for (let i = 1; i < AGE_CURVE.length; i += 1) {
			assert.ok(AGE_CURVE[i][0] > AGE_CURVE[i - 1][0], 'the curve has to move forward');
			assert.ok(AGE_CURVE[i][1] >= 0);
		}
	});

	it('the population curve favours young adults over children and the old', () => {
		const ages = randAge({ count: LARGE });
		// Per year of age, so that a band of twenty years is not favoured for being
		// wide.
		const perYear = (low: number, high: number) => share(ages, low, high) / (high - low + 1);

		assert.ok(share(ages, 20, 64) > 55, 'adults are most of a population');
		assert.ok(perYear(20, 39) > perYear(0, 12) * 1.3, 'more young adults than children');
		assert.ok(perYear(20, 39) > perYear(65, 100) * 2, 'more young adults than seniors');
		assert.ok(perYear(60, 69) > perYear(75, 84) * 1.5, 'the old thin out past seventy');
		assert.ok(share(ages, 90, 100) < 2, 'a nonagenarian is a rare draw');
	});

	it('uniform draws every age alike', () => {
		const ages = randAge({ count: LARGE, distribution: 'uniform' });
		const mean = ages.reduce((sum, age) => sum + age, 0) / ages.length;

		// An even draw over 0..100 averages 50; the population curve averages under 40.
		assert.ok(Math.abs(mean - 50) < 3, `mean ${mean}`);
		assert.ok(share(ages, 80, 100) > 15, 'the old are as likely as anybody');
	});

	it('a minAge past the default maxAge reaches for the oldest ages', () => {
		for (const age of randAge({ minAge: 105, count: SAMPLE })) {
			assert.ok(age >= 105 && age <= RAND_AGE_MAX, String(age));
		}

		// The curve reaches zero at its last age, which is still drawn when it is
		// the only age the range holds.
		assert.deepStrictEqual(randAge({ minAge: RAND_AGE_MAX, count: 3 }), [
			RAND_AGE_MAX,
			RAND_AGE_MAX,
			RAND_AGE_MAX
		]);
	});

	it('unique never repeats an age, and stops when the range runs out', () => {
		const ages = randAge({ minAge: 10, maxAge: 14, count: 10, unique: true });

		assert.strictEqual(ages.length, 5);
		assert.deepStrictEqual(
			[...ages].sort((a, b) => a - b),
			[10, 11, 12, 13, 14]
		);

		const many = randAge({ count: 50, unique: true });

		assert.strictEqual(new Set(many).size, many.length);
	});
});
