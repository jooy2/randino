import assert from 'assert';
import { describe, it } from 'node:test';
import { PHONE_COUNTRIES, PHONE_TYPES, RAND_COUNT_MAX, randPhone } from '../dist/index.js';
import type { PhoneCountry, PhoneDetail } from '../dist/index.js';
// Internal, but it is what every number is checked against.
import { PHONE_DATA } from '../dist/phone/data/index.js';

const SAMPLE = 60;
const LARGE = 3000;

// How each country writes a number for itself, by the shape of the string.
const NATIONAL: Record<PhoneCountry, RegExp> = {
	US: /^\(\d{3}\) \d{3}-\d{4}$/,
	KR: /^0\d{1,2}-\d{3,4}-\d{4}$/,
	JP: /^0\d{1,2}-\d{3,4}-\d{4}$/,
	CN: /^(1\d{2}|0\d{2,3}) \d{4} \d{4}$/,
	VN: /^0\d{2,3} \d{3,4} \d{4}$/,
	ES: /^[6-9]\d{2} \d{2} \d{2} \d{2}$/,
	IT: /^(3\d{2}|0\d{1,2}) \d{3,4} \d{4}$/,
	DE: /^0\d{2,3} \d{7,8}$/,
	RU: /^8 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
};

// How many digits follow the calling code: the national significant number.
const DIGITS: Record<PhoneCountry, [number, number]> = {
	US: [10, 10],
	KR: [8, 10],
	JP: [9, 10],
	CN: [10, 11],
	VN: [9, 10],
	ES: [9, 9],
	IT: [10, 10],
	DE: [10, 11],
	RU: [10, 10]
};

/** The digits after the calling code. */
function significant(detail: PhoneDetail): string {
	return detail.e164.slice(1 + detail.callingCode.length);
}

/** Whether the number opens on a prefix its country's plan lists for its type. */
function opensOnItsPlan(detail: PhoneDetail): boolean {
	return PHONE_DATA[detail.country].plans[detail.type].some((shape) =>
		shape.prefixes.some((prefix) => significant(detail).startsWith(prefix))
	);
}

function sample(country: PhoneCountry, type: 'mobile' | 'landline', extra = {}): PhoneDetail[] {
	return randPhone({ country, type, count: SAMPLE, output: 'detail', ...extra });
}

describe('Phone', () => {
	it('randPhone returns one number by default', () => {
		const phones = randPhone();

		assert.strictEqual(phones.length, 1);
		assert.strictEqual(typeof phones[0], 'string');
	});

	it('returns exactly `count` numbers', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randPhone({ count }).length, count);
		}

		assert.strictEqual(randPhone({ count: -3 }).length, 0);
		assert.strictEqual(randPhone({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every country writes its own national form', () => {
		for (const country of PHONE_COUNTRIES) {
			for (const type of PHONE_TYPES) {
				for (const detail of sample(country, type)) {
					assert.match(detail.phone, NATIONAL[country], `${country} ${type}`);
					assert.strictEqual(detail.country, country);
					assert.strictEqual(detail.type, type);
				}
			}
		}
	});

	it('every number opens on a block its plan gives out, and is as long as the plan says', () => {
		for (const country of PHONE_COUNTRIES) {
			const [low, high] = DIGITS[country];

			for (const type of PHONE_TYPES) {
				for (const detail of sample(country, type)) {
					const digits = significant(detail);

					assert.ok(opensOnItsPlan(detail), `${detail.e164} is not a ${country} ${type}`);
					assert.match(detail.e164, /^\+\d+$/);
					assert.ok(digits.length >= low && digits.length <= high, detail.e164);
				}
			}
		}
	});

	it('the national form is the trunk prefix and the same digits as E.164', () => {
		for (const country of PHONE_COUNTRIES) {
			for (const type of PHONE_TYPES) {
				for (const detail of sample(country, type)) {
					const written = detail.phone.replace(/\D/g, '');
					const trunk = written.slice(0, written.length - significant(detail).length);

					assert.ok(written.endsWith(significant(detail)), detail.phone);
					// Only the trunk prefix is added at home, and only the one the plan has.
					assert.ok(
						[
							PHONE_DATA[country].trunk,
							...PHONE_DATA[country].plans[type].map((shape) => shape.trunk)
						].includes(trunk),
						`${detail.phone} opens on ${trunk}`
					);
				}
			}
		}

		// A Chinese mobile number is dialled without the `0` a landline takes.
		for (const detail of sample('CN', 'mobile')) {
			assert.match(detail.phone, /^1/);
		}

		for (const detail of sample('RU', 'mobile')) {
			assert.match(detail.phone, /^8 \(9/);
		}
	});

	it('includeCountryCode writes the international form, without the trunk prefix', () => {
		const examples: Record<PhoneCountry, RegExp> = {
			US: /^\+1 \d{3}-\d{3}-\d{4}$/,
			KR: /^\+82 \d{1,2}-\d{3,4}-\d{4}$/,
			JP: /^\+81 \d{1,2}-\d{3,4}-\d{4}$/,
			CN: /^\+86 \d{2,3} \d{4} \d{4}$/,
			VN: /^\+84 \d{2,3} \d{3,4} \d{4}$/,
			ES: /^\+34 \d{3} \d{2} \d{2} \d{2}$/,
			// Italy keeps a landline's `0`, because it is part of the number.
			IT: /^\+39 [03]\d{1,2} \d{3,4} \d{4}$/,
			DE: /^\+49 [1-9]\d{1,2} \d{7,8}$/,
			RU: /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/
		};

		for (const country of PHONE_COUNTRIES) {
			for (const type of PHONE_TYPES) {
				for (const detail of sample(country, type, { includeCountryCode: true })) {
					assert.match(detail.phone, examples[country], `${country} ${type}`);
					assert.strictEqual(detail.phone.replace(/[^\d+]/g, ''), detail.e164);
				}
			}
		}
	});

	it('separator replaces the punctuation, and nothing else', () => {
		for (const country of PHONE_COUNTRIES) {
			for (const detail of sample(country, 'landline', { separator: '' })) {
				assert.match(detail.phone, /^\d+$/);
				assert.ok(detail.phone.endsWith(significant(detail)));
			}

			for (const detail of sample(country, 'mobile', { separator: '', includeCountryCode: true })) {
				assert.strictEqual(detail.phone, detail.e164);
			}

			for (const detail of sample(country, 'mobile', { separator: '.' })) {
				assert.match(detail.phone, /^\d+(\.\d+)+$/);
			}
		}

		// The trunk goes where the country writes it: on the first group in Korea, a
		// group of its own in Russia.
		assert.match(randPhone({ country: 'KR', separator: '-' })[0], /^010-\d{4}-\d{4}$/);
		assert.match(randPhone({ country: 'RU', separator: '-' })[0], /^8-9\d{2}-\d{3}-\d{2}-\d{2}$/);
		assert.match(randPhone({ country: 'US', separator: '-' })[0], /^\d{3}-\d{3}-\d{4}$/);
		assert.match(
			randPhone({ country: 'KR', separator: '-', includeCountryCode: true })[0],
			/^\+82-10-\d{4}-\d{4}$/
		);
	});

	it('a US exchange is never a service code or 555', () => {
		for (const detail of randPhone({ country: 'US', count: LARGE, output: 'detail' })) {
			const exchange = significant(detail).slice(3, 6);

			assert.doesNotMatch(exchange, /^[2-9]11$/, detail.phone);
			assert.notStrictEqual(exchange, '555', detail.phone);
			assert.match(exchange, /^[2-9]/);
		}
	});

	it('a Korean mobile number opens its exchange on 2 to 9', () => {
		for (const phone of randPhone({ country: 'KR', count: LARGE })) {
			assert.match(phone, /^010-[2-9]/);
		}
	});

	it('mobile is the default, and `all` draws both', () => {
		assert.ok(
			randPhone({ count: SAMPLE, output: 'detail' }).every((detail) => detail.type === 'mobile')
		);

		const types = new Set(
			randPhone({ type: 'all', count: SAMPLE, output: 'detail' }).map((detail) => detail.type)
		);

		assert.deepStrictEqual([...types].sort(), ['landline', 'mobile']);
	});

	it('every country comes up when none is named, and a code is read in any case', () => {
		const countries = new Set(
			randPhone({ count: LARGE, output: 'detail' }).map((detail) => detail.country)
		);

		assert.strictEqual(countries.size, PHONE_COUNTRIES.length);

		for (const detail of randPhone({ country: 'kr' as never, count: SAMPLE, output: 'detail' })) {
			assert.strictEqual(detail.country, 'KR');
			assert.strictEqual(detail.callingCode, '82');
		}
	});

	it('unique never repeats a number', () => {
		const phones = randPhone({ country: 'KR', count: 500, unique: true });

		assert.strictEqual(new Set(phones).size, phones.length);
		assert.strictEqual(phones.length, 500);
	});

	it('every shape is one the templates can write', () => {
		assert.deepStrictEqual(Object.keys(PHONE_DATA).sort(), [...PHONE_COUNTRIES].sort());

		for (const country of PHONE_COUNTRIES) {
			const data = PHONE_DATA[country];
			const marks = (template: string) => template.split('#').length - 1;

			assert.doesNotMatch(data.international, /T/, country);

			for (const type of PHONE_TYPES) {
				assert.ok(data.plans[type].length > 0, `${country} has no ${type} plan`);

				for (const shape of data.plans[type]) {
					// The first group is the prefix, and each pattern is one group more.
					assert.strictEqual(marks(data.national), shape.groups.length + 1, country);
					assert.strictEqual(marks(data.international), shape.groups.length + 1, country);
					assert.ok(
						shape.prefixes.every((prefix) => /^\d+$/.test(prefix)),
						country
					);
					assert.strictEqual(
						new Set(shape.prefixes).size,
						shape.prefixes.length,
						`${country} lists a prefix twice`
					);
				}
			}
		}
	});
});
