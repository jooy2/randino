import assert from 'assert';
import { describe, it } from 'node:test';
import { RAM_TYPES, RAM_UNITS, RAND_COUNT_MAX, SYSTEM_PLATFORMS, randRam } from '../dist/index.js';
import type { RamDetail } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { RAM_SCALE, RAM_SIZES, RAM_TYPE_ENTRIES } from '../dist/ram/data/index.js';
import { fitUnit, inUnit } from '../dist/_internal/capacity.js';

const SAMPLE = 60;
const LARGE = 4000;
const MEGABYTE = 1024 * 1024;
const GIGABYTE = 1024;
// Every size either platform is sold with.
const sizes = [
	...new Set(SYSTEM_PLATFORMS.flatMap((each) => RAM_SIZES[each].map(([size]) => size)))
];

/** The entry `detail` says its memory is. */
function entryOf(detail: RamDetail) {
	return RAM_TYPE_ENTRIES.find(
		(entry) => entry.type === detail.type && entry.platform === detail.platform
	);
}

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

	it('each pool is every size once, smallest first, each a whole number of megabytes', () => {
		for (const platform of SYSTEM_PLATFORMS) {
			const pool = RAM_SIZES[platform];

			for (let i = 0; i < pool.length; i += 1) {
				const [size, weight] = pool[i];

				assert.ok(Number.isInteger(size) && size > 0, `${platform} ${size}`);
				assert.ok(weight > 0, `${platform} ${size}`);

				if (i > 0) {
					assert.ok(size > pool[i - 1][0], `${platform} ${size} is out of order`);
				}
			}
		}

		// A phone's memory stops at 24 GB.
		assert.strictEqual(RAM_SIZES.mobile.at(-1)![0], 24 * GIGABYTE);
	});

	it('every kind of memory is described once per platform, at sizes its platform is sold with', () => {
		const seen = new Set<string>();

		for (const entry of RAM_TYPE_ENTRIES) {
			const key = `${entry.type} ${entry.platform}`;
			const pool = RAM_SIZES[entry.platform].map(([size]) => size);

			assert.ok(!seen.has(key), `${key} is listed twice`);
			seen.add(key);
			assert.ok(RAM_TYPES.includes(entry.type), key);
			assert.ok(entry.from >= 2000 && entry.from <= 2026, key);
			assert.ok(entry.to === null || (entry.to >= entry.from && entry.to <= 2026), key);
			assert.ok(entry.weight > 0, key);
			assert.ok(entry.sizes.length > 0, key);

			for (let i = 0; i < entry.sizes.length; i += 1) {
				const { size, from } = entry.sizes[i];

				assert.ok(pool.includes(size), `${key} at ${size} MB`);
				// A size comes no earlier than its kind, and inside the years it was sold.
				assert.ok(from >= entry.from && from <= (entry.to ?? 2026), `${key} at ${size} MB`);

				if (i > 0) {
					assert.ok(size > entry.sizes[i - 1].size, `${key} is out of order`);
				}
			}
		}

		for (const type of RAM_TYPES) {
			assert.ok(
				RAM_TYPE_ENTRIES.some((entry) => entry.type === type),
				type
			);
		}

		for (const platform of SYSTEM_PLATFORMS) {
			const entries = RAM_TYPE_ENTRIES.filter((entry) => entry.platform === platform);

			assert.strictEqual(
				entries.reduce((sum, entry) => sum + entry.weight, 0),
				100,
				platform
			);

			// Every size a platform is sold with is one some kind of memory came in.
			for (const [size] of RAM_SIZES[platform]) {
				assert.ok(
					entries.some((entry) => entry.sizes.some((each) => each.size === size)),
					`${platform} ${size} MB`
				);
			}
		}

		// Only a desktop or a laptop is sold with DDR memory.
		assert.ok(
			RAM_TYPE_ENTRIES.filter((entry) => entry.platform === 'mobile').every((entry) =>
				entry.type.startsWith('LPDDR')
			)
		);
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

				assert.ok(
					RAM_SIZES[detail.platform].some(([each]) => each === size),
					detail.ram
				);
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

	it('the kind of memory is one sold at that size, on that platform', () => {
		for (const detail of randRam({ count: LARGE, output: 'detail' })) {
			const entry = entryOf(detail);

			assert.ok(entry, `${detail.ram} ${detail.type} ${detail.platform}`);
			assert.ok(
				entry.sizes.some((each) => each.size === detail.bytes / MEGABYTE),
				`${detail.ram} ${detail.type}`
			);
		}
	});

	it('platform keeps to the memory of one kind of machine', () => {
		const mobile = randRam({ platform: 'mobile', count: LARGE, output: 'detail' });

		assert.ok(mobile.every((detail) => detail.platform === 'mobile'));
		assert.ok(mobile.every((detail) => detail.type.startsWith('LPDDR')));
		assert.ok(mobile.every((detail) => detail.bytes <= 24 * GIGABYTE * MEGABYTE));

		const desktop = randRam({ platform: 'desktop', count: SAMPLE * 3, output: 'detail' });

		assert.ok(desktop.every((detail) => detail.platform === 'desktop'));

		const both = new Set(
			randRam({ count: SAMPLE * 3, output: 'detail' }).map((each) => each.platform)
		);

		assert.strictEqual(both.size, SYSTEM_PLATFORMS.length);
	});

	it('a year range keeps to the kinds of memory sold in it', () => {
		const old = randRam({
			platform: 'desktop',
			maxYear: 2005,
			count: SAMPLE * 5,
			output: 'detail'
		});

		assert.deepStrictEqual([...new Set(old.map((detail) => detail.type))].sort(), ['DDR', 'DDR2']);
		assert.ok(old.every((detail) => detail.bytes <= 8 * GIGABYTE * MEGABYTE));

		for (const detail of randRam({ minYear: 2024, count: LARGE, output: 'detail' })) {
			const entry = entryOf(detail)!;

			assert.ok(entry.to === null || entry.to >= 2024, `${detail.type} ${detail.platform}`);
		}

		// No phone was sold with 512 MB before 2010, and nothing at all before 2000.
		assert.deepStrictEqual(randRam({ platform: 'mobile', maxYear: 2009, count: 5 }), []);
		assert.deepStrictEqual(randRam({ maxYear: 1990, count: 5 }), []);
		// A range the wrong way round keeps maxYear.
		assert.ok(
			randRam({
				minYear: 2024,
				maxYear: 2003,
				platform: 'desktop',
				count: SAMPLE,
				output: 'detail'
			}).every((detail) => detail.type === 'DDR')
		);
	});

	it('a year range keeps to the sizes out by then, not only to the kinds', () => {
		for (const maxYear of [2005, 2010, 2015, 2020, 2022]) {
			for (const detail of randRam({ maxYear, count: LARGE / 4, output: 'detail' })) {
				const size = entryOf(detail)!.sizes.find((each) => each.size === detail.bytes / MEGABYTE)!;

				assert.ok(size.from <= maxYear, `${detail.ram} ${detail.type} by ${maxYear}`);
			}
		}

		// The largest a desktop of 2010 came with was 32 GB of DDR3: the half a
		// terabyte of a workstation came three years later.
		const old = randRam({ platform: 'desktop', maxYear: 2010, count: LARGE, output: 'detail' });

		assert.ok(old.every((detail) => detail.bytes <= 32 * GIGABYTE * MEGABYTE));
	});

	it('includeType writes the kind of memory after the size', () => {
		for (const detail of randRam({ includeType: true, count: SAMPLE * 3, output: 'detail' })) {
			assert.strictEqual(detail.ram, `${detail.value} ${detail.unit} ${detail.type}`);
		}

		// A bare number goes without the kind, the way it goes without the unit, and
		// the detail still carries it.
		for (const detail of randRam({
			includeType: true,
			includeUnit: false,
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.match(detail.ram, /^\d+$/);
			assert.ok(detail.type.length > 0, detail.ram);
		}

		for (const detail of randRam({ count: SAMPLE, output: 'detail' })) {
			assert.strictEqual(detail.ram, `${detail.value} ${detail.unit}`);
		}
	});

	it('DDR4 and DDR5 lead the desktops, and LPDDR4X and later the phones', () => {
		const share = (details: RamDetail[], keep: (detail: RamDetail) => boolean) =>
			details.filter(keep).length / details.length;
		const desktop = randRam({ platform: 'desktop', count: LARGE, output: 'detail' });
		const mobile = randRam({ platform: 'mobile', count: LARGE, output: 'detail' });

		assert.ok(share(desktop, (each) => each.type === 'DDR4' || each.type === 'DDR5') > 0.5);
		assert.ok(share(mobile, (each) => ['LPDDR4X', 'LPDDR5', 'LPDDR5X'].includes(each.type)) > 0.6);
	});

	it('unique never repeats a size, and stops when the sizes run out', () => {
		// Kept to the common sizes, so every one of them is reached long before the
		// draws run out: the rarest of the whole pool is a draw in a thousand.
		const ram = randRam({ minSize: 4, maxSize: 16, unique: true, count: 100 });

		assert.strictEqual(new Set(ram).size, ram.length);
		assert.deepStrictEqual([...ram].sort(), ['12 GB', '16 GB', '4 GB', '6 GB', '8 GB']);
	});
});
