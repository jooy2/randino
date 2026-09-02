import assert from 'assert';
import { describe, it } from 'node:test';
import {
	RAND_COUNT_MAX,
	WORD_LANGUAGES,
	WORD_THEMES,
	nicknameLengthRange,
	randNickname
} from '../dist/index.js';
import type {
	NicknameDetail,
	WordLanguage,
	WordTheme,
	RandNicknameOptions
} from '../dist/index.js';
// The datasets are internal, but a nickname is only as good as the words it is
// built from — these checks are what keep person names out of them.
import { WORD_DATA } from '../dist/word/data/index.js';
import { NAME_DATA } from '../dist/name/data/index.js';

const SAMPLE = 60;

const SCRIPT: Record<WordLanguage, RegExp> = {
	en: /^[A-Za-z]+$/,
	ko: /^[가-힣]+$/,
	ja: /^[々぀-ヿ一-鿿]+$/,
	zh: /^[々一-鿿]+$/
};

/** Every word the language can put in a nickname. */
function allWords(language: WordLanguage): string[] {
	const data = WORD_DATA[language];

	return [
		...data.modifiers,
		...(data.parts ?? []),
		...WORD_THEMES.flatMap((theme) => [...data.nouns[theme]])
	];
}

function nounsOf(language: WordLanguage, theme?: WordTheme): string[] {
	const data = WORD_DATA[language];

	return theme ? [...data.nouns[theme]] : WORD_THEMES.flatMap((each) => [...data.nouns[each]]);
}

/**
 * `randNickname`'s detail form, which most of the assertions below read. It used
 * to be `randNicknameDetails`, a second function; it is one option now.
 */
function nicknameDetails(options: RandNicknameOptions = {}): NicknameDetail[] {
	return randNickname({ ...options, output: 'detail' });
}

describe('Nickname', () => {
	it('randNickname returns one nickname by default', () => {
		const nicknames = randNickname();

		assert.strictEqual(nicknames.length, 1);
		assert.strictEqual(typeof nicknames[0], 'string');
		assert.ok(nicknames[0].length > 0);
	});

	it('randNickname returns exactly `count` nicknames', () => {
		assert.strictEqual(randNickname({ count: 25 }).length, 25);
		assert.strictEqual(randNickname({ count: 0 }).length, 0);
		assert.strictEqual(randNickname({ count: -10 }).length, 0);
		assert.strictEqual(randNickname({ count: 2.7 }).length, 2);
		assert.strictEqual(randNickname({ count: RAND_COUNT_MAX + 500 }).length, RAND_COUNT_MAX);
	});

	it('every language writes nicknames in its own script', () => {
		for (const language of WORD_LANGUAGES) {
			for (const nickname of randNickname({ language, count: SAMPLE })) {
				assert.match(nickname, SCRIPT[language], `${language}: ${nickname}`);
			}

			for (const nickname of randNickname({ language, count: SAMPLE, style: 100 })) {
				assert.match(nickname, SCRIPT[language], `${language} invented: ${nickname}`);
			}
		}
	});

	it('the mixed language uses every language it knows', () => {
		const used = new Set(
			nicknameDetails({ count: 400 }).map((detail) => {
				assert.match(detail.nickname, SCRIPT[detail.language], detail.nickname);
				return detail.language;
			})
		);

		assert.strictEqual(used.size, WORD_LANGUAGES.length);
	});

	it('nicknames are built from real words, and never from names', () => {
		for (const language of WORD_LANGUAGES) {
			const pool = new Set(allWords(language));

			for (const detail of nicknameDetails({ language, count: 200 })) {
				assert.ok(detail.words.length > 0, detail.nickname);

				for (const word of detail.words) {
					assert.ok(pool.has(word), `${language}: ${word} is not in the word pools`);
				}
			}
		}

		// English person names are distinct words from English common nouns, so the
		// two sets must not meet — this is what stops an `Emma` or a `Bennett` from
		// being added to a nickname pool by accident. Korean and Japanese cannot be
		// held to that: 하늘, 별 and 森 are everyday nouns that also happen to be
		// names, and `아름다운하늘` is still nobody's name.
		const en = NAME_DATA.en;
		const names = new Set(
			[...(en.male ?? []), ...(en.female ?? []), ...(en.last ?? [])].map((item) =>
				typeof item === 'string' ? item : item.n
			)
		);

		for (const word of allWords('en')) {
			assert.ok(!names.has(word), `${word} is a person name, not a nickname word`);
		}
	});

	it('every nickname is a word with something added to it', () => {
		const details = nicknameDetails({ language: 'ko', count: 200 });
		const modifiers = new Set(WORD_DATA.ko.modifiers);
		const decorated = details.filter(
			(detail) => detail.words.length > 1 || modifiers.has(detail.words[0])
		);

		// A bare word is allowed, but a decorated one is the point.
		assert.ok(
			decorated.length > details.length * 0.5,
			`only ${decorated.length} of ${details.length} were decorated`
		);
		assert.ok(details.some((detail) => modifiers.has(detail.words[0])));
		assert.ok(details.some((detail) => detail.words.length === 3));
	});

	it('theme decides what the nickname is about', () => {
		for (const theme of WORD_THEMES) {
			for (const language of WORD_LANGUAGES) {
				const nouns = nounsOf(language, theme);

				for (const detail of nicknameDetails({ language, theme, count: 40 })) {
					assert.strictEqual(detail.theme, theme, detail.nickname);
					assert.ok(
						detail.words.some((word) => nouns.includes(word)),
						`${detail.nickname} has no ${theme} word`
					);
				}
			}
		}

		const themes = new Set(nicknameDetails({ count: 400 }).map((detail) => detail.theme));
		assert.deepStrictEqual([...themes].sort(), [...WORD_THEMES].sort());
	});

	it('a word belongs to exactly one theme', () => {
		// Two themes claiming one word make `theme` ambiguous, and make
		// `randNickname`'s detail form report a theme the caller never asked about.
		for (const language of WORD_LANGUAGES) {
			const owner = new Map<string, WordTheme>();

			for (const theme of WORD_THEMES) {
				for (const word of nounsOf(language, theme)) {
					const held = owner.get(word);

					assert.ok(!held, `${language}: ${word} is in both ${held} and ${theme}`);
					owner.set(word, theme);
				}
			}
		}
	});

	it('nicknames stay inside the requested length range', () => {
		const ranges: [WordLanguage, number, number][] = [
			['ko', 2, 3],
			['ko', 4, 6],
			['ko', 8, 10],
			['en', 4, 8],
			['en', 10, 16],
			['en', 18, 24],
			['ja', 2, 4],
			['zh', 2, 4]
		];

		for (const [language, minLength, maxLength] of ranges) {
			for (const nickname of randNickname({ language, minLength, maxLength, count: SAMPLE })) {
				assert.ok(
					nickname.length >= minLength && nickname.length <= maxLength,
					`${language} ${minLength}-${maxLength}: ${nickname} (${nickname.length})`
				);
			}
		}
	});

	it('omitted length bounds fall back to what the language can produce', () => {
		assert.deepStrictEqual(nicknameLengthRange('zh'), [2, 5]);
		assert.deepStrictEqual(nicknameLengthRange('ko'), [1, 12]);
		assert.deepStrictEqual(nicknameLengthRange('en'), [3, 30]);

		for (const language of WORD_LANGUAGES) {
			const [min, max] = nicknameLengthRange(language);

			for (const style of [0, 100]) {
				for (const nickname of randNickname({ language, style, count: SAMPLE })) {
					assert.ok(
						nickname.length >= min && nickname.length <= max,
						`${language} @ ${style}: ${nickname} (${nickname.length})`
					);
				}
			}
		}
	});

	it('wordSeparator goes between the words', () => {
		for (const language of WORD_LANGUAGES) {
			for (const wordSeparator of ['', ' ', '-', '::']) {
				for (const detail of nicknameDetails({ language, wordSeparator, count: SAMPLE })) {
					assert.strictEqual(
						detail.nickname,
						detail.words.join(wordSeparator),
						`${language} '${wordSeparator}': ${detail.nickname}`
					);

					for (const word of detail.words) {
						assert.match(word, SCRIPT[language], `${language}: ${word}`);
					}
				}
			}
		}

		// Omitted, it falls back to the way the language joins its words, which is
		// to run them together.
		for (const detail of nicknameDetails({ count: SAMPLE })) {
			assert.strictEqual(detail.nickname, detail.words.join(''), detail.nickname);
		}

		// The separator is part of the nickname, so it counts toward the length.
		assert.deepStrictEqual(nicknameLengthRange('ko', '-'), [1, 14]);
		assert.deepStrictEqual(nicknameLengthRange('en', ' '), [3, 32]);

		for (const [language, wordSeparator, minLength, maxLength] of [
			['ko', ' ', 5, 8],
			['en', '-', 8, 14],
			['zh', '::', 6, 9]
		] as [WordLanguage, string, number, number][]) {
			for (const nickname of randNickname({
				language,
				wordSeparator,
				minLength,
				maxLength,
				count: SAMPLE
			})) {
				assert.ok(
					nickname.length >= minLength && nickname.length <= maxLength,
					`${language} '${wordSeparator}' ${minLength}-${maxLength}: ${nickname} (${nickname.length})`
				);
			}
		}
	});

	it('startsWith leads every nickname with the requested character', () => {
		for (const nickname of randNickname({ language: 'ko', count: SAMPLE, startsWith: '파' })) {
			assert.match(nickname, /^파/, nickname);
		}

		for (const nickname of randNickname({ language: 'en', count: SAMPLE, startsWith: 'b' })) {
			assert.match(nickname, /^[Bb]/, nickname);
		}

		// A character no real word starts with is answered with an invented one.
		for (const nickname of randNickname({ language: 'en', count: 20, startsWith: 'Z' })) {
			assert.match(nickname, /^Z[A-Za-z]+$/, nickname);
		}
	});

	it('style invents words instead of drawing them', () => {
		const pool = new Set(allWords('ko'));
		const invented = nicknameDetails({ language: 'ko', style: 100, count: 200 });
		const drawn = invented.filter((detail) => detail.words.some((word) => pool.has(word)));

		assert.ok(drawn.length < 20, `${drawn.length} of 200 still came from the pools`);

		for (const detail of invented) {
			assert.match(detail.nickname, SCRIPT.ko, detail.nickname);

			// An invented word can spell a real one by accident (나 + 비 -> 나비), and
			// the theme is then reported rather than hidden — but it has to be true.
			if (detail.theme) {
				assert.ok(
					detail.words.some((word) => nounsOf('ko', detail.theme!).includes(word)),
					detail.nickname
				);
			}
		}

		// Halfway, both kinds of word show up.
		const mixed = nicknameDetails({ language: 'ko', style: 50, count: 200 });
		assert.ok(mixed.some((detail) => detail.words.every((word) => pool.has(word))));
		assert.ok(mixed.some((detail) => detail.words.every((word) => !pool.has(word))));

		// Out-of-range values are clamped rather than rejected.
		for (const style of [-50, 500]) {
			assert.strictEqual(randNickname({ language: 'ko', style, count: 5 }).length, 5);
		}
	});

	it('unique never repeats a nickname', () => {
		const nicknames = randNickname({ language: 'ko', count: 2000, unique: true });
		assert.strictEqual(new Set(nicknames).size, nicknames.length);

		// One theme in one language, held to two characters, is a small enough pool
		// that the request runs out of combinations and returns fewer instead of
		// looping.
		const limited = randNickname({
			language: 'zh',
			theme: 'animal',
			maxLength: 2,
			count: 400,
			unique: true
		});

		assert.strictEqual(new Set(limited).size, limited.length);
		assert.ok(limited.length < 400, `expected the pool to run out: ${limited.length}`);
	});

	it("output: 'detail' reports the pieces it used", () => {
		// Written out rather than going through the helper, so that the overload
		// itself is what a test compiles against.
		for (const detail of randNickname({ count: 100, output: 'detail' })) {
			const joiner = WORD_DATA[detail.language].joiner;

			assert.strictEqual(detail.words.join(joiner), detail.nickname);
			assert.ok(WORD_LANGUAGES.includes(detail.language));
			assert.ok(detail.theme === null || WORD_THEMES.includes(detail.theme));
		}
	});
});
