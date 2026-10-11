import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Planets by name — the eight, the dwarf planets, named minor planets and
 * the exoplanets the IAU has named. Never a catalogue designation.
 *
 * `randWord({ theme: 'planet' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randPlanet({ language: 'ko', count: 3 }); // ['화성', '목성', '세드나']
 * randPlanet({ language: 'en', count: 3 }); // ['Mars', 'Jupiter', 'Sedna']
 */
export function randPlanet(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Planet names with the language and theme each one came from.
 *
 * @example
 * randPlanet({ language: 'ko', output: 'detail' });
 * // [{ word: '화성', language: 'ko', theme: 'planet' }]
 */
export function randPlanet(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randPlanet(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('planet', options);
}
