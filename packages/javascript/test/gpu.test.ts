import assert from 'assert';
import { describe, it } from 'node:test';
import { RAND_COUNT_MAX, SYSTEM_PLATFORMS, randGpu } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { GPUS } from '../dist/gpu/data/index.js';
import { writeGpu } from '../dist/gpu/gpuGenerator.js';

const SAMPLE = 60;

describe('Gpu', () => {
	it('randGpu returns one graphics processor by default', () => {
		const gpus = randGpu();

		assert.strictEqual(gpus.length, 1);
		assert.strictEqual(typeof gpus[0], 'string');
	});

	it('returns exactly `count` graphics processors', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randGpu({ count }).length, count);
		}

		assert.strictEqual(randGpu({ count: -3 }).length, 0);
		assert.strictEqual(randGpu({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every graphics processor in the catalog is well formed', () => {
		const seen = new Set<string>();

		for (const entry of GPUS) {
			const key = `${entry.vendor} ${entry.model}`;

			assert.ok(!seen.has(key), `${key} is listed twice`);
			seen.add(key);
			assert.ok(SYSTEM_PLATFORMS.includes(entry.platform), key);
			assert.ok(entry.year >= 2006 && entry.year <= 2025, key);
			assert.ok(entry.vendor.length > 0 && entry.model.length > 0, key);
			// The maker is written in front of the model, never inside it.
			assert.ok(!entry.model.startsWith(entry.vendor), key);
		}

		for (const platform of SYSTEM_PLATFORMS) {
			assert.ok(GPUS.filter((entry) => entry.platform === platform).length >= 40, platform);
		}
	});

	it('every graphics processor is one the catalog holds, written as its detail says', () => {
		for (const detail of randGpu({ count: SAMPLE * 5, output: 'detail' })) {
			const entry = GPUS.find(
				(each) => each.vendor === detail.vendor && each.model === detail.model
			)!;

			assert.ok(entry, detail.gpu);
			assert.strictEqual(detail.gpu, writeGpu(entry, true));
			assert.strictEqual(detail.gpu, `${detail.vendor} ${detail.model}`);
			assert.strictEqual(detail.platform, entry.platform);
			assert.strictEqual(detail.year, entry.year);
		}

		for (const detail of randGpu({ includeVendor: false, count: SAMPLE * 3, output: 'detail' })) {
			assert.strictEqual(detail.gpu, detail.model);
		}
	});

	it('platform keeps to the graphics processors of one kind of machine', () => {
		for (const platform of SYSTEM_PLATFORMS) {
			assert.ok(
				randGpu({ platform, count: SAMPLE * 3, output: 'detail' }).every(
					(detail) => detail.platform === platform
				)
			);
		}

		const both = new Set(
			randGpu({ count: SAMPLE * 3, output: 'detail' }).map((each) => each.platform)
		);

		assert.strictEqual(both.size, SYSTEM_PLATFORMS.length);
	});

	it('a year range keeps to the graphics processors out in it', () => {
		for (const detail of randGpu({
			minYear: 2015,
			maxYear: 2018,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			assert.ok(detail.year >= 2015 && detail.year <= 2018, `${detail.gpu} ${detail.year}`);
		}

		const asOf = randGpu({ platform: 'desktop', maxYear: 2010, unique: true, count: 100 });

		assert.ok(asOf.includes('NVIDIA GeForce GTX 480'));
		assert.ok(!asOf.includes('NVIDIA GeForce GTX 560 Ti'));
	});

	it('a year range nothing came out in answers with nothing, and one the wrong way round keeps maxYear', () => {
		assert.deepStrictEqual(randGpu({ maxYear: 2005, count: 5 }), []);
		assert.deepStrictEqual(randGpu({ minYear: 2030, count: 5 }), []);
		// The first phone GPU in the catalog is the 2013 Adreno 330.
		assert.deepStrictEqual(randGpu({ platform: 'mobile', maxYear: 2012 }), []);

		for (const detail of randGpu({
			minYear: 2024,
			maxYear: 2016,
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.strictEqual(detail.year, 2016, detail.gpu);
		}
	});

	it('the value form is the graphics processor of each detail', () => {
		const seeded = () => {
			let state = 7;

			return () => {
				state = (state * 48271) % 2147483647;

				return state / 2147483647;
			};
		};

		assert.deepStrictEqual(
			randGpu({ count: SAMPLE, random: seeded() }),
			randGpu({ count: SAMPLE, random: seeded(), output: 'detail' }).map((each) => each.gpu)
		);
	});

	it('unique never repeats a graphics processor, and stops when they run out', () => {
		const expected = GPUS.filter((entry) => entry.platform === 'mobile' && entry.year === 2025);
		const gpus = randGpu({ platform: 'mobile', minYear: 2025, unique: true, count: 100 });

		assert.strictEqual(new Set(gpus).size, gpus.length);
		assert.deepStrictEqual([...gpus].sort(), expected.map((entry) => writeGpu(entry, true)).sort());
	});
});
