import assert from 'assert';
import { describe, it } from 'node:test';
import {
	RAND_COUNT_MAX,
	WORD_LANGUAGES,
	WORD_THEMES,
	randAnimal,
	randBody,
	randClothing,
	randColor,
	randConcept,
	randDrink,
	randEmotion,
	randFinance,
	randFood,
	randGem,
	randJob,
	randMusic,
	randMyth,
	randNature,
	randObject,
	randPlace,
	randPlant,
	randProduct,
	randSpace,
	randSport,
	randTech,
	randTime,
	randTool,
	randVehicle,
	randWeather,
	randWord,
	wordLengthRange
} from '../dist/index.js';
import type {
	RandRealism,
	RandThemedWordOptions,
	WordDetail,
	WordLanguage,
	WordTheme
} from '../dist/index.js';
// The datasets are internal, but a word generator is only as good as the pools
// behind it — these checks are what tie the output back to them.
import { WORD_DATA } from '../dist/word/data/index.js';

const SAMPLE = 60;

const SCRIPT: Record<WordLanguage, RegExp> = {
	en: /^[A-Za-z]+$/,
	ko: /^[가-힣]+$/,
	ja: /^[々぀-ヿ一-鿿]+$/,
	zh: /^[々一-鿿]+$/,
	vi: /^[a-zA-ZÀ-ỹ]+(?: [a-zA-ZÀ-ỹ]+)*$/,
	es: /^[a-zA-ZÀ-ÿ]+(?: [a-zA-ZÀ-ÿ]+)*$/,
	it: /^[a-zA-ZÀ-ÿ]+(?: [a-zA-ZÀ-ÿ]+)*$/,
	de: /^[a-zA-ZÀ-ÿß]+(?: [a-zA-ZÀ-ÿß]+)*$/
};

/** The themed generator for each theme, which is what the seventeen of them are. */
const THEMED: Record<WordTheme, (options?: RandThemedWordOptions) => string[]> = {
	animal: randAnimal,
	object: randObject,
	nature: randNature,
	plant: randPlant,
	gem: randGem,
	concept: randConcept,
	myth: randMyth,
	job: randJob,
	music: randMusic,
	place: randPlace,
	food: randFood,
	sport: randSport,
	vehicle: randVehicle,
	product: randProduct,
	color: randColor,
	finance: randFinance,
	tech: randTech,
	weather: randWeather,
	space: randSpace,
	time: randTime,
	emotion: randEmotion,
	body: randBody,
	clothing: randClothing,
	tool: randTool,
	drink: randDrink
};

function nounsOf(language: WordLanguage, theme?: WordTheme): string[] {
	const data = WORD_DATA[language];

	return theme ? [...data.nouns[theme]] : WORD_THEMES.flatMap((each) => [...data.nouns[each]]);
}

function details(options: Parameters<typeof randWord>[0] = {}): WordDetail[] {
	return randWord({ ...options, output: 'detail' });
}

describe('Word', () => {
	it('randWord returns one word by default', () => {
		const words = randWord();

		assert.strictEqual(words.length, 1);
		assert.strictEqual(typeof words[0], 'string');
		assert.ok(words[0].length > 0);
	});

	it('randWord returns exactly `count` words', () => {
		assert.strictEqual(randWord({ count: 25 }).length, 25);
		assert.strictEqual(randWord({ count: 0 }).length, 0);
		assert.strictEqual(randWord({ count: -10 }).length, 0);
		assert.strictEqual(randWord({ count: 2.7 }).length, 2);
		assert.strictEqual(randWord({ count: RAND_COUNT_MAX + 500 }).length, RAND_COUNT_MAX);
	});

	it('every language writes its words in its own script', () => {
		for (const language of WORD_LANGUAGES) {
			for (const word of randWord({ language, count: SAMPLE })) {
				assert.match(word, SCRIPT[language], `${language}: ${word}`);
			}

			for (const word of randWord({ language, count: SAMPLE, realism: 'invented' })) {
				assert.match(word, SCRIPT[language], `${language} invented: ${word}`);
			}
		}
	});

	it('the mixed language uses every language it knows', () => {
		const used = new Set(details({ count: 400 }).map((detail) => detail.language));

		assert.strictEqual(used.size, WORD_LANGUAGES.length);
	});

	it('a drawn word comes out of the pools, and reports the theme that holds it', () => {
		for (const language of WORD_LANGUAGES) {
			const pool = new Set(nounsOf(language));

			for (const detail of details({ language, count: 200 })) {
				assert.ok(pool.has(detail.word), `${language}: ${detail.word} is not in the pools`);
				assert.ok(detail.theme, detail.word);
				assert.ok(nounsOf(language, detail.theme!).includes(detail.word), detail.word);
			}
		}
	});

	it('theme narrows the pool to that one theme', () => {
		for (const theme of WORD_THEMES) {
			for (const language of WORD_LANGUAGES) {
				const nouns = nounsOf(language, theme);

				for (const detail of details({ language, theme, count: 40 })) {
					assert.strictEqual(detail.theme, theme, detail.word);
					assert.ok(nouns.includes(detail.word), `${detail.word} is not a ${theme} word`);
				}
			}
		}

		const themes = new Set(details({ count: 400 }).map((detail) => detail.theme));

		assert.deepStrictEqual([...themes].sort(), [...WORD_THEMES].sort());
	});

	it('there is one generator per theme, and it is that theme', () => {
		// A theme added to `WORD_THEMES` without a generator beside it is the
		// failure this catches — the table above would be missing a key.
		assert.deepStrictEqual(Object.keys(THEMED).sort(), [...WORD_THEMES].sort());

		for (const theme of WORD_THEMES) {
			for (const language of WORD_LANGUAGES) {
				const nouns = nounsOf(language, theme);

				for (const word of THEMED[theme]({ language, count: 20 })) {
					assert.ok(nouns.includes(word), `${theme}: ${word}`);
				}
			}
		}

		// The detail form carries through the wrapper, overload and all.
		for (const detail of randAnimal({ language: 'ko', count: 20, output: 'detail' })) {
			assert.strictEqual(detail.theme, 'animal');
			assert.strictEqual(detail.language, 'ko');
		}
	});

	it('words stay inside the requested length range', () => {
		const ranges: [WordLanguage, WordTheme, number, number][] = [
			['ko', 'animal', 2, 3],
			['ko', 'food', 2, 4],
			['en', 'animal', 3, 6],
			['en', 'object', 6, 9],
			['ja', 'nature', 2, 4],
			['zh', 'plant', 2, 3]
		];

		for (const [language, theme, minLength, maxLength] of ranges) {
			for (const word of randWord({ language, theme, minLength, maxLength, count: SAMPLE })) {
				assert.ok(
					word.length >= minLength && word.length <= maxLength,
					`${language}/${theme} ${minLength}-${maxLength}: ${word} (${word.length})`
				);
			}
		}
	});

	it('omitted length bounds fall back to what the pools hold', () => {
		assert.deepStrictEqual(wordLengthRange('zh'), [2, 3]);
		assert.deepStrictEqual(wordLengthRange('ko'), [1, 4]);
		assert.deepStrictEqual(wordLengthRange('en'), [3, 11]);

		for (const language of WORD_LANGUAGES) {
			const [min, max] = wordLengthRange(language);

			for (const word of randWord({ language, count: SAMPLE })) {
				assert.ok(
					word.length >= min && word.length <= max,
					`${language}: ${word} (${word.length})`
				);
			}

			// A theme is a pool of its own, so its range sits inside the language's.
			for (const theme of WORD_THEMES) {
				const [low, high] = wordLengthRange(language, theme);

				assert.ok(low >= min && high <= max, `${language}/${theme}: ${low}-${high}`);
			}
		}
	});

	it('startsWith leads every word with the requested character', () => {
		for (const word of randWord({ language: 'ko', count: SAMPLE, startsWith: '바' })) {
			assert.match(word, /^바/, word);
		}

		for (const word of randWord({ language: 'en', count: SAMPLE, startsWith: 'b' })) {
			assert.match(word, /^[Bb]/, word);
		}

		// A character no real word starts with is answered with an invented one.
		for (const word of randWord({ language: 'en', theme: 'gem', count: 20, startsWith: 'Z' })) {
			assert.match(word, /^Z[A-Za-z]+$/, word);
		}
	});

	it('realism invents words instead of drawing them', () => {
		const pool = new Set(nounsOf('ko'));
		const invented = details({ language: 'ko', realism: 'invented', count: 200 });
		const drawn = invented.filter((detail) => pool.has(detail.word));

		assert.ok(drawn.length < 20, `${drawn.length} of 200 still came from the pools`);

		for (const detail of invented) {
			assert.match(detail.word, SCRIPT.ko, detail.word);

			// An invented word can spell a real one by accident (나 + 비 -> 나비), and
			// the theme is then reported rather than hidden — but it has to be true.
			if (detail.theme) {
				assert.ok(nounsOf('ko', detail.theme).includes(detail.word), detail.word);
			}
		}

		// Halfway, both kinds of word show up.
		const mixed = details({ language: 'ko', realism: 'mixed', count: 200 });

		assert.ok(mixed.some((detail) => pool.has(detail.word)));
		assert.ok(mixed.some((detail) => !pool.has(detail.word)));

		// A level outside the three, which only an untyped caller can pass, falls
		// back to the default rather than throwing.
		const unknown = 'wild' as RandRealism;

		assert.strictEqual(randWord({ language: 'ko', realism: unknown, count: 5 }).length, 5);
	});

	it('unique never repeats a word', () => {
		const words = randWord({ language: 'ko', count: 400, unique: true });

		assert.strictEqual(new Set(words).size, words.length);

		// One theme in one language is a pool of a few dozen words, so the request
		// runs out and returns fewer instead of looping.
		const limited = randWord({ language: 'zh', theme: 'sport', count: 400, unique: true });

		assert.strictEqual(new Set(limited).size, limited.length);
		assert.ok(limited.length < 400, `expected the pool to run out: ${limited.length}`);
	});
});
