import assert from 'assert';
import { describe, it } from 'node:test';
import { randName, randSentence, seededRandom } from '../dist/index.js';

describe('Random', () => {
	it('seededRandom hands out numbers in [0, 1), the same for the same seed', () => {
		const first = seededRandom(42);
		const second = seededRandom(42);

		for (let i = 0; i < 10000; i += 1) {
			const value = first();

			assert.ok(value >= 0 && value < 1, String(value));
			assert.strictEqual(second(), value);
		}

		// A seed is read as its text.
		assert.strictEqual(seededRandom('42')(), seededRandom(42)());
	});

	it('seededRandom keeps its numbers from one version to the next', () => {
		// Pinned, unlike a generated name, because these are what every fixture
		// built on a seed is made of: a change here moves all of them.
		const source = seededRandom(42);

		assert.deepStrictEqual(
			[source(), source(), source()],
			[0.336448959638861, 0.735262591710671, 0.9547428610323784]
		);
	});

	it('seededRandom spreads its numbers evenly, and seeds a character apart differ', () => {
		const source = seededRandom('randino');
		const buckets = new Array<number>(10).fill(0);
		const total = 100000;

		for (let i = 0; i < total; i += 1) {
			buckets[Math.floor(source() * 10)] += 1;
		}

		// Ten buckets of 10,000 each, every one within six deviations of it.
		for (const bucket of buckets) {
			assert.ok(Math.abs(bucket - total / 10) < 600, String(buckets));
		}

		const seeds = ['a', 'b', 'c', 'aa', 'ab', '0', '1', '2'].map((seed) => seededRandom(seed)());

		assert.strictEqual(new Set(seeds).size, seeds.length);
	});

	it('a call made with the same seed comes out the same', () => {
		assert.deepStrictEqual(
			randName({ count: 20, random: seededRandom(7) }),
			randName({ count: 20, random: seededRandom(7) })
		);
		assert.deepStrictEqual(
			randSentence({ sentences: 3, random: seededRandom('story') }),
			randSentence({ sentences: 3, random: seededRandom('story') })
		);
		assert.notDeepStrictEqual(
			randName({ count: 20, random: seededRandom(7) }),
			randName({ count: 20, random: seededRandom(8) })
		);
	});
});
