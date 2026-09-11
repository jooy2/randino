import type { NameLanguageOption } from '../_types/global.js';
import { NAME_DATA, resolveNameLanguage } from './data/index.js';

/**
 * Whether the language uses a middle name. `includeMiddleName` is ignored for
 * languages that do not — Korean, Japanese and Chinese names have no middle part.
 *
 * @example
 * nameSupportsMiddleName('en'); // true
 * nameSupportsMiddleName('ko'); // false
 */
export function nameSupportsMiddleName(language: NameLanguageOption = 'all'): boolean {
	const wanted = resolveNameLanguage(language);

	return wanted === 'all' ? true : NAME_DATA[wanted].hasMiddle;
}
