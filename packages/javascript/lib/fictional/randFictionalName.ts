import type {
	FictionalForms,
	FictionalNameDetail,
	RandFictionalNameOptions,
	WordLanguage,
	WordLanguageOption
} from '../_types/global.js';
import { generateFictionalNameDetails } from './nameGenerator.js';

/**
 * Generate names for the characters of a story or a game: the names a novel, a
 * game or a tabletop campaign gives its cast, rather than the names of real
 * people in one country.
 *
 * A name is spelled in Latin letters first, English and British names among
 * them, and written by its sound in every other language: `Artemis` is
 * `아르테미스` in Korean and `アルテミス` in Japanese. `'all'`, the default,
 * draws a language per name.
 *
 * @example
 * randFictionalName({ language: 'en', count: 3 }); // ['Alice', 'Arsis', 'Emily']
 * randFictionalName({ language: 'ko', gender: 'female', count: 3 });
 * // ['앨리스', '트리아', '베리']
 * randFictionalName({ language: 'ja', includeSurname: true }); // ['アスター・シンクレア']
 */
export function randFictionalName(
	options?: RandFictionalNameOptions & { language?: WordLanguageOption; output?: 'value' }
): string[];
/**
 * Generate fictional names in several languages at once, for a game or a book
 * that shows the same character to every reader in the reader's own language.
 *
 * A list of languages returns one object per name, the name in each language
 * keyed by its code, in the order of the list. The first language is the one
 * `startsWith` and the length range read.
 *
 * @example
 * randFictionalName({ language: ['ko', 'en', 'ja'], count: 2 });
 * // [{ ko: '아르테미스', en: 'Artemis', ja: 'アルテミス' },
 * //  { ko: '앨리스', en: 'Alice', ja: 'アリス' }]
 */
export function randFictionalName<L extends WordLanguage>(
	options: RandFictionalNameOptions & { language: readonly L[]; output?: 'value' }
): FictionalForms<L>[];
/**
 * Generate fictional names along with the gender behind each one.
 *
 * `output: 'detail'` returns a `FictionalNameDetail` per name: the name in its
 * language, its gender, and the same name in every language asked for under
 * `forms`.
 *
 * @example
 * randFictionalName({ language: ['en', 'ko'], output: 'detail' });
 * // [{ name: 'Artemis', gender: 'female', language: 'en',
 * //    forms: { en: 'Artemis', ko: '아르테미스' } }]
 */
export function randFictionalName(
	options: RandFictionalNameOptions & { output: 'detail' }
): FictionalNameDetail[];
/**
 * A call whose `language` is only known when it runs: strings for one language
 * or `'all'`, a `FictionalForms` per result for a list.
 */
export function randFictionalName(
	options?: RandFictionalNameOptions & { output?: 'value' }
): string[] | FictionalForms[];
export function randFictionalName(
	options: RandFictionalNameOptions = {}
): string[] | FictionalForms[] | FictionalNameDetail[] {
	options ??= {};

	const details = generateFictionalNameDetails(options);

	if (options.output === 'detail') {
		return details;
	}

	return Array.isArray(options.language)
		? details.map((detail) => detail.forms as FictionalForms)
		: details.map((detail) => detail.name);
}
