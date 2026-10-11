import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Fruit, the way a kitchen counts it — from apples and berries to melons and
 * mangoes.
 *
 * `randWord({ theme: 'fruit' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randFruit({ language: 'ko', count: 3 }); // ['사과', '복숭아', '수박']
 * randFruit({ language: 'en', count: 3 }); // ['Apple', 'Peach', 'Watermelon']
 */
export function randFruit(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Fruit words with the language and theme each one came from.
 *
 * @example
 * randFruit({ language: 'ko', output: 'detail' });
 * // [{ word: '사과', language: 'ko', theme: 'fruit' }]
 */
export function randFruit(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randFruit(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('fruit', options);
}
