import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Nature and its phenomena — sky, weather, water, land.
 *
 * `randWord({ theme: 'nature' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randNature({ language: 'ko', count: 3 }); // ['하늘', '노을', '바람']
 * randNature({ language: 'en', count: 3 }); // ['Sky', 'Sunset', 'Breeze']
 */
export function randNature(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Nature words with the language and theme each one came from.
 *
 * @example
 * randNature({ language: 'ko', output: 'detail' });
 * // [{ word: '하늘', language: 'ko', theme: 'nature' }]
 */
export function randNature(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randNature(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('nature', options);
}
