import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * What is beyond the sky, from the moon to a galaxy.
 *
 * `randWord({ theme: 'space' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randSpace({ language: 'ko', count: 3 }); // ['은하', '혜성', '북극성']
 * randSpace({ language: 'en', count: 3 }); // ['Galaxy', 'Comet', 'Nebula']
 */
export function randSpace(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Space words with the language and theme each one came from.
 *
 * @example
 * randSpace({ language: 'ko', output: 'detail' });
 * // [{ word: '은하', language: 'ko', theme: 'space' }]
 */
export function randSpace(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randSpace(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('space', options);
}
