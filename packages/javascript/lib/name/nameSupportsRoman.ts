import type { NameLanguageOption } from '../_types/global.js';

/**
 * Whether `script: 'roman'` produces anything different from `script: 'native'`.
 * English names are already written in the Latin alphabet, so both scripts return
 * the same string.
 *
 * @example
 * nameSupportsRoman('ko'); // true
 * nameSupportsRoman('en'); // false
 */
export function nameSupportsRoman(language: NameLanguageOption = 'all'): boolean {
	return language !== 'en';
}
