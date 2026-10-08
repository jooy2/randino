// The disk size generator: a capacity a drive is really sold with, in a unit it
// is a whole number of.

import { capacityCandidates, writeCapacity } from '../_internal/capacity.js';
import { collect, resolveOption, resolveRandom } from '../_internal/generate.js';
import { pickWeighted, withRandom } from '../_internal/utils.js';
import type { DiskSizeDetail, DiskUnitOption, RandDiskSizeOptions } from '../_types/global.js';
import { DISK_SCALE, DISK_UNITS } from './data/index.js';

const DISK_UNIT_OPTIONS: readonly DiskUnitOption[] = [...DISK_UNITS, 'auto'];

export function generateDiskSizeDetails(options: RandDiskSizeOptions = {}): DiskSizeDetail[] {
	const includeUnit = options.includeUnit !== false;
	const asked = resolveOption(options.unit, DISK_UNIT_OPTIONS, 'auto');
	// Without the unit there is nothing to tell `2` terabytes from `512`
	// gigabytes, so a size written bare is in one unit throughout.
	const unit = asked === 'auto' && !includeUnit ? DISK_SCALE.reference : asked;
	// Worked out once per call: a couple of dozen sizes, each with its unit
	// already decided.
	const candidates = capacityCandidates(DISK_SCALE, unit, options.minSize, options.maxSize);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: candidates.length ? options.count : 0, unique: options.unique },
			() => {
				const {
					size,
					unit: written,
					value
				} = pickWeighted(candidates, (candidate) => candidate.weight);

				return {
					size: writeCapacity(value, written, includeUnit),
					value,
					unit: written,
					bytes: size * DISK_SCALE.bytes
				};
			},
			(detail) => detail.size
		)
	);
}
