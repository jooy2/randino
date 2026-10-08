import type { RandVersionOptions, VersionDetail } from '../_types/global.js';
import { generateVersionDetails } from './versionGenerator.js';

/**
 * Generate software version numbers: `2.14.3`, `2024.3.1`, `42`.
 *
 * `format` picks how they are numbered — `semver`, `calver` or `number` — and
 * every part is drawn with the small numbers most often, so `0.x` and `x.y.0`
 * come up the way they do in a registry. `prefix` writes something in front of
 * each, and `includePrerelease` gives a semantic version a `-beta.2` now and then.
 *
 * @example
 * randVersion(); // ['2.14.3']
 * randVersion({ format: 'calver', count: 3 }); // ['2024.3.1', '24.04', '2019.2']
 * randVersion({ format: 'number', prefix: 'v' }); // ['v42']
 * randVersion({ includePrerelease: true, count: 3 }); // ['1.4.0', '3.0.0-rc.1', '0.12.2']
 */
export function randVersion(options?: RandVersionOptions & { output?: 'value' }): string[];
/**
 * Generate versions along with the numbers they are made of.
 *
 * `output: 'detail'` returns a `VersionDetail` per version instead of a string.
 *
 * @example
 * randVersion({ output: 'detail' });
 * // [{ version: '2.14.3', format: 'semver', scheme: 'MAJOR.MINOR.PATCH', parts: [2, 14, 3], prerelease: null, year: null }]
 */
export function randVersion(options: RandVersionOptions & { output: 'detail' }): VersionDetail[];
export function randVersion(options: RandVersionOptions = {}): string[] | VersionDetail[] {
	const details = generateVersionDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.version);
}
