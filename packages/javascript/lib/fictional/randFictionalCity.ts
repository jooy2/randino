import type {
	FictionalForms,
	FictionalPlaceDetail,
	RandFictionalPlaceOptions,
	WordLanguage,
	WordLanguageOption
} from '../_types/global.js';
import { generateFictionalPlaceDetails } from './placeGenerator.js';

/**
 * Generate the names of cities and towns that do not exist, for the map of a
 * story or a game. A city may carry the kind of place it is beside its name —
 * left out, `includeKind` decides that per city, and a city's kind keeps its
 * English word outside English unless `kindStyle` says otherwise.
 *
 * A name is spelled in Latin letters first and written by its sound in every
 * other language, and the kind in each language's own words. `'all'`, the
 * default, draws a language per result.
 *
 * @example
 * randFictionalCity({ language: 'en', count: 3 }); // ['Ashwick', 'Port Ravenford', 'Hollowbrook Falls']
 * randFictionalCity({ language: 'ko', count: 3 }); // ['애시윅', '포트 레이븐퍼드', '할로브룩 폴스']
 * randFictionalCity({ language: 'es', kindStyle: 'translated', includeKind: true }); // ['Puerto Ravenford']
 */
export function randFictionalCity(
	options?: RandFictionalPlaceOptions & { language?: WordLanguageOption; output?: 'value' }
): string[];
/**
 * Generate fictional cities and towns in several languages at once, for a game or a
 * book that shows the same map to every reader in the reader's own language.
 *
 * A list of languages returns one object per result, the place in each language
 * keyed by its code, in the order of the list. The first language is the one
 * `startsWith` and the length range read.
 *
 * @example
 * randFictionalCity({ language: ['ko', 'en', 'ru'], includeKind: true });
 * // [{ ko: '애시윅 스프링스', en: 'Ashwick Springs', ru: 'Эшуик-Спрингс' }]
 */
export function randFictionalCity<L extends WordLanguage>(
	options: RandFictionalPlaceOptions & { language: readonly L[]; output?: 'value' }
): FictionalForms<L>[];
/**
 * Generate fictional cities and towns along with their names and kinds.
 *
 * `output: 'detail'` returns a `FictionalPlaceDetail` per result: the place and
 * its name in its language, its kind, and the same place in every language
 * asked for under `forms`.
 *
 * @example
 * randFictionalCity({ language: ['en', 'ru'], includeKind: true, output: 'detail' });
 * // [{ place: 'Ashwick Springs', name: 'Ashwick', kind: 'springs', level: 'city',
 * //    language: 'en', forms: { en: 'Ashwick Springs', ru: 'Эшуик-Спрингс' } }]
 */
export function randFictionalCity(
	options: RandFictionalPlaceOptions & { output: 'detail' }
): FictionalPlaceDetail[];
/**
 * A call whose `language` is only known when it runs: strings for one language
 * or `'all'`, a `FictionalForms` per result for a list.
 */
export function randFictionalCity(
	options?: RandFictionalPlaceOptions & { output?: 'value' }
): string[] | FictionalForms[];
export function randFictionalCity(
	options: RandFictionalPlaceOptions = {}
): string[] | FictionalForms[] | FictionalPlaceDetail[] {
	options ??= {};

	const details = generateFictionalPlaceDetails('city', options);

	if (options.output === 'detail') {
		return details;
	}

	return Array.isArray(options.language)
		? details.map((detail) => detail.forms as FictionalForms)
		: details.map((detail) => detail.place);
}
