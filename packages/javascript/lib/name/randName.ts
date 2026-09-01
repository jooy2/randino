import type { RandNameOptions } from '../_types/global.js';
import { generateNameDetails } from './nameGenerator.js';

/**
 * Generate natural-looking person names.
 *
 * Returns `count` names as an array of strings, written in the script given by
 * `options.script`. Use `randNameDetails` to get the native and romanized form
 * of each name together.
 *
 * @example
 * randName(); // ['Emma Clover']
 * randName({ language: 'ko', count: 3 }); // ['김민준', '이서연', '박지호']
 * randName({ language: 'ko', script: 'roman' }); // ['Kim Minjun']
 * randName({ language: 'en', gender: 'female', includeMiddleName: true });
 * // ['Grace Amelia Bennett']
 */
export function randName(options: RandNameOptions = {}): string[] {
	const script = options.script ?? 'native';

	return generateNameDetails(options).map((detail) =>
		script === 'roman' ? detail.roman : detail.native
	);
}
