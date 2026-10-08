import assert from 'assert';
import { describe, it } from 'node:test';
import { DISK_TYPES, RAND_COUNT_MAX, SYSTEM_PLATFORMS, randDiskType } from '../dist/index.js';
import type { DiskTypeDetail } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS } from '../dist/disk/data/index.js';

const SAMPLE = 60;
const LARGE = 4000;

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
});
