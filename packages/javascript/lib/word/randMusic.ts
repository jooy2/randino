import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Music: instruments, forms and the words around them.
 *
 * `randWord({ theme: 'music' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randMusic({ language: 'ko', count: 3 }); // ['피아노', '거문고', '교향곡']
 * randMusic({ language: 'en', count: 3 }); // ['Piano', 'Fiddle', 'Symphony']
 */
export function randMusic(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Music words with the language and theme each one came from.
 *
 * @example
 * randMusic({ language: 'ko', output: 'detail' });
 * // [{ word: '피아노', language: 'ko', theme: 'music' }]
 */
export function randMusic(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randMusic(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('music', options);
}
