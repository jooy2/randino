// The disk type generator: the kind of storage a machine has, by the platform it
// is drawn for.

import { collect, resolvePlatforms, resolveRandom } from '../_internal/generate.js';
import { pick, pickWeighted, withRandom } from '../_internal/utils.js';
import type { DiskType, DiskTypeDetail, RandDiskTypeOptions } from '../_types/global.js';
import { DISK_TYPES, DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS } from './data/index.js';

export function generateDiskTypeDetails(options: RandDiskTypeOptions = {}): DiskTypeDetail[] {
	const platforms = resolvePlatforms(options.platform);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: options.count, unique: options.unique },
			() => {
				// The platform first, so `'all'` is half desktops and half phones, and
				// eMMC — which both use — is drawn by the platform it came up for.
				const platform = pick(platforms);
				const weights = DISK_TYPE_WEIGHTS[platform];
				const code = pickWeighted(
					DISK_TYPES.filter((type): type is DiskType => weights[type] !== undefined),
					(type) => weights[type]!
				);

				return {
					diskType: DISK_TYPE_LABELS[code].label,
					code,
					name: DISK_TYPE_LABELS[code].name,
					platform
				};
			},
			(detail) => detail.diskType
		)
	);
}
