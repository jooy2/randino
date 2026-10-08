import assert from 'assert';
import { describe, it } from 'node:test';
import { RAND_COUNT_MAX, SYSTEM_PLATFORMS, randOs } from '../dist/index.js';
import type { OsDetail } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { OS_FAMILIES, OS_RELEASES } from '../dist/os/data/index.js';
import { writeOs } from '../dist/os/osGenerator.js';

const SAMPLE = 60;
// Large enough that a line weighted at three in a hundred still shows up.
const LARGE = 4000;

/** Every string a release can be written as, with every build and edition it has. */
function everyWriting(): Set<string> {
	const written = new Set<string>();

	for (const release of OS_RELEASES) {
		written.add(release.name);

		for (const build of [null, ...release.builds]) {
			for (const edition of [null, ...release.editions]) {
				written.add(writeOs(release, build, edition));
			}
		}
	}

	return written;
}

describe('Os', () => {
	it('randOs returns one system by default', () => {
		const systems = randOs();

		assert.strictEqual(systems.length, 1);
		assert.strictEqual(typeof systems[0], 'string');
	});

	it('returns exactly `count` systems', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randOs({ count }).length, count);
		}

		assert.strictEqual(randOs({ count: -3 }).length, 0);
		assert.strictEqual(randOs({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every release is well formed', () => {
		const seen = new Set<string>();

		for (const release of OS_RELEASES) {
			const key = `${release.family} ${release.version}`;

			assert.ok(!seen.has(key), `${key} is listed twice`);
			seen.add(key);
			assert.ok(release.family in OS_FAMILIES, key);
			assert.ok(release.template.includes('{v}'), key);
			assert.ok(release.year >= 1995 && release.year <= 2026, key);
			// An edition needs somewhere to go, and a place for one needs editions.
			assert.strictEqual(release.template.includes('{e}'), release.editions.length > 0, key);

			let last = release.year;

			for (const build of release.builds) {
				assert.ok(
					build.year >= last,
					`${key} ${build.text} comes out before the build ahead of it`
				);
				last = build.year;
			}
		}

		for (const family of Object.keys(OS_FAMILIES)) {
			assert.ok(
				OS_RELEASES.some((release) => release.family === family),
				family
			);
		}
	});

	it('every system is one the catalog writes', () => {
		const written = everyWriting();

		for (const options of [
			{},
			{ includeBuild: true },
			{ includeEdition: true },
			{ includeBuild: true, includeEdition: true },
			{ includeVersion: false }
		]) {
			for (const system of randOs({ ...options, count: SAMPLE * 5 })) {
				assert.ok(written.has(system), system);
			}
		}
	});

	it('the detail is what the value was written from', () => {
		for (const detail of randOs({
			includeBuild: true,
			includeEdition: true,
			count: SAMPLE * 5,
			output: 'detail'
		})) {
			const release = OS_RELEASES.find(
				(each) => each.name === detail.name && each.version === detail.version
			)!;

			assert.ok(release, detail.os);
			assert.strictEqual(detail.platform, OS_FAMILIES[release.family].platform);

			const build = release.builds.find((each) => each.text === detail.build) ?? null;

			assert.strictEqual(build === null, detail.build === null, detail.os);
			// A release with builds always writes one when asked.
			assert.strictEqual(detail.build !== null, release.builds.length > 0, detail.os);
			assert.strictEqual(detail.edition !== null, release.editions.length > 0, detail.os);
			assert.strictEqual(detail.os, writeOs(release, build, detail.edition));
			assert.strictEqual(detail.year, build?.year ?? release.year);
		}
	});

	it('the version, the build and the edition are left out unless asked for', () => {
		for (const detail of randOs({ count: SAMPLE * 5, output: 'detail' })) {
			assert.strictEqual(detail.build, null);
			assert.strictEqual(detail.edition, null);
			assert.ok(detail.version !== null);
		}

		// Without a version there is nothing for a build or an edition to belong to.
		for (const detail of randOs({
			includeVersion: false,
			includeBuild: true,
			includeEdition: true,
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.strictEqual(detail.os, detail.name);
			assert.strictEqual(detail.version, null);
			assert.strictEqual(detail.build, null);
			assert.strictEqual(detail.edition, null);
		}
	});

	it('platform keeps to the systems of one kind of machine', () => {
		for (const platform of SYSTEM_PLATFORMS) {
			const details = randOs({ platform, count: SAMPLE * 3, output: 'detail' });

			assert.ok(details.every((detail) => detail.platform === platform));
		}

		const both = new Set(
			randOs({ count: SAMPLE * 3, output: 'detail' }).map((each) => each.platform)
		);

		assert.strictEqual(both.size, SYSTEM_PLATFORMS.length);
	});

	it('a year range keeps to the releases out in it', () => {
		for (const detail of randOs({
			minYear: 2010,
			maxYear: 2015,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			assert.ok(detail.year >= 2010 && detail.year <= 2015, `${detail.os} ${detail.year}`);
		}

		// As of 2015: no Windows 11, and Windows 10 at no feature update after 1511.
		const asOf = randOs({ maxYear: 2015, platform: 'desktop', count: LARGE, includeBuild: true });

		assert.ok(!asOf.some((system) => system.startsWith('Windows 11')));
		assert.ok(asOf.some((system) => system.startsWith('Windows 10')));
		assert.ok(!asOf.some((system) => system.startsWith('Windows 10 1607')));
	});

	it('with includeBuild the year is the build’s, without it the release’s', () => {
		// Windows 10 came out in 2015, and its 22H2 update in 2022.
		const released = randOs({ minYear: 2022, count: LARGE, platform: 'desktop' });
		const built = randOs({ minYear: 2022, count: LARGE, platform: 'desktop', includeBuild: true });

		assert.ok(!released.includes('Windows 10'));
		assert.ok(built.includes('Windows 10 22H2 (Build 19045)'));
	});

	it('a year range nothing came out in answers with nothing', () => {
		assert.deepStrictEqual(randOs({ maxYear: 1990, count: 5 }), []);
		assert.deepStrictEqual(randOs({ minYear: 2030, count: 5 }), []);
		// The first iPhone OS is 2007, so mobile before it has nothing.
		assert.deepStrictEqual(randOs({ platform: 'mobile', maxYear: 2006 }), []);
	});

	it('a year range the wrong way round keeps maxYear', () => {
		for (const detail of randOs({
			minYear: 2020,
			maxYear: 2005,
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.strictEqual(detail.year, 2005, detail.os);
		}
	});

	it('Windows is most of the desktop and Android most of mobile', () => {
		const share = (details: OsDetail[], name: string) =>
			details.filter((detail) => detail.name === name).length / details.length;

		const desktop = randOs({ platform: 'desktop', count: LARGE, output: 'detail' });
		const mobile = randOs({ platform: 'mobile', count: LARGE, output: 'detail' });

		assert.ok(share(desktop, 'Windows') > 0.55, `Windows ${share(desktop, 'Windows')}`);
		assert.ok(share(mobile, 'Android') > 0.52, `Android ${share(mobile, 'Android')}`);
		assert.ok(share(desktop, 'Debian') > 0, 'Debian never came up');
	});

	it('the value form is the os of each detail', () => {
		const seeded = () => {
			let state = 7;

			return () => {
				state = (state * 48271) % 2147483647;

				return state / 2147483647;
			};
		};
		const options = { includeBuild: true, includeEdition: true, count: SAMPLE };

		assert.deepStrictEqual(
			randOs({ ...options, random: seeded() }),
			randOs({ ...options, random: seeded(), output: 'detail' }).map((each) => each.os)
		);
	});

	it('unique never repeats a system, and stops when the systems run out', () => {
		const names = randOs({ includeVersion: false, unique: true, count: 100 });

		assert.strictEqual(new Set(names).size, names.length);
		assert.deepStrictEqual(
			[...names].sort(),
			[...new Set(OS_RELEASES.map((release) => release.name))].sort()
		);
	});
});
