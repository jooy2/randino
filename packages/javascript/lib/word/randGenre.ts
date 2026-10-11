import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Kinds of music: genres and their sub-genres, from techno and grunge to
 * K-pop, and the kinds of piece a composer writes.
 *
 * `randWord({ theme: 'genre' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randGenre({ language: 'ko', count: 3 }); // ['재즈', '테크노', '교향곡']
 * randGenre({ language: 'en', count: 3 }); // ['Jazz', 'Techno', 'Symphony']
 */
export function randGenre(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Genre words with the language and theme each one came from.
 *
 * @example
 * randGenre({ language: 'ko', output: 'detail' });
 * // [{ word: '재즈', language: 'ko', theme: 'genre' }]
 */
export function randGenre(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randGenre(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('genre', options);
}
