import type { PhoneDetail, RandPhoneOptions } from '../_types/global.js';
import { generatePhoneDetails } from './phoneGenerator.js';

/**
 * Generate phone numbers, written the way their country writes them.
 *
 * Each number opens on a block the country's numbering plan gives out — a
 * mobile block, or the area code of a real city — and the digits after it are
 * random. That is what makes it look like a real number, and it is also why it
 * can be one: a drawn number may belong to somebody. Use the numbers as sample
 * data, and never call or text one — or pass `fictional`, for the numbers the
 * United States and Germany keep out of service for films and books.
 *
 * Mobile numbers by default. `includeCountryCode` writes the international
 * form, and `separator` replaces the country's own punctuation.
 *
 * The examples write the last four digits as `#`; a call returns every digit.
 *
 * @example
 * randPhone({ country: 'KR' }); // ['010-4821-####']
 * randPhone({ country: 'US', count: 2 }); // ['(415) 726-####', '(917) 384-####']
 * randPhone({ country: 'KR', includeCountryCode: true }); // ['+82 10-4821-####']
 * randPhone({ country: 'KR', includeCountryCode: true, separator: '' }); // ['+82104821####']
 * randPhone({ country: 'US', fictional: true }); // ['(415) 555-0147']
 */
export function randPhone(options?: RandPhoneOptions & { output?: 'value' }): string[];
/**
 * Generate phone numbers along with their country, their type and their E.164
 * form.
 *
 * A drawn number may belong to somebody, the same as with the plain form: use it
 * as sample data, never call or text one, and pass `fictional` for numbers kept
 * out of service.
 *
 * The examples write the last four digits as `#`; a call returns every digit.
 *
 * @example
 * randPhone({ country: 'JP', output: 'detail' });
 * // [{ phone: '090-3718-####', e164: '+81903718####', country: 'JP', callingCode: '81', type: 'mobile' }]
 */
export function randPhone(options: RandPhoneOptions & { output: 'detail' }): PhoneDetail[];
export function randPhone(options: RandPhoneOptions = {}): string[] | PhoneDetail[] {
	options ??= {};

	const details = generatePhoneDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.phone);
}
