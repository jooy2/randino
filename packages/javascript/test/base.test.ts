import assert from 'assert';
import { describe, it } from 'node:test';
import * as randino from '../dist/index.js';
// Internal, but every generator's length options go through it.
import { lengthBounds } from '../dist/_internal/generate.js';

describe('base test', () => {
	it('all check success', async () => {
		// The package entry point is the API contract: everything documented in the
		// README has to be reachable from it, and nothing internal should leak.
		assert.deepStrictEqual(Object.keys(randino).sort(), [
			'AFFIX_CHARSET',
			'AFFIX_LENGTH_DEFAULT',
			'AFFIX_LENGTH_MAX',
			'AFFIX_SEPARATOR_DEFAULT',
			'AGE_GROUPS',
			'DATE_UNITS',
			'LOCATION_LANGUAGES',
			'LOCATION_LEVELS',
			'NAME_LANGUAGES',
			'ORGANIZATION_INDUSTRIES',
			'ORGANIZATION_TYPES',
			'PHONE_COUNTRIES',
			'PHONE_TYPES',
			'RAND_AGE_MAX',
			'RAND_COUNT_MAX',
			'RAND_LENGTH_MAX',
			'RAND_LENGTH_MIN',
			'RAND_LOCATION_LENGTH_MAX',
			'RAND_ORGANIZATION_LENGTH_MAX',
			'RAND_SENTENCE_COUNT_MAX',
			'RAND_SENTENCE_LENGTH_MAX',
			'WORD_LANGUAGES',
			'WORD_THEMES',
			'nameLengthRange',
			'nameSupportsMiddleName',
			'nameSupportsRoman',
			'nicknameLengthRange',
			'randAge',
			'randAnimal',
			'randBody',
			'randCity',
			'randClothing',
			'randColor',
			'randConcept',
			'randCountry',
			'randDate',
			'randDistrict',
			'randDrink',
			'randEmotion',
			'randFinance',
			'randFood',
			'randFurniture',
			'randGem',
			'randGender',
			'randJob',
			'randLocation',
			'randModifier',
			'randMusic',
			'randMyth',
			'randName',
			'randNature',
			'randNickname',
			'randObject',
			'randOrganization',
			'randPerson',
			'randPhone',
			'randPlace',
			'randPlant',
			'randPrefix',
			'randProduct',
			'randRegion',
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

		// A location written out is every level of it at once, so it has a length
		// ceiling of its own, and one generator per level below it.
		assert.strictEqual(typeof randino.randLocation({ language: 'ko' })[0], 'string');
		assert.strictEqual(randino.randLocation({ output: 'detail' })[0].country.length > 0, true);
		assert.strictEqual(randino.randCity({ language: 'en', output: 'detail' })[0].level, 'city');
		assert.strictEqual(randino.RAND_LOCATION_LENGTH_MAX, 100);
		assert.deepStrictEqual(randino.LOCATION_LEVELS, ['country', 'region', 'city', 'district']);

		// An age is a number rather than a string, and its groups are what `group`
		// accepts.
		assert.strictEqual(typeof randino.randAge()[0], 'number');
		assert.strictEqual(typeof randino.randAge({ output: 'detail' })[0].group, 'string');
		assert.strictEqual(randino.RAND_AGE_MAX, 120);
		assert.deepStrictEqual(randino.AGE_GROUPS, ['child', 'teen', 'adult', 'senior']);

		// A date is a string written by `format`, and one part of it is a number.
		assert.strictEqual(typeof randino.randDate()[0], 'string');
		assert.strictEqual(typeof randino.randDate({ unit: 'minute' })[0], 'number');
		assert.strictEqual(typeof randino.randDate({ output: 'detail' })[0].timestamp, 'number');
		assert.deepStrictEqual(randino.DATE_UNITS, [
			'year',
			'month',
			'day',
			'hour',
			'minute',
			'second',
			'millisecond'
		]);

		assert.strictEqual(typeof randino.randGender()[0], 'string');
		assert.strictEqual(randino.randGender({ language: 'en', output: 'detail' })[0].language, 'en');

		// An organization can be a name, a word for its business and a legal form at
		// once, so it has a length ceiling of its own.
		assert.strictEqual(typeof randino.randOrganization()[0], 'string');
		assert.strictEqual(randino.randOrganization({ output: 'detail' })[0].name.length > 0, true);
		assert.strictEqual(randino.RAND_ORGANIZATION_LENGTH_MAX, 60);
		assert.deepStrictEqual(randino.ORGANIZATION_TYPES, [
			'company',
			'nonprofit',
			'school',
			'government',
			'public'
		]);
		assert.strictEqual(randino.ORGANIZATION_INDUSTRIES.length, 10);

		// A phone number is written by its country, one country per word language.
		assert.strictEqual(typeof randino.randPhone()[0], 'string');
		assert.match(randino.randPhone({ output: 'detail' })[0].e164, /^\+\d+$/);
		assert.strictEqual(randino.PHONE_COUNTRIES.length, randino.WORD_LANGUAGES.length);
		assert.deepStrictEqual(randino.PHONE_TYPES, ['mobile', 'landline']);
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
			() => randino.nameSupportsMiddleName('xx' as never),
			() => randino.randLocation({ language: 'xx' as never }),
			() => randino.randLocation({ level: 'street' as never }),
			() => randino.randLocation({ minLength: NaN }),
			() => randino.randCity({ language: 'ja' as never }),
			() => randino.randCountry({ language: 'xx' as never, minLength: NaN }),
			() => randino.randAge({ group: 'elder' as never }),
			() => randino.randAge({ group: [null] as never }),
			() => randino.randAge({ distribution: 'normal' as never }),
			() => randino.randAge({ minAge: NaN, maxAge: 'x' as never }),
			() => randino.randDate({ unit: 'week' as never, format: 123 as never }),
			() => randino.randDate({ language: 'xx' as never, format: 'MMMM dddd A' }),
			() => randino.randDate({ utcOffset: [] as never, format: 'Z ZZ' }),
			() => randino.randDate({ minDate: {} as never, maxDate: [] as never, count: NaN }),
			() => randino.randPhone({ country: 'XX' as never, type: 'pager' as never }),
			() => randino.randPhone({ country: 123 as never, separator: 7 as never, count: NaN }),
			() => randino.randPhone({ fictional: 'yes' as never }),
			() => randino.randGender({ language: 'xx' as never, count: NaN }),
			() => randino.randGender({ includeUnknown: 'yes' as never }),
			() => randino.randOrganization({ language: 'xx' as never, type: 'shop' as never }),
			() => randino.randOrganization({ type: [null] as never, industry: 'mining' as never }),
			() => randino.randOrganization({ includeLegalForm: 'yes' as never, minLength: NaN })
		];

		for (const ask of asks) {
			assert.doesNotThrow(ask);
		}

		// And the fallback is the option's own default, not silence: `count: NaN`
		// asked for one name and used to hand back none.
		assert.strictEqual(randino.randName({ count: NaN }).length, 1);
		assert.strictEqual(randino.randSentence({ sentences: NaN })[0].split('. ').length, 1);
		// An age range that is not a number is the default range, not an empty one.
		assert.ok(randino.randAge({ minAge: NaN, maxAge: NaN })[0] <= 100);
		// A unit that is not one is the whole date, written the default way.
		assert.match(randino.randDate({ unit: 'week' as never })[0] as never, /^\d{4}-/);
		// A token of no length is not a token. `NaN` clamped to `NaN`, and a loop
		// that runs `NaN` times wrote nothing at all.
		assert.strictEqual(randino.randSuffix('x', { length: NaN }).length, 'x_'.length + 5);
	});

	it('a length range the wrong way round keeps maxLength', () => {
		// `maxLength` is the bound a caller is holding to — a field limit, a column
		// width — where `minLength` only shapes how a result reads. `[30, 5]` used to
		// read as `[30, 30]`.
		assert.deepStrictEqual(lengthBounds(30, 5, 3, 10), [5, 5]);
		assert.deepStrictEqual(lengthBounds(5, 30, 3, 10), [5, 30]);

		for (const word of randino.randWord({
			language: 'en',
			minLength: 30,
			maxLength: 5,
			count: 60
		})) {
			assert.ok(word.length <= 5, word);
		}
	});

	it('`random` is where every draw of a call comes from', () => {
		// One source, threaded through everything the call reaches — which for
		// `randSentence` is the word pools, the story planner and the name
		// generator. Two calls with the same seed have to agree on all of it.
		const seeded = (seed: number) => {
			let state = seed >>> 0;

			return () => {
				state = (state + 0x6d2b79f5) >>> 0;

				let next = Math.imul(state ^ (state >>> 15), state | 1);

				next ^= next + Math.imul(next ^ (next >>> 7), next | 61);

				return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
			};
		};

		const twice = <T>(draw: () => T) => [draw(), draw()];
		const agrees = <T>(draw: () => T) => {
			const [first, second] = twice(draw);

			assert.deepEqual(first, second);

			return first;
		};

		agrees(() => randino.randName({ language: 'en', count: 5, random: seeded(42) }));
		agrees(() => randino.randWord({ language: 'ko', count: 5, random: seeded(42) }));
		agrees(() => randino.randAnimal({ language: 'en', count: 5, random: seeded(42) }));
		agrees(() => randino.randNickname({ language: 'en', count: 5, random: seeded(42) }));
		agrees(() =>
			randino.randSentence({ language: 'ko', count: 3, sentences: 3, random: seeded(42) })
		);
		agrees(() => randino.randSuffix('MistyOwl', { random: seeded(42) }));
		agrees(() => randino.randPrefix('MistyOwl', { random: seeded(42) }));
		agrees(() => randino.randModifier('사자', { random: seeded(42) }));
		agrees(() => randino.randLocation({ count: 5, random: seeded(42) }));
		agrees(() => randino.randCity({ language: 'en', maxLength: 8, count: 5, random: seeded(42) }));
		agrees(() => randino.randAge({ count: 5, random: seeded(42) }));
		agrees(() => randino.randDate({ count: 5, random: seeded(42) }));
		agrees(() => randino.randDate({ unit: 'minute', count: 5, random: seeded(42) }));
		agrees(() => randino.randDate({ utcOffset: '+09:00', count: 5, random: seeded(42) }));
		agrees(() => randino.randPhone({ count: 5, random: seeded(42) }));
		agrees(() => randino.randPhone({ count: 5, fictional: true, random: seeded(42) }));
		agrees(() => randino.randGender({ count: 5, includeUnknown: true, random: seeded(42) }));
		agrees(() => randino.randOrganization({ count: 5, random: seeded(42) }));
		agrees(() => randino.randOrganization({ count: 5, maxLength: 20, random: seeded(42) }));

		// Two different seeds are two different answers, so the source is actually
		// what the draws are coming from.
		assert.notDeepEqual(
			randino.randName({ language: 'en', count: 5, random: seeded(1) }),
			randino.randName({ language: 'en', count: 5, random: seeded(2) })
		);

		// And the package's own source is put back afterwards, including when the
		// caller's throws.
		const before = randino.randName({ count: 5 });

		assert.throws(() =>
			randino.randName({
				random: () => {
					throw new Error('boom');
				}
			})
		);
		assert.notDeepEqual(before, randino.randName({ count: 5 }));

		// A source that hands back something that is not a number in `[0, 1)` reads
		// as `0` rather than as an index off the end of a pool.
		for (const source of [() => NaN, () => 1, () => -1, () => 'x' as never]) {
			assert.strictEqual(randino.randName({ language: 'en', random: source }).length, 1);
		}
	});
});
