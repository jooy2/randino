import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Make-up, skin care, fragrance, hair and nail care, and the tools and
 * treatments that go with them.
 *
 * `randWord({ theme: 'beauty' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randBeauty({ language: 'ko', count: 3 }); // ['립스틱', '로션', '향수']
 * randBeauty({ language: 'en', count: 3 }); // ['Lipstick', 'Lotion', 'Perfume']
 */
export function randBeauty(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Beauty words with the language and theme each one came from.
 *
 * @example
 * randBeauty({ language: 'ko', output: 'detail' });
 * // [{ word: '립스틱', language: 'ko', theme: 'beauty' }]
 */
export function randBeauty(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randBeauty(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('beauty', options);
}
