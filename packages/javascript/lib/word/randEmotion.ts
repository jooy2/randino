import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * What someone feels, from joy to a quiet regret.
 *
 * `randWord({ theme: 'emotion' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randEmotion({ language: 'ko', count: 3 }); // ['그리움', '설렘', '안도']
 * randEmotion({ language: 'en', count: 3 }); // ['Longing', 'Delight', 'Relief']
 */
export function randEmotion(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Emotion words with the language and theme each one came from.
 *
 * @example
 * randEmotion({ language: 'ko', output: 'detail' });
 * // [{ word: '그리움', language: 'ko', theme: 'emotion' }]
 */
export function randEmotion(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randEmotion(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('emotion', options);
}
