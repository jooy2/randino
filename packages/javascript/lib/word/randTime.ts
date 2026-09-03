import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * When something happens, from a moment to a season.
 *
 * `randWord({ theme: 'time' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randTime({ language: 'ko', count: 3 }); // ['새벽', '한여름', '찰나']
 * randTime({ language: 'en', count: 3 }); // ['Twilight', 'Solstice', 'Eternity']
 */
export function randTime(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Time words with the language and theme each one came from.
 *
 * @example
 * randTime({ language: 'ko', output: 'detail' });
 * // [{ word: '새벽', language: 'ko', theme: 'time' }]
 */
export function randTime(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randTime(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('time', options);
}
