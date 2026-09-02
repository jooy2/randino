import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Stones and metals, precious and ordinary alike.
 *
 * `randWord({ theme: 'gem' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randGem({ language: 'ko', count: 3 }); // ['금', '수정', '흑요석']
 * randGem({ language: 'en', count: 3 }); // ['Gold', 'Quartz', 'Obsidian']
 */
export function randGem(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Gem words with the language and theme each one came from.
 *
 * @example
 * randGem({ language: 'ko', output: 'detail' });
 * // [{ word: '금', language: 'ko', theme: 'gem' }]
 */
export function randGem(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randGem(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('gem', options);
}
