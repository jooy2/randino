import type { LocationDetail, RandLocationUnitOptions } from '../_types/global.js';
import { drawLocation } from './locationGenerator.js';

/**
 * Generate the divisions inside a city: a Korean 읍·면·동. The legal 동 an address
 * is written with, not the administrative one a community centre serves, and
 * never a 리 below it.
 *
 * Only Korean locations have this level, so `language: 'en'` returns nothing and
 * `language: 'all'` draws Korean.
 *
 * @example
 * randDistrict({ language: 'ko', count: 3 }); // ['역삼동', '조치원읍', '한림읍']
 */
export function randDistrict(options?: RandLocationUnitOptions & { output?: 'value' }): string[];
/**
 * Districts along with the city, region and country each one is in.
 *
 * @example
 * randDistrict({ language: 'ko', output: 'detail' });
 * // [{ location: '역삼동', language: 'ko', level: 'district',
 * //    country: '대한민국', region: '서울특별시', city: '강남구', district: '역삼동' }]
 */
export function randDistrict(
	options: RandLocationUnitOptions & { output: 'detail' }
): LocationDetail[];
export function randDistrict(options: RandLocationUnitOptions = {}): string[] | LocationDetail[] {
	return drawLocation('unit', 'district', options);
}
