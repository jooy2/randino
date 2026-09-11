// Which language a piece of text is written in, judged by its script alone.
// Internal — it answers one narrow question, for the decorators that have to
// match a value they were handed rather than one they generated, and for the
// `startsWith` that has to be a character the language actually writes.

import type { WordLanguage } from '../_types/global.js';

const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const HAN = /[一-鿿]/;
const CYRILLIC = /\p{Script=Cyrillic}/u;
const LATIN = /\p{Script=Latin}/u;
// Vietnamese shares the Latin alphabet with English, and is told apart by the
// letters and tone marks English never uses. A Vietnamese word carrying none of
// them reads as English, which is the most a single word can be asked to say.
const VIETNAMESE = /[À-ɏẠ-ỹ]/;

/**
 * The word language `text` is written in. Han characters are read as Chinese
 * unless kana appear alongside them, which is the only signal a single word
 * carries; Cyrillic is Russian, a Latin word with Vietnamese marks on it is
 * Vietnamese, and anything else is English.
 *
 * Spanish, Italian and German share the Latin alphabet with English and with
 * each other, so no script tells them apart — a caller who wants one of those
 * names it. `randModifier` asks their pools instead, which is a question about
 * the word rather than about its script and so does not belong here.
 */
export function detectLanguage(text: string): WordLanguage {
	if (HANGUL.test(text)) return 'ko';
	if (KANA.test(text)) return 'ja';
	if (HAN.test(text)) return 'zh';
	if (CYRILLIC.test(text)) return 'ru';
	if (VIETNAMESE.test(text)) return 'vi';

	return 'en';
}

// The scripts the nine languages are written in. Both `NameLanguage` and
// `WordLanguage` are the same nine codes, so one table answers for both.
//
// Written out rather than read off the pools because no pool answers it
// reliably: Japanese nouns are kanji and katakana at once, so the first entry of
// a pool says nothing about the rest of it.
const SCRIPTS: Record<string, readonly RegExp[]> = {
	en: [LATIN],
	ko: [HANGUL],
	ja: [KANA, HAN],
	zh: [HAN],
	vi: [LATIN],
	es: [LATIN],
	it: [LATIN],
	de: [LATIN],
	ru: [CYRILLIC]
};

/**
 * Whether `language` writes the script `text` is in, which is what a requested
 * first character has to be before a generator can lead anything with it.
 *
 * A character from another script is one the language can never begin a word
 * with, and putting it there anyway is how `randName({ language: 'ko',
 * startsWith: 'Q' })` used to answer `Q대겸` — a Latin letter glued to a Korean
 * given name, in two scripts and in neither language.
 */
export function writesScript(language: string, text: string): boolean {
	const scripts = SCRIPTS[language];

	return !text || !scripts ? true : scripts.some((script) => script.test(text));
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

// The final consonant `ㄹ` is the eighth of the twenty-seven a syllable can close
// on, and the one Korean treats as a vowel for one particle: `마을로`, never
// `마을으로`.
const HANGUL_LIQUID = 8;

/**
 * Whether `text` ends on the Korean liquid `ㄹ`, which is the one coda the
 * particle `로` does not alternate for: `시장으로` and `마을로`, both from one
 * particle. Anything that is not a Hangul syllable reports `false`.
 */
export function endsWithLiquid(text: string): boolean {
	const last = text.trim().slice(-1);
	const code = last ? last.codePointAt(0)! : 0;

	return (
		code >= HANGUL_BASE &&
		code <= HANGUL_LAST &&
		(code - HANGUL_BASE) % HANGUL_FINALS === HANGUL_LIQUID
	);
}
