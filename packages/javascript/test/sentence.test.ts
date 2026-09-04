import assert from 'assert';
import { describe, it } from 'node:test';
import {
	RAND_COUNT_MAX,
	WORD_LANGUAGES,
	WORD_THEMES,
	randSentence,
	sentenceLengthRange
} from '../dist/index.js';
import type {
	RandSentenceOptions,
	SentenceDetail,
	SentenceShape,
	SentenceSlot,
	WordLanguage,
	WordTheme
} from '../dist/index.js';
// The datasets are internal, but a sentence is only as good as the grammar
// behind it — these checks read the pools a sentence is allowed to draw from.
import { WORD_DATA } from '../dist/word/data/index.js';
import { agree } from '../dist/word/wordGenerator.js';
import type { WordGender } from '../dist/word/data/types.js';
import { SENTENCE_DATA, THEME_CLASS } from '../dist/sentence/data/index.js';
import { shapeOf } from '../dist/sentence/sentenceGenerator.js';

const SAMPLE = 60;

/** Everything a sentence of the language may be written with, punctuation aside. */
const SCRIPT: Record<WordLanguage, RegExp> = {
	en: /^[A-Za-z' ,.]+$/,
	ko: /^[가-힣 .]+$/,
	ja: /^[々぀-ヿ一-鿿。]+$/,
	zh: /^[々一-鿿。]+$/,
	vi: /^[a-zA-ZÀ-ỹ ,.]+$/,
	es: /^[a-zA-ZÀ-ÿ ,.]+$/,
	it: /^[a-zA-ZÀ-ÿ' ,.]+$/,
	de: /^[a-zA-ZÀ-ÿß ,.]+$/,
	ru: /^[Ѐ-ӿ ,.]+$/
};

const SHAPES: readonly SentenceShape[] = ['simple', 'detailed', 'complex'];

function sentenceDetails(options: RandSentenceOptions = {}): SentenceDetail[] {
	return randSentence({ ...options, output: 'detail' });
}

/** A word as a sentence writes it — English stores its pools capitalized. */
function plain(language: WordLanguage, word: string): string {
	return WORD_DATA[language].capitalize ? word.charAt(0).toLowerCase() + word.slice(1) : word;
}

/**
 * Every word the language may put in a phrase of `slot`, in every form it can
 * take. A modifier is stored in one form and comes out agreeing with its noun,
 * so each gender's shape of it counts as one of the language's words.
 */
function poolFor(language: WordLanguage, slot: SentenceSlot): Set<string> {
	const wordData = WORD_DATA[language];
	const data = SENTENCE_DATA[language];
	const genders = Object.keys(wordData.agreement ?? {}) as WordGender[];
	const inflected = (pool: readonly string[]) => [
		...pool,
		...genders.flatMap((gender) => pool.map((word) => agree(wordData, word, gender)))
	];

	if (slot === 'verb') {
		return new Set(data.verbs.flatMap((group) => [...group.words]));
	}

	if (slot === 'state') {
		const states = data.states.flatMap((group) => [...group.words]);

		return new Set(data.predicateAgrees ? inflected(states) : states);
	}

	if (slot === 'manner') {
		return new Set(data.manners);
	}

	if (slot === 'time') {
		return new Set(data.times);
	}

	return new Set(
		WORD_THEMES.flatMap((theme) => [...wordData.nouns[theme]]).map((word) => plain(language, word))
	);
}

/** The modifiers a noun phrase may carry, in every form they can take. */
function modifiersFor(language: WordLanguage): Set<string> {
	const wordData = WORD_DATA[language];
	const genders = Object.keys(wordData.agreement ?? {}) as WordGender[];
	const pool = [...wordData.adjectives];

	return new Set(
		[
			...pool,
			...genders.flatMap((gender) => pool.map((word) => agree(wordData, word, gender)))
		].map((word) => plain(language, word))
	);
}

function articlesFor(language: WordLanguage): string[] {
	return Object.values(SENTENCE_DATA[language].articles ?? {}).flatMap((rules) =>
		(rules ?? []).map(([, article]) => article)
	);
}

/**
 * Whether a noun phrase is exactly what the generator is allowed to build: an
 * article, a noun, and at most one modifier on the side the language puts it.
 *
 * Split by hand rather than on whitespace, because a pool entry can hold a space
 * of its own — Vietnamese `hơi thở` is one word — and Japanese and Chinese write
 * no space at all.
 */
function explains(language: WordLanguage, phrase: string): boolean {
	const space = SENTENCE_DATA[language].space;
	const nouns = poolFor(language, 'subject');
	const modifiers = modifiersFor(language);
	let rest = phrase;

	for (const article of articlesFor(language)) {
		const opening = article.endsWith("'") ? article : article + space;

		if (rest.startsWith(opening)) {
			rest = rest.slice(opening.length);
			break;
		}
	}

	if (nouns.has(rest)) {
		return true;
	}

	for (let at = 1; at < rest.length; at += 1) {
		if (space && rest.slice(at, at + space.length) !== space) {
			continue;
		}

		const left = rest.slice(0, at);
		const right = rest.slice(at + space.length);

		if ((modifiers.has(left) && nouns.has(right)) || (nouns.has(left) && modifiers.has(right))) {
			return true;
		}
	}

	return false;
}

describe('Sentence', () => {
	it('randSentence returns one sentence by default', () => {
		const sentences = randSentence();

		assert.strictEqual(sentences.length, 1);
		assert.strictEqual(typeof sentences[0], 'string');
		assert.ok(sentences[0].length > 0);
	});

	it('randSentence returns exactly `count` sentences', () => {
		assert.strictEqual(randSentence({ count: 25 }).length, 25);
		assert.strictEqual(randSentence({ count: 0 }).length, 0);
		assert.strictEqual(randSentence({ count: -10 }).length, 0);
		assert.strictEqual(randSentence({ count: 2.7 }).length, 2);
		assert.strictEqual(randSentence({ count: RAND_COUNT_MAX + 500 }).length, RAND_COUNT_MAX);
	});

	it('every language writes sentences in its own script, and closes them', () => {
		for (const language of WORD_LANGUAGES) {
			const terminator = SENTENCE_DATA[language].terminator;

			for (const realism of ['real', 'invented'] as const) {
				for (const sentence of randSentence({ language, realism, count: SAMPLE })) {
					assert.match(sentence, SCRIPT[language], `${language} ${realism}: ${sentence}`);
					assert.ok(sentence.endsWith(terminator), `${language}: ${sentence}`);
					assert.ok(!sentence.includes('  '), `${language} double space: ${sentence}`);
					assert.ok(!sentence.includes(' .'), `${language} loose stop: ${sentence}`);
				}
			}
		}
	});

	it('a language with articles writes one, invented word or not', () => {
		// An invented noun is in no pool, so it has no entry in `nounGender` — and
		// Spanish and Italian declare their articles under `m` and `f` alone, with no
		// `n` to fall back to. Both wrote no article at all in front of one until the
		// gender was read off the ending instead.
		for (const language of WORD_LANGUAGES) {
			const articles = SENTENCE_DATA[language].articles;

			if (!articles) {
				continue;
			}

			const written = new Set<string>();

			for (const rules of Object.values(articles)) {
				for (const [, article] of rules ?? []) {
					written.add(article);
				}
			}

			for (const realism of ['real', 'invented'] as const) {
				for (const sentence of randSentence({ language, realism, count: SAMPLE })) {
					const carries = [...written].some((article) =>
						// An elided article runs into the word behind it — `l'orso`.
						article.endsWith("'")
							? sentence.toLowerCase().includes(article)
							: new RegExp(`(^|\\s)${article}\\s`, 'i').test(sentence)
					);

					assert.ok(carries, `${language} ${realism}: ${sentence}`);
				}
			}
		}
	});

	it('a language that capitalizes opens its sentences on a capital', () => {
		for (const language of WORD_LANGUAGES) {
			if (!SENTENCE_DATA[language].capitalize) {
				continue;
			}

			for (const sentence of randSentence({ language, count: SAMPLE })) {
				assert.strictEqual(sentence.charAt(0), sentence.charAt(0).toUpperCase(), sentence);
			}
		}
	});

	it('the mixed language uses every language it knows', () => {
		const used = new Set(
			sentenceDetails({ count: 600 }).map((detail) => {
				assert.match(detail.sentence, SCRIPT[detail.language], detail.sentence);
				return detail.language;
			})
		);

		assert.strictEqual(used.size, WORD_LANGUAGES.length);
	});

	it('every phrase is written out of the language`s own pools', () => {
		for (const language of WORD_LANGUAGES) {
			const fixed = new Map(
				(['verb', 'state', 'manner', 'time'] as SentenceSlot[]).map((slot) => [
					slot,
					poolFor(language, slot)
				])
			);

			for (const detail of sentenceDetails({ language, count: 200 })) {
				assert.strictEqual(detail.phrases.length, detail.slots.length, detail.sentence);

				for (let i = 0; i < detail.phrases.length; i += 1) {
					const phrase = detail.phrases[i];
					const slot = detail.slots[i];
					// Only the opening phrase can have been capitalized, and it is put
					// back the way the pools hold it before being looked up.
					const written = i === 0 ? phrase.charAt(0).toLowerCase() + phrase.slice(1) : phrase;
					const pool = fixed.get(slot);

					if (pool) {
						assert.ok(
							pool.has(written) || pool.has(phrase),
							`${language}: '${phrase}' is not in the ${slot} pools (${detail.sentence})`
						);

						continue;
					}

					assert.ok(
						explains(language, written),
						`${language}: '${phrase}' is not a ${slot} the pools can build (${detail.sentence})`
					);
				}
			}
		}
	});

	it('the phrases appear in the sentence, in order', () => {
		for (const language of WORD_LANGUAGES) {
			for (const detail of sentenceDetails({ language, count: 120 })) {
				let at = 0;

				for (const phrase of detail.phrases) {
					const found = detail.sentence.indexOf(phrase, at);

					assert.ok(found >= at, `${language}: '${phrase}' not in '${detail.sentence}'`);
					at = found + phrase.length;
				}
			}
		}
	});

	it('a sentence has one predicate, and it is a verb or a state', () => {
		for (const language of WORD_LANGUAGES) {
			for (const detail of sentenceDetails({ language, count: 120 })) {
				const predicates = detail.slots.filter((slot) => slot === 'verb' || slot === 'state');

				assert.strictEqual(predicates.length, 1, detail.sentence);
				assert.ok(detail.slots.includes('subject'), detail.sentence);
			}
		}
	});

	it('a verb only takes the subject and object its group allows', () => {
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];

			for (const detail of sentenceDetails({ language, count: 200 })) {
				const at = detail.slots.indexOf('verb');

				if (at < 0 || detail.theme === null) {
					continue;
				}

				const transitive = detail.slots.includes('object');
				// A verb can sit in more than one group — `gathers` is transitive
				// beside a person and intransitive beside a crowd — so the sentence is
				// right when one of its groups accounts for it.
				const groups = data.verbs.filter(
					(group) =>
						group.words.includes(detail.phrases[at]) && Boolean(group.object) === transitive
				);

				assert.ok(
					groups.length > 0,
					`${language}: ${detail.phrases[at]} has no ${transitive ? 'transitive' : 'intransitive'} group (${detail.sentence})`
				);
				assert.ok(
					groups.some((group) => group.subject.includes(THEME_CLASS[detail.theme as WordTheme])),
					`${language}: ${detail.theme} cannot be the subject of ${detail.phrases[at]} (${detail.sentence})`
				);
			}
		}
	});

	it('Korean picks the particle its noun asks for', () => {
		const ALTERNATING: Record<string, string> = { 가: '이', 를: '을', 는: '은' };

		for (const detail of sentenceDetails({ language: 'ko', count: 300 })) {
			for (let i = 0; i < detail.phrases.length; i += 1) {
				const phrase = detail.phrases[i];
				const after = detail.sentence.slice(
					detail.sentence.indexOf(phrase) + phrase.length,
					detail.sentence.indexOf(phrase) + phrase.length + 1
				);
				const expected = ALTERNATING[after];
				const last = phrase.charCodeAt(phrase.length - 1);
				const coda = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0;

				if (expected !== undefined) {
					assert.ok(!coda, `${phrase}${after}: needs ${expected} (${detail.sentence})`);
				}

				if (Object.values(ALTERNATING).includes(after) && after !== '은') {
					assert.ok(coda, `${phrase}${after}: needs the other form (${detail.sentence})`);
				}
			}
		}
	});

	it('`theme` decides what the subject is about', () => {
		for (const theme of WORD_THEMES) {
			for (const detail of sentenceDetails({ language: 'ko', theme, count: 20 })) {
				assert.strictEqual(detail.theme, theme, detail.sentence);
			}
		}
	});

	it('`shape` decides how much the sentence says', () => {
		for (const language of WORD_LANGUAGES) {
			for (const shape of SHAPES) {
				assert.ok(
					SENTENCE_DATA[language].frames.some((frame) => shapeOf(frame) === shape),
					`${language} has no ${shape} shape`
				);

				for (const detail of sentenceDetails({ language, shape, count: 30 })) {
					const parts = detail.phrases.length;
					const actual = parts <= 2 ? 'simple' : parts === 3 ? 'detailed' : 'complex';

					assert.strictEqual(actual, shape, `${language}: ${detail.sentence}`);
				}
			}
		}
	});

	it('`slots` decides what the sentence carries beside its subject', () => {
		for (const slot of ['object', 'place', 'time', 'manner', 'state'] as SentenceSlot[]) {
			for (const language of WORD_LANGUAGES) {
				const able = SENTENCE_DATA[language].frames.some((frame) =>
					frame.parts.some((part) => part.slot === slot)
				);

				if (!able) {
					continue;
				}

				for (const detail of sentenceDetails({ language, slots: slot, count: 30 })) {
					assert.ok(detail.slots.includes(slot), `${language} ${slot}: ${detail.sentence}`);
				}
			}
		}

		for (const detail of sentenceDetails({ slots: 'none', count: 120 })) {
			assert.ok(detail.phrases.length <= 2, detail.sentence);
		}
	});

	it('`slots` prefers a language that has the shape asked for', () => {
		const languages = new Set(
			sentenceDetails({ slots: 'object', count: 200 }).map((d) => d.language)
		);

		for (const language of languages) {
			assert.ok(
				SENTENCE_DATA[language].frames.some((frame) =>
					frame.parts.some((part) => part.slot === 'object')
				),
				`${language} has no object shape`
			);
		}
	});

	it('`include` puts every word it was given into every sentence', () => {
		const cases: [WordLanguage, string | string[]][] = [
			['ko', '사자'],
			['ko', ['사자', '조용히']],
			['ko', '달린다'],
			['en', 'lion'],
			['en', ['otter', 'quietly']],
			// `brave` is both a predicate and a modifier, and only one of the two
			// leaves room for an adverb — which shape it takes is what `slots` on a
			// requirement is for.
			['en', ['brave', 'lion', 'quietly']],
			['ko', ['멋진', '사자', '조용히']],
			['ja', '猫'],
			['zh', '狮子'],
			['es', 'gato'],
			['de', 'Wolf'],
			['ru', 'кит'],
			['it', 'gatto'],
			['vi', 'mèo']
		];

		for (const [language, include] of cases) {
			const listed = typeof include === 'string' ? [include] : include;

			for (const sentence of randSentence({ language, include, count: 40 })) {
				for (const word of listed) {
					assert.ok(
						sentence.toLowerCase().includes(word.toLowerCase()),
						`${language}: '${word}' missing from '${sentence}'`
					);
				}
			}
		}
	});

	it('`include` takes a word the pools have never heard of', () => {
		for (const sentence of randSentence({ language: 'ko', include: '깜냥이', count: 30 })) {
			assert.ok(sentence.includes('깜냥이'), sentence);
		}
	});

	it('`include` picks the language the word is written in', () => {
		for (const detail of sentenceDetails({ include: '고양이', count: 40 })) {
			assert.strictEqual(detail.language, 'ko', detail.sentence);
			assert.ok(detail.sentence.includes('고양이'), detail.sentence);
		}
	});

	it('sentences respect the length range', () => {
		const ranges: [WordLanguage, number, number][] = [
			['ko', 8, 16],
			['ko', 20, 34],
			['en', 14, 30],
			['en', 40, 70],
			['ja', 6, 14],
			['zh', 5, 12],
			['vi', 12, 28],
			['es', 14, 34],
			['it', 14, 34],
			['de', 14, 34],
			['ru', 10, 26]
		];

		for (const [language, minLength, maxLength] of ranges) {
			for (const sentence of randSentence({ language, minLength, maxLength, count: SAMPLE })) {
				assert.ok(
					sentence.length >= minLength && sentence.length <= maxLength,
					`${language} ${minLength}-${maxLength}: ${sentence} (${sentence.length})`
				);
			}
		}
	});

	it('a narrow range is met too, anywhere in the language`s own range', () => {
		// The wide ranges above are met by most shapes the language has. A narrow one
		// is what caught the budget measuring a phrase against every pool of the
		// language rather than the one it draws from.
		//
		// Swept across what the language is observed to produce rather than across
		// `sentenceLengthRange`, whose ends are the shortest and longest sentence the
		// shapes could spell — the very top of it needs the longest word of every
		// pool at once, which is a fit no draw is going to find.
		//
		// A miss is still possible and the assertion says so: German's shortest shape
		// tops out around seventeen characters and the same shape with a modifier
		// starts above twenty-two, so a window in between is one the language has
		// almost nothing to put in. What has to hold is that a miss is rare and
		// small. The bug this replaced missed by six characters one time in forty.
		const misses: string[] = [];
		let drawn = 0;

		for (const language of WORD_LANGUAGES) {
			const seen = randSentence({ language, count: 400 })
				.map((sentence) => sentence.length)
				.sort((a, b) => a - b);
			const lowest = seen[Math.floor(seen.length * 0.05)];
			const highest = seen[Math.floor(seen.length * 0.95)];
			const step = Math.max(2, Math.floor((highest - lowest) / 8));

			for (let minLength = lowest; minLength + 5 <= highest; minLength += step) {
				const maxLength = Math.min(highest, minLength + 5);

				for (const sentence of randSentence({ language, minLength, maxLength, count: 30 })) {
					drawn += 1;

					const over = sentence.length - maxLength;
					const distance = over > 0 ? over : minLength - sentence.length;

					if (distance <= 0) {
						continue;
					}

					misses.push(`${language} ${minLength}-${maxLength}: ${sentence} (${sentence.length})`);

					assert.ok(distance <= 2, `off by ${distance}: ${misses[misses.length - 1]}`);
				}
			}
		}

		assert.ok(
			misses.length * 200 <= drawn,
			`${misses.length} of ${drawn} outside the range: ${misses.slice(0, 5).join(' | ')}`
		);
	});

	it('sentences start with `startsWith`', () => {
		for (const [language, prefix] of [
			['ko', '사'],
			['ja', '空'],
			['zh', '雨']
		] as [WordLanguage, string][]) {
			const sentences = randSentence({ language, startsWith: prefix, count: 20 });

			assert.ok(sentences.length > 0, `${language} ${prefix}`);

			for (const sentence of sentences) {
				assert.ok(sentence.startsWith(prefix), `${language}: ${sentence}`);
			}
		}
	});

	it('`unique` never repeats a sentence', () => {
		const sentences = randSentence({ language: 'ko', unique: true, count: 300 });

		assert.strictEqual(new Set(sentences).size, sentences.length);
	});

	it('the detail form reports what the sentence was built from', () => {
		for (const detail of sentenceDetails({ language: 'en', count: SAMPLE })) {
			assert.ok(detail.sentence.length > 0);
			assert.strictEqual(detail.language, 'en');
			assert.ok(detail.phrases.length >= 2);
			assert.strictEqual(detail.phrases.length, detail.slots.length);
			assert.ok(detail.theme === null || WORD_THEMES.includes(detail.theme));
		}
	});

	it('sentenceLengthRange reports what the language can produce', () => {
		for (const language of WORD_LANGUAGES) {
			const [min, max] = sentenceLengthRange(language);

			assert.ok(min >= 1 && min < max, `${language}: ${min}-${max}`);

			for (const sentence of randSentence({ language, count: SAMPLE })) {
				assert.ok(
					sentence.length >= min && sentence.length <= max,
					`${language}: ${sentence} (${sentence.length}) outside ${min}-${max}`
				);
			}
		}

		const [allMin, allMax] = sentenceLengthRange();

		assert.strictEqual(allMin, Math.min(...WORD_LANGUAGES.map((l) => sentenceLengthRange(l)[0])));
		assert.strictEqual(allMax, Math.max(...WORD_LANGUAGES.map((l) => sentenceLengthRange(l)[1])));
	});

	it('every noun class the frames can ask for has a predicate to go with it', () => {
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];
			const subjects = new Set(data.verbs.flatMap((group) => [...group.subject]));
			const described = new Set(data.states.flatMap((group) => [...group.subject]));

			for (const theme of WORD_THEMES) {
				const noun = THEME_CLASS[theme];

				assert.ok(subjects.has(noun), `${language}: no verb takes a ${noun} subject`);
				assert.ok(described.has(noun), `${language}: no state describes a ${noun}`);
			}
		}
	});
});
