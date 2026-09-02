import { clamp } from '../_internal/utils.js';
import { RAND_LENGTH_MAX, RAND_LENGTH_MIN } from '../constants.js';
import type { WordLanguageOption } from '../_types/global.js';
import { WORD_LANGUAGES } from '../word/data/index.js';
import { naturalRange } from './nicknameGenerator.js';

/**
 * Every nickname length the language can produce, in characters, which is what
 * `randNickname` falls back to when `minLength` or `maxLength` is omitted. The
 * lower end is a bare noun and the upper end a modifier, a noun and a trailing
 * word together, so the range is wide on purpose — the shape of each nickname is
 * picked inside it. A `wordSeparator` widens it by what it adds between the
 * words.
 *
 * @example
 * nicknameLengthRange('ko'); // [1, 12]
 * nicknameLengthRange('en'); // [3, 30]
 * nicknameLengthRange('ko', '-'); // [1, 14]
 */
export function nicknameLengthRange(
	language: WordLanguageOption = 'all',
	wordSeparator?: string
): [number, number] {
	const languages = language === 'all' ? WORD_LANGUAGES : [language];
	let min = Infinity;
	let max = 0;

	for (const code of languages) {
		const [low, high] = naturalRange(code, wordSeparator);

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [
		clamp(min, RAND_LENGTH_MIN, RAND_LENGTH_MAX),
		clamp(max, RAND_LENGTH_MIN, RAND_LENGTH_MAX)
	];
}
