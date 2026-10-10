import type { NameLanguageOption } from '../_types/global.js';
import { NAME_LANGUAGES, NAME_SPECS, resolveNameLanguage } from './data/specs.js';

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
	const wanted = resolveNameLanguage(language);

	return wanted === 'all'
		? NAME_LANGUAGES.some((code) => NAME_SPECS[code].romanizes)
		: NAME_SPECS[wanted].romanizes;
}
