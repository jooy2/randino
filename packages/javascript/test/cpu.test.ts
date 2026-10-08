import assert from 'assert';
import { describe, it } from 'node:test';
import { CPU_VENDORS, RAND_COUNT_MAX, SYSTEM_PLATFORMS, randCpu } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { CPUS } from '../dist/cpu/data/index.js';
import { writeCpu } from '../dist/cpu/cpuGenerator.js';

const SAMPLE = 60;

describe('Cpu', () => {
	it('randCpu returns one processor by default', () => {
		const cpus = randCpu();

		assert.strictEqual(cpus.length, 1);
		assert.strictEqual(typeof cpus[0], 'string');
	});

	it('returns exactly `count` processors', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randCpu({ count }).length, count);
		}

		assert.strictEqual(randCpu({ count: -3 }).length, 0);
		assert.strictEqual(randCpu({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every processor in the catalog is well formed', () => {
		const seen = new Set<string>();

		for (const entry of CPUS) {
			const key = `${entry.vendor} ${entry.model}`;

			assert.ok(!seen.has(key), `${key} is listed twice`);
			seen.add(key);
			assert.ok(SYSTEM_PLATFORMS.includes(entry.platform), key);
			assert.ok(entry.year >= 2000 && entry.year <= 2025, key);
			assert.ok(entry.vendor.length > 0 && entry.model.length > 0, key);
			// The maker is written in front of the model, never inside it.
			assert.ok(!entry.model.startsWith(entry.vendor), key);
		}

		for (const platform of SYSTEM_PLATFORMS) {
			assert.ok(CPUS.filter((entry) => entry.platform === platform).length >= 60, platform);
		}
	});

	it('every processor is one the catalog holds, written as its detail says', () => {
		for (const detail of randCpu({ count: SAMPLE * 5, output: 'detail' })) {
			const entry = CPUS.find(
				(each) => each.vendor === detail.vendor && each.model === detail.model
			)!;

			assert.ok(entry, detail.cpu);
			assert.strictEqual(detail.cpu, writeCpu(entry, true));
			assert.strictEqual(detail.cpu, `${detail.vendor} ${detail.model}`);
			assert.strictEqual(detail.platform, entry.platform);
			assert.strictEqual(detail.year, entry.year);
		}

		for (const detail of randCpu({ includeVendor: false, count: SAMPLE * 3, output: 'detail' })) {
			assert.strictEqual(detail.cpu, detail.model);
		}
	});

	it('platform keeps to the processors of one kind of machine', () => {
		for (const platform of SYSTEM_PLATFORMS) {
			assert.ok(
				randCpu({ platform, count: SAMPLE * 3, output: 'detail' }).every(
					(detail) => detail.platform === platform
				)
			);
		}

		const both = new Set(
			randCpu({ count: SAMPLE * 3, output: 'detail' }).map((each) => each.platform)
		);

		assert.strictEqual(both.size, SYSTEM_PLATFORMS.length);
	});

	it('a year range keeps to the processors out in it', () => {
		for (const detail of randCpu({
			minYear: 2015,
			maxYear: 2018,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			assert.ok(detail.year >= 2015 && detail.year <= 2018, `${detail.cpu} ${detail.year}`);
		}

		const asOf = randCpu({ platform: 'desktop', maxYear: 2010, unique: true, count: 100 });

		assert.ok(asOf.includes('Intel Core i7-920'));
		assert.ok(!asOf.includes('Intel Core i5-2500K'));
	});

	it('a year range nothing came out in answers with nothing, and one the wrong way round keeps maxYear', () => {
		assert.deepStrictEqual(randCpu({ maxYear: 1999, count: 5 }), []);
		assert.deepStrictEqual(randCpu({ minYear: 2030, count: 5 }), []);
		// The first phone chip in the catalog is the 2010 Apple A4.
		assert.deepStrictEqual(randCpu({ platform: 'mobile', maxYear: 2009 }), []);

		for (const detail of randCpu({
			minYear: 2024,
			maxYear: 2016,
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.strictEqual(detail.year, 2016, detail.cpu);
		}
	});

	it('the value form is the processor of each detail', () => {
		const seeded = () => {
			let state = 7;

			return () => {
				state = (state * 48271) % 2147483647;

				return state / 2147483647;
			};
		};

		assert.deepStrictEqual(
			randCpu({ count: SAMPLE, random: seeded() }),
			randCpu({ count: SAMPLE, random: seeded(), output: 'detail' }).map((each) => each.cpu)
		);
	});

	it('unique never repeats a processor, and stops when the processors run out', () => {
		const expected = CPUS.filter((entry) => entry.platform === 'mobile' && entry.year === 2025);
		const cpus = randCpu({ platform: 'mobile', minYear: 2025, unique: true, count: 100 });

		assert.strictEqual(new Set(cpus).size, cpus.length);
		assert.deepStrictEqual([...cpus].sort(), expected.map((entry) => writeCpu(entry, true)).sort());
	});

	it('vendor keeps to the makers named, and lists every maker the catalog holds', () => {
		assert.deepStrictEqual(
			[...new Set(CPUS.map((entry) => entry.vendor))].sort(),
			[...CPU_VENDORS].sort()
		);

		for (const vendor of CPU_VENDORS) {
			assert.ok(
				randCpu({ vendor, count: SAMPLE, output: 'detail' }).every(
					(detail) => detail.vendor === vendor
				),
				vendor
			);
		}

		const two = randCpu({ vendor: ['Intel', 'Apple'], count: SAMPLE, output: 'detail' });

		assert.ok(two.every((detail) => detail.vendor === 'Intel' || detail.vendor === 'Apple'));
		assert.ok(
			randCpu({ vendor: 'Nope' as never, count: SAMPLE, output: 'detail' }).some(
				(detail) => detail.vendor !== 'Intel'
			),
			'an unknown maker reads as all of them'
		);
	});

	it('a maker with no part on the platform asked for is answered with nothing', () => {
		assert.deepStrictEqual(randCpu({ vendor: 'MediaTek', platform: 'desktop', count: 5 }), []);
		assert.deepStrictEqual(randCpu({ vendor: 'Intel', platform: 'mobile', count: 5 }), []);
	});
});
