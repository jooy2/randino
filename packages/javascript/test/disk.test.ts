import assert from 'assert';
import { describe, it } from 'node:test';
import {
	DISK_TYPES,
	DISK_UNITS,
	RAND_COUNT_MAX,
	SYSTEM_PLATFORMS,
	randDiskSize,
	randDiskType
} from '../dist/index.js';
import type { DiskTypeDetail } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { DISK_SCALE, DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS } from '../dist/disk/data/index.js';
import { fitUnit, inUnit } from '../dist/_internal/capacity.js';

const SAMPLE = 60;
const LARGE = 4000;
const GIGABYTE = 1000 ** 3;
const sizes = DISK_SCALE.pool.map(([size]) => size);

/** The share of `details` that carry `code`, as a fraction. */
function share(details: DiskTypeDetail[], code: string): number {
	return details.filter((detail) => detail.code === code).length / details.length;
}

describe('Disk', () => {
	describe('randDiskType', () => {
		it('returns one label by default', () => {
			const types = randDiskType();

			assert.strictEqual(types.length, 1);
			assert.strictEqual(typeof types[0], 'string');
		});

		it('returns exactly `count` labels', () => {
			for (const count of [0, 1, 7, 25]) {
				assert.strictEqual(randDiskType({ count }).length, count);
			}

			assert.strictEqual(randDiskType({ count: -3 }).length, 0);
			assert.strictEqual(randDiskType({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
		});

		it('every kind has a label and a name of its own, and a platform that uses it', () => {
			const labels = DISK_TYPES.map((code) => DISK_TYPE_LABELS[code].label);
			const names = DISK_TYPES.map((code) => DISK_TYPE_LABELS[code].name);

			assert.strictEqual(new Set(labels).size, DISK_TYPES.length);
			assert.strictEqual(new Set(names).size, DISK_TYPES.length);

			for (const code of DISK_TYPES) {
				assert.ok(
					SYSTEM_PLATFORMS.some((platform) => DISK_TYPE_WEIGHTS[platform][code] !== undefined),
					code
				);
			}

			for (const platform of SYSTEM_PLATFORMS) {
				const total = Object.values(DISK_TYPE_WEIGHTS[platform]).reduce(
					(sum, each) => sum + each!,
					0
				);

				assert.strictEqual(total, 100, platform);
			}
		});

		it('the label is the one its code is written with', () => {
			for (const detail of randDiskType({ count: SAMPLE * 3, output: 'detail' })) {
				assert.strictEqual(detail.diskType, DISK_TYPE_LABELS[detail.code].label);
				assert.strictEqual(detail.name, DISK_TYPE_LABELS[detail.code].name);
				assert.ok(DISK_TYPE_WEIGHTS[detail.platform][detail.code] !== undefined, detail.diskType);
			}
		});

		it('platform keeps to the storage of one kind of machine', () => {
			const desktop = randDiskType({ platform: 'desktop', count: LARGE, output: 'detail' });
			const mobile = randDiskType({ platform: 'mobile', count: LARGE, output: 'detail' });

			assert.ok(desktop.every((detail) => detail.platform === 'desktop'));
			assert.deepStrictEqual([...new Set(mobile.map((detail) => detail.code))].sort(), [
				'emmc',
				'ufs'
			]);
			assert.ok(!desktop.some((detail) => detail.code === 'ufs'));
			assert.strictEqual(
				new Set(randDiskType({ count: SAMPLE * 3, output: 'detail' }).map((each) => each.platform))
					.size,
				2
			);
		});

		it('an SSD is most desktops and UFS most phones', () => {
			const desktop = randDiskType({ platform: 'desktop', count: LARGE, output: 'detail' });
			const mobile = randDiskType({ platform: 'mobile', count: LARGE, output: 'detail' });

			assert.ok(share(desktop, 'ssd') > 0.55, `ssd ${share(desktop, 'ssd')}`);
			assert.ok(share(desktop, 'hdd') > share(desktop, 'sshd'));
			assert.ok(share(desktop, 'sshd') > 0, 'an SSHD never came up');
			assert.ok(share(mobile, 'ufs') > 0.6, `ufs ${share(mobile, 'ufs')}`);
		});

		it('the value form is the label of each detail', () => {
			const seeded = () => {
				let state = 7;

				return () => {
					state = (state * 48271) % 2147483647;

					return state / 2147483647;
				};
			};

			assert.deepStrictEqual(
				randDiskType({ count: SAMPLE, random: seeded() }),
				randDiskType({ count: SAMPLE, random: seeded(), output: 'detail' }).map(
					(each) => each.diskType
				)
			);
		});

		it('unique never repeats a label, and stops when the labels run out', () => {
			assert.deepStrictEqual(
				[...randDiskType({ platform: 'mobile', unique: true, count: 10 })].sort(),
				['UFS', 'eMMC']
			);
			assert.strictEqual(randDiskType({ unique: true, count: 10 }).length, DISK_TYPES.length);
		});
	});
	describe('randDiskSize', () => {
		it('returns one size by default', () => {
			const sizes = randDiskSize();

			assert.strictEqual(sizes.length, 1);
			assert.match(sizes[0], /^\d+ (GB|TB)$/);
		});

		it('returns exactly `count` sizes', () => {
			for (const count of [0, 1, 7, 25]) {
				assert.strictEqual(randDiskSize({ count }).length, count);
			}

			assert.strictEqual(randDiskSize({ count: -3 }).length, 0);
			assert.strictEqual(randDiskSize({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
		});

		it('the pool is every size once, smallest first', () => {
			for (let i = 0; i < DISK_SCALE.pool.length; i += 1) {
				const [size, weight] = DISK_SCALE.pool[i];

				assert.ok(Number.isInteger(size) && size > 0, String(size));
				assert.ok(weight > 0, String(size));

				if (i > 0) {
					assert.ok(size > DISK_SCALE.pool[i - 1][0], `${size} is out of order`);
				}
			}
		});

		it('a size is counted in powers of ten, and written in the largest unit it is whole in', () => {
			assert.strictEqual(fitUnit(DISK_SCALE, 1000), 'TB');
			assert.strictEqual(fitUnit(DISK_SCALE, 512), 'GB');
			assert.strictEqual(inUnit(DISK_SCALE, 1000, 'TB'), 1);
			assert.strictEqual(inUnit(DISK_SCALE, 500, 'TB'), 0.5);
			assert.strictEqual(inUnit(DISK_SCALE, 512, 'MB'), 512000);

			for (const detail of randDiskSize({ count: LARGE, output: 'detail' })) {
				assert.strictEqual(detail.unit, fitUnit(DISK_SCALE, detail.bytes / GIGABYTE), detail.size);
			}
		});

		it('every size is one the pool holds, and the detail is what was written', () => {
			for (const unit of ['auto', ...DISK_UNITS] as const) {
				for (const detail of randDiskSize({ unit, count: SAMPLE * 5, output: 'detail' })) {
					const size = detail.bytes / GIGABYTE;

					assert.ok(sizes.includes(size), detail.size);
					assert.strictEqual(detail.size, `${detail.value} ${detail.unit}`);
					assert.strictEqual(detail.value, inUnit(DISK_SCALE, size, detail.unit));
					assert.ok(Number.isInteger(detail.value), detail.size);
				}
			}
		});

		it('a named unit keeps to the sizes whole in it, and never writes a decimal point', () => {
			const terabytes = randDiskSize({ unit: 'TB', count: LARGE, output: 'detail' });

			assert.ok(terabytes.every((detail) => detail.unit === 'TB'));
			assert.ok(!terabytes.some((detail) => detail.bytes === 500 * GIGABYTE));
			assert.ok(
				randDiskSize({ unit: 'GB', count: SAMPLE * 3 }).every((size) => /^\d+ GB$/.test(size))
			);

			for (const size of randDiskSize({ count: LARGE })) {
				assert.ok(!size.includes('.'), size);
			}
		});

		it('includeUnit: false writes the number alone, in gigabytes throughout', () => {
			for (const size of randDiskSize({ includeUnit: false, count: SAMPLE * 5 })) {
				assert.match(size, /^\d+$/);
				assert.ok(sizes.includes(Number(size)), size);
			}
		});

		it('minSize and maxSize are read in the unit, or in gigabytes for auto', () => {
			for (const detail of randDiskSize({
				minSize: 500,
				maxSize: 2000,
				count: SAMPLE * 3,
				output: 'detail'
			})) {
				const gigabytes = detail.bytes / GIGABYTE;

				assert.ok(gigabytes >= 500 && gigabytes <= 2000, detail.size);
			}

			for (const detail of randDiskSize({
				unit: 'TB',
				minSize: 8,
				count: SAMPLE * 3,
				output: 'detail'
			})) {
				assert.ok(detail.value >= 8, detail.size);
			}

			assert.deepStrictEqual(
				[...new Set(randDiskSize({ minSize: 1000, maxSize: 1000, count: SAMPLE }))],
				['1 TB']
			);
		});

		it('a range no real size is inside answers with nothing, and one the wrong way round keeps maxSize', () => {
			assert.deepStrictEqual(randDiskSize({ minSize: 600, maxSize: 900, count: 5 }), []);
			assert.deepStrictEqual(randDiskSize({ minSize: 100000, count: 5 }), []);
			assert.deepStrictEqual(
				[...new Set(randDiskSize({ minSize: 4000, maxSize: 256, count: SAMPLE }))],
				['256 GB']
			);
		});

		it('a bound need not be whole, and is not rounded', () => {
			// Floored, 1.5 TB read as 1 TB and let a 1 TB drive in under it.
			assert.deepStrictEqual(
				[...new Set(randDiskSize({ unit: 'TB', minSize: 1.5, maxSize: 2.5, count: SAMPLE }))],
				['2 TB']
			);
		});

		it('256 GB, 512 GB and 1 TB are the most common, and the largest drives rare', () => {
			const drives = randDiskSize({ count: LARGE });
			const share = (size: string) => drives.filter((each) => each === size).length / drives.length;

			assert.ok(share('256 GB') + share('512 GB') + share('1 TB') > 0.35);
			assert.ok(share('1 TB') > share('8 TB'));
			assert.ok(share('24 TB') < 0.01);
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
				randDiskSize({ count: SAMPLE, random: seeded() }),
				randDiskSize({ count: SAMPLE, random: seeded(), output: 'detail' }).map((each) => each.size)
			);
		});

		it('unique never repeats a size, and stops when the sizes run out', () => {
			const drives = randDiskSize({ minSize: 256, maxSize: 2000, unique: true, count: 100 });

			assert.strictEqual(new Set(drives).size, drives.length);
			assert.deepStrictEqual([...drives].sort(), [
				'1 TB',
				'2 TB',
				'256 GB',
				'480 GB',
				'500 GB',
				'512 GB'
			]);
		});
	});
});
