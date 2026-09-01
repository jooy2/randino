// Internal shape of the per-language nickname datasets. Not part of the public
// API — consumers only ever see `RandomNicknameOptions` / `NicknameDetail`.

import type { NicknameTheme } from '../../_types/global.js';

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

export type NicknameLanguageData = {
	// Joins the parts of one nickname. '' everywhere so far — Korean and CJK words
	// run together, and alphabetic parts read as CamelCase (BraveLion).
	joiner: string;
	// Whether each part should be capitalized. Meaningless for CJK scripts.
	capitalize: boolean;
	// Words a nickname is built around, grouped by theme. Deliberately common
	// nouns — never person names.
	nouns: Record<NicknameTheme, WordPool>;
	// Words that decorate the noun, in the form that can precede it directly
	// (Korean attributive: 멋진, Japanese: 青い / 静かな).
	modifiers: WordPool;
	// Optional trailing noun for compounds (고양이 + 꼬리). Languages that would
	// need a particle or a different word order for this leave it out, and the
	// compound patterns are then skipped for them.
	parts?: WordPool;
	syn: WordSynthesis;
};
