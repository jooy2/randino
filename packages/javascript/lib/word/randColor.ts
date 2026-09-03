import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Colours, from the plain ones to the ones with a history.
 *
 * `randWord({ theme: 'color' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randColor({ language: 'ko', count: 3 }); // ['주홍', '연두', '쪽빛']
 * randColor({ language: 'en', count: 3 }); // ['Crimson', 'Teal', 'Ochre']
 */
export function randColor(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Colour words with the language and theme each one came from.
 *
 * @example
 * randColor({ language: 'ko', output: 'detail' });
 * // [{ word: '주홍', language: 'ko', theme: 'color' }]
 */
export function randColor(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randColor(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('color', options);
}
