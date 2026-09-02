import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Things you buy — the manufactured end of the vocabulary.
 *
 * `randWord({ theme: 'product' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randProduct({ language: 'ko', count: 3 }); // ['노트북', '키보드', '이어폰']
 * randProduct({ language: 'en', count: 3 }); // ['Laptop', 'Keyboard', 'Earphone']
 */
export function randProduct(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Product words with the language and theme each one came from.
 *
 * @example
 * randProduct({ language: 'ko', output: 'detail' });
 * // [{ word: '노트북', language: 'ko', theme: 'product' }]
 */
export function randProduct(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randProduct(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('product', options);
}
