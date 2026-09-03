import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * The parts of a body, inside and out.
 *
 * `randWord({ theme: 'body' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randBody({ language: 'ko', count: 3 }); // ['손목', '어깨', '심장']
 * randBody({ language: 'en', count: 3 }); // ['Wrist', 'Shoulder', 'Heart']
 */
export function randBody(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Body words with the language and theme each one came from.
 *
 * @example
 * randBody({ language: 'ko', output: 'detail' });
 * // [{ word: '손목', language: 'ko', theme: 'body' }]
 */
export function randBody(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randBody(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('body', options);
}
