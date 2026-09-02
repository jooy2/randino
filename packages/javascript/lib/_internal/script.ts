// Which language a piece of text is written in, judged by its script alone.
// Internal — it answers one narrow question, for the decorators that have to
// match a value they were handed rather than one they generated.

import type { WordLanguage } from '../_types/global.js';

const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const HAN = /[一-鿿]/;

/**
 * The word language `text` is written in. Han characters are read as Chinese
 * unless kana appear alongside them, which is the only signal a single word
 * carries; anything else is English.
 */
export function detectLanguage(text: string): WordLanguage {
	if (HANGUL.test(text)) return 'ko';
	if (KANA.test(text)) return 'ja';
	if (HAN.test(text)) return 'zh';

	return 'en';
}
