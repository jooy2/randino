import { clamp } from '../_internal/utils.js';
import { RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX } from '../constants.js';
import type { WordLanguageOption } from '../_types/global.js';
import { WORD_LANGUAGES } from '../word/data/index.js';
import { naturalRange } from './sentenceGenerator.js';

/**
 * Every sentence length the language can produce, in characters, which is what
 * `randSentence` falls back to when `minLength` or `maxLength` is omitted. The
 * lower end is the shortest shape with the shortest words in it, and the upper
 * end the longest shape with a modifier on every phrase, so the range is wide on
 * purpose — the shape of each sentence is picked inside it.
 *
 * @example
 * sentenceLengthRange('ko'); // [5, 45]
 * sentenceLengthRange('en'); // [10, 84]
 */
export function sentenceLengthRange(language: WordLanguageOption = 'all'): [number, number] {
	const languages = language === 'all' ? WORD_LANGUAGES : [language];
	let min = Infinity;
	let max = 0;

	for (const code of languages) {
		const [low, high] = naturalRange(code);

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [
		clamp(min, RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX),
		clamp(max, RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX)
	];
}
