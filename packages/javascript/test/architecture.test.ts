import assert from 'assert';
import { describe, it } from 'node:test';
import {
	ARCHITECTURES,
	ARCHITECTURE_NAMINGS,
	RAND_COUNT_MAX,
	SYSTEM_PLATFORMS,
	randArchitecture
} from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { ARCHITECTURE_DATA } from '../dist/architecture/data/index.js';
import { aliasesOf, writeArchitecture } from '../dist/architecture/architectureGenerator.js';

const SAMPLE = 60;
const LARGE = 6000;

describe('Architecture', () => {
	it('randArchitecture returns one architecture by default', () => {
		const architectures = randArchitecture();

		assert.strictEqual(architectures.length, 1);
		assert.ok(ARCHITECTURES.includes(architectures[0] as never), architectures[0]);
	});

	it('returns exactly `count` architectures', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randArchitecture({ count }).length, count);
		}

		assert.strictEqual(randArchitecture({ count: -3 }).length, 0);
		assert.strictEqual(randArchitecture({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every architecture is described, and no name is another one’s alias', () => {
		assert.deepStrictEqual(Object.keys(ARCHITECTURE_DATA).sort(), [...ARCHITECTURES].sort());

		const names = new Set<string>();

		for (const architecture of ARCHITECTURES) {
			const data = ARCHITECTURE_DATA[architecture];

			assert.ok([32, 64].includes(data.bits), architecture);
			assert.ok(Object.keys(data.weights).length > 0, architecture);
			assert.ok(
				Object.values(data.weights).every((weight) => weight > 0),
				architecture
			);

			for (const name of [architecture, ...data.aliases]) {
				assert.ok(!names.has(name), `${name} is written twice`);
				names.add(name);
			}

			// Every naming writes a name the architecture goes by.
			for (const naming of ARCHITECTURE_NAMINGS) {
				assert.ok(
					[architecture, ...data.aliases].includes(writeArchitecture(architecture, naming)),
					`${architecture} ${naming}`
				);
			}
		}

		// The four common ones are what a hundred draws are split between, on each
		// platform, and the rare ones are a desktop's alone.
		const common = ARCHITECTURES.filter((each) => !ARCHITECTURE_DATA[each].rare);

		assert.deepStrictEqual(common, ['x86_64', 'arm64', 'x86', 'armv7']);

		for (const platform of SYSTEM_PLATFORMS) {
			assert.strictEqual(
				common.reduce((sum, each) => sum + (ARCHITECTURE_DATA[each].weights[platform] ?? 0), 0),
				100,
				platform
			);
		}

		assert.ok(
			ARCHITECTURES.filter((each) => ARCHITECTURE_DATA[each].rare).every(
				(each) => ARCHITECTURE_DATA[each].weights.mobile === undefined
			)
		);
	});

	it('the detail is the architecture’s own data', () => {
		for (const detail of randArchitecture({
			includeRare: true,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			const data = ARCHITECTURE_DATA[detail.code];

			assert.strictEqual(detail.architecture, detail.code);
			assert.deepStrictEqual(detail.aliases, [...data.aliases]);
			assert.ok(data.weights[detail.platform] !== undefined, detail.architecture);
			assert.strictEqual(detail.bits, data.bits);
			assert.strictEqual(detail.family, data.family);
			assert.strictEqual(detail.rare, data.rare);
		}
	});

	it('x86 and Arm alone, until the rare ones are asked for', () => {
		const plain = new Set(randArchitecture({ count: LARGE }));

		assert.deepStrictEqual([...plain].sort(), ['arm64', 'armv7', 'x86', 'x86_64']);

		const all = new Set(randArchitecture({ includeRare: true, count: LARGE }));

		assert.strictEqual(all.size, ARCHITECTURES.length);
	});

	it('64-bit x86 and Arm are nearly every draw, and the rare ones uncommon', () => {
		const details = randArchitecture({ includeRare: true, count: LARGE, output: 'detail' });
		const share = (keep: (detail: (typeof details)[number]) => boolean) =>
			details.filter(keep).length / details.length;

		assert.ok(
			share((each) => each.architecture === 'x86_64' || each.architecture === 'arm64') > 0.75
		);

		// About one desktop draw in twenty, the rare ones being a desktop's alone.
		const desktop = randArchitecture({
			platform: 'desktop',
			includeRare: true,
			count: LARGE,
			output: 'detail'
		});
		const rare = desktop.filter((each) => each.rare).length / desktop.length;

		assert.ok(rare > 0.02 && rare < 0.08, String(rare));
	});

	it('platform keeps to the architectures of one kind of machine', () => {
		const mobile = randArchitecture({
			platform: 'mobile',
			includeRare: true,
			count: LARGE,
			output: 'detail'
		});

		assert.ok(mobile.every((detail) => detail.platform === 'mobile'));
		// A phone is Arm nearly always, never 64-bit x86 and never a rare one.
		assert.deepStrictEqual([...new Set(mobile.map((detail) => detail.architecture))].sort(), [
			'arm64',
			'armv7',
			'x86'
		]);
		assert.ok(mobile.filter((detail) => detail.family === 'arm').length / mobile.length > 0.9);

		const desktop = randArchitecture({ platform: 'desktop', count: LARGE, output: 'detail' });

		assert.ok(desktop.every((detail) => detail.platform === 'desktop'));
		assert.ok(
			desktop.filter((detail) => detail.architecture === 'x86_64').length / desktop.length > 0.7
		);

		const both = new Set(
			randArchitecture({ count: SAMPLE * 3, output: 'detail' }).map((each) => each.platform)
		);

		assert.strictEqual(both.size, SYSTEM_PLATFORMS.length);
	});

	it('naming writes Debian’s, Go’s or the kernel’s names', () => {
		const written = (naming: (typeof ARCHITECTURE_NAMINGS)[number]) =>
			ARCHITECTURES.map((each) => writeArchitecture(each, naming));

		assert.deepStrictEqual(written('common'), [...ARCHITECTURES]);
		assert.deepStrictEqual(written('debian').slice(0, 4), ['amd64', 'arm64', 'i386', 'armhf']);
		assert.deepStrictEqual(written('go').slice(0, 4), ['amd64', 'arm64', '386', 'arm']);
		assert.deepStrictEqual(written('kernel').slice(0, 4), ['x86_64', 'aarch64', 'i686', 'armv7l']);

		for (const naming of ARCHITECTURE_NAMINGS) {
			for (const detail of randArchitecture({
				naming,
				includeRare: true,
				count: SAMPLE * 3,
				output: 'detail'
			})) {
				assert.strictEqual(detail.architecture, writeArchitecture(detail.code, naming));
				// The common name is among the aliases whenever it is not the one written.
				assert.deepStrictEqual(detail.aliases, aliasesOf(detail.code, detail.architecture));
				assert.ok(!detail.aliases.includes(detail.architecture), detail.architecture);
				assert.strictEqual(
					detail.aliases.includes(detail.code),
					detail.architecture !== detail.code,
					detail.architecture
				);
			}
		}

		assert.ok(
			randArchitecture({ naming: 'apple' as never, count: SAMPLE }).every((each) =>
				ARCHITECTURES.includes(each as never)
			),
			'an unknown naming reads as the common one'
		);
	});

	it('the value form is the architecture of each detail', () => {
		const seeded = () => {
			let state = 7;

			return () => {
				state = (state * 48271) % 2147483647;

				return state / 2147483647;
			};
		};
		const options = { includeRare: true, count: SAMPLE };

		assert.deepStrictEqual(
			randArchitecture({ ...options, random: seeded() }),
			randArchitecture({ ...options, random: seeded(), output: 'detail' }).map(
				(each) => each.architecture
			)
		);
	});

	it('unique never repeats an architecture, and stops when they run out', () => {
		assert.deepStrictEqual([...randArchitecture({ unique: true, count: 10 })].sort(), [
			'arm64',
			'armv7',
			'x86',
			'x86_64'
		]);
	});
});
