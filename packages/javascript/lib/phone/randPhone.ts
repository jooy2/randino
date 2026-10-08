import type { PhoneDetail, RandPhoneOptions } from '../_types/global.js';
import { generatePhoneDetails } from './phoneGenerator.js';

/**
 * Generate phone numbers, written the way their country writes them.
 *
 * Each number opens on a block the country's numbering plan gives out — a
 * mobile block, or the area code of a real city — and the digits after it are
 * random. That is what makes it look like a real number, and it is also why it
 * can be one: a drawn number may belong to somebody. Use the numbers as sample
 * data, and never call or text one.
 *
 * Mobile numbers by default. `includeCountryCode` writes the international
 * form, and `separator` replaces the country's own punctuation.
 *
 * @example
 * randPhone({ country: 'KR' }); // ['010-4821-3967']
 * randPhone({ country: 'US', count: 2 }); // ['(415) 726-0193', '(917) 384-5520']
 * randPhone({ country: 'KR', includeCountryCode: true }); // ['+82 10-4821-3967']
 * randPhone({ country: 'KR', includeCountryCode: true, separator: '' }); // ['+821048213967']
 */
export function randPhone(options?: RandPhoneOptions & { output?: 'value' }): string[];
/**
 * Generate phone numbers along with their country, their type and their E.164
 * form.
 *
 * @example
 * randPhone({ country: 'JP', output: 'detail' });
 * // [{ phone: '090-3718-2046', e164: '+819037182046', country: 'JP', callingCode: '81', type: 'mobile' }]
 */
export function randPhone(options: RandPhoneOptions & { output: 'detail' }): PhoneDetail[];
export function randPhone(options: RandPhoneOptions = {}): string[] | PhoneDetail[] {
	const details = generatePhoneDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.phone);
}
