import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Toys and games, the things and the play a childhood is made of.
 *
 * `randWord({ theme: 'toy' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randToy({ language: 'ko', count: 3 }); // ['팽이', '연', '딱지']
 * randToy({ language: 'en', count: 3 }); // ['Kite', 'Yoyo', 'Domino']
 */
export function randToy(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Toy words with the language and theme each one came from.
 *
 * @example
 * randToy({ language: 'ko', output: 'detail' });
 * // [{ word: '팽이', language: 'ko', theme: 'toy' }]
 */
export function randToy(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randToy(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('toy', options);
}
