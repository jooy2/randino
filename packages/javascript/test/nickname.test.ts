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
	RandRealism,
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
		...data.adjectives,
		...data.actions,
		...(data.parts ?? []),
		...WORD_THEMES.flatMap((theme) => [...data.nouns[theme]])
	];
}

/** Every particle the language's frames can put between two words, longest first. */
function gluesOf(language: WordLanguage): string[] {
	const seen = new Set<string>(['']);

	for (const frame of WORD_DATA[language].frames) {
		for (const glue of frame.glue ?? []) {
			seen.add(glue);
		}
	}

	return [...seen].sort((a, b) => b.length - a.length);
}

/**
 * True when the nickname is exactly its words in order, with nothing between
 * them but the separator and a particle the language allows. Backtracks, because
 * a particle and the first character of the next word can be the same one (`의`
 * in front of `의자`).
 */
function joinedBy(
	nickname: string,
	words: readonly string[],
	glues: readonly string[],
	separator: string
): boolean {
	if (!words.length) {
		return nickname === '';
	}

	if (!nickname.startsWith(words[0])) {
		return false;
	}

	const rest = nickname.slice(words[0].length);

	if (words.length === 1) {
		return rest === '';
	}

	return glues.some(
		(glue) =>
			rest.startsWith(glue + separator) &&
			joinedBy(rest.slice(glue.length + separator.length), words.slice(1), glues, separator)
	);
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

			for (const nickname of randNickname({ language, count: SAMPLE, realism: 'invented' })) {
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
		const modifiers = new Set([...WORD_DATA.ko.adjectives, ...WORD_DATA.ko.actions]);
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
		assert.deepStrictEqual(nicknameLengthRange('zh'), [2, 8]);
		assert.deepStrictEqual(nicknameLengthRange('ko'), [1, 13]);
		assert.deepStrictEqual(nicknameLengthRange('en'), [3, 31]);

		for (const language of WORD_LANGUAGES) {
			const [min, max] = nicknameLengthRange(language);

			for (const realism of ['real', 'invented'] as const) {
				for (const nickname of randNickname({ language, realism, count: SAMPLE })) {
					assert.ok(
						nickname.length >= min && nickname.length <= max,
						`${language} @ ${realism}: ${nickname} (${nickname.length})`
					);
				}
			}
		}
	});

	it('wordSeparator goes between the words', () => {
		for (const language of WORD_LANGUAGES) {
			for (const wordSeparator of ['', ' ', '-', '::']) {
				for (const detail of nicknameDetails({ language, wordSeparator, count: SAMPLE })) {
					assert.ok(
						joinedBy(detail.nickname, detail.words, gluesOf(language), wordSeparator),
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
			assert.ok(
				joinedBy(detail.nickname, detail.words, gluesOf(detail.language), ''),
				detail.nickname
			);
		}

		// The separator is part of the nickname, so it counts toward the length.
		assert.deepStrictEqual(nicknameLengthRange('ko', '-'), [1, 15]);
		assert.deepStrictEqual(nicknameLengthRange('en', ' '), [3, 33]);

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

	it('realism invents words instead of drawing them', () => {
		const pool = new Set(allWords('ko'));
		const invented = nicknameDetails({ language: 'ko', realism: 'invented', count: 200 });
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
		const mixed = nicknameDetails({ language: 'ko', realism: 'mixed', count: 200 });
		assert.ok(mixed.some((detail) => detail.words.every((word) => pool.has(word))));
		assert.ok(mixed.some((detail) => detail.words.every((word) => !pool.has(word))));

		// A level outside the three, which only an untyped caller can pass, falls
		// back to the default rather than throwing.
		const unknown = 'wild' as RandRealism;

		assert.strictEqual(randNickname({ language: 'ko', realism: unknown, count: 5 }).length, 5);
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

			assert.ok(joinedBy(detail.nickname, detail.words, gluesOf(detail.language), joiner));
			assert.ok(WORD_LANGUAGES.includes(detail.language));
			assert.ok(detail.theme === null || WORD_THEMES.includes(detail.theme));
		}
	});
});
