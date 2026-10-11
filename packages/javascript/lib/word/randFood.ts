import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Prepared food: dishes, soups, noodles, bread, desserts and snacks — what is
 * eaten as it is served. What it is cooked from is `randIngredient`, and
 * vegetables and fruit have their own.
 *
 * `randWord({ theme: 'food' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randFood({ language: 'ko', count: 3 }); // ['밥', '떡볶이', '빵']
 * randFood({ language: 'en', count: 3 }); // ['Pizza', 'Noodle', 'Dumpling']
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
	options ??= {};

	return themedWord('food', options);
}
