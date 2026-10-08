import type { RandResolutionOptions, ResolutionDetail } from '../_types/global.js';
import { generateResolutionDetails } from './resolutionGenerator.js';

/**
 * Generate screen resolutions, the way a browser reports them, with the common
 * ones most often.
 *
 * 1920x1080 is about a quarter of the desktops, and the sizes of the common
 * iPhones and Android phones lead on mobile. Each is written as the width, `x`
 * and the height, or with the `separator` named.
 *
 * @example
 * randResolution(); // ['1920x1080']
 * randResolution({ platform: 'mobile', count: 2 }); // ['390x844', '360x800']
 * randResolution({ separator: ' × ' }); // ['2560 × 1440']
 */
export function randResolution(options?: RandResolutionOptions & { output?: 'value' }): string[];
/**
 * Generate resolutions along with the width and the height as numbers.
 *
 * `output: 'detail'` returns a `ResolutionDetail` per resolution instead of a
 * string.
 *
 * @example
 * randResolution({ output: 'detail' });
 * // [{ resolution: '1920x1080', width: 1920, height: 1080, platform: 'desktop' }]
 */
export function randResolution(
	options: RandResolutionOptions & { output: 'detail' }
): ResolutionDetail[];
export function randResolution(options: RandResolutionOptions = {}): string[] | ResolutionDetail[] {
	const details = generateResolutionDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.resolution);
}
