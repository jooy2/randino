// Internal shape of the per-language sentence datasets. Not part of the public
// API — consumers only ever see `RandSentenceOptions` and `SentenceDetail`.
//
// One dataset per language, beside `word/data` rather than inside it. The word
// pools hold nouns and the words that sit in front of them; a sentence needs
// what neither of those is — a verb in the form a sentence ends on, an adjective
// in the form a predicate takes, and the shapes the language's own grammar
// allows. So the nouns are still drawn from `word/data`, and everything a
// sentence adds to them lives here.

import type { SentenceQuote, SentenceSlot, SentenceType } from '../../_types/global.js';
import type { WordGender, WordPool } from '../../word/data/types.js';

/**
 * The kind of thing a noun names, which is what makes a sentence hold together:
 * a verb states the classes it accepts, and the nouns beside it are drawn from
 * those classes alone. `사자가 사과를 먹는다` and `사자가 철학을 먹는다` differ by
 * nothing else.
 *
 * Derived from `WordTheme`, so no noun carries a tag of its own — a theme is
 * already a slice of vocabulary, and which of these it falls into is the same in
 * every language. `THEME_CLASS` is where that map is written.
 */
export type NounClass =
	| 'creature'
	| 'person'
	| 'plant'
	| 'edible'
	| 'thing'
	| 'vehicle'
	| 'place'
	| 'event'
	| 'idea'
	| 'body';

/**
 * A form a predicate takes beside the one a plain statement ends on. `question`
 * is Korean `달리니` beside `달린다`, and English `run` beside `runs`; `polite`
 * is `달립니다`, and `politeQuestion` `달립니까`.
 *
 * A form rather than another pool: the same verbs, said differently. Every form
 * pool is index-aligned with `words`, so a verb keeps its meaning across them and
 * a word the caller required can be translated into the form the sentence needs.
 *
 * A group declares only what its language actually writes, and the lookup falls
 * back along `politeQuestion` → `polite` → `question` → `words`. That is why
 * Japanese declares `polite` alone: `走ります` is its polite question too, because
 * the `か` that asks is the frame's tag rather than part of the verb.
 */
export type PredicateForm = 'question' | 'polite' | 'politeQuestion';

/** The forms a group declares, beside the plain statement its `words` are in. */
export type PredicateForms = Partial<Record<PredicateForm, WordPool>>;

/**
 * Verbs that take the same arguments. Written as a group rather than one tagged
 * entry per verb, because the tag is the interesting part and a group of thirty
 * verbs shares one: they all say what can do the doing, and — when the verb is
 * transitive — what it can be done to.
 */
export type VerbGroup = {
	/** Classes a noun has to belong to to be the subject of these verbs. */
	subject: readonly NounClass[];
	/** Classes it can take as a direct object. Left out by an intransitive group. */
	object?: readonly NounClass[];
	/** The verbs themselves, in the form a plain statement ends on (`달린다`, `runs`). */
	words: WordPool;
	/**
	 * The same verbs in another form, index-aligned with `words`. Left out by a
	 * language whose verb does not change — Chinese, Vietnamese, Spanish, Italian
	 * and Russian ask a question with the mark alone.
	 */
	forms?: PredicateForms;
};

/**
 * Predicate adjectives that describe the same kinds of thing, grouped the way
 * verbs are. Its own pool rather than `word/data`'s `adjectives`, which are
 * written to sit in front of a noun: Korean `파란` cannot end a sentence and
 * `파랗다` cannot start a noun phrase.
 */
export type StateGroup = {
	/** Classes a noun has to belong to to be described by these. */
	subject: readonly NounClass[];
	words: WordPool;
	/** The same adjectives in another form, index-aligned with `words`. */
	forms?: PredicateForms;
};

/**
 * One phrase of a shape, with whatever the language writes around it.
 *
 * Both sides, because languages mark a phrase on either: Korean and Japanese
 * suffix a particle, English and Chinese put a preposition in front, and a
 * language can want both at once (Chinese `在` … `里`).
 */
export type SentencePart = {
	slot: SentenceSlot;
	/** Written in front of the phrase (`in`, `在`, `is`). */
	head?: string;
	/** Written after it (`가`, `が`, `里`). */
	tail?: string;
	/**
	 * Used instead of `tail` when the word in front of it ends on a consonant.
	 * That is the whole of Korean particle alternation — `사자가` beside `사슴이`
	 * — and a language whose particles do not alternate leaves it out.
	 */
	tailAlt?: string;
	/**
	 * Whether the phrase may carry a modifier when there is room for one. Off for
	 * a phrase that is already a fixed expression, which is every adverbial.
	 */
	modifiable?: boolean;
	/**
	 * Whether the phrase goes without the article the language would otherwise
	 * give it. Italian is why this exists: every Italian preposition merges with
	 * the article behind it (`in` + `la` is `nella`), so a phrase opening on one
	 * either carries the merged form or carries no article at all.
	 */
	bare?: boolean;
};

/**
 * What a shape is for. A frame with no mood is a statement, and a statement shape
 * also serves an exclamation and a sentence that trails off — those differ from
 * it by the mark and by what stands in front, not by the order of the words.
 *
 * A question is the one that can differ, and only four of the nine languages need
 * it to. The rest declare no question shape and get their statement shapes back,
 * which is the same best-effort every other narrowing here makes.
 */
export type SentenceMood = 'statement' | 'question';

/**
 * The kinds of sentence a language writes a mark of its own for.
 *
 * `dialogue` and `thought` are not among them: what they quote is a sentence of
 * one of these, so they take its mark and add the quotation marks around it.
 */
export type SentenceMark = Exclude<SentenceType, 'dialogue' | 'thought'>;

/**
 * One shape a sentence can take, written in the order the language puts it in.
 *
 * Per language rather than shared, and for the same reason a nickname's frames
 * are: Korean closes on its verb where English puts it second, and a language
 * whose articles cannot mark an object has no shape that carries one.
 */
export type SentenceFrame = {
	parts: readonly SentencePart[];
	/** How often this shape is used, against the other frames of the language. */
	weight: number;
	/** What the shape is for. Left out by a statement. */
	mood?: SentenceMood;
	/**
	 * Written after the last phrase and before the terminator, with the language's
	 * own space in front of it. That is Chinese `吗`, Japanese `か` and Vietnamese
	 * `không` — none of which is a phrase, and none of which any slot could carry.
	 */
	tag?: string;
};

/**
 * The article a noun takes, by its gender and by how the word right after the
 * article begins. Each rule is `[prefix, article]`; the first whose prefix
 * matches wins, and `''` matches anything, which is how Italian picks `l'`
 * before a vowel, `lo` before `s` plus a consonant, and `il` for the rest.
 *
 * A language whose nouns carry no gender writes every rule under `n`, which is
 * what the lookup falls back to.
 */
export type SentenceArticles = {
	[gender in WordGender]?: readonly (readonly [string, string])[];
};

/**
 * The subject pronoun a later sentence refers to the topic with, by the topic's
 * gender. Nominative only, because a subject is never in another case.
 *
 * `''` is a real entry and means the language writes no subject at all, which is
 * what Korean, Japanese, Chinese, Spanish and Italian actually do in a second
 * sentence about the same thing. The lookup falls back to `n` the way
 * `SentenceArticles` does, so a language whose pronoun does not inflect writes
 * one rule.
 */
export type SentencePronouns = {
	[gender in WordGender]?: WordPool;
};

/**
 * How a language writes a number beside a noun, and beside money.
 *
 * Left out by a language that cannot write either correctly, which is what
 * German and Russian do: both would need a case their nouns change their own
 * ending for, the same reason neither declares an object shape.
 */
export type SentenceNumeral = {
	/**
	 * Where the number stands relative to the noun it counts. Korean, Japanese and
	 * Chinese put it behind (`사과 12 개`); Vietnamese puts it in front, classifier
	 * and all (`12 con mèo`).
	 */
	order: 'before' | 'after';
	/**
	 * The counter each kind of noun takes, which is what the noun classes were
	 * worth having for: `마리` for a creature, `명` for a person, `대` for a vehicle.
	 *
	 * A classifier is also what makes an abstract noun countable at all — `슬픔 12
	 * 가지` is twelve kinds of sadness — so a language with this table can count
	 * anything in its pools. English, Spanish and Italian have no such word and
	 * would need a plural, and a plural of `sadness` is not a thing anyone writes;
	 * that is why they declare `counters` empty and no counted shape.
	 */
	counters: Partial<Record<NounClass, string>>;
	/** How many of a counted thing, at the fewest and at the most. */
	count: readonly [number, number];
	/**
	 * What money is written in, after the amount (`원`, `dollars`, `円`). Joined by
	 * the language's own space, which is none at all in Japanese and Chinese.
	 */
	currency: string;
	/**
	 * The amounts the language writes, as a pool rather than a range. A range would
	 * hand back `73,412 dollars`, and nobody writes that; these are the round
	 * numbers a sentence actually names.
	 */
	amounts: readonly number[];
	/**
	 * What separates the thousands. `,` in English, Korean, Japanese and Chinese;
	 * `.` in Vietnamese, Spanish and Italian.
	 */
	group: string;
};

export type SentenceLanguageData = {
	/**
	 * Placed between the phrases, and between the words inside one. A space in
	 * every language that writes one, and nothing in Japanese and Chinese.
	 *
	 * Not `word/data`'s `joiner`, which runs a nickname's words together on
	 * purpose: `멋진사자` is a handle, and `멋진 사자가 달린다` is a sentence.
	 */
	space: string;
	/** Whether the sentence opens on a capital letter. */
	capitalize: boolean;
	/** What a sentence of each kind closes on. */
	terminators: Record<SentenceMark, string>;
	/**
	 * What it opens on, for a language that marks the kind at both ends. Spanish
	 * `¿` and `¡` are the only ones here, and every other language leaves it out.
	 */
	openers?: Partial<Record<SentenceMark, string>>;
	/**
	 * The two levels of quotation marks the language writes, as `[open, close]`.
	 *
	 * Per language and not close to universal: Japanese writes `「」` and `『』`,
	 * German opens low and closes high (`„…“`), and Spanish, Italian and Russian
	 * reach for guillemets before anything else.
	 */
	quotes: Record<SentenceQuote, readonly [string, string]>;
	/** The article a noun phrase opens with. Left out by a language with no articles. */
	articles?: SentenceArticles;
	/**
	 * Whether a predicate adjective agrees with its subject the way an attributive
	 * one does. Spanish, Italian and Russian inflect both; German inflects only
	 * the attributive form, so `der Wal ist blau` keeps the base word.
	 */
	predicateAgrees?: boolean;
	verbs: readonly VerbGroup[];
	states: readonly StateGroup[];
	/** How something is done, written as the language writes it (`조용히`, `quietly`). */
	manners: WordPool;
	/** When it happens, written whole, particle and all (`새벽에`, `at dawn`). */
	times: WordPool;
	/**
	 * What a sentence opens on when it follows another one of the same result
	 * (`그리고`, `and then`, `そして`). Written whole, so a language that needs a
	 * comma after it writes the comma.
	 */
	connectives: WordPool;
	/** How a later sentence refers to the topic without naming it again. */
	pronouns: SentencePronouns;
	/**
	 * What an exclamation opens on (`와,`, `Wow,`, `ああ、`). Written whole, comma
	 * and all, because where the comma goes is the language's business.
	 *
	 * Exclamations alone: a statement that opened on one would be reading itself
	 * aloud, and a question has its own mark to do the work.
	 */
	interjections: WordPool;
	/**
	 * Noun classes the language's written pronouns are wrong for. A sentence about
	 * one of them leaves the subject out where the language can, and names the
	 * topic again where it cannot.
	 *
	 * English is the reason it exists: `he` and `she` need a person's gender,
	 * which a job noun does not carry, and `they` needs a plural verb the pools
	 * are not written in — so an English sentence about a person names it again.
	 * The languages whose written pronoun is inanimate — `그것`, `それ`, `它`, `nó`
	 * — list `person` too, and drop the subject instead, which is what they would
	 * do anyway. Omitted by a language whose pronouns stand for anything.
	 */
	pronounless?: readonly NounClass[];
	/**
	 * How the language writes a number. Left out by one that cannot, which then
	 * declares no `quantity` and no `money` shape either.
	 */
	numeral?: SentenceNumeral;
	frames: readonly SentenceFrame[];
};
