import assert from 'assert';
import { describe, it } from 'node:test';
import {
	AFFIX_CHARSET,
	AFFIX_LENGTH_MAX,
	randName,
	randNickname,
	randPrefix,
	randSuffix
} from '../dist/index.js';

const SAMPLE = 60;

/** The default token, as a pattern — the charset minus `0O1lI`, five long. */
const TOKEN = /^[0-9A-Za-z]{5}$/;

describe('Affix', () => {
	it('randSuffix appends the token and randPrefix puts it in front', () => {
		for (const word of randNickname({ language: 'en', count: SAMPLE })) {
			const suffixed = randSuffix(word);
			const prefixed = randPrefix(word);

			assert.ok(suffixed.startsWith(`${word}_`), suffixed);
			assert.ok(prefixed.endsWith(`_${word}`), prefixed);
			assert.strictEqual(suffixed.length, word.length + 6);
			assert.strictEqual(prefixed.length, word.length + 6);

			const token = suffixed.slice(word.length + 1);

			assert.match(token, TOKEN, suffixed);

			// Not merely alphanumeric: the pairs that are easy to misread are out.
			for (const character of token) {
				assert.ok(AFFIX_CHARSET.includes(character), `${character} in ${suffixed}`);
			}
		}
	});

	it('a string in gives a string, an array in gives an array', () => {
		const words = randNickname({ language: 'ko', count: SAMPLE });
		const suffixed = randSuffix(words);
		const prefixed = randPrefix(words);

		assert.strictEqual(suffixed.length, words.length);
		assert.strictEqual(prefixed.length, words.length);

		for (const [index, word] of words.entries()) {
			assert.ok(suffixed[index].startsWith(`${word}_`), suffixed[index]);
			assert.ok(prefixed[index].endsWith(`_${word}`), prefixed[index]);
		}

		assert.deepStrictEqual(randSuffix([]), []);
		assert.strictEqual(typeof randSuffix(''), 'string');
	});

	it('every value gets its own token rather than the batch sharing one', () => {
		// Twelve characters, so that a collision is not what this is measuring.
		const tokens = randSuffix(new Array(2000).fill('x'), { length: 12 });

		assert.strictEqual(new Set(tokens).size, 2000);
	});

	it('length, separator and charset are all configurable', () => {
		for (let i = 0; i < SAMPLE; i += 1) {
			assert.match(randSuffix('Owl', { length: 8, separator: '-' }), /^Owl-[0-9A-Za-z]{8}$/);
			assert.match(randPrefix('Owl', { length: 8, separator: '-' }), /^[0-9A-Za-z]{8}-Owl$/);
			assert.match(randSuffix('사자', { length: 4, charset: '0123456789' }), /^사자_[0-9]{4}$/);
			// An empty separator is a choice, not a missing value.
			assert.match(randSuffix('Owl', { separator: '', length: 1 }), /^Owl[0-9A-Za-z]$/);
		}
	});

	it('length is clamped to at least one character and at most the maximum', () => {
		assert.strictEqual(randSuffix('a', { length: 0, separator: '' }).length, 2);
		assert.strictEqual(randSuffix('a', { length: -5, separator: '' }).length, 2);
		assert.strictEqual(
			randSuffix('a', { length: 999, separator: '' }).length,
			1 + AFFIX_LENGTH_MAX
		);
	});

	it('attaches to anything, which is the reason it is not a nickname option', () => {
		const names = randName({ language: 'ko', count: SAMPLE });

		for (const [index, tagged] of randSuffix(names).entries()) {
			assert.ok(tagged.startsWith(`${names[index]}_`), tagged);
		}

		assert.match(
			randPrefix('order-4021', { length: 4, separator: '-' }),
			/^[0-9A-Za-z]{4}-order-4021$/
		);
	});
});
