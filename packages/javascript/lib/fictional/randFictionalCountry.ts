import type { FictionalPlaceDetail, RandFictionalPlaceOptions } from '../_types/global.js';
import { generateFictionalPlaceDetails } from './placeGenerator.js';

/**
 * Generate the names of countries that do not exist, for the map of a story or a
 * game. A place may carry the kind it is beside its name — left out,
 * `includeKind` decides that per place.
 *
 * A name is spelled in Latin letters first and written by its sound in every
 * other language, and the kind in each language's own words: a list of
 * languages draws one per place, and the detail form writes each place in all
 * of them.
 *
 * @example
 * randFictionalCountry({ language: 'en', count: 3 }); // ['Kingdom of Edlin', 'Glacia', 'Valoria Empire']
 * randFictionalCountry({ language: 'ko', count: 3 }); // ['에들린 왕국', '글래시아', '발로리아 제국']
 * randFictionalCountry({ language: 'ko', kindStyle: 'borrowed', includeKind: true }); // ['에들린 킹덤']
 */
export function randFictionalCountry(
	options?: RandFictionalPlaceOptions & { output?: 'value' }
): string[];
/**
 * Generate fictional countries written in every language the call asks for.
 *
 * `output: 'detail'` returns a `FictionalPlaceDetail` per place: the place and
 * its name in the language drawn for it, its kind, and the same place in each
 * language of `language` under `forms`.
 *
 * @example
 * randFictionalCountry({ language: ['en', 'ko'], includeKind: true, output: 'detail' });
 * // [{ place: 'Kingdom of Edlin', name: 'Edlin', kind: 'kingdom', level: 'country',
 * //    language: 'en', forms: { en: 'Kingdom of Edlin', ko: '에들린 왕국' } }]
 */
export function randFictionalCountry(
	options: RandFictionalPlaceOptions & { output: 'detail' }
): FictionalPlaceDetail[];
export function randFictionalCountry(
	options: RandFictionalPlaceOptions = {}
): string[] | FictionalPlaceDetail[] {
	options ??= {};

	const details = generateFictionalPlaceDetails('country', options);

	return options.output === 'detail' ? details : details.map((detail) => detail.place);
}
