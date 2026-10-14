// The resolution generator: a screen size people really have, drawn by how
// common it is on the platform it is drawn for.

import { collectFrom, resolvePlatforms, resolveRandom } from '../_internal/generate.js';
import { shares, withRandom } from '../_internal/utils.js';
import type { RandResolutionOptions, ResolutionDetail } from '../_types/global.js';
import { RESOLUTIONS, RESOLUTION_SEPARATOR_DEFAULT } from './data/index.js';

export function generateResolutionDetails(options: RandResolutionOptions = {}): ResolutionDetail[] {
	const separator =
		typeof options.separator === 'string' ? options.separator : RESOLUTION_SEPARATOR_DEFAULT;
	// One list per platform, worked out once per call rather than per draw.
	const pools = resolvePlatforms(options.platform).map((platform) =>
		RESOLUTIONS.filter((entry) => entry.platform === platform)
	);

	// The platform first, so `'all'` is half screens of each kind rather than
	// whichever kind the table happens to list more sizes for.
	const outcomes = pools.flatMap((pool) =>
		shares(pool, (entry) => entry.weight).map((share, index) => ({
			entry: pool[index],
			weight: share / pools.length
		}))
	);

	return withRandom(resolveRandom(options.random), () =>
		collectFrom(
			{ count: options.count, unique: options.unique },
			outcomes,
			({ width, height }) => `${width}${separator}${height}`,
			({ width, height, platform }) => ({
				resolution: `${width}${separator}${height}`,
				width,
				height,
				platform
			})
		)
	);
}
