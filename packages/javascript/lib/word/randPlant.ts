import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Plants: trees, flowers, leaves and what grows on them.
 *
 * `randWord({ theme: 'plant' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randPlant({ language: 'ko', count: 3 }); // ['나무', '민들레', '꽃']
 * randPlant({ language: 'en', count: 3 }); // ['Treetop', 'Blossom', 'Fern']
 */
export function randPlant(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Plant words with the language and theme each one came from.
 *
 * @example
 * randPlant({ language: 'ko', output: 'detail' });
 * // [{ word: '나무', language: 'ko', theme: 'plant' }]
 */
export function randPlant(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randPlant(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('plant', options);
}
