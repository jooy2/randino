import type {
	FictionalForms,
	FictionalPlaceDetail,
	RandFictionalPlaceOptions,
	WordLanguage,
	WordLanguageOption
} from '../_types/global.js';
import { generateFictionalPlaceDetails } from './placeGenerator.js';

/**
 * Generate the names of countries that do not exist, for the map of a story or a
 * game. A country may carry the kind of state it is beside its name — left out,
 * `includeKind` decides that per country, and a country's kind is translated
 * outside English unless `kindStyle` says otherwise.
 *
 * A name is spelled in Latin letters first and written by its sound in every
 * other language, and the kind in each language's own words. `'all'`, the
 * default, draws a language per result.
 *
 * @example
 * randFictionalCountry({ language: 'en', count: 3 }); // ['Kingdom of Edlin', 'Glacia', 'Castavia Empire']
 * randFictionalCountry({ language: 'ko', count: 3 }); // ['에들린 왕국', '글래시아', '카스타비아 제국']
 * randFictionalCountry({ language: 'ko', kindStyle: 'borrowed', includeKind: true }); // ['에들린 킹덤']
 */
export function randFictionalCountry(
	options?: RandFictionalPlaceOptions & { language?: WordLanguageOption; output?: 'value' }
): string[];
/**
 * Generate fictional countries in several languages at once, for a game or a
 * book that shows the same map to every reader in the reader's own language.
 *
 * A list of languages returns one object per result, the place in each language
 * keyed by its code, in the order of the list. The first language is the one
 * `startsWith` and the length range read.
 *
 * @example
 * randFictionalCountry({ language: ['ko', 'en'], includeKind: true });
 * // [{ ko: '에들린 왕국', en: 'Kingdom of Edlin' }]
 */
export function randFictionalCountry<L extends WordLanguage>(
	options: RandFictionalPlaceOptions & { language: readonly L[]; output?: 'value' }
): FictionalForms<L>[];
/**
 * Generate fictional countries along with their names and kinds.
 *
 * `output: 'detail'` returns a `FictionalPlaceDetail` per result: the place and
 * its name in its language, its kind, and the same place in every language
 * asked for under `forms`.
 *
 * @example
 * randFictionalCountry({ language: ['en', 'ko'], includeKind: true, output: 'detail' });
 * // [{ place: 'Kingdom of Edlin', name: 'Edlin', kind: 'kingdom', level: 'country',
 * //    language: 'en', forms: { en: 'Kingdom of Edlin', ko: '에들린 왕국' } }]
 */
export function randFictionalCountry(
	options: RandFictionalPlaceOptions & { output: 'detail' }
): FictionalPlaceDetail[];
/**
 * A call whose `language` is only known when it runs: strings for one language
 * or `'all'`, a `FictionalForms` per result for a list.
 */
export function randFictionalCountry(
	options?: RandFictionalPlaceOptions & { output?: 'value' }
): string[] | FictionalForms[];
export function randFictionalCountry(
	options: RandFictionalPlaceOptions = {}
): string[] | FictionalForms[] | FictionalPlaceDetail[] {
	options ??= {};

	const details = generateFictionalPlaceDetails('country', options);

	if (options.output === 'detail') {
		return details;
	}

	return Array.isArray(options.language)
		? details.map((detail) => detail.forms as FictionalForms)
		: details.map((detail) => detail.place);
}
