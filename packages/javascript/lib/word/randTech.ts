import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * The vocabulary of computers and the networks between them.
 *
 * `randWord({ theme: 'tech' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randTech({ language: 'ko', count: 3 }); // ['서버', '캐시', '대역']
 * randTech({ language: 'en', count: 3 }); // ['Server', 'Cache', 'Subnet']
 */
export function randTech(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Tech words with the language and theme each one came from.
 *
 * @example
 * randTech({ language: 'ko', output: 'detail' });
 * // [{ word: '서버', language: 'ko', theme: 'tech' }]
 */
export function randTech(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randTech(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('tech', options);
}
