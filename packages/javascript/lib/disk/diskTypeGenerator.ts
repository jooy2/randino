// The disk type generator: the kind of storage a machine has, by the platform it
// is drawn for.

import {
	collectFrom,
	keptOutcomes,
	resolvePlatforms,
	resolveRandom
} from '../_internal/generate.js';
import type { Outcome } from '../_internal/generate.js';
import { shares, withRandom } from '../_internal/utils.js';
import type {
	DiskType,
	DiskTypeDetail,
	RandDiskTypeOptions,
	SystemPlatform
} from '../_types/global.js';
import { DISK_TYPES, DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS } from './data/index.js';

// The kinds each set of platforms uses, kept so a call does not work them out again.
const kept = new Map<string, readonly Outcome<{ platform: SystemPlatform; code: DiskType }>[]>();

export function generateDiskTypeDetails(options: RandDiskTypeOptions = {}): DiskTypeDetail[] {
	const platforms = resolvePlatforms(options.platform);

	// The platform first, so `'all'` is half desktops and half phones, and eMMC —
	// which both use — is drawn by the platform it came up for.
	const outcomes = keptOutcomes(kept, String(platforms), () =>
		platforms.flatMap((platform) => {
			const weights = DISK_TYPE_WEIGHTS[platform];
			const codes = DISK_TYPES.filter((type): type is DiskType => weights[type] !== undefined);

			return shares(codes, (type) => weights[type]!).map((share, index) => ({
				entry: { platform, code: codes[index] },
				weight: share / platforms.length
			}));
		})
	);

	return withRandom(resolveRandom(options.random), () =>
		collectFrom(
			{ count: options.count, unique: options.unique },
			outcomes,
			({ code }) => DISK_TYPE_LABELS[code].label,
			({ platform, code }) => ({
				diskType: DISK_TYPE_LABELS[code].label,
				code,
				name: DISK_TYPE_LABELS[code].name,
				platform
			})
		)
	);
}
