import type { FictionalNameDetail, RandFictionalNameOptions } from '../_types/global.js';
import { generateFictionalNameDetails } from './nameGenerator.js';

/**
 * Generate names for the characters of a story or a game: the names a novel, a
 * game or a tabletop campaign gives its cast, rather than the names of real
 * people in one country.
 *
 * A name is spelled in Latin letters first, English and British names among
 * them, and written by its sound in every other language: `Artemis` is
 * `아르테미스` in Korean and `アルテミス` in Japanese. A list of languages draws
 * one per name, and the detail form writes each name in all of them.
 *
 * @example
 * randFictionalName({ language: 'en', count: 3 }); // ['Alice', 'Theron', 'Elara']
 * randFictionalName({ language: 'ko', gender: 'female', count: 3 });
 * // ['앨리스', '트리아', '에밀리']
 * randFictionalName({ language: 'ja', includeSurname: true }); // ['エララ・ブラックウッド']
 */
export function randFictionalName(
	options?: RandFictionalNameOptions & { output?: 'value' }
): string[];
/**
 * Generate fictional names written in every language the call asks for.
 *
 * `output: 'detail'` returns a `FictionalNameDetail` per name: the name in the
 * language drawn for it, its gender, and the same name in each language of
 * `language` under `forms`.
 *
 * @example
 * randFictionalName({ language: ['en', 'ko', 'ja'], output: 'detail' });
 * // [{ name: 'Artemis', gender: 'female', language: 'en',
 * //    forms: { en: 'Artemis', ko: '아르테미스', ja: 'アルテミス' } }]
 */
export function randFictionalName(
	options: RandFictionalNameOptions & { output: 'detail' }
): FictionalNameDetail[];
export function randFictionalName(
	options: RandFictionalNameOptions = {}
): string[] | FictionalNameDetail[] {
	options ??= {};

	const details = generateFictionalNameDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.name);
}
