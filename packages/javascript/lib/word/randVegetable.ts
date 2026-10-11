import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Vegetables, the way a kitchen counts them — roots, greens, onions,
 * peppers, squash and mushrooms.
 *
 * `randWord({ theme: 'vegetable' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randVegetable({ language: 'ko', count: 3 }); // ['당근', '양파', '시금치']
 * randVegetable({ language: 'en', count: 3 }); // ['Carrot', 'Onion', 'Spinach']
 */
export function randVegetable(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Vegetable words with the language and theme each one came from.
 *
 * @example
 * randVegetable({ language: 'ko', output: 'detail' });
 * // [{ word: '당근', language: 'ko', theme: 'vegetable' }]
 */
export function randVegetable(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randVegetable(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('vegetable', options);
}
