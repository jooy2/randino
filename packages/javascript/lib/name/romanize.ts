// Turns a native name into its "English pronunciation". Every language does this
// with plain data — the package has no runtime dependencies:
// - Latin scripts strip their diacritics (José -> Jose, Müller -> Muller).
// - Cyrillic is transliterated character by character.
// - Hangul follows the Revised Romanization of Korean, including the sound
//   changes that happen between syllables (석민 -> seongmin, not seokmin).
// - Japanese and Chinese carry the reading on each token, so nothing to do here.

import { capitalizeFirst } from '../_internal/utils.js';
import { KO_SURNAME_ROMAN } from './data/ko.js';
import type { RomanMode } from './data/types.js';

const DIACRITIC = /\p{Diacritic}/gu;

/** ASCII-fold a Latin-script string (José -> Jose, Müller -> Muller, Đỗ -> Do). */
export function fold(value: string): string {
	return value
		.normalize('NFD')
		.replace(DIACRITIC, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
		.replace(/ß/g, 'ss');
}

const CYRILLIC_MAP: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ё: 'yo',
	ж: 'zh',
	з: 'z',
	и: 'i',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'kh',
	ц: 'ts',
	ч: 'ch',
	ш: 'sh',
	щ: 'shch',
	ъ: '',
	ы: 'y',
	ь: '',
	э: 'e',
	ю: 'yu',
	я: 'ya'
};

/** Char-level Cyrillic -> Latin transliteration, preserving initial capitals. */
export function translit(value: string): string {
	let out = '';

	for (const char of value) {
		const lower = char.toLowerCase();
		const base = CYRILLIC_MAP[lower] ?? char;

		out += char === lower ? base : capitalizeFirst(base);
	}

	return out;
}

// --- Hangul -----------------------------------------------------------------

const HANGUL_FIRST = 0xac00;
const HANGUL_LAST = 0xd7a3;

// Indexed by jamo position within a composed syllable.
const ONSET = [
	'g',
	'kk',
	'n',
	'd',
	'tt',
	'r',
	'm',
	'b',
	'pp',
	's',
	'ss',
	'',
	'j',
	'jj',
	'ch',
	'k',
	't',
	'p',
	'h'
];

const NUCLEUS = [
	'a',
	'ae',
	'ya',
	'yae',
	'eo',
	'e',
	'yeo',
	'ye',
	'o',
	'wa',
	'wae',
	'oe',
	'yo',
	'u',
	'wo',
	'we',
	'wi',
	'yu',
	'eu',
	'ui',
	'i'
];

const CODA = [
	'',
	'k',
	'k',
	'k',
	'n',
	'n',
	'n',
	't',
	'l',
	'k',
	'm',
	'l',
	'l',
	'l',
	'p',
	'l',
	'm',
	'p',
	'p',
	't',
	't',
	'ng',
	't',
	't',
	'k',
	't',
	'p',
	't'
];

// A final consonant in front of a vowel moves into the next syllable's onset.
// `[keep, moved]`: complex finals leave their first half behind (닭이 -> dalgi),
// and a silent ㅎ moves nothing (좋아 -> joa).
const LIAISON: readonly (readonly [string, string])[] = [
	['', ''],
	['', 'g'],
	['', 'kk'],
	['k', 's'],
	['', 'n'],
	['n', 'j'],
	['', 'n'],
	['', 'd'],
	['', 'r'],
	['l', 'g'],
	['l', 'm'],
	['l', 'b'],
	['l', 's'],
	['l', 't'],
	['l', 'p'],
	['', 'r'],
	['', 'm'],
	['', 'b'],
	['p', 's'],
	['', 's'],
	['', 'ss'],
	['ng', ''],
	['', 'j'],
	['', 'ch'],
	['', 'k'],
	['', 't'],
	['', 'p'],
	['', '']
];

// Onset indexes worth branching on.
const ONSET_N = 2;
const ONSET_R = 5;
const ONSET_M = 6;
const ONSET_EMPTY = 11;

// Final consonants grouped by the sound they end on, which is what the
// assimilation rules key off.
const CODA_K = new Set([1, 2, 3, 9, 24]);
const CODA_T = new Set([7, 19, 20, 22, 23, 25, 27]);
const CODA_P = new Set([14, 17, 18, 26]);
const CODA_L = new Set([8, 11, 12, 13, 15]);
const CODA_NASAL = new Set([10, 16, 21]);
// Finals containing ㅎ, which aspirates the following consonant (좋고 -> joko).
const CODA_H: Record<number, string> = { 6: 'n', 15: 'l', 27: '' };
const ASPIRATED: Record<number, string> = { 0: 'k', 3: 't', 9: 'ss', 12: 'ch' };

type Syllable = { onset: number; nucleus: number; coda: number };

function decompose(char: string): Syllable | null {
	const code = char.codePointAt(0) ?? 0;

	if (code < HANGUL_FIRST || code > HANGUL_LAST) {
		return null;
	}

	const offset = code - HANGUL_FIRST;

	return {
		onset: Math.floor(offset / 588),
		nucleus: Math.floor((offset % 588) / 28),
		coda: offset % 28
	};
}

/**
 * Romanize one final consonant against the syllable that follows it. Returns the
 * sound the current syllable ends on plus an onset override for the next one.
 */
function romanizeCoda(coda: number, next: Syllable | null): readonly [string, string | null] {
	if (coda === 0) {
		return ['', null];
	}

	if (!next) {
		return [CODA[coda], null];
	}

	const onset = next.onset;

	// A vowel-initial syllable pulls the final consonant across.
	if (onset === ONSET_EMPTY) {
		const [keep, moved] = LIAISON[coda];
		return [keep, moved];
	}

	// ㅎ in the final aspirates the next consonant (놓다 -> nota).
	if (coda in CODA_H && onset in ASPIRATED) {
		return [CODA_H[coda], ASPIRATED[onset]];
	}

	// Nasalization: a stop in front of ㄴ or ㅁ becomes the matching nasal.
	if (onset === ONSET_N || onset === ONSET_M) {
		if (CODA_K.has(coda)) return ['ng', null];
		if (CODA_T.has(coda)) return ['n', null];
		if (CODA_P.has(coda)) return ['m', null];
		// ㄹ + ㄴ assimilates the other way around (실내 -> sillae).
		if (CODA_L.has(coda) && onset === ONSET_N) return ['l', 'l'];

		return [CODA[coda], null];
	}

	// ㄹ either doubles after another ㄹ (별로 -> byeollo) or turns into ㄴ.
	if (onset === ONSET_R) {
		if (CODA_L.has(coda)) return ['l', 'l'];
		if (coda === 4) return ['l', 'l'];
		if (CODA_K.has(coda)) return ['ng', 'n'];
		if (CODA_T.has(coda)) return ['n', 'n'];
		if (CODA_P.has(coda)) return ['m', 'n'];
		if (CODA_NASAL.has(coda)) return [CODA[coda], 'n'];
	}

	return [CODA[coda], null];
}

/**
 * Romanize Hangul text with the Revised Romanization of Korean. Characters that
 * are not composed Hangul syllables are passed through untouched.
 */
export function romanizeHangul(text: string): string {
	const chars = [...text];
	const syllables = chars.map(decompose);
	let out = '';
	let override: string | null = null;

	for (let i = 0; i < chars.length; i += 1) {
		const current = syllables[i];

		if (!current) {
			out += chars[i];
			override = null;
			continue;
		}

		const [coda, nextOnset] = romanizeCoda(current.coda, syllables[i + 1] ?? null);

		out += (override ?? ONSET[current.onset]) + NUCLEUS[current.nucleus] + coda;
		override = nextOnset;
	}

	return out;
}

// --- Entry point ------------------------------------------------------------

/** Romanize a native name part according to its language's romanization mode. */
export function romanize(mode: RomanMode, value: string, part: 'surname' | 'given'): string {
	switch (mode) {
		case 'fold':
			return fold(value);
		case 'translit':
			return translit(value);
		case 'hangul':
			return part === 'surname'
				? (KO_SURNAME_ROMAN[value] ?? capitalizeFirst(romanizeHangul(value)))
				: capitalizeFirst(romanizeHangul(value));
		case 'token':
		default:
			return value;
	}
}
