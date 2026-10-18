import type { FictionalPlaceDetail, RandFictionalPlaceOptions } from '../_types/global.js';
import { generateFictionalPlaceDetails } from './placeGenerator.js';

/**
 * Generate the names of cities and towns that do not exist, for the map of a story or a
 * game. A place may carry the kind it is beside its name — left out,
 * `includeKind` decides that per place.
 *
 * A name is spelled in Latin letters first and written by its sound in every
 * other language, and the kind in each language's own words: a list of
 * languages draws one per place, and the detail form writes each place in all
 * of them.
 *
 * @example
 * randFictionalCity({ language: 'en', count: 3 }); // ['Ashwick', 'Port Ravenford', 'Hollowbrook Falls']
 * randFictionalCity({ language: 'ko', count: 3 }); // ['애시윅', '포트 레이븐퍼드', '할로브룩 폴스']
 * randFictionalCity({ language: 'es', kindStyle: 'translated', includeKind: true }); // ['Puerto Ravenford']
 */
export function randFictionalCity(
	options?: RandFictionalPlaceOptions & { output?: 'value' }
): string[];
/**
 * Generate fictional cities and towns written in every language the call asks for.
 *
 * `output: 'detail'` returns a `FictionalPlaceDetail` per place: the place and
 * its name in the language drawn for it, its kind, and the same place in each
 * language of `language` under `forms`.
 *
 * @example
 * randFictionalCity({ language: ['en', 'ru'], includeKind: true, output: 'detail' });
 * // [{ place: 'Ashwick Springs', name: 'Ashwick', kind: 'springs', level: 'city',
 * //    language: 'en', forms: { en: 'Ashwick Springs', ru: 'Эшуик-Спрингс' } }]
 */
export function randFictionalCity(
	options: RandFictionalPlaceOptions & { output: 'detail' }
): FictionalPlaceDetail[];
export function randFictionalCity(
	options: RandFictionalPlaceOptions = {}
): string[] | FictionalPlaceDetail[] {
	options ??= {};

	const details = generateFictionalPlaceDetails('city', options);

	return options.output === 'detail' ? details : details.map((detail) => detail.place);
}
