import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Sports and the things people play.
 *
 * `randWord({ theme: 'sport' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randSport({ language: 'ko', count: 3 }); // ['축구', '야구', '양궁']
 * randSport({ language: 'en', count: 3 }); // ['Soccer', 'Baseball', 'Archery']
 */
export function randSport(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Sport words with the language and theme each one came from.
 *
 * @example
 * randSport({ language: 'ko', output: 'detail' });
 * // [{ word: '축구', language: 'ko', theme: 'sport' }]
 */
export function randSport(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randSport(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('sport', options);
}
