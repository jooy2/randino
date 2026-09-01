import type { RandomNameOptions } from '../_types/global.js';
import { generateNameDetails } from './nameGenerator.js';

/**
 * Generate natural-looking person names.
 *
 * Returns `count` names as an array of strings, written in the script given by
 * `options.script`. Use `randomNameDetails` to get the native and romanized form
 * of each name together.
 *
 * @example
 * randomName(); // ['Emma Clover']
 * randomName({ language: 'ko', count: 3 }); // ['김민준', '이서연', '박지호']
 * randomName({ language: 'ko', script: 'roman' }); // ['Kim Minjun']
 * randomName({ language: 'en', gender: 'female', includeMiddleName: true });
 * // ['Grace Amelia Bennett']
 */
export function randomName(options: RandomNameOptions = {}): string[] {
	const script = options.script ?? 'native';

	return generateNameDetails(options).map((detail) =>
		script === 'roman' ? detail.roman : detail.native
	);
}
