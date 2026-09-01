import assert from 'assert';
import { describe, it } from 'node:test';
import {
	NICKNAME_COUNT_MAX,
	NICKNAME_LANGUAGES,
	NICKNAME_THEMES,
	nicknameLengthRange,
	randNickname,
	randNicknameDetails
} from '../dist/index.js';
import type { NicknameLanguage, NicknameTheme } from '../dist/index.js';
// The datasets are internal, but a nickname is only as good as the words it is
// built from — these checks are what keep person names out of them.
import { NICKNAME_DATA } from '../dist/nickname/data/index.js';
import { NAME_DATA } from '../dist/name/data/index.js';

const SAMPLE = 60;

const SCRIPT: Record<NicknameLanguage, RegExp> = {
	en: /^[A-Za-z]+$/,
	ko: /^[가-힣]+$/,
	ja: /^[々぀-ヿ一-鿿]+$/,
	zh: /^[々一-鿿]+$/
};

/** Every word the language can put in a nickname. */
function allWords(language: NicknameLanguage): string[] {
	const data = NICKNAME_DATA[language];

	return [
		...data.modifiers,
		...(data.parts ?? []),
		...NICKNAME_THEMES.flatMap((theme) => [...data.nouns[theme]])
	];
}

function nounsOf(language: NicknameLanguage, theme?: NicknameTheme): string[] {
	const data = NICKNAME_DATA[language];

	return theme ? [...data.nouns[theme]] : NICKNAME_THEMES.flatMap((each) => [...data.nouns[each]]);
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
		assert.strictEqual(
			randNickname({ count: NICKNAME_COUNT_MAX + 500 }).length,
			NICKNAME_COUNT_MAX
		);
	});

	it('every language writes nicknames in its own script', () => {
		for (const language of NICKNAME_LANGUAGES) {
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
			randNicknameDetails({ count: 400 }).map((detail) => {
				assert.match(detail.nickname, SCRIPT[detail.language], detail.nickname);
				return detail.language;
			})
		);

		assert.strictEqual(used.size, NICKNAME_LANGUAGES.length);
	});

	it('nicknames are built from real words, and never from names', () => {
		for (const language of NICKNAME_LANGUAGES) {
			const pool = new Set(allWords(language));

			for (const detail of randNicknameDetails({ language, count: 200 })) {
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
		const details = randNicknameDetails({ language: 'ko', count: 200 });
		const modifiers = new Set(NICKNAME_DATA.ko.modifiers);
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

	it('includeModifier: false leaves the word undecorated', () => {
		for (const language of NICKNAME_LANGUAGES) {
			const parts = NICKNAME_DATA[language].parts ?? [];

			for (const detail of randNicknameDetails({
				language,
				count: SAMPLE,
				includeModifier: false
			})) {
				// A noun, and at most one trailing word behind it. Note that a few
				// words serve as both modifier and noun (무지개, Marble), so the check
				// has to be structural rather than "is not a modifier".
				assert.ok(detail.words.length <= 2, detail.nickname);
				assert.ok(nounsOf(language).includes(detail.words[0]), detail.nickname);

				if (detail.words.length === 2) {
					assert.ok(parts.includes(detail.words[1]), detail.nickname);
				}
			}
		}
	});

	it('theme decides what the nickname is about', () => {
		for (const theme of NICKNAME_THEMES) {
			for (const language of NICKNAME_LANGUAGES) {
				const nouns = nounsOf(language, theme);

				for (const detail of randNicknameDetails({ language, theme, count: 40 })) {
					assert.strictEqual(detail.theme, theme, detail.nickname);
					assert.ok(
						detail.words.some((word) => nouns.includes(word)),
						`${detail.nickname} has no ${theme} word`
					);
				}
			}
		}

		const themes = new Set(randNicknameDetails({ count: 400 }).map((detail) => detail.theme));
		assert.deepStrictEqual([...themes].sort(), [...NICKNAME_THEMES].sort());
	});

	it('a word belongs to exactly one theme', () => {
		// Two themes claiming one word make `theme` ambiguous for `baseWord`, and
		// make `randNicknameDetails` report a theme the caller never asked about.
		for (const language of NICKNAME_LANGUAGES) {
			const owner = new Map<string, NicknameTheme>();

			for (const theme of NICKNAME_THEMES) {
				for (const word of nounsOf(language, theme)) {
					const held = owner.get(word);

					assert.ok(!held, `${language}: ${word} is in both ${held} and ${theme}`);
					owner.set(word, theme);
				}
			}
		}
	});

	it('nicknames stay inside the requested length range', () => {
		const ranges: [NicknameLanguage, number, number][] = [
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
		// Without a modifier the upper end drops to a noun plus a trailing word.
		assert.deepStrictEqual(nicknameLengthRange('ko', false), [1, 8]);

		for (const language of NICKNAME_LANGUAGES) {
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
		for (const language of NICKNAME_LANGUAGES) {
			for (const wordSeparator of ['', ' ', '-', '::']) {
				for (const detail of randNicknameDetails({ language, wordSeparator, count: SAMPLE })) {
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
		for (const detail of randNicknameDetails({ count: SAMPLE })) {
			assert.strictEqual(detail.nickname, detail.words.join(''), detail.nickname);
		}

		// The separator is part of the nickname, so it counts toward the length.
		assert.deepStrictEqual(nicknameLengthRange('ko', true, '-'), [1, 14]);
		assert.deepStrictEqual(nicknameLengthRange('en', true, ' '), [3, 32]);

		for (const [language, wordSeparator, minLength, maxLength] of [
			['ko', ' ', 5, 8],
			['en', '-', 8, 14],
			['zh', '::', 6, 9]
		] as [NicknameLanguage, string, number, number][]) {
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

	it('baseWord keeps the word and varies only the decoration', () => {
		const details = randNicknameDetails({ baseWord: '고양이', count: 100 });

		for (const detail of details) {
			assert.ok(detail.nickname.includes('고양이'), detail.nickname);
			assert.ok(detail.words.includes('고양이'), detail.nickname);
			// Something is always added, or the answer would be the input.
			assert.ok(detail.words.length > 1, detail.nickname);
			// The word decides the language when none was given.
			assert.strictEqual(detail.language, 'ko');
			// 고양이 is one of the generator's own animal words, so its theme is known.
			assert.strictEqual(detail.theme, 'animal');
			assert.match(detail.nickname, SCRIPT.ko, detail.nickname);
		}

		assert.ok(new Set(details.map((detail) => detail.nickname)).size > 20);

		// A word the generator does not know belongs to no theme.
		for (const detail of randNicknameDetails({ baseWord: '뿌꾸', count: 20 })) {
			assert.strictEqual(detail.theme, null);
			assert.ok(detail.nickname.includes('뿌꾸'), detail.nickname);
		}

		// Each script picks the language that goes with it.
		assert.strictEqual(randNicknameDetails({ baseWord: 'Cat' })[0].language, 'en');
		assert.strictEqual(randNicknameDetails({ baseWord: 'ネコ' })[0].language, 'ja');
		assert.strictEqual(randNicknameDetails({ baseWord: '熊猫' })[0].language, 'zh');
		// An explicit language wins over the guess.
		assert.strictEqual(
			randNicknameDetails({ baseWord: '고양이', language: 'en' })[0].language,
			'en'
		);

		// A base word longer than the language's natural range is not truncated.
		for (const nickname of randNickname({ baseWord: '고양이발바닥무늬', count: 20 })) {
			assert.ok(nickname.includes('고양이발바닥무늬'), nickname);
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
		const invented = randNicknameDetails({ language: 'ko', style: 100, count: 200 });
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
		const mixed = randNicknameDetails({ language: 'ko', style: 50, count: 200 });
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

		// A single word plus one theme is a small pool, so the request runs out of
		// combinations and returns fewer instead of looping.
		const limited = randNickname({
			language: 'zh',
			theme: 'animal',
			includeModifier: false,
			count: 400,
			unique: true
		});

		assert.strictEqual(new Set(limited).size, limited.length);
		assert.ok(limited.length < 400, `expected the pool to run out: ${limited.length}`);
	});

	it('randNicknameDetails reports the pieces it used', () => {
		for (const detail of randNicknameDetails({ count: 100 })) {
			const joiner = NICKNAME_DATA[detail.language].joiner;

			assert.strictEqual(detail.words.join(joiner), detail.nickname);
			assert.ok(NICKNAME_LANGUAGES.includes(detail.language));
			assert.ok(detail.theme === null || NICKNAME_THEMES.includes(detail.theme));
		}
	});
});
