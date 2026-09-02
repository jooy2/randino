import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Everyday things: what is on a desk, in a bag, around a house.
 *
 * `randWord({ theme: 'object' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randObject({ language: 'ko', count: 3 }); // ['물병', '연필', '우산']
 * randObject({ language: 'en', count: 3 }); // ['Bottle', 'Pencil', 'Umbrella']
 */
export function randObject(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Object words with the language and theme each one came from.
 *
 * @example
 * randObject({ language: 'ko', output: 'detail' });
 * // [{ word: '물병', language: 'ko', theme: 'object' }]
 */
export function randObject(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randObject(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('object', options);
}
