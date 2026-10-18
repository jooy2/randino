import type { FictionalPlaceDetail, RandFictionalPlaceOptions } from '../_types/global.js';
import { generateFictionalPlaceDetails } from './placeGenerator.js';

/**
 * Generate the names of districts — the parts of a city a story moves between — that do not exist, for the map of a story or a
 * game. A place may carry the kind it is beside its name — left out,
 * `includeKind` decides that per place.
 *
 * A name is spelled in Latin letters first and written by its sound in every
 * other language, and the kind in each language's own words: a list of
 * languages draws one per place, and the detail form writes each place in all
 * of them.
 *
 * @example
 * randFictionalDistrict({ language: 'en', count: 3 }); // ['Gruger Park', 'Evelyn Bay', 'Hadley']
 * randFictionalDistrict({ language: 'ko', count: 3 }); // ['그루거 파크', '이블린 베이', '해들리']
 * randFictionalDistrict({ language: 'ko', kindStyle: 'translated', includeKind: true }); // ['그루거 공원']
 */
export function randFictionalDistrict(
	options?: RandFictionalPlaceOptions & { output?: 'value' }
): string[];
/**
 * Generate fictional districts — the parts of a city a story moves between — written in every language the call asks for.
 *
 * `output: 'detail'` returns a `FictionalPlaceDetail` per place: the place and
 * its name in the language drawn for it, its kind, and the same place in each
 * language of `language` under `forms`.
 *
 * @example
 * randFictionalDistrict({ language: ['en', 'zh'], includeKind: true, output: 'detail' });
 * // [{ place: 'Evelyn Bay', name: 'Evelyn', kind: 'bay', level: 'district',
 * //    language: 'en', forms: { en: 'Evelyn Bay', zh: '伊芙琳湾' } }]
 */
export function randFictionalDistrict(
	options: RandFictionalPlaceOptions & { output: 'detail' }
): FictionalPlaceDetail[];
export function randFictionalDistrict(
	options: RandFictionalPlaceOptions = {}
): string[] | FictionalPlaceDetail[] {
	options ??= {};

	const details = generateFictionalPlaceDetails('district', options);

	return options.output === 'detail' ? details : details.map((detail) => detail.place);
}
