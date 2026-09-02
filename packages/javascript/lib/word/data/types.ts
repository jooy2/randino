// Internal shape of the per-language word datasets. Not part of the public API —
// consumers only ever see the options types and the two details.
//
// One dataset per language rather than one per generator: `randWord` and its
// fourteen themed forms draw from `nouns`, `randModifier` draws from
// `modifiers`, and `randNickname` puts the two together and adds `parts`. The
// pools are the same words either way, so they are written once.

import type { WordTheme } from '../../_types/global.js';

export type WordPool = readonly string[];

/**
 * How invented words are built at the abstract end of the style range:
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

export type WordLanguageData = {
	// Joins words that are put together. '' everywhere so far — Korean and CJK
	// words run together, and alphabetic ones read as CamelCase (BraveLion).
	joiner: string;
	// Whether each word should be capitalized. Meaningless for CJK scripts.
	capitalize: boolean;
	// The words themselves, grouped by theme. Deliberately common nouns — never
	// person names.
	nouns: Record<WordTheme, WordPool>;
	// Words that decorate a noun, in the form that can precede it directly
	// (Korean attributive: 멋진, Japanese: 青い / 静かな). `randModifier` draws
	// from here, and so does the nickname generator's modifier slot.
	modifiers: WordPool;
	// Optional trailing noun for compounds (고양이 + 꼬리), used by nicknames
	// only. Languages that would need a particle or a different word order for
	// this leave it out, and the compound patterns are then skipped for them.
	parts?: WordPool;
	syn: WordSynthesis;
};
