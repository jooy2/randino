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
