// The disk size generator: a capacity a drive is really sold with, in a unit it
// is a whole number of, for a kind of storage that is sold in it.

import { capacityCandidates, writeCapacity } from '../_internal/capacity.js';
import type { CapacityCandidate } from '../_internal/capacity.js';
import {
	collect,
	resolveMany,
	resolveOption,
	resolvePlatforms,
	resolveRandom
} from '../_internal/generate.js';
import { pick, pickWeighted, withRandom } from '../_internal/utils.js';
import type {
	DiskSizeDetail,
	DiskType,
	DiskUnit,
	DiskUnitOption,
	RandDiskSizeOptions,
	SystemPlatform
} from '../_types/global.js';
import { DISK_SCALE, DISK_SIZES, DISK_TYPES, DISK_TYPE_WEIGHTS, DISK_UNITS } from './data/index.js';

const DISK_UNIT_OPTIONS: readonly DiskUnitOption[] = [...DISK_UNITS, 'auto'];

/** A kind of storage one call may land on, with the sizes of it the call may write. */
type Kind = { type: DiskType; sizes: CapacityCandidate<DiskUnit>[] };

/**
 * The kinds of storage each platform may land on, each with its sizes. Worked
 * out once per call: a kind with no size left in the unit and the range asked
 * for is left out, and so is a platform with no kind left, so `'all'` never
 * draws a platform it then has nothing to write for.
 */
function candidatesFor(
	options: RandDiskSizeOptions,
	unit: DiskUnit | 'auto'
): { platform: SystemPlatform; kinds: Kind[] }[] {
	const named = resolveMany(options.type, DISK_TYPES, DISK_TYPES);

	return resolvePlatforms(options.platform)
		.map((platform) => ({
			platform,
			kinds: named
				.filter((type) => DISK_TYPE_WEIGHTS[platform][type] !== undefined)
				.map((type) => ({
					type,
					sizes: capacityCandidates(
						DISK_SCALE,
						DISK_SIZES[type],
						unit,
						options.minSize,
						options.maxSize
					)
				}))
				.filter((kind) => kind.sizes.length > 0)
		}))
		.filter((each) => each.kinds.length > 0);
}

export function generateDiskSizeDetails(options: RandDiskSizeOptions = {}): DiskSizeDetail[] {
	const includeUnit = options.includeUnit !== false;
	const asked = resolveOption(options.unit, DISK_UNIT_OPTIONS, 'auto');
	// Without the unit there is nothing to tell `2` terabytes from `512`
	// gigabytes, so a size written bare is in one unit throughout.
	const unit = asked === 'auto' && !includeUnit ? DISK_SCALE.reference : asked;
	const candidates = candidatesFor(options, unit);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: candidates.length ? options.count : 0, unique: options.unique },
			() => {
				// The platform first, so `'all'` is half desktops and half phones, then
				// the kind of storage by how common it is there, then a size it is sold in.
				const { platform, kinds } = pick(candidates);
				const { type, sizes } = pickWeighted(
					kinds,
					(kind) => DISK_TYPE_WEIGHTS[platform][kind.type]!
				);
				const { size, unit: written, value } = pickWeighted(sizes, (candidate) => candidate.weight);

				return {
					size: writeCapacity(value, written, includeUnit),
					value,
					unit: written,
					bytes: size * DISK_SCALE.bytes,
					type,
					platform
				};
			},
			(detail) => detail.size
		)
	);
}
