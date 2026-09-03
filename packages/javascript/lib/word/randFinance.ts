import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Money, and the words for what is done with it.
 *
 * `randWord({ theme: 'finance' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randFinance({ language: 'ko', count: 3 }); // ['이자', '환율', '장부']
 * randFinance({ language: 'en', count: 3 }); // ['Ledger', 'Yield', 'Escrow']
 */
export function randFinance(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Finance words with the language and theme each one came from.
 *
 * @example
 * randFinance({ language: 'ko', output: 'detail' });
 * // [{ word: '이자', language: 'ko', theme: 'finance' }]
 */
export function randFinance(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randFinance(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('finance', options);
}
