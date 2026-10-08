import assert from 'assert';
import { describe, it } from 'node:test';
import { RAND_COUNT_MAX, VERSION_FORMATS, randVersion } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { CALVER_SCHEMES, VERSION_PARTS, VERSION_PRERELEASES } from '../dist/version/data/index.js';

const SAMPLE = 60;
const LARGE = 6000;
const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?$/;

function seeded(seed: number): () => number {
	let state = seed;

	return () => {
		state = (state * 1103515245 + 12345) % 2147483648;

		return state / 2147483648;
	};
}

describe('Version', () => {
	it('randVersion returns one semantic version by default', () => {
		const versions = randVersion();

		assert.strictEqual(versions.length, 1);
		assert.match(versions[0], /^\d+\.\d+\.\d+$/);
	});

	it('returns exactly `count` versions', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randVersion({ count }).length, count);
		}

		assert.strictEqual(randVersion({ count: -3 }).length, 0);
		assert.strictEqual(randVersion({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('a semantic version keeps every part inside its range', () => {
		for (const detail of randVersion({ count: SAMPLE * 5, output: 'detail' })) {
			const [major, minor, patch] = detail.parts;

			assert.strictEqual(detail.format, 'semver');
			assert.strictEqual(detail.scheme, 'MAJOR.MINOR.PATCH');
			assert.strictEqual(detail.version, detail.parts.join('.'));
			assert.ok(major >= VERSION_PARTS.major[0] && major <= VERSION_PARTS.major[1]);
			assert.ok(minor >= VERSION_PARTS.minor[0] && minor <= VERSION_PARTS.minor[1]);
			assert.ok(patch >= VERSION_PARTS.patch[0] && patch <= VERSION_PARTS.patch[1]);
			assert.strictEqual(detail.prerelease, null);
			assert.strictEqual(detail.year, null);
		}
	});

	it('the small numbers come up most often', () => {
		const details = randVersion({ count: LARGE, output: 'detail' });
		const share = (index: number, value: number) =>
			details.filter((detail) => detail.parts[index] === value).length / details.length;

		assert.ok(share(2, 0) > 0.18, 'a patch of 0 is the most common');
		assert.ok(share(2, 0) > share(2, 1));
		assert.ok(share(2, 1) > share(2, 10));
		assert.ok(share(0, 20) < 0.03);
	});

	it('a calendar version is written by its scheme, and its year is in range', () => {
		const schemes = new Set(CALVER_SCHEMES.map((each) => each.scheme));

		for (const detail of randVersion({ format: 'calver', count: SAMPLE * 5, output: 'detail' })) {
			assert.strictEqual(detail.format, 'calver');
			assert.ok(schemes.has(detail.scheme), detail.scheme);
			assert.ok(detail.year !== null && detail.year >= 2010 && detail.year <= 2026);

			const tokens = detail.scheme.split('.');
			const written = detail.version.split('.');

			assert.strictEqual(written.length, tokens.length, detail.version);
			assert.deepStrictEqual(written.map(Number), detail.parts);

			tokens.forEach((token, index) => {
				if (token === 'YYYY') assert.strictEqual(detail.parts[index], detail.year);
				if (token === 'YY') assert.strictEqual(detail.parts[index], detail.year! - 2000);
				if (token === '0M' || token === '0D') assert.match(written[index], /^\d\d$/);
				if (token === 'MM' || token === '0M') {
					assert.ok(detail.parts[index] >= 1 && detail.parts[index] <= 12);
				}
			});

			if (detail.scheme === 'YYYY.0M.0D') {
				const [year, month, day] = detail.parts;
				const date = new Date(Date.UTC(year, month - 1, day));

				assert.strictEqual(date.getUTCDate(), day, `${detail.version} is a real day`);
			}
		}
	});

	it('minYear and maxYear keep a calendar version inside them', () => {
		for (const detail of randVersion({
			format: 'calver',
			minYear: 2019,
			maxYear: 2021,
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.ok(detail.year! >= 2019 && detail.year! <= 2021);
		}

		const later = randVersion({ format: 'calver', minYear: 2040, count: SAMPLE, output: 'detail' });

		assert.ok(
			later.every((detail) => detail.year === 2040),
			'a bound left out moves aside'
		);

		const wrong = randVersion({
			format: 'calver',
			minYear: 2024,
			maxYear: 2015,
			count: SAMPLE,
			output: 'detail'
		});

		assert.ok(
			wrong.every((detail) => detail.year === 2015),
			'the wrong way round keeps maxYear'
		);

		const clamped = randVersion({
			format: 'calver',
			minYear: 1990,
			maxYear: 3000,
			count: SAMPLE,
			output: 'detail'
		});

		assert.ok(clamped.every((detail) => detail.year! >= 2000 && detail.year! <= 2099));
	});

	it('a single-number version keeps inside its range', () => {
		for (const detail of randVersion({ format: 'number', count: SAMPLE * 5, output: 'detail' })) {
			assert.strictEqual(detail.scheme, 'MAJOR');
			assert.strictEqual(detail.version, String(detail.parts[0]));
			assert.ok(detail.parts[0] >= VERSION_PARTS.number[0]);
			assert.ok(detail.parts[0] <= VERSION_PARTS.number[1]);
		}
	});

	it('several formats, or all of them, are drawn evenly', () => {
		const details = randVersion({ format: 'all', count: LARGE, output: 'detail' });

		for (const format of VERSION_FORMATS) {
			const share = details.filter((detail) => detail.format === format).length / details.length;

			assert.ok(share > 0.28 && share < 0.39, `${format}: ${share}`);
		}

		const two = randVersion({ format: ['calver', 'number'], count: SAMPLE, output: 'detail' });

		assert.ok(two.every((detail) => detail.format !== 'semver'));
		assert.ok(
			randVersion({ format: 'nope' as never, count: SAMPLE, output: 'detail' }).every(
				(detail) => detail.format === 'semver'
			)
		);
	});

	it('includePrerelease gives about one semantic version in four a pre-release', () => {
		const labels = Object.keys(VERSION_PRERELEASES);
		const details = randVersion({ includePrerelease: true, count: LARGE, output: 'detail' });
		const marked = details.filter((detail) => detail.prerelease !== null);

		assert.ok(marked.length / details.length > 0.2 && marked.length / details.length < 0.3);

		for (const detail of details) {
			const match = SEMVER.exec(detail.version);

			assert.ok(match, detail.version);

			if (detail.prerelease) {
				const [label, number] = detail.prerelease.split('.');

				assert.ok(labels.includes(label));
				assert.ok(Number(number) >= 1 && Number(number) <= 9);
				assert.ok(detail.version.endsWith(`-${detail.prerelease}`));
			}
		}

		assert.ok(
			randVersion({
				format: 'calver',
				includePrerelease: true,
				count: SAMPLE,
				output: 'detail'
			}).every((detail) => detail.prerelease === null),
			'only a semantic version is given one'
		);
	});

	it('prefix is written in front of every version', () => {
		for (const version of randVersion({ format: 'all', prefix: 'v', count: SAMPLE })) {
			assert.match(version, /^v\d/);
		}

		assert.match(randVersion({ prefix: 3 as never })[0], /^\d/);
	});

	it('the value form is the version of each detail, and a seed repeats it', () => {
		assert.deepStrictEqual(
			randVersion({ format: 'all', count: SAMPLE, random: seeded(7) }),
			randVersion({ format: 'all', count: SAMPLE, random: seeded(7), output: 'detail' }).map(
				(detail) => detail.version
			)
		);
	});

	it('unique never repeats a version', () => {
		const found = randVersion({ format: 'number', unique: true, count: 100 });

		assert.strictEqual(new Set(found).size, found.length);
		assert.ok(found.length > 25);
	});
});
