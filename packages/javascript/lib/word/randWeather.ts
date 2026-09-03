import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * What the sky is doing, from a breeze to a blizzard.
 *
 * `randWord({ theme: 'weather' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randWeather({ language: 'ko', count: 3 }); // ['소나기', '무지개', '된서리']
 * randWeather({ language: 'en', count: 3 }); // ['Drizzle', 'Rainbow', 'Hoarfrost']
 */
export function randWeather(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Weather words with the language and theme each one came from.
 *
 * @example
 * randWeather({ language: 'ko', output: 'detail' });
 * // [{ word: '소나기', language: 'ko', theme: 'weather' }]
 */
export function randWeather(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randWeather(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('weather', options);
}
