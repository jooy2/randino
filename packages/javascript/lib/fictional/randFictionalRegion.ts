import type { FictionalPlaceDetail, RandFictionalPlaceOptions } from '../_types/global.js';
import { generateFictionalPlaceDetails } from './placeGenerator.js';

/**
 * Generate the names of regions — provinces, valleys, coasts and the like — that do not exist, for the map of a story or a
 * game. A place may carry the kind it is beside its name — left out,
 * `includeKind` decides that per place.
 *
 * A name is spelled in Latin letters first and written by its sound in every
 * other language, and the kind in each language's own words: a list of
 * languages draws one per place, and the detail form writes each place in all
 * of them.
 *
 * @example
 * randFictionalRegion({ language: 'en', count: 3 }); // ['Silverfen Valley', 'Altheria', 'Isle of Lumeria']
 * randFictionalRegion({ language: 'ko', count: 3 }); // ['실버펜 계곡', '알테리아', '루메리아섬']
 * randFictionalRegion({ language: 'de', includeKind: true }); // ['Grafschaft Altheria']
 */
export function randFictionalRegion(
	options?: RandFictionalPlaceOptions & { output?: 'value' }
): string[];
/**
 * Generate fictional regions — provinces, valleys, coasts and the like — written in every language the call asks for.
 *
 * `output: 'detail'` returns a `FictionalPlaceDetail` per place: the place and
 * its name in the language drawn for it, its kind, and the same place in each
 * language of `language` under `forms`.
 *
 * @example
 * randFictionalRegion({ language: ['en', 'ja'], includeKind: true, output: 'detail' });
 * // [{ place: 'Mistvale Highlands', name: 'Mistvale', kind: 'highlands', level: 'region',
 * //    language: 'en', forms: { en: 'Mistvale Highlands', ja: 'ミストヴェイル高地' } }]
 */
export function randFictionalRegion(
	options: RandFictionalPlaceOptions & { output: 'detail' }
): FictionalPlaceDetail[];
export function randFictionalRegion(
	options: RandFictionalPlaceOptions = {}
): string[] | FictionalPlaceDetail[] {
	options ??= {};

	const details = generateFictionalPlaceDetails('region', options);

	return options.output === 'detail' ? details : details.map((detail) => detail.place);
}
