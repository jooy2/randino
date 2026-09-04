// Which language a piece of text is written in, judged by its script alone.
// Internal — it answers one narrow question, for the decorators that have to
// match a value they were handed rather than one they generated.

import type { WordLanguage } from '../_types/global.js';

const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const HAN = /[一-鿿]/;
// Vietnamese shares the Latin alphabet with English, and is told apart by the
// letters and tone marks English never uses. A Vietnamese word carrying none of
// them reads as English, which is the most a single word can be asked to say.
const VIETNAMESE = /[\u00C0-\u024F\u1EA0-\u1EF9]/;

/**
 * The word language `text` is written in. Han characters are read as Chinese
 * unless kana appear alongside them, which is the only signal a single word
 * carries; a Latin word with Vietnamese marks on it is Vietnamese, and anything
 * else is English.
 */
export function detectLanguage(text: string): WordLanguage {
	if (HANGUL.test(text)) return 'ko';
	if (KANA.test(text)) return 'ja';
	if (HAN.test(text)) return 'zh';
	if (VIETNAMESE.test(text)) return 'vi';

	return 'en';
}

// Hangul syllables are composed as (initial * 21 + vowel) * 28 + final, so the
// remainder is the final consonant, and 0 means there is none.
const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const HANGUL_FINALS = 28;

const VOWELS = /[aeiouàáâãäåèéêëìíîïòóôõöùúûüыаеёиоуэюяıəăâêôơư]/;

/**
 * Whether `text` ends on a consonant, which is what a language whose particles
 * alternate needs to know: Korean writes `사자가` and `사슴이` for the same
 * particle, by whether the syllable in front of it closes on one.
 *
 * Answered by the script rather than per language. A Hangul syllable carries its
 * final consonant in its code point; a Latin or Cyrillic word is judged by its
 * last letter; a script that writes no vowels of its own — Han, kana — has no
 * answer to give and reports `false`, which is also what its particles need,
 * since they do not alternate.
 */
export function endsWithConsonant(text: string): boolean {
	const last = text.trim().slice(-1);

	if (!last) {
		return false;
	}

	const code = last.codePointAt(0)!;

	if (code >= HANGUL_BASE && code <= HANGUL_LAST) {
		return (code - HANGUL_BASE) % HANGUL_FINALS !== 0;
	}

	return /\p{Letter}/u.test(last) && !VOWELS.test(last.toLowerCase());
}
