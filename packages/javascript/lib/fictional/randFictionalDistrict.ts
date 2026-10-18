import type {
	FictionalForms,
	FictionalPlaceDetail,
	RandFictionalPlaceOptions,
	WordLanguage,
	WordLanguageOption
} from '../_types/global.js';
import { generateFictionalPlaceDetails } from './placeGenerator.js';

/**
 * Generate the names of districts that do not exist — the parts of a city a
 * story moves between. A district usually carries the kind of place it is
 * beside its name — left out, `includeKind` decides that per district, and a
 * district's kind keeps its English word outside English unless `kindStyle`
 * says otherwise.
 *
 * A name is spelled in Latin letters first and written by its sound in every
 * other language, and the kind in each language's own words. `'all'`, the
 * default, draws a language per result.
 *
 * @example
 * randFictionalDistrict({ language: 'en', count: 3 }); // ['Gruger Park', 'Evelyn Bay', 'Hadley']
 * randFictionalDistrict({ language: 'ko', count: 3 }); // ['그루거 파크', '이블린 베이', '해들리']
 * randFictionalDistrict({ language: 'ko', kindStyle: 'translated', includeKind: true }); // ['그루거 공원']
 */
export function randFictionalDistrict(
	options?: RandFictionalPlaceOptions & { language?: WordLanguageOption; output?: 'value' }
): string[];
/**
 * Generate fictional districts in several languages at once, for a game or a
 * book that shows the same map to every reader in the reader's own language.
 *
 * A list of languages returns one object per result, the place in each language
 * keyed by its code, in the order of the list. The first language is the one
 * `startsWith` and the length range read.
 *
 * @example
 * randFictionalDistrict({ language: ['ko', 'en', 'zh'], includeKind: true });
 * // [{ ko: '이블린 베이', en: 'Evelyn Bay', zh: '伊芙琳湾' }]
 */
export function randFictionalDistrict<L extends WordLanguage>(
	options: RandFictionalPlaceOptions & { language: readonly L[]; output?: 'value' }
): FictionalForms<L>[];
/**
 * Generate fictional districts along with their names and kinds.
 *
 * `output: 'detail'` returns a `FictionalPlaceDetail` per result: the place and
 * its name in its language, its kind, and the same place in every language
 * asked for under `forms`.
 *
 * @example
 * randFictionalDistrict({ language: ['en', 'zh'], includeKind: true, output: 'detail' });
 * // [{ place: 'Evelyn Bay', name: 'Evelyn', kind: 'bay', level: 'district',
 * //    language: 'en', forms: { en: 'Evelyn Bay', zh: '伊芙琳湾' } }]
 */
export function randFictionalDistrict(
	options: RandFictionalPlaceOptions & { output: 'detail' }
): FictionalPlaceDetail[];
/**
 * A call whose `language` is only known when it runs: strings for one language
 * or `'all'`, a `FictionalForms` per result for a list.
 */
export function randFictionalDistrict(
	options?: RandFictionalPlaceOptions & { output?: 'value' }
): string[] | FictionalForms[];
export function randFictionalDistrict(
	options: RandFictionalPlaceOptions = {}
): string[] | FictionalForms[] | FictionalPlaceDetail[] {
	options ??= {};

	const details = generateFictionalPlaceDetails('district', options);

	if (options.output === 'detail') {
		return details;
	}

	return Array.isArray(options.language)
		? details.map((detail) => detail.forms as FictionalForms)
		: details.map((detail) => detail.place);
}
