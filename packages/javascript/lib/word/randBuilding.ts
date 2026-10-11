import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Buildings and the rooms in them: homes, schools, shops and offices, the
 * places of worship and of public business, and the words for a kind of
 * property.
 *
 * `randWord({ theme: 'building' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randBuilding({ language: 'ko', count: 3 }); // ['아파트', '도서관', '학원']
 * randBuilding({ language: 'en', count: 3 }); // ['House', 'Library', 'Bakery']
 */
export function randBuilding(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Building words with the language and theme each one came from.
 *
 * @example
 * randBuilding({ language: 'ko', output: 'detail' });
 * // [{ word: '아파트', language: 'ko', theme: 'building' }]
 */
export function randBuilding(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randBuilding(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('building', options);
}
