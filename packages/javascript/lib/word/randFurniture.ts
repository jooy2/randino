import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Furniture and the furnishings of a home.
 *
 * `randWord({ theme: 'furniture' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randFurniture({ language: 'ko', count: 3 }); // ['흔들의자', '요람', '책장']
 * randFurniture({ language: 'en', count: 3 }); // ['Hammock', 'Cradle', 'Wardrobe']
 */
export function randFurniture(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Furniture words with the language and theme each one came from.
 *
 * @example
 * randFurniture({ language: 'ko', output: 'detail' });
 * // [{ word: '흔들의자', language: 'ko', theme: 'furniture' }]
 */
export function randFurniture(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randFurniture(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('furniture', options);
}
