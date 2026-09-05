// Internal shape of the per-language sentence datasets. Not part of the public
// API — consumers only ever see `RandSentenceOptions` and `SentenceDetail`.
//
// One dataset per language, beside `word/data` rather than inside it. The word
// pools hold nouns and the words that sit in front of them; a sentence needs
// what neither of those is — a verb in the form a sentence ends on, an adjective
// in the form a predicate takes, and the shapes the language's own grammar
// allows. So the nouns are still drawn from `word/data`, and everything a
// sentence adds to them lives here.

import type { SentenceSlot } from '../../_types/global.js';
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
	/** What the sentence closes on. */
	terminator: string;
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
	frames: readonly SentenceFrame[];
};
