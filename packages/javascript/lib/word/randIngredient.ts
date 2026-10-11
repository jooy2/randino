import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * What food is made from, short of a vegetable or a fruit: meat, grain,
 * dairy, seasonings, sauces, spices and herbs.
 *
 * `randWord({ theme: 'ingredient' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randIngredient({ language: 'ko', count: 3 }); // ['간장', '밀가루', '버터']
 * randIngredient({ language: 'en', count: 3 }); // ['Flour', 'Butter', 'Cinnamon']
 */
export function randIngredient(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Ingredient words with the language and theme each one came from.
 *
 * @example
 * randIngredient({ language: 'ko', output: 'detail' });
 * // [{ word: '간장', language: 'ko', theme: 'ingredient' }]
 */
export function randIngredient(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randIngredient(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('ingredient', options);
}
