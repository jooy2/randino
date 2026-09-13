import type { LocationDetail, RandLocationOptions } from '../_types/global.js';
import { resolveLevel } from './data/index.js';
import { drawLocation } from './locationGenerator.js';

/**
 * Generate real locations, written out from the country down to `level` the way
 * the language writes one. Every division is one the country itself publishes,
 * and each sits inside the one written beside it.
 *
 * Nothing goes below a Korean 읍·면·동 or a US city — no street, no building, no
 * number — so a result is a place, never somebody's address.
 *
 * @example
 * randLocation({ language: 'ko' }); // ['대한민국 경기도 수원시 장안구 파장동']
 * randLocation({ language: 'en' }); // ['Pasadena, California, United States']
 * randLocation({ language: 'ko', level: 'city', count: 2 });
 * // ['대한민국 경상남도 창원시 진해구', '대한민국 충청북도 단양군']
 * randLocation({ language: 'ko', includeCountry: false }); // ['경기도 양평군 단월면']
 */
export function randLocation(options?: RandLocationOptions & { output?: 'value' }): string[];
/**
 * Generate locations along with every level each one names.
 *
 * `output: 'detail'` returns a `LocationDetail` per location instead of a string.
 *
 * @example
 * randLocation({ language: 'ko', output: 'detail' });
 * // [{ location: '대한민국 서울특별시 종로구 청운동', language: 'ko', level: 'district',
 * //    country: '대한민국', region: '서울특별시', city: '종로구', district: '청운동' }]
 */
export function randLocation(options: RandLocationOptions & { output: 'detail' }): LocationDetail[];
export function randLocation(options: RandLocationOptions = {}): string[] | LocationDetail[] {
	return drawLocation('path', resolveLevel(options.level), options, options.includeCountry ?? true);
}
