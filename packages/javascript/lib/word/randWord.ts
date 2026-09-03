import type { RandWordOptions, WordDetail } from '../_types/global.js';
import { generateWordDetails } from './wordGenerator.js';

/**
 * Generate everyday words — the vocabulary a nickname is built from, on its own.
 * Animals, things, nature, ideas: twenty-five themes, in nine languages. Person
 * names are never used.
 *
 * `theme` picks what the words are about; the twenty-five `rand…` functions beside
 * this one are the same generator with one theme already chosen.
 *
 * @example
 * randWord({ language: 'ko', theme: 'animal', count: 3 }); // ['여우', '고래', '수달']
 * randWord({ language: 'en', count: 2 }); // ['Lantern', 'Meadow']
 * randWord({ language: 'ko', maxLength: 2, count: 3 }); // ['별', '노을', '거문고']
 */
export function randWord(options?: RandWordOptions & { output?: 'value' }): string[];
/**
 * Generate words along with the language and theme each one came from.
 *
 * `output: 'detail'` returns a `WordDetail` per word instead of a string. The
 * theme is null for an invented word that matches nothing in the pools.
 *
 * @example
 * randWord({ language: 'ko', theme: 'plant', output: 'detail' });
 * // [{ word: '민들레', language: 'ko', theme: 'plant' }]
 */
export function randWord(options: RandWordOptions & { output: 'detail' }): WordDetail[];
export function randWord(options: RandWordOptions = {}): string[] | WordDetail[] {
	const details = generateWordDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.word);
}
