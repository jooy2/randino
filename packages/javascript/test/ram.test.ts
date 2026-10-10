import assert from 'assert';
import { describe, it } from 'node:test';
import { RAM_UNITS, RAND_COUNT_MAX, randRam } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { RAM_SCALE } from '../dist/ram/data/index.js';
import { fitUnit, inUnit } from '../dist/_internal/capacity.js';

const SAMPLE = 60;
const LARGE = 4000;
const MEGABYTE = 1024 * 1024;
const sizes = RAM_SCALE.pool.map(([size]) => size);

describe('Ram', () => {
	it('randRam returns one size by default', () => {
		const ram = randRam();

		assert.strictEqual(ram.length, 1);
		assert.match(ram[0], /^\d+ (MB|GB)$/);
	});

	it('returns exactly `count` sizes', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randRam({ count }).length, count);
		}

		assert.strictEqual(randRam({ count: -3 }).length, 0);
		assert.strictEqual(randRam({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('the pool is every size once, smallest first, each a whole number of megabytes', () => {
		for (let i = 0; i < RAM_SCALE.pool.length; i += 1) {
			const [size, weight] = RAM_SCALE.pool[i];

			assert.ok(Number.isInteger(size) && size > 0, String(size));
			assert.ok(weight > 0, String(size));

			if (i > 0) {
				assert.ok(size > RAM_SCALE.pool[i - 1][0], `${size} is out of order`);
			}
		}
	});

	it('a size is written in the largest unit it is a whole number of', () => {
		assert.strictEqual(fitUnit(RAM_SCALE, 512), 'MB');
		assert.strictEqual(fitUnit(RAM_SCALE, 16384), 'GB');
		assert.strictEqual(inUnit(RAM_SCALE, 16384, 'GB'), 16);
		assert.strictEqual(inUnit(RAM_SCALE, 512, 'GB'), 0.5);

		for (const detail of randRam({ count: LARGE, output: 'detail' })) {
			assert.strictEqual(detail.unit, fitUnit(RAM_SCALE, detail.bytes / MEGABYTE), detail.ram);
		}
	});

	it('every size is one the pool holds, and the detail is what was written', () => {
		for (const unit of ['auto', ...RAM_UNITS] as const) {
			for (const detail of randRam({ unit, count: SAMPLE * 5, output: 'detail' })) {
				const size = detail.bytes / MEGABYTE;

				assert.ok(sizes.includes(size), detail.ram);
				assert.strictEqual(detail.ram, `${detail.value} ${detail.unit}`);
				assert.strictEqual(detail.value, inUnit(RAM_SCALE, size, detail.unit));
				assert.ok(Number.isInteger(detail.value), detail.ram);
			}
		}
	});

	it('a named unit keeps to the sizes whole in it, and never writes a decimal point', () => {
		const gigabytes = randRam({ unit: 'GB', count: LARGE, output: 'detail' });

		assert.ok(gigabytes.every((detail) => detail.unit === 'GB'));
		assert.ok(!gigabytes.some((detail) => detail.bytes === 512 * MEGABYTE));

		const megabytes = randRam({ unit: 'MB', count: SAMPLE * 3 });

		assert.ok(
			megabytes.every((ram) => /^\d+ MB$/.test(ram)),
			megabytes.join()
		);

		for (const ram of randRam({ count: LARGE })) {
			assert.ok(!ram.includes('.'), ram);
		}
	});

	it('includeUnit: false writes the number alone, in one unit throughout', () => {
		for (const ram of randRam({ includeUnit: false, count: SAMPLE * 5 })) {
			assert.match(ram, /^\d+$/);
			// In gigabytes throughout, so every bare number is a size in gigabytes.
			assert.ok(sizes.includes(Number(ram) * 1024), ram);
		}

		assert.ok(
			randRam({ unit: 'MB', includeUnit: false, count: SAMPLE }).every((ram) => Number(ram) >= 512)
		);
	});

	it('minSize and maxSize are read in the unit, or in gigabytes for auto', () => {
		for (const detail of randRam({
			minSize: 8,
			maxSize: 32,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			const gigabytes = detail.bytes / MEGABYTE / 1024;

			assert.ok(gigabytes >= 8 && gigabytes <= 32, detail.ram);
		}

		for (const detail of randRam({
			unit: 'MB',
			maxSize: 4096,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			assert.ok(detail.value <= 4096, detail.ram);
		}

		// Both ends are included.
		assert.deepStrictEqual(
			[...new Set(randRam({ minSize: 16, maxSize: 16, count: SAMPLE }))],
			['16 GB']
		);
	});

	it('a range no real size is inside answers with nothing', () => {
		assert.deepStrictEqual(randRam({ minSize: 5, maxSize: 5, count: 5 }), []);
		assert.deepStrictEqual(randRam({ minSize: 5000, count: 5 }), []);
	});

	it('a bound need not be whole, and is not rounded', () => {
		// Half a gigabyte is 512 MB, which is in range; floored, it was 0 GB.
		assert.deepStrictEqual([...new Set(randRam({ maxSize: 0.5, count: SAMPLE }))], ['512 MB']);
		assert.deepStrictEqual(randRam({ minSize: 0.6, maxSize: 0.9, count: 5 }), []);
	});

	it('a range the wrong way round keeps maxSize', () => {
		assert.deepStrictEqual(
			[...new Set(randRam({ minSize: 64, maxSize: 8, count: SAMPLE }))],
			['8 GB']
		);
	});

	it('8 and 16 GB are the most common, and the largest sizes rare', () => {
		const ram = randRam({ count: LARGE });
		const share = (size: string) => ram.filter((each) => each === size).length / ram.length;

		assert.ok(share('8 GB') + share('16 GB') > 0.3, `${share('8 GB')} ${share('16 GB')}`);
		assert.ok(share('8 GB') > share('32 GB'));
		assert.ok(share('1024 GB') < 0.01);
	});

	it('the value form is the size of each detail', () => {
		const seeded = () => {
			let state = 7;

			return () => {
				state = (state * 48271) % 2147483647;

				return state / 2147483647;
			};
		};

		assert.deepStrictEqual(
			randRam({ count: SAMPLE, random: seeded() }),
			randRam({ count: SAMPLE, random: seeded(), output: 'detail' }).map((each) => each.ram)
		);
	});

	it('unique never repeats a size, and stops when the sizes run out', () => {
		// Kept to the common sizes, so every one of them is reached long before the
		// draws run out: the rarest of the whole pool is a draw in a thousand.
		const ram = randRam({ minSize: 4, maxSize: 16, unique: true, count: 100 });

		assert.strictEqual(new Set(ram).size, ram.length);
		assert.deepStrictEqual([...ram].sort(), ['12 GB', '16 GB', '4 GB', '6 GB', '8 GB']);
	});
});
