import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Animals — the creatures a nickname is most often built around.
 *
 * `randWord({ theme: 'animal' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randAnimal({ language: 'ko', count: 3 }); // ['사자', '호랑이', '수달']
 * randAnimal({ language: 'en', count: 3 }); // ['Lion', 'Otter', 'Falcon']
 */
export function randAnimal(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Animal words with the language and theme each one came from.
 *
 * @example
 * randAnimal({ language: 'ko', output: 'detail' });
 * // [{ word: '사자', language: 'ko', theme: 'animal' }]
 */
export function randAnimal(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randAnimal(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('animal', options);
}
