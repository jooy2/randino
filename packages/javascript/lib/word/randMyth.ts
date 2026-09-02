import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Creatures and figures out of myth and folklore.
 *
 * `randWord({ theme: 'myth' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randMyth({ language: 'ko', count: 3 }); // ['용', '봉황', '구미호']
 * randMyth({ language: 'en', count: 3 }); // ['Dragon', 'Phoenix', 'Griffin']
 */
export function randMyth(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Myth words with the language and theme each one came from.
 *
 * @example
 * randMyth({ language: 'ko', output: 'detail' });
 * // [{ word: '용', language: 'ko', theme: 'myth' }]
 */
export function randMyth(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randMyth(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('myth', options);
}
