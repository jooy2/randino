import assert from 'assert';
import { describe, it } from 'node:test';
import {
	RAND_COUNT_MAX,
	RAND_SENTENCE_COUNT_MAX,
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
	SentenceType,
	WordLanguage,
	WordTheme
} from '../dist/index.js';
// The datasets are internal, but a sentence is only as good as the grammar
// behind it — these checks read the pools a sentence is allowed to draw from.
import { WORD_DATA } from '../dist/word/data/index.js';
import { agree } from '../dist/word/wordGenerator.js';
import type { WordGender } from '../dist/word/data/types.js';
import { NAME_DATA } from '../dist/name/data/index.js';
import { SENTENCE_DATA, THEME_CLASS } from '../dist/sentence/data/index.js';
import { shapeOf } from '../dist/sentence/sentenceGenerator.js';

const SAMPLE = 60;

/** Everything a sentence of the language may be written with, punctuation aside. */
const SCRIPT: Record<WordLanguage, RegExp> = {
	en: /^[A-Za-z0-9' ,.?!…“”‘’]+$/,
	ko: /^[가-힣0-9 ,.?!…“”‘’]+$/,
	ja: /^[々぀-ヿ一-鿿0-9,。、？！…「」『』]+$/,
	zh: /^[々一-鿿0-9,。，？！…“”‘’]+$/,
	vi: /^[a-zA-ZÀ-ỹ0-9 ,.?!…“”‘’]+$/,
	es: /^[a-zA-ZÀ-ÿ0-9 ,.?!…¿¡«»“”]+$/,
	it: /^[a-zA-ZÀ-ÿ0-9' ,.?!…«»“”]+$/,
	de: /^[a-zA-ZÀ-ÿß0-9 ,.?!…„“‚‘]+$/,
	ru: /^[Ѐ-ӿ0-9 ,.?!…«»„“]+$/
};

const SHAPES: readonly SentenceShape[] = ['simple', 'detailed', 'complex'];

const STYLES: readonly SentenceStyle[] = ['plain', 'casual', 'polite', 'formal'];

// The form keys a level reaches for. `question` and `exclamation` are 해라체's
// own and say nothing about whether a language has levels at all — English
// declares `question` and has none.
const STYLE_FORMS = ['casual', 'polite', 'formal', 'formalQuestion'] as const;

/** How a capitalizing language writes the first word of a sentence. */
function upperFirst(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Every subject pronoun the language can write, in both cases. */
function pronounsOf(language: WordLanguage): Set<string> {
	const written = Object.values(SENTENCE_DATA[language].pronouns).flatMap((pool) => [
		...(pool ?? [])
	]);

	return new Set([...written, ...written.map(upperFirst)].filter(Boolean));
}

/**
 * Every noun a phrase could have been built around, as far as the pools can tell
 * — the same decomposition `explains` makes, kept instead of thrown away.
 *
 * Every one of them rather than the first, because a word can be both a noun and
 * a modifier and two of them beside each other parse both ways: Vietnamese `Sâu
 * ấm` is a warm worm and a deep teapot, and only the generator knows which it
 * meant. Empty for a phrase built on a word no pool holds, which is what an
 * invented subject is.
 */
function nounsIn(language: WordLanguage, phrase: string): Set<string> {
	const space = SENTENCE_DATA[language].space;
	const nouns = poolFor(language, 'subject');
	const modifiers = modifiersFor(language);
	const found = new Set<string>();
	let rest = phrase;

	for (const article of articlesFor(language)) {
		const opening = article.endsWith("'") ? article : article + space;

		if (rest.startsWith(opening)) {
			rest = rest.slice(opening.length);
			break;
		}
	}

	if (nouns.has(rest)) {
		found.add(rest);
	}

	for (let at = 1; at < rest.length; at += 1) {
		if (space && rest.slice(at, at + space.length) !== space) {
			continue;
		}

		const left = rest.slice(0, at);
		const right = rest.slice(at + space.length);

		if (modifiers.has(left) && nouns.has(right)) {
			found.add(right);
		}

		if (nouns.has(left) && modifiers.has(right)) {
			found.add(left);
		}
	}

	return found;
}

/** The theme whose pool holds a noun, in the form a sentence writes it. */
function themeOfNoun(language: WordLanguage, noun: string): WordTheme | null {
	for (const theme of WORD_THEMES) {
		if (WORD_DATA[language].nouns[theme].some((word) => plain(language, word) === noun)) {
			return theme;
		}
	}

	return null;
}

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
function escapeRe(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * A counted phrase with its number taken off, so what is left is the noun phrase
 * every other check already knows how to read.
 */
function stripCount(language: WordLanguage, phrase: string): string {
	const data = SENTENCE_DATA[language];
	const numeral = data.numeral;

	if (!numeral) {
		return phrase;
	}

	const space = escapeRe(data.space);
	const gap = escapeRe(numeral.gap);
	const counters = Object.values(numeral.counters).map(escapeRe);
	const number = `\\d[\\d${escapeRe(numeral.group)}]*`;
	const group = counters.length ? `${number}(?:${gap}(?:${counters.join('|')}))?` : number;

	return phrase
		.replace(new RegExp(`${space}${group}$`), '')
		.replace(new RegExp(`^${group}${space}`), '');
}

/** Whether a phrase is an amount of money, written the way the language writes it. */
function isMoney(language: WordLanguage, phrase: string): boolean {
	const data = SENTENCE_DATA[language];
	const numeral = data.numeral;

	if (!numeral) {
		return false;
	}

	return new RegExp(
		`^\\d[\\d${escapeRe(numeral.group)}]*${escapeRe(numeral.gap)}${escapeRe(numeral.currency)}$`
	).test(phrase);
}

/**
 * Which sentence of a result each phrase belongs to.
 *
 * `phrases` and `slots` are one flat list across every sentence, which is what
 * they are for — but a question like "is this counted phrase the subject of its
 * own sentence" needs the boundaries back, and the phrases appear in order, so
 * walking them against `sentences` finds them.
 */
function sentenceOf(detail: SentenceDetail): number[] {
	const out: number[] = [];
	let at = 0;
	let cursor = 0;

	for (const phrase of detail.phrases) {
		while (at < detail.sentences.length - 1 && detail.sentences[at].indexOf(phrase, cursor) < 0) {
			at += 1;
			cursor = 0;
		}

		const found = detail.sentences[at].indexOf(phrase, cursor);

		cursor = found < 0 ? cursor : found + phrase.length;
		out.push(at);
	}

	return out;
}

function inflectedFor(language: WordLanguage, pool: readonly string[]): string[] {
	const wordData = WORD_DATA[language];
	const genders = Object.keys(wordData.agreement ?? {}) as WordGender[];

	return [
		...pool,
		...genders.flatMap((gender) => pool.map((word) => agree(wordData, word, gender)))
	];
}

type Group = { words: readonly string[]; forms?: Partial<Record<string, readonly string[]>> };

/** Every ending an entry lists: `달리니|달리나` is one entry and two endings. */
function endings(pool: readonly string[]): string[] {
	return pool.flatMap((entry) => entry.split('|'));
}

/**
 * Which form a level writes for each mood, best first. The generator's own
 * `FORM_CHAIN`, written out again here so a change to it has to be made twice
 * rather than agreeing with itself by construction.
 */
const FORM_CHAIN: Record<SentenceStyle, Record<SentenceMark, readonly string[]>> = {
	plain: { statement: [], trailing: [], question: ['question'], exclamation: ['exclamation'] },
	casual: {
		statement: ['casual'],
		trailing: ['casual'],
		question: ['casual', 'question'],
		exclamation: ['casual', 'exclamation']
	},
	polite: {
		statement: ['polite'],
		trailing: ['polite'],
		question: ['polite', 'question'],
		exclamation: ['polite', 'exclamation']
	},
	formal: {
		statement: ['formal', 'polite'],
		trailing: ['formal', 'polite'],
		question: ['formalQuestion', 'formal', 'polite', 'question'],
		exclamation: ['formal', 'polite', 'exclamation']
	}
};

/** The predicates one group can write at one level and mood. */
function formsOf(group: Group, style: SentenceStyle, mark: SentenceMark): string[] {
	for (const key of FORM_CHAIN[style][mark]) {
		const pool = group.forms?.[key];

		if (pool) {
			return endings(pool);
		}
	}

	return [...group.words];
}

/** Every predicate a group can write at any level and any mood. */
function everyForm(group: Group): string[] {
	return [...group.words, ...endings(Object.values(group.forms ?? {}).flat())];
}

function poolFor(language: WordLanguage, slot: SentenceSlot): Set<string> {
	const wordData = WORD_DATA[language];
	const data = SENTENCE_DATA[language];
	const inflected = (pool: readonly string[]) => inflectedFor(language, pool);

	if (slot === 'verb') {
		return new Set(data.verbs.flatMap(everyForm));
	}

	if (slot === 'state') {
		const states = data.states.flatMap(everyForm);

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

/**
 * The given names the language can write, by gender — the pools `randSentence`
 * reaches through `includeName`. CJK languages keep whole given names under
 * `givenMale` / `givenFemale`; the others draw from `male` / `female`.
 */
function givenNames(language: WordLanguage, gender: 'male' | 'female'): Set<string> {
	const data = NAME_DATA[language];
	const pool =
		gender === 'male' ? (data.givenMale ?? data.male) : (data.givenFemale ?? data.female);

	return new Set((pool ?? []).map((entry) => (typeof entry === 'string' ? entry : entry.n)));
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
			const terminator = SENTENCE_DATA[language].terminators.statement;

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

					if (slot === 'money') {
						assert.ok(
							isMoney(language, phrase),
							`${language}: '${phrase}' is not an amount (${detail.sentence})`
						);

						continue;
					}

					// A counted phrase is a noun phrase with a number on it, so the
					// number comes off before the pools are asked about the rest.
					assert.ok(
						explains(language, stripCount(language, written)),
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
				// A shape that counts what it is about has no separate subject: the
				// counted phrase is what the verb agrees with.
				assert.ok(
					detail.slots.includes('subject') || detail.slots.includes('quantity'),
					detail.sentence
				);
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

				// A quantity beside a subject is an object with a number on it, and an
				// amount is an object of the class money belongs to.
				const transitive =
					detail.slots.includes('object') ||
					detail.slots.includes('money') ||
					(detail.slots.includes('quantity') && detail.slots.includes('subject'));
				// A verb can sit in more than one group — `gathers` is transitive
				// beside a person and intransitive beside a crowd — so the sentence is
				// right when one of its groups accounts for it.
				const groups = data.verbs.filter(
					(group) =>
						everyForm(group).includes(detail.phrases[at]) && Boolean(group.object) === transitive
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

			// A required predicate is named in the form a plain statement ends on, and
			// every other level writes it in its own form — which the test above is
			// what covers. Here the word has to survive as itself.
			for (const sentence of randSentence({ language, include, style: 'plain', count: 40 })) {
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

					// Three rather than two, and German is why. Its short shape reaches a
					// window like 18–23 only with a long enough noun, and the theme is
					// settled before the noun is drawn — so a run of fourteen attempts
					// that all rolled a short-noun theme (`color` is `Rot` and `Blau`)
					// settles three characters short. Measured at roughly one draw in
					// thirty thousand.
					assert.ok(distance <= 3, `off by ${distance}: ${misses[misses.length - 1]}`);
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

	it('`sentences` puts more than one sentence in one result', () => {
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];

			for (const detail of sentenceDetails({ language, sentences: 3, count: 40 })) {
				assert.strictEqual(detail.sentences.length, 3, detail.sentence);
				assert.strictEqual(detail.sentences.join(data.space), detail.sentence);

				for (const sentence of detail.sentences) {
					assert.ok(sentence.endsWith(data.terminators.statement), `${language}: ${sentence}`);
					assert.match(sentence, SCRIPT[language], `${language}: ${sentence}`);
					// Every sentence closes exactly once, so two of them were never run
					// together into one entry. Counted after the grouped numbers are
					// taken out: Vietnamese, Spanish and Italian group on a full stop,
					// so `5.000.000` is three of them and none is a terminator.
					assert.strictEqual(
						sentence.replace(/\d[\d.,]*\d/g, '#').split(data.terminators.statement).length - 1,
						1,
						`${language}: ${sentence}`
					);
					assert.ok(!sentence.includes('  '), `${language} double space: ${sentence}`);
				}
			}
		}

		for (const detail of sentenceDetails({ count: 20 })) {
			assert.strictEqual(detail.sentences.length, 1, detail.sentence);
			assert.strictEqual(detail.sentences[0], detail.sentence);
		}
	});

	it('`sentences` is clamped, and `count` still says how many strings there are', () => {
		for (const [asked, expected] of [
			[0, 1],
			[-3, 1],
			[2.9, 2],
			[RAND_SENTENCE_COUNT_MAX + 5, RAND_SENTENCE_COUNT_MAX]
		] as [number, number][]) {
			for (const detail of sentenceDetails({ language: 'ko', sentences: asked, count: 10 })) {
				assert.strictEqual(detail.sentences.length, expected, detail.sentence);
			}
		}

		assert.strictEqual(randSentence({ sentences: 4, count: 7 }).length, 7);
	});

	it('the length range describes the whole result, not one sentence of it', () => {
		const ranges: [WordLanguage, number, number, number][] = [
			['ko', 2, 24, 40],
			['ko', 3, 40, 60],
			['en', 2, 40, 70],
			['ja', 3, 24, 42],
			['zh', 2, 14, 28],
			['de', 2, 34, 60],
			['ru', 3, 40, 75]
		];

		for (const [language, sentences, minLength, maxLength] of ranges) {
			for (const sentence of randSentence({
				language,
				sentences,
				minLength,
				maxLength,
				count: SAMPLE
			})) {
				assert.ok(
					sentence.length >= minLength && sentence.length <= maxLength,
					`${language} x${sentences} ${minLength}-${maxLength}: ${sentence} (${sentence.length})`
				);
			}
		}
	});

	it('the sentences of one result are about the same kind of thing', () => {
		// A paragraph is not three draws. Every sentence after the first names that
		// first subject again, stands a pronoun where it was, or draws another noun
		// of the same class — so a paragraph that opens on a creature never wanders
		// into an idea halfway through.
		for (const language of WORD_LANGUAGES) {
			const pronouns = pronounsOf(language);

			for (const detail of sentenceDetails({ language, sentences: 3, count: 60 })) {
				if (detail.theme === null) {
					continue;
				}

				const wanted = THEME_CLASS[detail.theme];
				// A shape that counts what it is about has no separate subject, so the
				// counted phrase is the one that has to stay on topic. Beside a subject
				// it is an object instead, and belongs to whatever class the verb takes.
				//
				// A counted phrase is checked only in the opening sentence, and only
				// when that sentence has no subject of its own — the one case where it
				// provably is the subject. A later sentence may have dropped its
				// subject, and then a counted object looks exactly the same from here.
				const belongs = sentenceOf(detail);
				const opens = !detail.slots.some((slot, i) => slot === 'subject' && belongs[i] === 0);
				const counted = (at: number) => belongs[at] === 0 && opens;
				let subjects = 0;

				for (let i = 0; i < detail.phrases.length; i += 1) {
					const slot = detail.slots[i];

					if (slot !== 'subject' && !(slot === 'quantity' && counted(i))) {
						continue;
					}

					subjects += 1;

					const phrase = detail.phrases[i];

					if (pronouns.has(phrase)) {
						continue;
					}

					// Any of the three sentences can be the one a phrase opens, so both
					// cases are tried rather than only the first phrase of the result.
					const bare = stripCount(language, phrase);
					const found = [
						...nounsIn(language, bare),
						...nounsIn(language, bare.charAt(0).toLowerCase() + bare.slice(1))
					];
					const themes = found
						.map((noun) => themeOfNoun(language, noun))
						.filter((theme): theme is WordTheme => theme !== null);

					assert.ok(
						themes.length === 0 || themes.some((theme) => THEME_CLASS[theme] === wanted),
						`${language}: '${phrase}' reads as ${themes.join('/')} where the result is about a ${wanted} (${detail.sentence})`
					);
				}

				assert.ok(subjects >= 1, detail.sentence);
			}
		}
	});

	it('a connective opens a sentence that follows another, and only one', () => {
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];
			const openers = data.connectives.map(
				(word) => (data.capitalize ? upperFirst(word) : word) + data.space
			);
			let seen = 0;

			for (const detail of sentenceDetails({ language, sentences: 3, count: 120 })) {
				assert.ok(
					!openers.some((opener) => detail.sentences[0].startsWith(opener)),
					`${language}: the first sentence opens on a connective (${detail.sentence})`
				);

				seen += detail.sentences
					.slice(1)
					.filter((sentence) => openers.some((opener) => sentence.startsWith(opener))).length;
			}

			// And the language can actually write one, which is what makes the check
			// above worth anything.
			assert.ok(seen > 0, `${language} never wrote a connective`);
		}
	});

	it('a language whose nouns carry a gender has a pronoun for each of them', () => {
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];
			const genders = Object.keys(WORD_DATA[language].agreement ?? {}) as WordGender[];

			assert.ok(data.connectives.length > 0, `${language} has no connectives`);
			assert.ok(
				data.pronouns.n !== undefined || genders.length > 0,
				`${language} has no pronoun to fall back to`
			);

			for (const gender of genders) {
				assert.ok(
					(data.pronouns[gender] ?? data.pronouns.n) !== undefined,
					`${language}: nothing stands in for a ${gender} subject`
				);
			}
		}
	});

	it("`includeName` writes a person's name where a sentence has room for one", () => {
		for (const language of WORD_LANGUAGES) {
			const details = sentenceDetails({ language, includeName: true, count: SAMPLE });

			for (const detail of details) {
				assert.ok(detail.names.length > 0, `${language}: no name in '${detail.sentence}'`);

				for (const name of detail.names) {
					assert.ok(detail.phrases.includes(name), `${language}: ${name} is not a phrase`);
					assert.ok(detail.sentence.includes(name), `${language}: ${name} is not in the sentence`);
				}

				// A name is a bare proper noun, so nothing opens the phrase it stands in.
				const at = detail.slots.indexOf('subject');

				if (at >= 0 && detail.names.includes(detail.phrases[at])) {
					for (const article of articlesFor(language)) {
						assert.ok(
							!detail.sentence.includes(
								`${article}${SENTENCE_DATA[language].space}${detail.phrases[at]}`
							),
							`${language}: '${article}' in front of a name (${detail.sentence})`
						);
					}
				}
			}
		}

		// Off by default, and the pools are not reached at all.
		for (const detail of sentenceDetails({ count: 60 })) {
			assert.deepStrictEqual(detail.names, [], detail.sentence);
		}
	});

	it('a name comes out of the language`s own given-name pools', () => {
		for (const language of WORD_LANGUAGES) {
			const known = new Set([...givenNames(language, 'male'), ...givenNames(language, 'female')]);

			for (const detail of sentenceDetails({ language, includeName: true, count: SAMPLE })) {
				for (const name of detail.names) {
					// English writes its pools capitalized and a sentence opens on a
					// capital, so the name is looked up the way the pool holds it.
					assert.ok(
						known.has(name) || known.has(upperFirst(name)),
						`${language}: '${name}' is in no given-name pool (${detail.sentence})`
					);
				}
			}
		}
	});

	it('a theme the caller named wins over `includeName`', () => {
		// A name can only stand where a person would. Asked for beside a theme that
		// names no people, the sentence is about that theme and carries no name.
		for (const detail of sentenceDetails({
			language: 'en',
			theme: 'animal',
			includeName: true,
			count: SAMPLE
		})) {
			assert.strictEqual(detail.theme, 'animal', detail.sentence);
			assert.deepStrictEqual(detail.names, [], detail.sentence);
		}
	});

	it('a predicate agrees with the gender of the name it describes', () => {
		// The one thing a name has to carry beside its letters. Spanish, Italian and
		// Russian inflect a predicate adjective, and a name is in no pool for
		// `genderOf` to read a gender out of.
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];
			const wordData = WORD_DATA[language];

			if (!data.predicateAgrees || !wordData.agreement) {
				continue;
			}

			const male = givenNames(language, 'male');
			const female = givenNames(language, 'female');
			const states = data.states.flatMap((group) => [...group.words]);
			const agreed = (gender: WordGender) =>
				new Set(states.map((word) => agree(wordData, word, gender)));
			const forms = { m: agreed('m'), f: agreed('f') };
			let checked = 0;

			for (const detail of sentenceDetails({
				language,
				includeName: true,
				slots: 'state',
				count: 200
			})) {
				const at = detail.slots.indexOf('state');
				const subject = detail.phrases[detail.slots.indexOf('subject')];

				if (at < 0 || !detail.names.includes(subject)) {
					continue;
				}

				const gender = male.has(subject) ? 'm' : female.has(subject) ? 'f' : null;

				if (gender === null) {
					continue;
				}

				checked += 1;

				assert.ok(
					forms[gender].has(detail.phrases[at]),
					`${language}: '${detail.phrases[at]}' does not agree with ${subject} (${detail.sentence})`
				);
			}

			assert.ok(checked > 0, `${language}: no named subject was described`);
		}
	});

	it('Korean picks the particle a name asks for too', () => {
		for (const detail of sentenceDetails({ language: 'ko', includeName: true, count: 200 })) {
			const at = detail.slots.indexOf('subject');
			const name = detail.phrases[at];

			if (!detail.names.includes(name)) {
				continue;
			}

			const after = detail.sentence.charAt(detail.sentence.indexOf(name) + name.length);
			const last = name.charCodeAt(name.length - 1);
			const coda = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0;

			if (after === '가' || after === '는') {
				assert.ok(!coda, `${name}${after} (${detail.sentence})`);
			}

			if (after === '이' || after === '은') {
				assert.ok(coda, `${name}${after} (${detail.sentence})`);
			}
		}
	});

	it('`type` decides what the sentence is doing, and what it closes on', () => {
		const TYPES: readonly SentenceType[] = ['statement', 'question', 'exclamation', 'trailing'];
		const EVERY: readonly SentenceType[] = [...TYPES, 'dialogue', 'thought'];

		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];

			for (const type of TYPES) {
				for (const detail of sentenceDetails({ language, type, count: SAMPLE })) {
					assert.deepStrictEqual(detail.types, [type], detail.sentence);
					assert.ok(
						detail.sentence.endsWith(data.terminators[type]),
						`${language} ${type}: ${detail.sentence}`
					);
					assert.match(detail.sentence, SCRIPT[language], `${language}: ${detail.sentence}`);

					const opener = data.openers?.[type];

					if (opener) {
						assert.ok(detail.sentence.startsWith(opener), `${language}: ${detail.sentence}`);
					}
				}
			}
		}

		// Statements by default, and the option decides per sentence when it is given
		// more than one to choose from.
		for (const detail of sentenceDetails({ count: 40 })) {
			assert.deepStrictEqual(detail.types, ['statement'], detail.sentence);
		}

		const seen = new Set(
			sentenceDetails({ language: 'ko', type: 'all', sentences: 3, count: 120 }).flatMap(
				(detail) => detail.types
			)
		);

		assert.strictEqual(seen.size, EVERY.length);
	});

	it('a question is a shape, not a mark bolted onto a statement', () => {
		// The four languages whose grammar moves for a question say so in their own
		// frames, and the shape has to be one of those rather than the statement's.
		const CARRIES: [WordLanguage, RegExp][] = [
			// English do-support, and the base form behind it.
			['en', /^(Does|Is) /],
			// Korean changes the ending on the predicate itself. Which ending is the
			// level's business — 해라체 asks with `-니`, `-나` and `-(으)ㄴ가` — so the
			// level is pinned below and the shape is what is under test.
			['ko', /(니|나|가)\?$/],
			// A tag Japanese, Chinese and Vietnamese write after the whole clause.
			['ja', /か？$/],
			['zh', /吗？$/],
			['vi', /không\?$/]
		];

		for (const [language, shape] of CARRIES) {
			for (const sentence of randSentence({
				language,
				type: 'question',
				style: 'plain',
				count: SAMPLE
			})) {
				assert.match(sentence, shape, `${language}: ${sentence}`);
			}
		}

		// German moves its finite verb to the front, so the question opens on the
		// predicate or on the `ist` that stands in for one.
		const verbs = new Set(poolFor('de', 'verb'));

		for (const sentence of randSentence({
			language: 'de',
			type: 'question',
			style: 'plain',
			count: SAMPLE
		})) {
			const first = sentence.split(' ')[0].toLowerCase();

			assert.ok(verbs.has(first) || first === 'ist', `de: ${sentence}`);
		}
	});

	it('a question form pool is the same length as the words it restates', () => {
		// Index-aligned is the whole contract: a verb keeps its meaning across the
		// forms, and a word the caller required is translated by its position.
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];

			for (const group of [...data.verbs, ...data.states]) {
				for (const [form, pool] of Object.entries(group.forms ?? {})) {
					assert.strictEqual(
						pool.length,
						group.words.length,
						`${language}: the ${form} pool is ${pool.length} beside ${group.words.length} words`
					);
					assert.ok(
						pool.every((word) => word.length > 0),
						`${language}: the ${form} pool has a blank`
					);
				}
			}
		}
	});

	it('a predicate is written in the form its type asks for', () => {
		// The form the level's chain lands on, and the plain words where the group
		// declares nothing — English states need none, because the shape moves `is`
		// to the front and leaves `green` alone.
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];
			const asked = (groups: readonly Group[]) =>
				groups.flatMap((group) => formsOf(group, 'plain', 'question'));
			const states = asked(data.states);
			const expected: Record<string, Set<string>> = {
				verb: new Set(asked(data.verbs)),
				// A predicate adjective that agrees comes out in the form its subject
				// asked for, question or not.
				state: new Set(data.predicateAgrees ? inflectedFor(language, states) : states)
			};

			for (const detail of sentenceDetails({
				language,
				type: 'question',
				style: 'plain',
				count: 120
			})) {
				for (let i = 0; i < detail.phrases.length; i += 1) {
					const slot = detail.slots[i];

					if (slot !== 'verb' && slot !== 'state') {
						continue;
					}

					const phrase = detail.phrases[i];
					const written = i === 0 ? phrase.charAt(0).toLowerCase() + phrase.slice(1) : phrase;
					const pool = expected[slot];

					assert.ok(
						pool.has(written) || pool.has(phrase),
						`${language}: '${phrase}' is not the ${slot} form a question asks for (${detail.sentence})`
					);
				}
			}
		}
	});

	it('`include` puts a required predicate in the form the type asks for', () => {
		// The pools are index-aligned so that a word named in the statement form can
		// be said the other way rather than written out wrong.
		for (const [style, written] of [
			['plain', ['달리니', '달리나', '달리는가']],
			['casual', ['달려', '달리지']],
			['polite', ['달려요', '달리죠']],
			['formal', ['달립니까']]
		] as [SentenceStyle, string[]][]) {
			for (const sentence of randSentence({
				language: 'ko',
				include: '달린다',
				type: 'question',
				style,
				count: 30
			})) {
				assert.ok(
					written.some((form) => sentence.includes(form)),
					`${style}: ${sentence}`
				);
				assert.ok(!sentence.includes('달린다'), sentence);
			}
		}

		for (const sentence of randSentence({
			language: 'en',
			include: 'runs',
			type: 'question',
			style: 'plain',
			count: 30
		})) {
			assert.match(sentence, /\brun\b/, sentence);
		}
	});

	it('an interjection opens an exclamation, and nothing else', () => {
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];
			const openers = data.interjections.map(
				(word) => (data.capitalize ? upperFirst(word) : word) + data.space
			);
			const opens = (sentence: string) => {
				const body = data.openers?.exclamation
					? sentence.slice(data.openers.exclamation.length)
					: sentence;

				return openers.some((opener) => body.startsWith(opener));
			};
			let seen = 0;

			for (const sentence of randSentence({ language, type: 'exclamation', count: 120 })) {
				if (opens(sentence)) {
					seen += 1;
				}
			}

			assert.ok(seen > 0, `${language} never wrote an interjection`);

			for (const sentence of randSentence({ language, count: 120 })) {
				assert.ok(!opens(sentence), `${language}: a statement opened on one (${sentence})`);
			}
		}
	});

	it('every language can write every type inside its own length range', () => {
		for (const language of WORD_LANGUAGES) {
			const [min, max] = sentenceLengthRange(language);

			for (const type of ['question', 'exclamation', 'trailing'] as SentenceType[]) {
				for (const sentence of randSentence({ language, type, count: 40 })) {
					assert.ok(
						sentence.length >= min && sentence.length <= max,
						`${language} ${type}: ${sentence} (${sentence.length}) outside ${min}-${max}`
					);
				}
			}
		}
	});

	it('a quoted line is a sentence in the language`s own marks', () => {
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];
			const marks = Object.values(data.terminators);

			for (const [type, kind] of [
				['dialogue', 'double'],
				['thought', 'single']
			] as [SentenceType, 'double' | 'single'][]) {
				const [open, close] = data.quotes[kind];

				for (const detail of sentenceDetails({ language, type, count: SAMPLE })) {
					assert.deepStrictEqual(detail.types, [type], detail.sentence);
					assert.ok(detail.sentence.startsWith(open), `${language}: ${detail.sentence}`);
					assert.ok(detail.sentence.endsWith(close), `${language}: ${detail.sentence}`);
					assert.match(detail.sentence, SCRIPT[language], detail.sentence);

					// What is quoted is a whole sentence, closed the way its own kind
					// closes — a spoken line is as often asking as telling.
					const inner = detail.sentence.slice(open.length, -close.length);

					assert.ok(
						marks.some((mark) => inner.endsWith(mark)),
						`${language}: '${inner}' closes on no mark (${detail.sentence})`
					);
				}
			}
		}
	});

	it('a quoted line is as often asking as telling', () => {
		// The mark under a quote is drawn per line rather than fixed, so a hundred
		// of them are not a hundred statements.
		const data = SENTENCE_DATA.en;
		const closes = new Set<string>();

		for (const sentence of randSentence({ language: 'en', type: 'dialogue', count: 200 })) {
			closes.add(sentence.slice(-2, -1));
		}

		assert.ok(
			closes.has(data.terminators.statement) &&
				closes.has(data.terminators.question) &&
				closes.has(data.terminators.exclamation),
			`only ${[...closes].join('')} came out`
		);
	});

	it('`quote` picks the marks, whatever the type', () => {
		for (const language of WORD_LANGUAGES) {
			const { quotes } = SENTENCE_DATA[language];

			for (const kind of ['double', 'single'] as const) {
				const [open, close] = quotes[kind];

				for (const type of ['dialogue', 'thought'] as SentenceType[]) {
					for (const sentence of randSentence({ language, type, quote: kind, count: 20 })) {
						assert.ok(
							sentence.startsWith(open) && sentence.endsWith(close),
							`${language} ${type} ${kind}: ${sentence}`
						);
					}
				}
			}

			// The two levels are two different pairs, or the option means nothing.
			assert.notDeepStrictEqual(quotes.double, quotes.single, `${language} quotes`);
		}
	});

	it('`style` is the speech level, and Korean is the language with four of them', () => {
		// The two languages a level changes, and the seven it does not. Korean has
		// all four; Japanese has two and maps onto them, `casual` being its plain
		// form and `polite` and `formal` both `走ります`.
		// What each level closes on, where a mark is what the level actually is.
		// 해라체 and 해체 are left out on purpose: 해체 is the stem with `-아/-어`
		// contracted onto it, so a regex over its endings would only restate the
		// pool, and the test below reads the pools themselves. What is worth
		// asserting about those two is the other half — that neither ever closes on
		// a polite ending.
		const CLOSES: Partial<Record<WordLanguage, Partial<Record<SentenceStyle, RegExp>>>> = {
			ko: { polite: /(요|죠)[.?!…”’]$/, formal: /(니다|니까)[.?!…”’]$/ },
			// A Japanese verb closes on ます and an adjective on です.
			ja: { polite: /(ます|です)か?[。？！…」』]$/, formal: /(ます|です)か?[。？！…」』]$/ }
		};
		const ADDRESSED: Partial<Record<WordLanguage, RegExp>> = {
			ko: /(요|죠|니다|니까)[.?!…”’]$/,
			ja: /(ます|です)か?[。？！…」』]$/
		};

		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];
			const declares = [...data.verbs, ...data.states].some((group) =>
				STYLE_FORMS.some((key) => group.forms?.[key] !== undefined)
			);

			assert.strictEqual(
				declares,
				language in CLOSES,
				`${language} ${declares ? 'declares' : 'declares no'} forms for a level`
			);

			for (const style of STYLES) {
				const closes = CLOSES[language]?.[style];
				const addressed = ADDRESSED[language];

				for (const type of ['statement', 'question'] as SentenceType[]) {
					for (const sentence of randSentence({ language, type, style, count: SAMPLE })) {
						if (closes) {
							assert.match(sentence, closes, `${language} ${style} ${type}: ${sentence}`);
						} else if (addressed) {
							assert.doesNotMatch(
								sentence,
								addressed,
								`${language} ${style} ${type} addresses somebody: ${sentence}`
							);
						}
					}
				}
			}
		}

		// A language with no form of its own writes exactly the same sentence at
		// every level, which is what its grammar actually does with politeness in
		// the third person.
		for (const language of WORD_LANGUAGES) {
			if (language in CLOSES) {
				continue;
			}

			const pools = poolFor(language, 'verb');

			for (const style of STYLES) {
				for (const detail of sentenceDetails({ language, style, count: 40 })) {
					const at = detail.slots.indexOf('verb');

					if (at >= 0) {
						assert.ok(pools.has(detail.phrases[at]), `${language} ${style}: ${detail.sentence}`);
					}
				}
			}
		}
	});

	it('a predicate comes out of the pool its level and its mood land on', () => {
		for (const language of ['ko', 'ja'] as WordLanguage[]) {
			const data = SENTENCE_DATA[language];

			for (const style of STYLES) {
				for (const type of ['statement', 'question', 'exclamation'] as SentenceType[]) {
					const mark = type as SentenceMark;
					const states = data.states.flatMap((group) => formsOf(group, style, mark));
					const pools: Record<string, Set<string>> = {
						verb: new Set(data.verbs.flatMap((group) => formsOf(group, style, mark))),
						state: new Set(data.predicateAgrees ? inflectedFor(language, states) : states)
					};

					for (const detail of sentenceDetails({ language, type, style, count: 60 })) {
						for (let i = 0; i < detail.phrases.length; i += 1) {
							const slot = detail.slots[i];

							if (slot !== 'verb' && slot !== 'state') {
								continue;
							}

							assert.ok(
								pools[slot].has(detail.phrases[i]),
								`${language} ${style} ${type}: '${detail.phrases[i]}' is not a ${style} ${slot} (${detail.sentence})`
							);
						}
					}
				}
			}
		}
	});

	it('a polite form pool is the same length as the words it restates', () => {
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];

			for (const group of [...data.verbs, ...data.states]) {
				for (const [form, pool] of Object.entries(group.forms ?? {})) {
					assert.strictEqual(pool.length, group.words.length, `${language} ${form}`);
				}
			}
		}
	});

	it('a number is written against its counter the way the language writes it', () => {
		// Korean spaces a unit noun off a spelled-out number and attaches it to
		// digits, which is what anyone writing `6개` does; Japanese and Chinese have
		// no space anywhere. The four that write the gap all write a plain space.
		const GAPS: Partial<Record<WordLanguage, string>> = {
			ko: '',
			ja: '',
			zh: '',
			vi: ' ',
			en: ' ',
			es: ' ',
			it: ' '
		};

		for (const language of WORD_LANGUAGES) {
			const numeral = SENTENCE_DATA[language].numeral;

			assert.strictEqual(numeral?.gap, GAPS[language], language);
		}

		// And the sentences agree with the table: nothing stands between the digits
		// and the counter or the currency in the three that attach them.
		for (const language of ['ko', 'ja', 'zh'] as const) {
			for (const detail of sentenceDetails({
				language,
				slots: ['quantity', 'money'],
				count: SAMPLE
			})) {
				assert.ok(
					!/\d\s/.test(detail.sentence),
					`${language}: '${detail.sentence}' spaces a number off what it counts`
				);
			}
		}
	});

	it('`slots: quantity` counts a noun with the counter its kind takes', () => {
		// Only the four languages with a classifier table declare a counted shape.
		// A classifier is what makes a noun countable at all — `슬픔 12 가지` is
		// twelve kinds of sadness — which is why English, Spanish and Italian do
		// not: they would need a plural, and a plural of `sadness` is not a word.
		const COUNTING = WORD_LANGUAGES.filter(
			(language) => Object.keys(SENTENCE_DATA[language].numeral?.counters ?? {}).length > 0
		);

		assert.deepStrictEqual([...COUNTING], ['ko', 'ja', 'zh', 'vi']);

		for (const language of COUNTING) {
			const data = SENTENCE_DATA[language];
			const numeral = data.numeral!;
			const counters = new Set(Object.values(numeral.counters));

			for (const detail of sentenceDetails({ language, slots: 'quantity', count: SAMPLE })) {
				const at = detail.slots.indexOf('quantity');

				assert.ok(at >= 0, `${language}: ${detail.sentence}`);

				const phrase = detail.phrases[at];
				const found = phrase.match(new RegExp(`\\d+${escapeRe(numeral.gap)}(\\S+)`));

				assert.ok(found, `${language}: '${phrase}' carries no number (${detail.sentence})`);
				assert.ok(
					counters.has(found![1]),
					`${language}: '${found![1]}' is not a counter (${detail.sentence})`
				);

				const number = Number(phrase.match(/\d+/)![0]);

				assert.ok(
					number >= numeral.count[0] && number <= numeral.count[1],
					`${language}: ${number} is outside ${numeral.count.join('-')}`
				);

				// A counted phrase drops its article and takes no modifier.
				for (const article of articlesFor(language)) {
					assert.ok(!phrase.startsWith(article + data.space), `${language}: ${phrase}`);
				}

				assert.ok(
					poolFor(language, 'subject').has(stripCount(language, phrase)),
					`${language}: '${phrase}' is not a bare noun and a count (${detail.sentence})`
				);
			}
		}

		// German and Russian declare no numeral at all, so asking falls back to the
		// shapes they do have rather than inventing a case they cannot write.
		for (const language of ['de', 'ru'] as WordLanguage[]) {
			assert.strictEqual(SENTENCE_DATA[language].numeral, undefined, language);

			for (const detail of sentenceDetails({ language, slots: 'quantity', count: 30 })) {
				assert.ok(!detail.slots.includes('quantity'), detail.sentence);
			}
		}
	});

	it('`slots: money` writes an amount the language actually writes', () => {
		const PAYING = WORD_LANGUAGES.filter((language) => SENTENCE_DATA[language].numeral);

		assert.deepStrictEqual([...PAYING], ['en', 'ko', 'ja', 'zh', 'vi', 'es', 'it']);

		for (const language of PAYING) {
			const numeral = SENTENCE_DATA[language].numeral!;
			const amounts = new Set(numeral.amounts);

			for (const detail of sentenceDetails({ language, slots: 'money', count: SAMPLE })) {
				const at = detail.slots.indexOf('money');

				assert.ok(at >= 0, `${language}: ${detail.sentence}`);

				const phrase = detail.phrases[at];

				assert.ok(isMoney(language, phrase), `${language}: '${phrase}' is not an amount`);
				assert.ok(
					amounts.has(
						Number(phrase.replace(new RegExp(escapeRe(numeral.group), 'g'), '').match(/\d+/)![0])
					),
					`${language}: '${phrase}' is not an amount the language writes`
				);
			}
		}

		// The two that cannot: an amount would be an object, and neither declares an
		// object shape, because both would need a case their nouns change for.
		for (const language of ['de', 'ru'] as WordLanguage[]) {
			for (const detail of sentenceDetails({ language, slots: 'money', count: 30 })) {
				assert.ok(!detail.slots.includes('money'), detail.sentence);
			}
		}
	});

	it('an amount stands where the verbs that take an idea can take it', () => {
		// Money is an idea, which is what decides the verbs it can stand beside.
		for (const language of WORD_LANGUAGES) {
			const data = SENTENCE_DATA[language];

			for (const detail of sentenceDetails({ language, slots: 'money', count: 60 })) {
				const at = detail.slots.indexOf('verb');

				if (at < 0 || !detail.slots.includes('money')) {
					continue;
				}

				const groups = data.verbs.filter((group) => everyForm(group).includes(detail.phrases[at]));

				assert.ok(
					groups.some((group) => group.object?.includes('idea')),
					`${language}: ${detail.phrases[at]} takes no idea (${detail.sentence})`
				);
			}
		}
	});

	it('a grouped number is written the way the language groups it', () => {
		for (const language of WORD_LANGUAGES) {
			const numeral = SENTENCE_DATA[language].numeral;

			if (!numeral) {
				continue;
			}

			for (const sentence of randSentence({ language, slots: 'money', count: 40 })) {
				const digits = sentence.match(/\d[\d.,\s]*\d/)?.[0] ?? '';

				// Three digits between separators, and no other separator in sight.
				assert.match(
					digits,
					new RegExp(`^\\d{1,3}(${escapeRe(numeral.group)}\\d{3})*$`),
					`${language}: '${digits}' (${sentence})`
				);
			}
		}
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
