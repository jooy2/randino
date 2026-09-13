import type { LocationDetail, RandLocationUnitOptions } from '../_types/global.js';
import { drawLocation } from './locationGenerator.js';

/**
 * The country a language's locations are in, the way the language writes it.
 * There is one per language — `language: 'all'` is how more than one comes back —
 * and it is the top of every location `randLocation` writes.
 *
 * @example
 * randCountry({ language: 'ko' }); // ['대한민국']
 * randCountry({ count: 3 }); // ['United States', '대한민국', '대한민국']
 */
export function randCountry(options?: RandLocationUnitOptions & { output?: 'value' }): string[];
/**
 * The country along with the language it was written in.
 *
 * @example
 * randCountry({ language: 'en', output: 'detail' });
 * // [{ location: 'United States', language: 'en', level: 'country',
 * //    country: 'United States', region: null, city: null, district: null }]
 */
export function randCountry(
	options: RandLocationUnitOptions & { output: 'detail' }
): LocationDetail[];
export function randCountry(options: RandLocationUnitOptions = {}): string[] | LocationDetail[] {
	return drawLocation('unit', 'country', options);
}
