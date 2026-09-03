// Internal shape of the per-language word datasets. Not part of the public API —
// consumers only ever see the options types and the two details.
//
// One dataset per language rather than one per generator: `randWord` and its
// twenty-five themed forms draw from `nouns`, `randModifier` draws from
// `adjectives` and `actions`, and `randNickname` puts them together in the
// shapes `frames` allows. The pools are the same words either way, so they are
// written once.

import type { WordTheme } from '../../_types/global.js';

export type WordPool = readonly string[];

/**
 * The gender a noun carries in a language whose modifiers agree with it. Only
 * those languages tag their nouns; the rest leave the lookup out entirely.
 */
export type WordGender = 'm' | 'f' | 'n';

/**
 * How a modifier written in its base form changes to agree with a noun of a
 * given gender. Each rule is `[ending, replacement]`; the first whose ending
 * matches wins, and a modifier no rule matches is already in the right form
 * (Spanish `azul` is the same beside `gato` and `luna`).
 *
 * Rules rather than a function so that the three packages compare as data
 * rather than as three copies of the same branch — see `tools/parity`.
 */
export type WordAgreement = {
	[gender in WordGender]?: readonly (readonly [string, string])[];
};

/**
 * How a word is built when `realism` calls for an invented one:
 * - `syllable`: onset + vowel + coda, for alphabetic scripts (Blorin).
 * - `pool`: pick N whole syllables or characters, for scripts where one character
 *   is already a syllable (뮤겔, 星霧).
 */
export type WordSynthesis =
	| {
			kind: 'syllable';
			onset: WordPool;
			vowel: WordPool;
			coda: WordPool;
			minSyllables: number;
			maxSyllables: number;
	  }
	| { kind: 'pool'; pool: WordPool; minSyllables: number; maxSyllables: number };

/** What one word does inside a nickname. */
export type WordSlot = 'adjective' | 'action' | 'noun' | 'part';

/**
 * One shape a nickname can take, written in the order the language puts it in.
 *
 * Per language rather than shared, because the shapes themselves differ: Chinese
 * needs 的 between a verb and its noun where Korean needs nothing, and a
 * language with no possessive particle has no possessive shape at all.
 */
export type WordFrame = {
	/** The words to draw, in order. */
	slots: readonly WordSlot[];
	/**
	 * A particle for each gap, so one entry shorter than `slots`, and left out
	 * entirely where every gap is empty. It attaches to the word in front of it,
	 * which is what puts a `wordSeparator` after it rather than around it
	 * (`사자의 눈물`, never `사자 의 눈물`).
	 */
	glue?: readonly string[];
	/** How often this shape is used, against the other frames of the language. */
	weight: number;
};

export type WordLanguageData = {
	// Joins words that are put together. '' everywhere so far — Korean and CJK
	// words run together, and alphabetic ones read as CamelCase (BraveLion).
	joiner: string;
	// Whether each word should be capitalized. Meaningless for CJK scripts.
	capitalize: boolean;
	// The words themselves, grouped by theme. Deliberately common nouns — never
	// person names.
	nouns: Record<WordTheme, WordPool>;
	// The gender of each noun, for a language whose modifiers agree with it.
	// Written as a `gato:m` tag on the pool and split out by `taggedNouns`, so
	// each word is still typed once.
	nounGender?: Record<string, WordGender>;
	// How a modifier is reshaped to agree with the noun it sits beside. Left out
	// by a language that asks for no agreement, which is most of them.
	agreement?: WordAgreement;
	// Words that say what the noun is like, in the form that can sit straight in
	// front of it (Korean attributive: 멋진, Japanese: 青い / 静かな). A handful of
	// them are nouns used attributively (별빛, Marble); they describe all the
	// same, so they live here rather than in a third pool.
	adjectives: WordPool;
	// Words that say what the noun is doing, in that same attributive form
	// (웃는, Laughing, 踊る). Kept apart from `adjectives` because the two are
	// different grammar: a language may need something between an action and its
	// noun where an adjective needs nothing (Chinese 奔跑的狮子), and only an
	// action can become a predicate.
	actions: WordPool;
	// Trailing noun for compounds (고양이 + 꼬리, 狮子 + 的 + 眼泪), used by
	// nicknames only. A language with no frame that asks for one leaves it out.
	parts?: WordPool;
	// The shapes a nickname of this language can take. Every language has to
	// declare its own: a shape is only as natural as the grammar behind it.
	frames: readonly WordFrame[];
	syn: WordSynthesis;
};
