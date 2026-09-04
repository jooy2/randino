import assert from 'assert';
import { describe, it } from 'node:test';
import {
	AFFIX_CHARSET,
	AFFIX_LENGTH_MAX,
	WORD_LANGUAGES,
	randAnimal,
	randModifier,
	randName,
	randNickname,
	randPrefix,
	randSuffix,
	randWord
} from '../dist/index.js';
import type { WordLanguage } from '../dist/index.js';
// The decorating pools are internal, but what `randModifier` attaches has to
// come out of them, and they are the same pools the nickname generator uses.
import { WORD_DATA } from '../dist/word/data/index.js';
import { agree, modifierFollows } from '../dist/word/wordGenerator.js';
import type { WordGender } from '../dist/word/data/types.js';

const SAMPLE = 60;

/** Every word the language can decorate with, adjectives and actions together. */
const modifiersOf = (language: WordLanguage): string[] => [
	...WORD_DATA[language].adjectives,
	...WORD_DATA[language].actions
];

/** The default token, as a pattern — the charset minus `0O1lI`, five long. */
const TOKEN = /^[0-9A-Za-z]{5}$/;

describe('Decorate', () => {
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

	it('with no value at all, the token is the whole answer', () => {
		// What a decorator attaches is worth having on its own, so the value is
		// optional on all three of them.
		for (let i = 0; i < SAMPLE; i += 1) {
			assert.match(randSuffix(), TOKEN);
			assert.match(randPrefix(), TOKEN);
			assert.match(randSuffix({ length: 8 }), /^[0-9A-Za-z]{8}$/);
			assert.match(randPrefix({ length: 4, charset: '0123456789' }), /^[0-9]{4}$/);
			// No value means no separator either — there is nothing to separate.
			assert.ok(!randSuffix({ separator: '-' }).includes('-'));
		}

		// An empty string is a value, and a missing one is not.
		assert.strictEqual(randSuffix('').length, 6);
	});

	it('randModifier attaches a real modifier on the side the language uses', () => {
		for (const language of WORD_LANGUAGES) {
			const data = WORD_DATA[language];
			// A value the language knows carries a gender, and the modifier agrees
			// with it, so every form of every modifier counts as a real one.
			const forms = Object.keys(data.agreement ?? {}) as WordGender[];
			const modifiers = new Set([
				...modifiersOf(language),
				...forms.flatMap((form) => modifiersOf(language).map((word) => agree(data, word, form)))
			]);
			// Vietnamese and Spanish write `mèo xanh` and `gato azul`, so the modifier
			// lands behind the value. The frames are what say so.
			const follows = modifierFollows(WORD_DATA[language]);

			for (const word of randWord({ language, count: SAMPLE })) {
				const decorated = randModifier(word, { language });
				const attached = follows
					? decorated.slice(word.length)
					: decorated.slice(0, decorated.length - word.length);

				assert.ok(follows ? decorated.startsWith(word) : decorated.endsWith(word), decorated);
				assert.ok(modifiers.has(attached.trim()), `${decorated} carries no ${language} modifier`);
			}
		}
	});

	it('randModifier on its own is the modifier', () => {
		for (const language of WORD_LANGUAGES) {
			const modifiers = new Set(modifiersOf(language));

			for (let i = 0; i < SAMPLE; i += 1) {
				assert.ok(modifiers.has(randModifier({ language })), language);
			}
		}

		// Every language shows up when none is asked for.
		const used = new Set<WordLanguage>();

		for (let i = 0; i < 400; i += 1) {
			const word = randModifier();

			for (const language of WORD_LANGUAGES) {
				if (modifiersOf(language).includes(word)) {
					used.add(language);
				}
			}
		}

		assert.strictEqual(used.size, WORD_LANGUAGES.length);
	});

	it('kind decides whether the modifier describes or acts', () => {
		for (const language of WORD_LANGUAGES) {
			const data = WORD_DATA[language];
			const genders = Object.keys(data.agreement ?? {}) as WordGender[];
			// A value the language knows inflects the modifier, so the value is left
			// out here and the base form is what comes back.
			const pools = {
				adjective: new Set(data.adjectives),
				action: new Set(data.actions)
			};

			for (const kind of ['adjective', 'action'] as const) {
				for (let i = 0; i < SAMPLE; i += 1) {
					const word = randModifier({ language, kind });

					assert.ok(pools[kind].has(word), `${language}: ${word} is no ${kind}`);
				}
			}

			// Decorating a value still agrees with it, whichever kind was asked for.
			const noun = Object.keys(data.nounGender ?? {})[0];

			if (noun) {
				// The base form counts too: Spanish lists no `m` rules because the base
				// form already is the masculine one.
				const forms = new Set([
					...data.actions,
					...genders.flatMap((gender) => [...data.actions].map((word) => agree(data, word, gender)))
				]);

				for (let i = 0; i < SAMPLE; i += 1) {
					const decorated = randModifier(noun, { language, kind: 'action', separator: '|' });
					const attached = decorated.split('|').filter((part) => part !== noun)[0];

					assert.ok(forms.has(attached), `${language}: ${decorated}`);
				}
			}
		}

		// Left out, both kinds are in play — which is what it did before there was
		// an option at all.
		const both = new Set<string>();

		for (let i = 0; i < 400; i += 1) {
			both.add(randModifier({ language: 'ko' }));
		}

		assert.ok([...both].some((word) => WORD_DATA.ko.adjectives.includes(word)));
		assert.ok([...both].some((word) => WORD_DATA.ko.actions.includes(word)));
	});

	it('randModifier follows the script of the value when no language is given', () => {
		const belongs = (word: string, language: WordLanguage) =>
			modifiersOf(language).some((modifier) => word.startsWith(modifier));

		for (const [word, language] of [
			['고양이', 'ko'],
			['ネコ', 'ja'],
			['熊猫', 'zh'],
			['Cat', 'en']
		] as [string, WordLanguage][]) {
			for (let i = 0; i < 20; i += 1) {
				assert.ok(belongs(randModifier(word), language), `${word}: ${randModifier(word)}`);
			}
		}

		// An explicit language wins over the guess.
		for (let i = 0; i < 20; i += 1) {
			assert.ok(belongs(randModifier('고양이', { language: 'en' }), 'en'));
		}
	});

	it('randModifier takes a separator, a realism and a list', () => {
		for (let i = 0; i < SAMPLE; i += 1) {
			assert.match(randModifier('Owl', { language: 'en', separator: ' ' }), /^[A-Za-z]+ Owl$/);
			assert.match(randModifier('사자', { language: 'ko', separator: '-' }), /^[가-힣]+-사자$/);
		}

		// An invented modifier is still in the language's script.
		const invented = new Set(modifiersOf('ko'));
		let drawn = 0;

		for (let i = 0; i < 200; i += 1) {
			const word = randModifier({ language: 'ko', realism: 'invented' });

			assert.match(word, /^[가-힣]+$/, word);

			if (invented.has(word)) {
				drawn += 1;
			}
		}

		assert.ok(drawn < 20, `${drawn} of 200 still came from the pool`);

		// A list gets a fresh modifier each, not one for the batch.
		const words = randAnimal({ language: 'ko', count: SAMPLE });
		const decorated = randModifier(words);

		assert.strictEqual(decorated.length, words.length);

		for (const [index, word] of words.entries()) {
			assert.ok(decorated[index].endsWith(word), decorated[index]);
		}

		assert.deepStrictEqual(randModifier([]), []);
	});
});
