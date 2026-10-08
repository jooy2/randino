import assert from 'assert';
import { describe, it } from 'node:test';
import { RAND_COUNT_MAX, SYSTEM_PLATFORMS, randResolution } from '../dist/index.js';
// Internal, but it is what a result is checked against.
import { RESOLUTIONS } from '../dist/resolution/data/index.js';

const SAMPLE = 60;
const LARGE = 6000;

describe('Resolution', () => {
	it('randResolution returns one resolution by default', () => {
		const resolutions = randResolution();

		assert.strictEqual(resolutions.length, 1);
		assert.match(resolutions[0], /^\d+x\d+$/);
	});

	it('returns exactly `count` resolutions', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randResolution({ count }).length, count);
		}

		assert.strictEqual(randResolution({ count: -3 }).length, 0);
		assert.strictEqual(randResolution({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every size is listed once, and each platform’s weights add up to a hundred', () => {
		const seen = new Set<string>();

		for (const entry of RESOLUTIONS) {
			const key = `${entry.platform} ${entry.width}x${entry.height}`;

			assert.ok(!seen.has(key), `${key} is listed twice`);
			seen.add(key);
			assert.ok(Number.isInteger(entry.width) && Number.isInteger(entry.height), key);
			assert.ok(entry.weight > 0, key);
		}

		for (const platform of SYSTEM_PLATFORMS) {
			const total = RESOLUTIONS.filter((entry) => entry.platform === platform).reduce(
				(sum, entry) => sum + entry.weight,
				0
			);

			assert.strictEqual(total, 100, platform);
		}
	});

	it('every resolution is one the table holds, and its detail is the two numbers', () => {
		for (const detail of randResolution({ count: SAMPLE * 5, output: 'detail' })) {
			assert.ok(
				RESOLUTIONS.some(
					(entry) =>
						entry.platform === detail.platform &&
						entry.width === detail.width &&
						entry.height === detail.height
				),
				detail.resolution
			);
			assert.strictEqual(detail.resolution, `${detail.width}x${detail.height}`);
		}
	});

	it('a desktop is wider than it is tall, and a phone is written portrait', () => {
		for (const detail of randResolution({
			platform: 'desktop',
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			assert.ok(detail.width > detail.height, detail.resolution);
		}

		for (const detail of randResolution({
			platform: 'mobile',
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			assert.ok(detail.width < detail.height, detail.resolution);
		}
	});

	it('platform keeps to the screens of one kind of machine, and all draws both evenly', () => {
		for (const platform of SYSTEM_PLATFORMS) {
			assert.ok(
				randResolution({ platform, count: SAMPLE, output: 'detail' }).every(
					(detail) => detail.platform === platform
				)
			);
		}

		const details = randResolution({ count: LARGE, output: 'detail' });
		const desktop =
			details.filter((detail) => detail.platform === 'desktop').length / details.length;

		assert.ok(desktop > 0.45 && desktop < 0.55, `desktop ${desktop}`);
	});

	it('1920x1080 is the most common desktop, and the rare sizes rare', () => {
		const desktops = randResolution({ platform: 'desktop', count: LARGE });
		const share = (size: string) =>
			desktops.filter((each) => each === size).length / desktops.length;

		assert.ok(share('1920x1080') > 0.2, `1920x1080 ${share('1920x1080')}`);
		assert.ok(share('1920x1080') > share('1366x768'));
		assert.ok(share('1024x768') < 0.03);
	});

	it('separator replaces the x, and anything that is not a string is the x', () => {
		for (const resolution of randResolution({ separator: ' × ', count: SAMPLE })) {
			assert.match(resolution, /^\d+ × \d+$/);
		}

		assert.ok(randResolution({ separator: '', count: SAMPLE }).every((each) => /^\d+$/.test(each)));
		assert.match(randResolution({ separator: 7 as never })[0], /^\d+x\d+$/);
	});

	it('the value form is the resolution of each detail', () => {
		const seeded = () => {
			let state = 7;

			return () => {
				state = (state * 48271) % 2147483647;

				return state / 2147483647;
			};
		};

		assert.deepStrictEqual(
			randResolution({ count: SAMPLE, random: seeded() }),
			randResolution({ count: SAMPLE, random: seeded(), output: 'detail' }).map(
				(each) => each.resolution
			)
		);
	});

	it('unique never repeats a resolution', () => {
		const resolutions = randResolution({ platform: 'desktop', unique: true, count: 100 });

		assert.strictEqual(new Set(resolutions).size, resolutions.length);
		assert.ok(resolutions.length > 15, String(resolutions.length));
	});
});
