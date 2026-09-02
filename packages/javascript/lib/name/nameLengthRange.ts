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
 * nameLengthRange('ko'); // [3, 3]
 * nameLengthRange('ko', false); // [2, 2]
 * nameLengthRange('en'); // [8, 16]
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

		if (includeSurname) {
			low += last[0];
			high += last[1];
		}

		if (includeMiddleName && data.hasMiddle) {
			low += middle[0];
			high += middle[1];
		}

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [
		clamp(min, RAND_LENGTH_MIN, RAND_LENGTH_MAX),
		clamp(max, RAND_LENGTH_MIN, RAND_LENGTH_MAX)
	];
}
