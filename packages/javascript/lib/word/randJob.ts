import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * The trades and roles people hold. Never a person name — which is why there is no `Baker` or `Hunter` here.
 *
 * `randWord({ theme: 'job' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randJob({ language: 'ko', count: 3 }); // ['기사', '마법사', '대장장이']
 * randJob({ language: 'en', count: 3 }); // ['Wizard', 'Ranger', 'Blacksmith']
 */
export function randJob(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Job words with the language and theme each one came from.
 *
 * @example
 * randJob({ language: 'ko', output: 'detail' });
 * // [{ word: '기사', language: 'ko', theme: 'job' }]
 */
export function randJob(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randJob(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('job', options);
}
