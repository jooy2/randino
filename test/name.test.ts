import assert from 'assert';
import { describe, it } from 'node:test';
import {
	NAME_COUNT_MAX,
	NAME_LANGUAGES,
	nameLengthRange,
	nameSupportsMiddleName,
	nameSupportsRoman,
	randomName,
	randomNameDetails
} from '../dist/index.js';
import type { NameLanguage } from '../dist/index.js';
// Internal, so it gets its own checks: everything else about a generated name is
// random, but romanization is a pure function with known answers.
import { romanizeHangul } from '../dist/name/romanize.js';

// Output is random by definition, so the tests assert the properties every name
// must have — script, structure, length, requested prefix — over a sample large
// enough that a broken option cannot pass by luck.
const SAMPLE = 60;

// A name may be a single part or several joined by a single space.
const joined = (part: string) => new RegExp(`^${part}+( ${part}+)*$`, 'u');

const SCRIPT: Record<NameLanguage, RegExp> = {
	en: joined('[A-Za-z]'),
	ko: /^[가-힣]+$/,
	ja: /^[々぀-ヿ一-鿿]+$/,
	zh: /^[々一-鿿]+$/,
	it: joined('\\p{Script=Latin}'),
	de: joined('\\p{Script=Latin}'),
	ru: joined('\\p{Script=Cyrillic}'),
	es: joined('\\p{Script=Latin}'),
	vi: joined('\\p{Script=Latin}')
};

const ROMAN = joined('[A-Za-z]');

describe('Name', () => {
	it('randomName returns one name by default', () => {
		const names = randomName();

		assert.strictEqual(names.length, 1);
		assert.strictEqual(typeof names[0], 'string');
		assert.ok(names[0].length > 0);
	});

	it('randomName returns exactly `count` names', () => {
		assert.strictEqual(randomName({ count: 25 }).length, 25);
		assert.strictEqual(randomName({ count: 1 }).length, 1);
		// Out-of-range counts are clamped rather than rejected.
		assert.strictEqual(randomName({ count: 0 }).length, 0);
		assert.strictEqual(randomName({ count: -10 }).length, 0);
		assert.strictEqual(randomName({ count: 2.7 }).length, 2);
		assert.strictEqual(randomName({ count: NAME_COUNT_MAX + 500 }).length, NAME_COUNT_MAX);
	});

	it('every language writes names in its own script', () => {
		for (const language of NAME_LANGUAGES) {
			for (const name of randomName({ language, count: SAMPLE })) {
				assert.match(name, SCRIPT[language], `${language}: ${name}`);
			}
		}
	});

	it('the mixed language uses every language it knows', () => {
		const used = new Set(
			randomNameDetails({ count: 600 }).map((detail) => {
				assert.match(detail.native, SCRIPT[detail.language], detail.native);
				return detail.language;
			})
		);

		assert.strictEqual(used.size, NAME_LANGUAGES.length);
	});

	it('script: roman romanizes every language into ASCII', () => {
		for (const language of NAME_LANGUAGES) {
			for (const name of randomName({ language, count: SAMPLE, script: 'roman' })) {
				assert.match(name, ROMAN, `${language}: ${name}`);
			}
		}
	});

	it('script: roman leaves English names as they are', () => {
		for (const detail of randomNameDetails({ language: 'en', count: SAMPLE })) {
			assert.strictEqual(detail.native, detail.roman);
		}

		assert.strictEqual(nameSupportsRoman('en'), false);
		assert.strictEqual(nameSupportsRoman('ko'), true);
	});

	it('Korean surnames use their conventional romanization', () => {
		for (const detail of randomNameDetails({ language: 'ko', count: SAMPLE, startsWith: '김' })) {
			assert.match(detail.native, /^김/);
			assert.match(detail.roman, /^Kim /);
		}
	});

	it('includeSurname adds or drops the family name', () => {
		// A generous length range keeps the generator from padding the name with
		// extra parts to reach a minimum length, which is what is being counted.
		const spaced = { minLength: 1, maxLength: 30, count: SAMPLE } as const;

		for (const name of randomName({ ...spaced, language: 'en' })) {
			assert.strictEqual(name.split(' ').length, 2, name);
		}

		for (const name of randomName({ ...spaced, language: 'en', includeSurname: false })) {
			assert.strictEqual(name.split(' ').length, 1, name);
		}

		// Korean keeps its own default range: one syllable of surname plus two of
		// given name.
		for (const name of randomName({ language: 'ko', count: SAMPLE })) {
			assert.strictEqual(name.length, 3, name);
		}

		for (const name of randomName({ language: 'ko', count: SAMPLE, includeSurname: false })) {
			assert.strictEqual(name.length, 2, name);
		}
	});

	it('includeMiddleName adds a middle name where the language has one', () => {
		const names = randomName({
			language: 'en',
			count: SAMPLE,
			includeMiddleName: true,
			minLength: 1,
			maxLength: 30
		});

		for (const name of names) {
			assert.strictEqual(name.split(' ').length, 3, name);
		}

		// Korean, Japanese and Chinese names have no middle part, so the option is
		// ignored instead of inventing one.
		assert.strictEqual(nameSupportsMiddleName('ko'), false);
		assert.strictEqual(nameSupportsMiddleName('en'), true);

		for (const name of randomName({ language: 'ko', count: SAMPLE, includeMiddleName: true })) {
			assert.strictEqual(name.length, 3, name);
		}
	});

	it('gender picks the pools the name is drawn from', () => {
		const options = { language: 'ru', minLength: 1, maxLength: 40, count: SAMPLE } as const;

		// Russian is the one language whose middle name and surname are inflected
		// for gender, which makes the choice verifiable.
		for (const name of randomName({ ...options, gender: 'male', includeMiddleName: true })) {
			const [, middle] = name.split(' ');
			assert.match(middle, /(ич)$/, name);
		}

		for (const name of randomName({ ...options, gender: 'female', includeMiddleName: true })) {
			const [, middle, surname] = name.split(' ');
			assert.match(middle, /(на)$/, name);
			assert.match(surname, /а$/, name);
		}

		const genders = new Set(randomNameDetails({ ...options, count: 200 }).map((d) => d.gender));
		assert.deepStrictEqual([...genders].sort(), ['female', 'male']);

		for (const detail of randomNameDetails({ ...options, gender: 'female', count: SAMPLE })) {
			assert.strictEqual(detail.gender, 'female');
		}
	});

	it('names stay inside the requested length range', () => {
		const ranges: [NameLanguage, number, number][] = [
			['ko', 3, 3],
			['ko', 2, 2],
			['ko', 5, 8],
			['ja', 3, 5],
			['zh', 2, 3],
			['en', 8, 16],
			['en', 20, 25],
			['ru', 12, 20],
			['vi', 5, 13]
		];

		for (const [language, minLength, maxLength] of ranges) {
			for (const name of randomName({ language, minLength, maxLength, count: SAMPLE })) {
				assert.ok(
					name.length >= minLength && name.length <= maxLength,
					`${language} ${minLength}-${maxLength}: ${name} (${name.length})`
				);
			}
		}
	});

	it('omitted length bounds fall back to the language default', () => {
		assert.deepStrictEqual(nameLengthRange('ko'), [3, 3]);
		assert.deepStrictEqual(nameLengthRange('ko', false), [2, 2]);
		assert.deepStrictEqual(nameLengthRange('en'), [8, 16]);
		assert.deepStrictEqual(nameLengthRange('en', false), [4, 8]);
		assert.deepStrictEqual(nameLengthRange('en', true, true), [12, 24]);
		// A middle name the language does not have cannot widen the range.
		assert.deepStrictEqual(nameLengthRange('ko', true, true), [3, 3]);

		for (const language of NAME_LANGUAGES) {
			const [min, max] = nameLengthRange(language);

			for (const name of randomName({ language, count: SAMPLE })) {
				assert.ok(name.length >= min && name.length <= max, `${language}: ${name}`);
			}
		}
	});

	it('startsWith leads every name with the requested character', () => {
		for (const name of randomName({ language: 'en', count: SAMPLE, startsWith: 'k' })) {
			assert.match(name, /^[Kk]/, name);
		}

		for (const name of randomName({ language: 'ko', count: SAMPLE, startsWith: '김' })) {
			assert.match(name, /^김/, name);
		}

		// The character leads the given name when there is no surname to lead with.
		for (const name of randomName({
			language: 'ko',
			count: SAMPLE,
			includeSurname: false,
			startsWith: '김'
		})) {
			assert.match(name, /^김/, name);
		}

		// A letter no real name starts with is answered with an invented name
		// rather than an empty result.
		for (const name of randomName({ language: 'en', count: SAMPLE, startsWith: 'Q' })) {
			assert.match(name, /^Q/, name);
			assert.match(name, ROMAN, name);
		}

		// Only the first character of a longer string is used.
		for (const name of randomName({ language: 'en', count: 10, startsWith: 'Beck' })) {
			assert.match(name, /^B/, name);
		}
	});

	it('style invents names without breaking the script or the structure', () => {
		for (const style of [0, 50, 100, -20, 500]) {
			for (const language of NAME_LANGUAGES) {
				for (const name of randomName({ language, style, count: 20 })) {
					assert.match(name, SCRIPT[language], `${language} @ ${style}: ${name}`);
				}
			}
		}

		// The abstract end should mostly leave the curated pools behind.
		const realistic = new Set(randomName({ language: 'en', style: 0, count: 400 }));
		const abstract = randomName({ language: 'en', style: 100, count: 100 });
		const overlap = abstract.filter((name) => realistic.has(name)).length;

		assert.ok(overlap < 10, `too many invented names look curated: ${overlap}`);
	});

	it('unique never repeats a name', () => {
		const names = randomName({ language: 'ko', count: 400, unique: true });

		assert.strictEqual(new Set(names).size, names.length);
		// Korean given names are a closed pool, so a request this large runs out of
		// combinations and returns fewer names instead of looping forever.
		const limited = randomName({
			language: 'ko',
			count: 400,
			unique: true,
			includeSurname: false
		});

		assert.strictEqual(new Set(limited).size, limited.length);
		assert.ok(limited.length < 400, `expected the pool to run out: ${limited.length}`);
	});

	it('randomNameDetails reports both scripts and the choices made', () => {
		for (const detail of randomNameDetails({ language: 'ja', count: SAMPLE })) {
			assert.strictEqual(detail.language, 'ja');
			assert.match(detail.native, SCRIPT.ja, detail.native);
			assert.match(detail.roman, ROMAN, detail.roman);
			assert.ok(detail.gender === 'male' || detail.gender === 'female');
		}
	});

	it('romanizeHangul follows the Revised Romanization of Korean', () => {
		const cases: [string, string][] = [
			['민준', 'minjun'],
			['서연', 'seoyeon'],
			['하은', 'haeun'],
			['한결', 'hangyeol'],
			['지훈', 'jihun'],
			['슬기', 'seulgi'],
			['별', 'byeol'],
			['다온', 'daon'],
			['하람', 'haram'],
			['광수', 'gwangsu'],
			['혜진', 'hyejin'],
			['아름', 'areum'],
			['하늘', 'haneul'],
			['채원', 'chaewon'],
			['지율', 'jiyul'],
			['영희', 'yeonghui'],
			// A final consonant in front of a vowel moves into the next syllable.
			['은우', 'eunu'],
			['백은', 'baegeun'],
			// Sound changes between syllables.
			['석민', 'seongmin'],
			['성록', 'seongnok'],
			['슬나', 'seulla'],
			['좋고', 'joko'],
			// Anything that is not a composed syllable is passed through.
			['Kim 민준', 'Kim minjun']
		];

		for (const [hangul, roman] of cases) {
			assert.strictEqual(romanizeHangul(hangul), roman, hangul);
		}
	});
});
