// The RAM generator: an amount of memory a machine is really sold with, in a
// unit it is a whole number of.

import { capacityCandidates, writeCapacity } from '../_internal/capacity.js';
import { collect, resolveOption, resolveRandom } from '../_internal/generate.js';
import { pickWeighted, withRandom } from '../_internal/utils.js';
import type { RamDetail, RamUnitOption, RandRamOptions } from '../_types/global.js';
import { RAM_SCALE, RAM_UNITS } from './data/index.js';

const RAM_UNIT_OPTIONS: readonly RamUnitOption[] = [...RAM_UNITS, 'auto'];

export function generateRamDetails(options: RandRamOptions = {}): RamDetail[] {
	const includeUnit = options.includeUnit !== false;
	const asked = resolveOption(options.unit, RAM_UNIT_OPTIONS, 'auto');
	// Without the unit there is nothing to tell `512` megabytes from `16`
	// gigabytes, so a size written bare is in one unit throughout.
	const unit = asked === 'auto' && !includeUnit ? RAM_SCALE.reference : asked;
	// Worked out once per call: at most a couple of dozen sizes, each with its
	// unit already decided.
	const candidates = capacityCandidates(RAM_SCALE, unit, options.minSize, options.maxSize);

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
					ram: writeCapacity(value, written, includeUnit),
					value,
					unit: written,
					bytes: size * RAM_SCALE.bytes
				};
			},
			(detail) => detail.ram
		)
	);
}
