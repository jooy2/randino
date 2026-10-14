// The GPU generator: a real graphics processor, by the name its maker gave it.
//
// Nothing is invented and nothing is weighted. Every option narrows the parts a
// draw may land on, and every part left is as likely as the next.

import {
	collectFrom,
	keptOutcomes,
	resolveMany,
	resolvePlatforms,
	resolveRandom,
	resolveYears
} from '../_internal/generate.js';
import type { Outcome } from '../_internal/generate.js';
import { withRandom } from '../_internal/utils.js';
import type { GpuDetail, RandGpuOptions } from '../_types/global.js';
import { GPUS, GPU_VENDORS } from './data/index.js';
import type { GpuEntry } from './data/index.js';

// The parts each set of options leaves, kept so a call does not filter the catalog again.
const kept = new Map<string, readonly Outcome<GpuEntry>[]>();

/** `entry` with its maker in front, or alone. */
export function writeGpu(entry: GpuEntry, includeVendor: boolean): string {
	return includeVendor ? `${entry.vendor} ${entry.model}` : entry.model;
}

export function generateGpuDetails(options: RandGpuOptions = {}): GpuDetail[] {
	const platforms = resolvePlatforms(options.platform);
	const [minYear, maxYear] = resolveYears(options.minYear, options.maxYear);
	const includeVendor = options.includeVendor !== false;
	const vendors = resolveMany(options.vendor, GPU_VENDORS, GPU_VENDORS);
	const outcomes = keptOutcomes(kept, `${platforms}|${vendors}|${minYear}|${maxYear}`, () =>
		GPUS.filter(
			(entry) =>
				platforms.includes(entry.platform) &&
				vendors.includes(entry.vendor) &&
				entry.year >= minYear &&
				entry.year <= maxYear
		).map((entry) => ({ entry, weight: 1 }))
	);

	return withRandom(resolveRandom(options.random), () =>
		collectFrom(
			// Only the options a graphics processor has: a `startsWith` slipped past
			// the types would otherwise filter parts by their first letter.
			{ count: options.count, unique: options.unique },
			outcomes,
			(entry) => writeGpu(entry, includeVendor),
			(entry) => ({
				gpu: writeGpu(entry, includeVendor),
				vendor: entry.vendor,
				model: entry.model,
				platform: entry.platform,
				year: entry.year
			})
		)
	);
}
