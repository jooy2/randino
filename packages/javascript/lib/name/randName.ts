import type { NameDetail, RandNameOptions } from '../_types/global.js';
import { generateNameDetails } from './nameGenerator.js';

/**
 * Generate natural-looking person names.
 *
 * Returns `count` names as an array of strings, written in the script given by
 * `options.script`.
 *
 * @example
 * randName(); // ['Emma Clover']
 * randName({ language: 'ko', count: 3 }); // ['김민준', '이서연', '박지호']
 * randName({ language: 'ko', script: 'roman' }); // ['Kim Minjun']
 * randName({ language: 'en', gender: 'female', includeMiddleName: true });
 * // ['Grace Amelia Bennett']
 */
export function randName(options?: RandNameOptions & { output?: 'value' }): string[];
/**
 * Generate person names with both scripts and the choices behind each one.
 *
 * `output: 'detail'` returns a `NameDetail` per name instead of a string: every
 * name in its native form and romanized at the same time, plus the language and
 * gender behind it. `script` is ignored, because both forms are already there.
 *
 * @example
 * randName({ language: 'ko', output: 'detail' });
 * // [{ native: '김민준', roman: 'Kim Minjun', language: 'ko', gender: 'male' }]
 */
export function randName(options: RandNameOptions & { output: 'detail' }): NameDetail[];
export function randName(options: RandNameOptions = {}): string[] | NameDetail[] {
	const details = generateNameDetails(options);

	if (options.output === 'detail') {
		return details;
	}

	const script = options.script ?? 'native';

	return details.map((detail) => (script === 'roman' ? detail.roman : detail.native));
}
