import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Things that carry you.
 *
 * `randWord({ theme: 'vehicle' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randVehicle({ language: 'ko', count: 3 }); // ['자전거', '기차', '열기구']
 * randVehicle({ language: 'en', count: 3 }); // ['Bicycle', 'Boat', 'Locomotive']
 */
export function randVehicle(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Vehicle words with the language and theme each one came from.
 *
 * @example
 * randVehicle({ language: 'ko', output: 'detail' });
 * // [{ word: '자전거', language: 'ko', theme: 'vehicle' }]
 */
export function randVehicle(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randVehicle(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('vehicle', options);
}
