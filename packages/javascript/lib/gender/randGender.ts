import type { GenderDetail, RandGenderOptions } from '../_types/global.js';
import { generateGenderDetails } from './genderGenerator.js';

/**
 * Generate genders for sample people, written the way a form in the language
 * labels them.
 *
 * Male and female, evenly, by default. `includeUnknown` adds a gender nobody
 * stated, about one draw in eleven, and `includeNonbinary` adds a third gender,
 * about one in a hundred.
 *
 * @example
 * randGender({ language: 'ko', count: 3 }); // ['여성', '남성', '여성']
 * randGender({ language: 'en', includeUnknown: true, count: 3 }); // ['Male', 'Unknown', 'Female']
 * randGender({ language: 'de', includeNonbinary: true }); // ['Divers']
 */
export function randGender(options?: RandGenderOptions & { output?: 'value' }): string[];
/**
 * Generate genders along with the code behind each label.
 *
 * `output: 'detail'` returns a `GenderDetail` per gender instead of a string, so
 * the code (`'female'`) can be stored while the label (`'여성'`) is shown.
 *
 * @example
 * randGender({ language: 'ko', output: 'detail' });
 * // [{ gender: '여성', code: 'female', language: 'ko' }]
 */
export function randGender(options: RandGenderOptions & { output: 'detail' }): GenderDetail[];
export function randGender(options: RandGenderOptions = {}): string[] | GenderDetail[] {
	options ??= {};

	const details = generateGenderDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.gender);
}
