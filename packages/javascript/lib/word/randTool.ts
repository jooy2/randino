import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * What a hand works with, from a chisel to a plough.
 *
 * `randWord({ theme: 'tool' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randTool({ language: 'ko', count: 3 }); // ['대패', '곡괭이', '집게']
 * randTool({ language: 'en', count: 3 }); // ['Chisel', 'Mallet', 'Trowel']
 */
export function randTool(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Tool words with the language and theme each one came from.
 *
 * @example
 * randTool({ language: 'ko', output: 'detail' });
 * // [{ word: '대패', language: 'ko', theme: 'tool' }]
 */
export function randTool(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randTool(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('tool', options);
}
