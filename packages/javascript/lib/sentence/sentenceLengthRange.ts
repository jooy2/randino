import { clamp } from '../_internal/utils.js';
import { RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX } from '../constants.js';
import type { WordLanguageOption } from '../_types/global.js';
import { WORD_LANGUAGES, resolveWordLanguage } from '../word/data/index.js';
import { SENTENCE_LENGTHS } from './data/lengths.js';

/**
 * Every sentence length the language can produce, in characters, which is what
 * `randSentence` falls back to when `minLength` or `maxLength` is omitted. The
 * lower end is the shortest shape with the shortest words in it, and the upper
 * end the longest shape with a modifier on every phrase, so the range is wide on
 * purpose — the shape of each sentence is picked inside it.
 *
 * @example
 * sentenceLengthRange('ko'); // [5, 56]
 * sentenceLengthRange('en'); // [11, 117]
 */
export function sentenceLengthRange(language: WordLanguageOption = 'all'): [number, number] {
	const wanted = resolveWordLanguage(language);
	const languages = wanted === 'all' ? WORD_LANGUAGES : [wanted];
	let min = Infinity;
	let max = 0;

	// Read from a table rather than from the pools, so that the two numbers do not
	// bring every pool and every shape into a bundle with them.
	for (const code of languages) {
		const [low, high] = SENTENCE_LENGTHS[code];

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [
		clamp(min, RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX),
		clamp(max, RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX)
	];
}
