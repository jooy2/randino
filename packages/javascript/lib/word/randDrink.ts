import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Something to drink, hot, cold or fermented.
 *
 * `randWord({ theme: 'drink' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randDrink({ language: 'ko', count: 3 }); // ['식혜', '보리차', '막걸리']
 * randDrink({ language: 'en', count: 3 }); // ['Cider', 'Cordial', 'Lemonade']
 */
export function randDrink(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Drink words with the language and theme each one came from.
 *
 * @example
 * randDrink({ language: 'ko', output: 'detail' });
 * // [{ word: '식혜', language: 'ko', theme: 'drink' }]
 */
export function randDrink(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randDrink(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('drink', options);
}
