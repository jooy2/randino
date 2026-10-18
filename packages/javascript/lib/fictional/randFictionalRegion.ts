import type {
	FictionalForms,
	FictionalPlaceDetail,
	RandFictionalPlaceOptions,
	WordLanguage,
	WordLanguageOption
} from '../_types/global.js';
import { generateFictionalPlaceDetails } from './placeGenerator.js';

/**
 * Generate the names of regions that do not exist — provinces, valleys, coasts
 * and the like — for the map of a story or a game. A region may carry the kind
 * of place it is beside its name — left out, `includeKind` decides that per
 * region, and a region's kind is translated outside English unless `kindStyle`
 * says otherwise.
 *
 * A name is spelled in Latin letters first and written by its sound in every
 * other language, and the kind in each language's own words. `'all'`, the
 * default, draws a language per result.
 *
 * @example
 * randFictionalRegion({ language: 'en', count: 3 }); // ['Silverfen Valley', 'Altheria', 'Isle of Lumeria']
 * randFictionalRegion({ language: 'ko', count: 3 }); // ['실버펜 계곡', '알테리아', '루메리아섬']
 * randFictionalRegion({ language: 'de', includeKind: true }); // ['Grafschaft Altheria']
 */
export function randFictionalRegion(
	options?: RandFictionalPlaceOptions & { language?: WordLanguageOption; output?: 'value' }
): string[];
/**
 * Generate fictional regions in several languages at once, for a game or a
 * book that shows the same map to every reader in the reader's own language.
 *
 * A list of languages returns one object per result, the place in each language
 * keyed by its code, in the order of the list. The first language is the one
 * `startsWith` and the length range read.
 *
 * @example
 * randFictionalRegion({ language: ['ko', 'en'], includeKind: true });
 * // [{ ko: '실버펜 계곡', en: 'Silverfen Valley' }]
 */
export function randFictionalRegion<L extends WordLanguage>(
	options: RandFictionalPlaceOptions & { language: readonly L[]; output?: 'value' }
): FictionalForms<L>[];
/**
 * Generate fictional regions along with their names and kinds.
 *
 * `output: 'detail'` returns a `FictionalPlaceDetail` per result: the place and
 * its name in its language, its kind, and the same place in every language
 * asked for under `forms`.
 *
 * @example
 * randFictionalRegion({ language: ['en', 'ja'], includeKind: true, output: 'detail' });
 * // [{ place: 'Novaria Frontier', name: 'Novaria', kind: 'frontier', level: 'region',
 * //    language: 'en', forms: { en: 'Novaria Frontier', ja: 'ノヴァリア辺境' } }]
 */
export function randFictionalRegion(
	options: RandFictionalPlaceOptions & { output: 'detail' }
): FictionalPlaceDetail[];
/**
 * A call whose `language` is only known when it runs: strings for one language
 * or `'all'`, a `FictionalForms` per result for a list.
 */
export function randFictionalRegion(
	options?: RandFictionalPlaceOptions & { output?: 'value' }
): string[] | FictionalForms[];
export function randFictionalRegion(
	options: RandFictionalPlaceOptions = {}
): string[] | FictionalForms[] | FictionalPlaceDetail[] {
	options ??= {};

	const details = generateFictionalPlaceDetails('region', options);

	if (options.output === 'detail') {
		return details;
	}

	return Array.isArray(options.language)
		? details.map((detail) => detail.forms as FictionalForms)
		: details.map((detail) => detail.place);
}
