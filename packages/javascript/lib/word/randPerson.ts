import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * People by age, kinship and character, never by trade and never by name.
 *
 * `randWord({ theme: 'person' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randPerson({ language: 'ko', count: 3 }); // ['꼬마', '이웃', '손님']
 * randPerson({ language: 'en', count: 3 }); // ['Toddler', 'Neighbor', 'Stranger']
 */
export function randPerson(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Person words with the language and theme each one came from.
 *
 * @example
 * randPerson({ language: 'ko', output: 'detail' });
 * // [{ word: '꼬마', language: 'ko', theme: 'person' }]
 */
export function randPerson(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randPerson(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('person', options);
}
