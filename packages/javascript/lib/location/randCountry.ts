import type { CountryDetail, RandCountryOptions } from '../_types/global.js';
import { generateCountryDetails } from './locationGenerator.js';

/**
 * Generate country names: every ISO 3166-1 country and territory, 249 of them,
 * named the way the language names it. Every word language has a name for every
 * one, so this takes any of the nine, where the other location generators write
 * only the languages whose countries publish their divisions.
 *
 * Each is drawn as often as any other. The names are Wikidata's, and the list is
 * ISO's: a territory is in because ISO 3166-1 gives it a code of its own.
 *
 * @example
 * randCountry({ language: 'ko', count: 3 }); // ['아르헨티나', '방글라데시', '세인트키츠 네비스']
 * randCountry({ language: 'en', count: 2 }); // ['Gibraltar', 'Burkina Faso']
 */
export function randCountry(options?: RandCountryOptions & { output?: 'value' }): string[];
/**
 * Country names along with the ISO 3166-1 code each one is known by.
 *
 * @example
 * randCountry({ language: 'ja', output: 'detail' });
 * // [{ country: 'サウジアラビア', code: 'SA', language: 'ja' }]
 */
export function randCountry(options: RandCountryOptions & { output: 'detail' }): CountryDetail[];
export function randCountry(options: RandCountryOptions = {}): string[] | CountryDetail[] {
	const details = generateCountryDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.country);
}
