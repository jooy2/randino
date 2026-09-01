import type { NameDetail, RandNameOptions } from '../_types/global.js';
import { generateNameDetails } from './nameGenerator.js';

/**
 * Generate person names with both scripts and the choices behind each one.
 *
 * Takes the same options as `randName`, except `script` — every name is
 * returned in its native form and romanized at the same time. Useful when the
 * language is mixed (`'all'`), where `language` tells you what each name is, or
 * when you want to show a name next to its English pronunciation.
 *
 * @example
 * randNameDetails({ language: 'ko' });
 * // [{ native: '김민준', roman: 'Kim Minjun', language: 'ko', gender: 'male' }]
 */
export function randNameDetails(options: RandNameOptions = {}): NameDetail[] {
	return generateNameDetails(options);
}
