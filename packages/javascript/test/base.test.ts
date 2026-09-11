import assert from 'assert';
import { describe, it } from 'node:test';
import * as randino from '../dist/index.js';

describe('base test', () => {
	it('all check success', async () => {
		// The package entry point is the API contract: everything documented in the
		// README has to be reachable from it, and nothing internal should leak.
		assert.deepStrictEqual(Object.keys(randino).sort(), [
			'AFFIX_CHARSET',
			'AFFIX_LENGTH_DEFAULT',
			'AFFIX_LENGTH_MAX',
			'AFFIX_SEPARATOR_DEFAULT',
			'NAME_LANGUAGES',
			'RAND_COUNT_MAX',
			'RAND_LENGTH_MAX',
			'RAND_LENGTH_MIN',
			'RAND_SENTENCE_COUNT_MAX',
			'RAND_SENTENCE_LENGTH_MAX',
			'WORD_LANGUAGES',
			'WORD_THEMES',
			'nameLengthRange',
			'nameSupportsMiddleName',
			'nameSupportsRoman',
			'nicknameLengthRange',
			'randAnimal',
			'randBody',
			'randClothing',
			'randColor',
			'randConcept',
			'randDrink',
			'randEmotion',
			'randFinance',
			'randFood',
			'randFurniture',
			'randGem',
			'randJob',
			'randModifier',
			'randMusic',
			'randMyth',
			'randName',
			'randNature',
			'randNickname',
			'randObject',
			'randPerson',
			'randPlace',
			'randPlant',
			'randPrefix',
			'randProduct',
			'randSentence',
			'randSound',
			'randSpace',
			'randSport',
			'randSuffix',
			'randTech',
			'randTime',
			'randTool',
			'randToy',
			'randVehicle',
			'randWeather',
			'randWord',
			'sentenceLengthRange',
			'wordLengthRange'
		]);

		assert.strictEqual(typeof randino.randName, 'function');
		// One function, two return shapes — the option is the API, so it is asserted
		// here rather than only in the category's own suite.
		assert.strictEqual(typeof randino.randName({ output: 'detail' })[0].roman, 'string');
		assert.ok(Array.isArray(randino.randNickname({ output: 'detail' })[0].words));
		assert.strictEqual(typeof randino.nameLengthRange, 'function');
		assert.strictEqual(typeof randino.nameSupportsMiddleName, 'function');
		assert.strictEqual(typeof randino.nameSupportsRoman, 'function');
		assert.ok(Array.isArray(randino.NAME_LANGUAGES));

		// One set of bounds for every generator, rather than one pair per category
		// holding the same numbers.
		assert.strictEqual(randino.RAND_LENGTH_MIN, 1);
		assert.strictEqual(randino.RAND_LENGTH_MAX, 40);
		assert.strictEqual(randino.RAND_COUNT_MAX, 10000);

		assert.strictEqual(typeof randino.randNickname, 'function');
		assert.strictEqual(typeof randino.nicknameLengthRange, 'function');

		// A sentence is many words rather than at most three, so it is the one
		// generator with a length ceiling of its own.
		assert.strictEqual(typeof randino.randSentence, 'function');
		assert.strictEqual(typeof randino.sentenceLengthRange, 'function');
		assert.ok(Array.isArray(randino.randSentence({ output: 'detail' })[0].phrases));
		assert.strictEqual(randino.RAND_SENTENCE_LENGTH_MAX, 200);
		assert.strictEqual(randino.RAND_SENTENCE_COUNT_MAX, 10);
		assert.ok(Array.isArray(randino.WORD_LANGUAGES));
		assert.ok(Array.isArray(randino.WORD_THEMES));

		// One generator per theme, and the theme list is what says how many.
		assert.strictEqual(typeof randino.randWord, 'function');
		assert.strictEqual(typeof randino.wordLengthRange, 'function');
		assert.strictEqual(typeof randino.randAnimal({ language: 'ko' })[0], 'string');
		assert.strictEqual(randino.randProduct({ output: 'detail' })[0].theme, 'product');

		assert.strictEqual(typeof randino.randSuffix, 'function');
		assert.strictEqual(typeof randino.randPrefix, 'function');
		// The decorators work with nothing to decorate, which is what makes what
		// they attach available on its own.
		assert.strictEqual(typeof randino.randSuffix(), 'string');
		assert.strictEqual(typeof randino.randPrefix(), 'string');
		assert.strictEqual(typeof randino.randModifier(), 'string');
		assert.strictEqual(randino.AFFIX_LENGTH_DEFAULT, 5);
		assert.strictEqual(randino.AFFIX_LENGTH_MAX, 32);
		assert.strictEqual(randino.AFFIX_SEPARATOR_DEFAULT, '_');
		assert.match(randino.AFFIX_CHARSET, /^[0-9A-Za-z]+$/);
	});

	it('an option the types rule out falls back rather than throwing', () => {
		// TypeScript rules every one of these out and a JavaScript caller can still
		// pass them. Each used to reach a pool lookup or an array length and throw
		// from somewhere that named neither the option nor the value.
		const asks: (() => unknown)[] = [
			() => randino.randName({ language: 'xx' as never }),
			() => randino.randName({ gender: 'other' as never }),
			() => randino.randName({ count: NaN }),
			() => randino.randName({ minLength: NaN }),
			() => randino.randWord({ theme: 'nope' as never }),
			() => randino.randWord({ language: 'xx' as never }),
			() => randino.randNickname({ theme: 'nope' as never }),
			() => randino.randNickname({ slots: 123 as never }),
			() => randino.randSentence({ language: 'xx' as never }),
			() => randino.randSentence({ type: 123 as never }),
			() => randino.randSentence({ include: 123 as never }),
			() => randino.randSentence({ include: [null] as never }),
			() => randino.randSentence({ slots: 123 as never }),
			() => randino.randSentence({ shape: 'huge' as never }),
			() => randino.randSentence({ story: 'nope' as never }),
			() => randino.randSentence({ style: 'shouty' as never }),
			() => randino.randSentence({ tense: 'future' as never }),
			() => randino.randSentence({ sentences: NaN }),
			() => randino.nameLengthRange('xx' as never),
			() => randino.wordLengthRange('xx' as never),
			() => randino.nicknameLengthRange('xx' as never),
			() => randino.sentenceLengthRange('xx' as never),
			() => randino.nameSupportsMiddleName('xx' as never)
		];

		for (const ask of asks) {
			assert.doesNotThrow(ask);
		}

		// And the fallback is the option's own default, not silence: `count: NaN`
		// asked for one name and used to hand back none.
		assert.strictEqual(randino.randName({ count: NaN }).length, 1);
		assert.strictEqual(randino.randSentence({ sentences: NaN })[0].split('. ').length, 1);
		// A token of no length is not a token. `NaN` clamped to `NaN`, and a loop
		// that runs `NaN` times wrote nothing at all.
		assert.strictEqual(randino.randSuffix('x', { length: NaN }).length, 'x_'.length + 5);
	});
});
