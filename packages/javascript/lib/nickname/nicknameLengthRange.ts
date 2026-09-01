import { clamp } from '../_internal/utils.js';
import type { NicknameLanguageOption } from '../_types/global.js';
import { NICKNAME_LANGUAGES, NICKNAME_LENGTH_MAX, NICKNAME_LENGTH_MIN } from './data/index.js';
import { naturalRange } from './nicknameGenerator.js';

/**
 * Every nickname length the language can produce, in characters, which is what
 * `randNickname` falls back to when `minLength` or `maxLength` is omitted. The
 * lower end is a bare noun and the upper end a modifier, a noun and a trailing
 * word together, so the range is wide on purpose — the shape of each nickname is
 * picked inside it. A `baseWord` longer than this range widens it, and a
 * `wordSeparator` widens it by what it adds between the words.
 *
 * @example
 * nicknameLengthRange('ko'); // [1, 12]
 * nicknameLengthRange('ko', false); // [1, 8]
 * nicknameLengthRange('en'); // [3, 30]
 * nicknameLengthRange('ko', true, '-'); // [1, 14]
 */
export function nicknameLengthRange(
	language: NicknameLanguageOption = 'all',
	includeModifier = true,
	wordSeparator?: string
): [number, number] {
	const languages = language === 'all' ? NICKNAME_LANGUAGES : [language];
	let min = Infinity;
	let max = 0;

	for (const code of languages) {
		const [low, high] = naturalRange(code, includeModifier, wordSeparator);

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [
		clamp(min, NICKNAME_LENGTH_MIN, NICKNAME_LENGTH_MAX),
		clamp(max, NICKNAME_LENGTH_MIN, NICKNAME_LENGTH_MAX)
	];
}
