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
			'ARCHITECTURES',
			'CPU_VENDORS',
			'DATE_UNITS',
			'DEVICE_TYPES',
			'DISK_TYPES',
			'DISK_UNITS',
			'FILE_CATEGORIES',
			'GPU_VENDORS',
			'LOCATION_LANGUAGES',
			'LOCATION_LEVELS',
			'MIME_TOP_LEVELS',
			'NAME_LANGUAGES',
			'ORGANIZATION_INDUSTRIES',
			'ORGANIZATION_TYPES',
			'PHONE_COUNTRIES',
			'PHONE_TYPES',
			'RAM_UNITS',
			'RAND_AGE_MAX',
			'RAND_COUNT_MAX',
			'RAND_LENGTH_MAX',
			'RAND_LENGTH_MIN',
			'RAND_LOCATION_LENGTH_MAX',
			'RAND_ORGANIZATION_LENGTH_MAX',
			'RAND_SENTENCE_COUNT_MAX',
			'RAND_SENTENCE_LENGTH_MAX',
			'SYSTEM_PLATFORMS',
			'VERSION_FORMATS',
			'WORD_LANGUAGES',
			'WORD_THEMES',
			'nameLengthRange',
			'nameSupportsMiddleName',
			'nameSupportsRoman',
			'nicknameLengthRange',
			'randAge',
			'randAnimal',
			'randAppStore',
			'randArchitecture',
			'randBody',
			'randCity',
			'randClothing',
			'randColor',
			'randConcept',
			'randCountry',
			'randCpu',
			'randDate',
			'randDevice',
			'randDiskSize',
			'randDiskType',
			'randDistrict',
			'randDrink',
			'randEmotion',
			'randFileExtension',
			'randFinance',
			'randFood',
			'randFurniture',
			'randGem',
			'randGender',
			'randGpu',
			'randJob',
			'randLocation',
			'randMimeType',
			'randModifier',
			'randMusic',
			'randMyth',
			'randName',
			'randNature',
			'randNickname',
			'randObject',
			'randOrganization',
			'randOs',
			'randPerson',
			'randPhone',
			'randPlace',
			'randPlant',
			'randPrefix',
			'randProduct',
			'randRam',
			'randRegion',
			'randResolution',
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
			'randVersion',
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

		// A system value belongs to a kind of machine, and an operating system is a
		// real release.
		assert.deepStrictEqual(randino.SYSTEM_PLATFORMS, ['desktop', 'mobile']);
		assert.strictEqual(typeof randino.randOs()[0], 'string');
		assert.strictEqual(typeof randino.randOs({ output: 'detail' })[0].year, 'number');
		assert.strictEqual(typeof randino.randDevice()[0], 'string');
		assert.deepStrictEqual(randino.DEVICE_TYPES, ['phone', 'tablet', 'laptop']);
		assert.match(randino.randRam()[0], /^\d+ (MB|GB)$/);
		assert.deepStrictEqual(randino.RAM_UNITS, ['MB', 'GB']);
		assert.strictEqual(typeof randino.randDiskType()[0], 'string');
		assert.deepStrictEqual(randino.DISK_TYPES, ['hdd', 'ssd', 'sshd', 'emmc', 'ufs']);
		assert.match(randino.randDiskSize()[0], /^\d+ (GB|TB)$/);
		assert.deepStrictEqual(randino.DISK_UNITS, ['MB', 'GB', 'TB']);
		assert.strictEqual(typeof randino.randCpu()[0], 'string');
		assert.strictEqual(typeof randino.randGpu()[0], 'string');
		assert.ok(randino.ARCHITECTURES.includes(randino.randArchitecture()[0] as never));
		assert.match(randino.randResolution()[0], /^\d+x\d+$/);
		assert.match(randino.randVersion()[0], /^\d+\.\d+\.\d+$/);
		assert.strictEqual(typeof randino.randAppStore()[0], 'string');
		assert.match(randino.randFileExtension()[0], /^\.[a-z0-9]+$/);
		assert.match(randino.randMimeType()[0], /^[a-z]+\/[a-z0-9.+-]+$/);
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
			() => randino.randOrganization({ includeLegalForm: 'yes' as never, minLength: NaN }),
			() => randino.randOs({ platform: 'tv' as never, minYear: NaN, maxYear: 'x' as never }),
			() => randino.randOs({ includeBuild: 'yes' as never, includeVersion: 0 as never }),
			() => randino.randDevice({ type: 'watch' as never, minYear: 'x' as never }),
			() => randino.randDevice({ type: [null] as never, includeVendor: 'no' as never }),
			() => randino.randRam({ unit: 'KB' as never, minSize: NaN, maxSize: 'x' as never }),
			() => randino.randRam({ includeUnit: 'no' as never, count: NaN }),
			() => randino.randDiskType({ platform: 'server' as never, count: 'x' as never }),
			() => randino.randDiskSize({ unit: 'PB' as never, minSize: NaN, includeUnit: 0 as never }),
			() =>
				randino.randCpu({
					platform: 'server' as never,
					maxYear: NaN,
					includeVendor: 'no' as never
				}),
			() => randino.randModifier('cat', { language: 'xx' as never }),
			() => randino.randModifier('cat', { language: '__proto__' as never }),
			() => randino.randModifier({ language: 'toString' as never }),
			() => randino.randNickname({ wordSeparator: 5 as never }),
			() => randino.nicknameLengthRange('en', [] as never)
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
		// A separator that is not a string is the language's own joiner.
		assert.deepStrictEqual(
			randino.nicknameLengthRange('en', 5 as never),
			randino.nicknameLengthRange('en')
		);
		// A language the package does not know leaves the value's own script to decide.
		for (let i = 0; i < 20; i += 1) {
			assert.doesNotMatch(randino.randModifier('고양이', { language: 'xx' as never }), / /);
		}
		// A word the lookup inherits from `Object.prototype` is no Spanish noun: an
		// English modifier goes in front of it, where a Spanish one would follow.
		assert.match(randino.randModifier('constructor', { separator: ' ' }), / constructor$/);
		assert.match(randino.randModifier('toString', { separator: ' ' }), / toString$/);
	});

	it('a null is an option left out, and a null options object is none', () => {
		// The other two packages read a null as left out. `Number(null)` is `0`, so
		// JavaScript used to read every one of these as zero.
		assert.strictEqual(randino.randName({ count: null as never }).length, 1);
		assert.strictEqual(randino.randName({ count: '' as never }).length, 1);
		assert.strictEqual(randino.randName({ count: [] as never }).length, 1);
		assert.ok(randino.randName({ language: 'en', maxLength: null as never })[0].length > 3);
		assert.ok(randino.randAge({ maxAge: null as never, count: 50 }).some((age) => age > 0));
		assert.strictEqual(randino.randOs({ maxYear: null as never }).length, 1);
		assert.strictEqual(randino.randRam({ maxSize: null as never }).length, 1);
		// A count spelled as a string is still a count.
		assert.strictEqual(randino.randName({ count: '3' as never }).length, 3);

		for (const [name, generate] of Object.entries(randino)) {
			if (typeof generate !== 'function' || !/^rand[A-Z]/.test(name)) {
				continue;
			}

			// The decorators take a value first, and read a null one as none.
			const result = (generate as (options: unknown) => unknown)(null);

			assert.ok(typeof result === 'string' || (Array.isArray(result) && result.length === 1), name);
		}
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
		agrees(() => randino.randOs({ count: 5, includeBuild: true, random: seeded(42) }));
		agrees(() => randino.randDevice({ count: 5, random: seeded(42) }));
		agrees(() => randino.randRam({ count: 5, random: seeded(42) }));
		agrees(() => randino.randDiskType({ count: 5, random: seeded(42) }));
		agrees(() => randino.randDiskSize({ count: 5, random: seeded(42) }));
		agrees(() => randino.randCpu({ count: 5, random: seeded(42) }));
		agrees(() => randino.randGpu({ count: 5, random: seeded(42) }));
		agrees(() => randino.randArchitecture({ count: 5, includeRare: true, random: seeded(42) }));
		agrees(() => randino.randResolution({ count: 5, random: seeded(42) }));
		agrees(() => randino.randVersion({ count: 5, format: 'all', random: seeded(42) }));
		agrees(() => randino.randAppStore({ count: 5, random: seeded(42) }));
		agrees(() => randino.randFileExtension({ count: 5, random: seeded(42) }));
		agrees(() => randino.randMimeType({ count: 5, random: seeded(42) }));

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
