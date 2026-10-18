// How a fictional name or place is written in every language at once.
//
// A fictional name is made up in Latin letters, and every other language writes
// it by its sound: `Artemis` is `아르테미스`, `アルテミス`, `阿尔忒弥斯` and
// `Артемис`. Five scripts cover the nine word languages, because English,
// Vietnamese, Spanish, Italian and German all keep a made-up name the way it is
// spelled. So every entry of the fictional datasets is one spelling per script,
// and a language only has to say which script it reads.

import { rows } from '../_internal/parse.js';
import { capitalizeFirst } from '../_internal/utils.js';
import type { WordLanguage } from '../_types/global.js';

/** One word in each of the five scripts: Latin, Hangul, katakana, hanzi and Cyrillic. */
export type Spelling = readonly [latin: string, ko: string, ja: string, zh: string, ru: string];

/** Where each script sits in a `Spelling`. */
export const LATIN = 0;
export const HANGUL = 1;
export const KANA = 2;
export const HAN = 3;
export const CYRILLIC = 4;

/** The script each word language writes a fictional name in. */
export const SCRIPT_OF: Readonly<Record<WordLanguage, number>> = {
	en: LATIN,
	vi: LATIN,
	es: LATIN,
	it: LATIN,
	de: LATIN,
	ko: HANGUL,
	ja: KANA,
	zh: HAN,
	ru: CYRILLIC
};

/**
 * What sits between a given name and a surname in each script. Japanese and
 * Chinese write a foreign name's parts apart with a dot of their own, where
 * every other script leaves a space: `エララ・ブラックウッド`, `埃拉拉·布莱克伍德`.
 */
export const NAME_JOINERS: readonly string[] = [' ', ' ', '・', '·', ' '];

/** One row of a table whose last five cells are a spelling, and what comes before them. */
export type SpelledRow = { readonly cells: readonly string[]; readonly spelling: Spelling };

/** Split a table whose rows end on the five spellings of one word. */
export function spelledRows(source: string): SpelledRow[] {
	return rows(source).map((cells) => {
		const at = cells.length - 5;

		return {
			cells: cells.slice(0, at),
			spelling: [cells[at], cells[at + 1], cells[at + 2], cells[at + 3], cells[at + 4]]
		};
	});
}

// Hangul syllables are composed as (initial * 21 + vowel) * 28 + final, so a
// syllable with no final consonant is a multiple of 28 from the base, and the
// liquid `ㄹ` is the eighth final.
const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const HANGUL_FINALS = 28;
const HANGUL_LIQUID = 8;

/**
 * `left` and `right` joined into one Korean word, for parts of one word written
 * apart: `에드` and `린` are `에들린`, `아` and `리아` are `알리아`.
 *
 * Korean writes an English `l` between vowels, or after a consonant written with
 * a vowel of its own, as a doubled `ㄹ`: `Alice` is `앨리스` and `Hartley` is
 * `하틀리`. A part that starts with `l` is spelled for a word that starts there,
 * so the `ㄹ` it needs in front is added to the syllable before it, when that
 * syllable has no final consonant to stand in the way. An `r` keeps a single
 * `ㄹ` (`이스라`), which is why the rule asks the Latin spelling and not the
 * Hangul one.
 */
function joinHangul(left: string, rightLatin: string, right: string): string {
	const code = left.codePointAt(left.length - 1) ?? 0;
	const open =
		code >= HANGUL_BASE && code <= HANGUL_LAST && (code - HANGUL_BASE) % HANGUL_FINALS === 0;

	if (open && rightLatin.toLowerCase().startsWith('l')) {
		return left.slice(0, -1) + String.fromCodePoint(code + HANGUL_LIQUID) + right;
	}

	return left + right;
}

/**
 * Whether two parts make one word that every script can write by joining them.
 *
 * A part ending on the letter the next one starts with is spelled double in
 * English and written once in the other scripts — `Kallis` is `カリス`, never
 * `カルリス` — so the two cannot be joined part by part. Nor can an `sh` meet an
 * `l`, which Korean writes as one sound of its own: `Ashley` is `애슐리`, and
 * `애시` and `리` make `애실리`. And an open syllable is not followed by one that
 * starts the same way, which reads as a stutter (`Lalan`, `Raria`).
 */
export function joinable(left: string, right: string): boolean {
	const end = left.toLowerCase();
	const start = right.toLowerCase();

	if (!end || !start || end.slice(-1) === start.charAt(0)) {
		return false;
	}

	if (/[aeiouy]$/.test(end) && end.charAt(0) === start.charAt(0)) {
		return false;
	}

	return !(end.endsWith('sh') && start.startsWith('l'));
}

/**
 * Parts joined into one word in every script. Each part is written for where it
 * sits, so the Latin and Cyrillic words only need their first letter raised.
 */
export function joinParts(parts: readonly Spelling[]): Spelling {
	let [latin, hangul, kana, han, cyrillic] = parts[0];

	for (let i = 1; i < parts.length; i += 1) {
		const part = parts[i];

		hangul = joinHangul(hangul, part[LATIN], part[HANGUL]);
		latin += part[LATIN];
		kana += part[KANA];
		han += part[HAN];
		cyrillic += part[CYRILLIC];
	}

	return [
		capitalizeFirst(latin.toLowerCase()),
		hangul,
		kana,
		han,
		capitalizeFirst(cyrillic.toLowerCase())
	];
}

/** Whether `text` starts with `prefix`, ignoring case. An empty prefix matches anything. */
export function leadsWith(text: string, prefix: string): boolean {
	return !prefix || text.toLowerCase().startsWith(prefix.toLowerCase());
}

/** How far a length is from a range, an overshoot counting half a character worse. */
export function missBy(length: number, low: number, high: number): number {
	return length < low ? low - length : length > high ? length - high + 0.5 : 0;
}

/**
 * The entries of `pool` whose text is between `low` and `high` characters long,
 * or the closest ones when none is. `textOf` is the text that is measured.
 */
export function fitting<T>(
	pool: readonly T[],
	textOf: (entry: T) => string,
	low: number,
	high: number
): T[] {
	let best = Infinity;
	let closest: T[] = [];

	for (const entry of pool) {
		const miss = missBy(textOf(entry).length, low, high);

		if (miss < best) {
			best = miss;
			closest = [entry];
		} else if (miss === best) {
			closest.push(entry);
		}
	}

	return closest;
}

/** The shortest and the longest text of a pool, in characters, `[0, 0]` for none. */
export function spanOf(texts: readonly string[]): [number, number] {
	if (!texts.length) {
		return [0, 0];
	}

	let low = Infinity;
	let high = 0;

	for (const text of texts) {
		low = Math.min(low, text.length);
		high = Math.max(high, text.length);
	}

	return [low, high];
}
