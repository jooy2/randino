import type { LocationDetail, RandLocationUnitOptions } from '../_types/global.js';
import { drawLocation } from './locationGenerator.js';

/**
 * Generate the divisions a region is made of: a Korean 시·군·구, written with its
 * city where it is one of a city's districts (`수원시 장안구`), or a US city, town,
 * village or census designated place.
 *
 * A name can come back more than once from different regions — Korea has a
 * `중구` in five of them — and `unique` compares the names.
 *
 * @example
 * randCity({ language: 'ko', count: 3 }); // ['강남구', '수원시 장안구', '양평군']
 * randCity({ language: 'en', count: 2 }); // ['Pasadena', 'Burlington']
 */
export function randCity(options?: RandLocationUnitOptions & { output?: 'value' }): string[];
/**
 * Cities along with the region and country each one is in.
 *
 * @example
 * randCity({ language: 'ko', output: 'detail' });
 * // [{ location: '강남구', language: 'ko', level: 'city',
 * //    country: '대한민국', region: '서울특별시', city: '강남구', district: null }]
 */
export function randCity(options: RandLocationUnitOptions & { output: 'detail' }): LocationDetail[];
export function randCity(options: RandLocationUnitOptions = {}): string[] | LocationDetail[] {
	return drawLocation('unit', 'city', options);
}
