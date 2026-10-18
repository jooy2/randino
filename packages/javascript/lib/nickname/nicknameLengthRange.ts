import { clamp } from '../_internal/utils.js';
import { RAND_LENGTH_MAX, RAND_LENGTH_MIN } from '../constants.js';
import type { WordLanguageOption } from '../_types/global.js';
import { WORD_LANGUAGES, resolveWordLanguage } from '../word/data/index.js';
import { NICKNAME_SPANS } from '../word/data/lengths.js';
import { resolveSeparator } from './nicknameGenerator.js';

/**
 * Every nickname length the language can produce, in characters, which is what
 * `randNickname` falls back to when `minLength` or `maxLength` is omitted. The
 * lower end is a bare noun and the upper end a modifier, a noun and a trailing
 * word together, so the range is wide on purpose — the shape of each nickname is
 * picked inside it. A `wordSeparator` widens it by what it adds between the
 * words.
 *
 * @example
 * nicknameLengthRange('ko'); // [1, 13]
 * nicknameLengthRange('en'); // [3, 33]
 * nicknameLengthRange('ko', '-'); // [1, 15]
 */
export function nicknameLengthRange(
	language: WordLanguageOption = 'all',
	wordSeparator?: string
): [number, number] {
	const wanted = resolveWordLanguage(language);
	const languages = wanted === 'all' ? WORD_LANGUAGES : [wanted];
	const separator = resolveSeparator(wordSeparator);
	let min = Infinity;
	let max = 0;

	// Read from a table rather than from the pools, so that the two numbers do not
	// bring every pool into a bundle with them. The table is measured with nothing
	// between the words, and whatever joins them is added once per gap.
	for (const code of languages) {
		const { joiner, spans } = NICKNAME_SPANS[code];
		const gap = (separator ?? joiner).length;

		spans.forEach(([low, high], gaps) => {
			min = Math.min(min, low + gaps * gap);
			max = Math.max(max, high + gaps * gap);
		});
	}

	return [
		clamp(min, RAND_LENGTH_MIN, RAND_LENGTH_MAX),
		clamp(max, RAND_LENGTH_MIN, RAND_LENGTH_MAX)
	];
}
