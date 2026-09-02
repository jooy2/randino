import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Ideas out of the humanities and the social world.
 *
 * `randWord({ theme: 'concept' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randConcept({ language: 'ko', count: 3 }); // ['자유', '평화', '진리']
 * randConcept({ language: 'en', count: 3 }); // ['Freedom', 'Peace', 'Truth']
 */
export function randConcept(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Concept words with the language and theme each one came from.
 *
 * @example
 * randConcept({ language: 'ko', output: 'detail' });
 * // [{ word: '자유', language: 'ko', theme: 'concept' }]
 */
export function randConcept(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randConcept(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('concept', options);
}
