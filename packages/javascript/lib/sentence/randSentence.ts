import type { RandSentenceOptions, SentenceDetail } from '../_types/global.js';
import { generateSentenceDetails } from './sentenceGenerator.js';

/**
 * Generate whole sentences — a subject and something said about it, written the
 * way the language writes it. The words are the same everyday vocabulary
 * `randWord` draws from, and person names are never used.
 *
 * A verb states what can do it and what it can be done to, so the words of one
 * sentence belong together: `여우가 사과를 먹는다` comes out, and the same shape
 * never puts an idea where the apple is.
 *
 * @example
 * randSentence({ language: 'ko', count: 2 });
 * // ['검은 고양이가 숲에서 잠잔다.', '여우가 사과를 먹는다.']
 * randSentence({ language: 'en' });
 * // ['The brave lion runs quietly.']
 * randSentence({ language: 'en', shape: 'simple' });
 * // ['The otter swims.']
 * randSentence({ language: 'ko', include: '사자' });
 * // ['사자가 새벽에 떠난다.']
 */
export function randSentence(options?: RandSentenceOptions & { output?: 'value' }): string[];
/**
 * Generate sentences along with the pieces each one was built from.
 *
 * `output: 'detail'` returns a `SentenceDetail` per sentence instead of a
 * string — the phrases in order, what each of them does, the language and the
 * subject's theme. The particles are left out of `phrases`, so joining them back
 * does not reproduce the sentence.
 *
 * @example
 * randSentence({ language: 'ko', output: 'detail' });
 * // [{
 * //   sentence: '검은 고양이가 숲에서 잠잔다.',
 * //   phrases: ['검은 고양이', '숲', '잠잔다'],
 * //   slots: ['subject', 'place', 'verb'],
 * //   language: 'ko',
 * //   theme: 'animal'
 * // }]
 */
export function randSentence(options: RandSentenceOptions & { output: 'detail' }): SentenceDetail[];
export function randSentence(options: RandSentenceOptions = {}): string[] | SentenceDetail[] {
	const details = generateSentenceDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.sentence);
}
