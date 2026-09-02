import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Food and drink, the everyday kind.
 *
 * `randWord({ theme: 'food' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randFood({ language: 'ko', count: 3 }); // ['밥', '떡볶이', '빵']
 * randFood({ language: 'en', count: 3 }); // ['Rice', 'Noodle', 'Dumpling']
 */
export function randFood(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Food words with the language and theme each one came from.
 *
 * @example
 * randFood({ language: 'ko', output: 'detail' });
 * // [{ word: '밥', language: 'ko', theme: 'food' }]
 */
export function randFood(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randFood(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('food', options);
}
