import { clamp } from '../_internal/utils.js';
import { RAND_LENGTH_MAX, RAND_LENGTH_MIN } from '../constants.js';
import type { NameLanguageOption } from '../_types/global.js';
import { NAME_DATA, NAME_LANGUAGES } from './data/index.js';

/**
 * Natural length range of a full name in the given language, in characters of the
 * native form. This is what `randName` falls back to when `minLength` or
 * `maxLength` is omitted, and it describes only the parts that are switched on —
 * so leaving the surname out relaxes the range instead of forcing the given name
 * to stretch and fill it.
 *
 * @example
 * nameLengthRange('ko'); // [2, 3]
 * nameLengthRange('ko', false); // [1, 2]
 * nameLengthRange('en'); // [7, 21]
 */
export function nameLengthRange(
	language: NameLanguageOption = 'all',
	includeSurname = true,
	includeMiddleName = false
): [number, number] {
	const languages = language === 'all' ? NAME_LANGUAGES : [language];
	let min = Infinity;
	let max = 0;

	for (const code of languages) {
		const data = NAME_DATA[code];
		const { given, last, middle } = data.lengthSpec;
		let low = given[0];
		let high = given[1];

		// Each part beyond the first brings the joiner with it: one space for the
		// space-separated scripts, nothing for CJK.
		if (includeSurname) {
			low += last[0] + data.joiner.length;
			high += last[1] + data.joiner.length;
		}

		if (includeMiddleName && data.hasMiddle) {
			low += middle[0] + data.joiner.length;
			high += middle[1] + data.joiner.length;
		}

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [
		clamp(min, RAND_LENGTH_MIN, RAND_LENGTH_MAX),
		clamp(max, RAND_LENGTH_MIN, RAND_LENGTH_MAX)
	];
}
