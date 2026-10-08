// The resolution generator: a screen size people really have, drawn by how
// common it is on the platform it is drawn for.

import { collect, resolvePlatforms, resolveRandom } from '../_internal/generate.js';
import { pick, pickWeighted, withRandom } from '../_internal/utils.js';
import type { RandResolutionOptions, ResolutionDetail } from '../_types/global.js';
import { RESOLUTIONS, RESOLUTION_SEPARATOR_DEFAULT } from './data/index.js';

export function generateResolutionDetails(options: RandResolutionOptions = {}): ResolutionDetail[] {
	const separator =
		typeof options.separator === 'string' ? options.separator : RESOLUTION_SEPARATOR_DEFAULT;
	// One list per platform, worked out once per call rather than per draw.
	const pools = resolvePlatforms(options.platform).map((platform) =>
		RESOLUTIONS.filter((entry) => entry.platform === platform)
	);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: options.count, unique: options.unique },
			() => {
				// The platform first, so `'all'` is half screens of each kind rather than
				// whichever kind the table happens to list more sizes for.
				const { width, height, platform } = pickWeighted(pick(pools), (entry) => entry.weight);

				return { resolution: `${width}${separator}${height}`, width, height, platform };
			},
			(detail) => detail.resolution
		)
	);
}
