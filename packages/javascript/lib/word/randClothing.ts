import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * What people wear, and what it is made of.
 *
 * `randWord({ theme: 'clothing' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randClothing({ language: 'ko', count: 3 }); // ['두루마기', '양말', '외투']
 * randClothing({ language: 'en', count: 3 }); // ['Cardigan', 'Mitten', 'Overcoat']
 */
export function randClothing(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Clothing words with the language and theme each one came from.
 *
 * @example
 * randClothing({ language: 'ko', output: 'detail' });
 * // [{ word: '두루마기', language: 'ko', theme: 'clothing' }]
 */
export function randClothing(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randClothing(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('clothing', options);
}
