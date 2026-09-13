import type { LocationDetail, RandLocationUnitOptions } from '../_types/global.js';
import { drawLocation } from './locationGenerator.js';

/**
 * Generate a country's first-level divisions: a Korean 시·도, a US state or the
 * District of Columbia. Each is drawn as often as any other, whatever its size.
 *
 * @example
 * randRegion({ language: 'ko', count: 3 }); // ['경기도', '부산광역시', '제주특별자치도']
 * randRegion({ language: 'en', count: 2 }); // ['Ohio', 'New Mexico']
 */
export function randRegion(options?: RandLocationUnitOptions & { output?: 'value' }): string[];
/**
 * Regions along with the country each one is in.
 *
 * @example
 * randRegion({ language: 'en', output: 'detail' });
 * // [{ location: 'Ohio', language: 'en', level: 'region',
 * //    country: 'United States', region: 'Ohio', city: null, district: null }]
 */
export function randRegion(
	options: RandLocationUnitOptions & { output: 'detail' }
): LocationDetail[];
export function randRegion(options: RandLocationUnitOptions = {}): string[] | LocationDetail[] {
	return drawLocation('unit', 'region', options);
}
