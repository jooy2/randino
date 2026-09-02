import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Places — where people gather, live and pass through.
 *
 * `randWord({ theme: 'place' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randPlace({ language: 'ko', count: 3 }); // ['시장', '광장', '마을']
 * randPlace({ language: 'en', count: 3 }); // ['Market', 'Plaza', 'Village']
 */
export function randPlace(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Place words with the language and theme each one came from.
 *
 * @example
 * randPlace({ language: 'ko', output: 'detail' });
 * // [{ word: '시장', language: 'ko', theme: 'place' }]
 */
export function randPlace(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randPlace(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('place', options);
}
