import { clamp } from '../_internal/utils.js';
import { RAND_LENGTH_MAX, RAND_LENGTH_MIN } from '../constants.js';
import type { WordLanguageOption, WordThemeOption } from '../_types/global.js';
import { WORD_LANGUAGES } from './data/index.js';
import { naturalRange } from './wordGenerator.js';

/**
 * Shortest and longest word the language's pools hold, in characters, which is
 * what `randWord` falls back to when `minLength` or `maxLength` is omitted.
 * Narrowing the theme narrows the range, because a theme is a pool of its own.
 *
 * @example
 * wordLengthRange('ko'); // [1, 5]
 * wordLengthRange('ko', 'animal'); // [2, 4]
 * wordLengthRange('en'); // [2, 12]
 */
export function wordLengthRange(
	language: WordLanguageOption = 'all',
	theme: WordThemeOption = 'all'
): [number, number] {
	const languages = language === 'all' ? WORD_LANGUAGES : [language];
	let min = Infinity;
	let max = 0;

	for (const code of languages) {
		const [low, high] = naturalRange(code, theme);

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [
		clamp(min, RAND_LENGTH_MIN, RAND_LENGTH_MAX),
		clamp(max, RAND_LENGTH_MIN, RAND_LENGTH_MAX)
	];
}
