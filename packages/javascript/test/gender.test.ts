import assert from 'assert';
import { describe, it } from 'node:test';
import { RAND_COUNT_MAX, WORD_LANGUAGES, randGender } from '../dist/index.js';
import type { GenderCode, GenderDetail } from '../dist/index.js';
// Internal, but they are what a label is checked against.
import { GENDER_CODES, GENDER_LABELS, GENDER_WEIGHTS } from '../dist/gender/data/index.js';

const SAMPLE = 60;
// Large enough that a share of one in a hundred shows up and stays well inside a
// band, so the weights can be asserted with room to spare rather than by luck.
const LARGE = 10000;

/** How many of `details` carry each code, as a share of all of them in percent. */
function shares(details: GenderDetail[]): Record<GenderCode, number> {
	const counts: Record<GenderCode, number> = { male: 0, female: 0, nonbinary: 0, unknown: 0 };

	for (const detail of details) {
		counts[detail.code] += 1;
	}

	for (const code of GENDER_CODES) {
		counts[code] = (100 * counts[code]) / details.length;
	}

	return counts;
}

describe('Gender', () => {
	it('randGender returns one label by default', () => {
		const genders = randGender();

		assert.strictEqual(genders.length, 1);
		assert.strictEqual(typeof genders[0], 'string');
	});

	it('returns exactly `count` genders', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randGender({ count }).length, count);
		}

		assert.strictEqual(randGender({ count: -3 }).length, 0);
		assert.strictEqual(randGender({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every language labels every code, and no two codes alike', () => {
		assert.deepStrictEqual(Object.keys(GENDER_LABELS).sort(), [...WORD_LANGUAGES].sort());

		for (const language of WORD_LANGUAGES) {
			const labels = GENDER_CODES.map((code) => GENDER_LABELS[language][code]);

			assert.ok(
				labels.every((label) => label.trim().length > 0),
				language
			);
			assert.strictEqual(new Set(labels).size, labels.length, `${language} repeats a label`);
		}
	});

	it('a label is the one its language writes for its code', () => {
		for (const language of WORD_LANGUAGES) {
			for (const detail of randGender({
				language,
				includeUnknown: true,
				includeNonbinary: true,
				count: SAMPLE,
				output: 'detail'
			})) {
				assert.strictEqual(detail.language, language);
				assert.strictEqual(detail.gender, GENDER_LABELS[language][detail.code]);
			}
		}

		assert.deepStrictEqual([...new Set(randGender({ language: 'ko', count: SAMPLE }))].sort(), [
			'남성',
			'여성'
		]);
	});

	it('the value form is the label of each detail', () => {
		// The same source twice, so the two calls make the same draws.
		const seeded = () => {
			let state = 7;

			return () => {
				state = (state * 48271) % 2147483647;

				return state / 2147483647;
			};
		};
		const options = { includeUnknown: true, includeNonbinary: true, count: SAMPLE };

		assert.deepStrictEqual(
			randGender({ ...options, random: seeded() }),
			randGender({ ...options, random: seeded(), output: 'detail' }).map((each) => each.gender)
		);
	});

	it('male and female alone, until the other two are asked for', () => {
		const codes = (options: Parameters<typeof randGender>[0]) =>
			new Set(randGender({ ...options, count: LARGE, output: 'detail' }).map((each) => each.code));

		assert.deepStrictEqual([...codes({})].sort(), ['female', 'male']);
		assert.deepStrictEqual([...codes({ includeUnknown: true })].sort(), [
			'female',
			'male',
			'unknown'
		]);
		assert.deepStrictEqual([...codes({ includeNonbinary: true })].sort(), [
			'female',
			'male',
			'nonbinary'
		]);
		assert.strictEqual(codes({ includeUnknown: true, includeNonbinary: true }).size, 4);
	});

	it('male and female split evenly, unknown is uncommon and nonbinary rare', () => {
		const share = shares(
			randGender({ includeUnknown: true, includeNonbinary: true, count: LARGE, output: 'detail' })
		);

		assert.ok(Math.abs(share.male - share.female) < 4, `${share.male} / ${share.female}`);
		assert.ok(share.unknown > 6 && share.unknown < 12, `unknown ${share.unknown}`);
		assert.ok(share.nonbinary > 0.4 && share.nonbinary < 2, `nonbinary ${share.nonbinary}`);
		assert.ok(GENDER_WEIGHTS.nonbinary < GENDER_WEIGHTS.unknown);
		assert.ok(GENDER_WEIGHTS.unknown < GENDER_WEIGHTS.male);
		assert.strictEqual(GENDER_WEIGHTS.male, GENDER_WEIGHTS.female);
	});

	it('language: all mixes every language', () => {
		const languages = new Set(
			randGender({ count: SAMPLE * 5, output: 'detail' }).map((each) => each.language)
		);

		assert.strictEqual(languages.size, WORD_LANGUAGES.length);
	});

	it('unique never repeats a label, and stops when the labels run out', () => {
		const genders = randGender({ language: 'en', includeUnknown: true, unique: true, count: 10 });

		assert.deepStrictEqual([...genders].sort(), ['Female', 'Male', 'Unknown']);
	});
});
