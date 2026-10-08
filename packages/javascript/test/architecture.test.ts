import assert from 'assert';
import { describe, it } from 'node:test';
import { ARCHITECTURES, RAND_COUNT_MAX, randArchitecture } from '../dist/index.js';
// Internal, but it is what a result is checked against.
import { ARCHITECTURE_DATA } from '../dist/architecture/data/index.js';

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
			assert.ok(data.weight > 0, architecture);

			for (const name of [architecture, ...data.aliases]) {
				assert.ok(!names.has(name), `${name} is written twice`);
				names.add(name);
			}
		}

		// The four common ones are what a hundred draws are split between.
		const common = ARCHITECTURES.filter((each) => !ARCHITECTURE_DATA[each].rare);

		assert.deepStrictEqual(common, ['x86_64', 'arm64', 'x86', 'armv7']);
		assert.strictEqual(
			common.reduce((sum, each) => sum + ARCHITECTURE_DATA[each].weight, 0),
			100
		);
	});

	it('the detail is the architecture’s own data', () => {
		for (const detail of randArchitecture({
			includeRare: true,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			const data = ARCHITECTURE_DATA[detail.architecture];

			assert.deepStrictEqual(detail.aliases, [...data.aliases]);
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
		assert.ok(share((each) => each.rare) > 0.02 && share((each) => each.rare) < 0.08);
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
