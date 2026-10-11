// The RAM generator: an amount of memory a machine is really sold with, in a
// unit it is a whole number of, and the kind of memory it was sold as.

import { capacityCandidates, writeCapacity } from '../_internal/capacity.js';
import type { CapacityCandidate } from '../_internal/capacity.js';
import {
	collect,
	resolveOption,
	resolvePlatforms,
	resolveRandom,
	resolveYears
} from '../_internal/generate.js';
import { pick, pickWeighted, withRandom } from '../_internal/utils.js';
import type {
	RamDetail,
	RamUnit,
	RamUnitOption,
	RandRamOptions,
	SystemPlatform
} from '../_types/global.js';
import { RAM_SCALE, RAM_SIZES, RAM_TYPE_ENTRIES, RAM_UNITS } from './data/index.js';
import type { RamTypeEntry } from './data/index.js';

const RAM_UNIT_OPTIONS: readonly RamUnitOption[] = [...RAM_UNITS, 'auto'];

/** A size one call may land on, with the kinds of memory it was sold as. */
type Candidate = CapacityCandidate<RamUnit> & { types: readonly RamTypeEntry[] };

/** `capacity` with the kind of memory after it where the call asked for it. */
export function writeRam(capacity: string, type: string, includeType: boolean): string {
	return includeType ? `${capacity} ${type}` : capacity;
}

/**
 * The sizes each platform may land on, each with the kinds of memory sold at it
 * on that platform in the years asked for. Worked out once per call, and a
 * platform left with no size is left out, so `'all'` never draws a platform it
 * then has nothing to write for.
 */
function candidatesFor(
	options: RandRamOptions,
	unit: RamUnit | 'auto'
): { platform: SystemPlatform; sizes: Candidate[] }[] {
	const [minYear, maxYear] = resolveYears(options.minYear, options.maxYear);

	return resolvePlatforms(options.platform)
		.map((platform) => {
			// A kind is in when it was sold at any point of the range, and at a size
			// when that size was out by the end of it.
			const types = RAM_TYPE_ENTRIES.filter(
				(entry) =>
					entry.platform === platform && entry.from <= maxYear && (entry.to ?? maxYear) >= minYear
			);
			const sizes = capacityCandidates(
				RAM_SCALE,
				RAM_SIZES[platform],
				unit,
				options.minSize,
				options.maxSize
			)
				.map((candidate) => ({
					...candidate,
					types: types.filter((entry) =>
						entry.sizes.some((each) => each.size === candidate.size && each.from <= maxYear)
					)
				}))
				.filter((candidate) => candidate.types.length > 0);

			return { platform, sizes };
		})
		.filter((each) => each.sizes.length > 0);
}

export function generateRamDetails(options: RandRamOptions = {}): RamDetail[] {
	const includeUnit = options.includeUnit !== false;
	// A kind of memory belongs to a size written as a size, so a bare number goes
	// without it, the way `randOs` drops the build along with the version.
	const includeType = includeUnit && options.includeType === true;
	const asked = resolveOption(options.unit, RAM_UNIT_OPTIONS, 'auto');
	// Without the unit there is nothing to tell `512` megabytes from `16`
	// gigabytes, so a size written bare is in one unit throughout.
	const unit = asked === 'auto' && !includeUnit ? RAM_SCALE.reference : asked;
	const candidates = candidatesFor(options, unit);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: candidates.length ? options.count : 0, unique: options.unique },
			() => {
				// The platform first, so `'all'` is half desktops and half phones, then
				// the size, then the kind of memory that size was sold as.
				const { platform, sizes } = pick(candidates);
				const {
					size,
					unit: written,
					value,
					types
				} = pickWeighted(sizes, (candidate) => candidate.weight);
				const { type } = pickWeighted(types, (entry) => entry.weight);

				return {
					ram: writeRam(writeCapacity(value, written, includeUnit), type, includeType),
					value,
					unit: written,
					bytes: size * RAM_SCALE.bytes,
					type,
					platform
				};
			},
			(detail) => detail.ram
		)
	);
}
