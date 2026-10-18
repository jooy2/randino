import { clamp } from '../_internal/utils.js';
import { RAND_LENGTH_MAX, RAND_LENGTH_MIN } from '../constants.js';
import type { WordLanguageOption, WordThemeOption } from '../_types/global.js';
import { WORD_LANGUAGES, WORD_THEMES, resolveTheme, resolveWordLanguage } from './data/index.js';
import { WORD_LENGTHS } from './data/lengths.js';

/**
 * Shortest and longest word the language's pools hold, in characters, which is
 * what `randWord` falls back to when `minLength` or `maxLength` is omitted.
 * Narrowing the theme narrows the range, because a theme is a pool of its own.
 *
 * @example
 * wordLengthRange('ko'); // [1, 4]
 * wordLengthRange('ko', 'animal'); // [1, 4]
 * wordLengthRange('en'); // [3, 11]
 */
export function wordLengthRange(
	language: WordLanguageOption = 'all',
	theme: WordThemeOption = 'all'
): [number, number] {
	const wanted = resolveWordLanguage(language);
	const languages = wanted === 'all' ? WORD_LANGUAGES : [wanted];
	const slice = resolveTheme(theme);
	const themes = slice === 'all' ? WORD_THEMES : [slice];
	let min = Infinity;
	let max = 0;

	// Read from a table rather than from the pools, so that the two numbers do not
	// bring every pool into a bundle with them.
	for (const code of languages) {
		for (const each of themes) {
			const [low, high] = WORD_LENGTHS[code][each];

			min = Math.min(min, low);
			max = Math.max(max, high);
		}
	}

	return [
		clamp(min, RAND_LENGTH_MIN, RAND_LENGTH_MAX),
		clamp(max, RAND_LENGTH_MIN, RAND_LENGTH_MAX)
	];
}
