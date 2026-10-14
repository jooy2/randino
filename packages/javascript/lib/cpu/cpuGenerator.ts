// The CPU generator: a real processor, by the name its maker gave it.
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
import type { CpuDetail, RandCpuOptions } from '../_types/global.js';
import { CPUS, CPU_VENDORS } from './data/index.js';
import type { CpuEntry } from './data/index.js';

// The parts each set of options leaves, kept so a call does not filter the catalog again.
const kept = new Map<string, readonly Outcome<CpuEntry>[]>();

/** `entry` with its maker in front, or alone. */
export function writeCpu(entry: CpuEntry, includeVendor: boolean): string {
	return includeVendor ? `${entry.vendor} ${entry.model}` : entry.model;
}

export function generateCpuDetails(options: RandCpuOptions = {}): CpuDetail[] {
	const platforms = resolvePlatforms(options.platform);
	const [minYear, maxYear] = resolveYears(options.minYear, options.maxYear);
	const includeVendor = options.includeVendor !== false;
	const vendors = resolveMany(options.vendor, CPU_VENDORS, CPU_VENDORS);
	const outcomes = keptOutcomes(kept, `${platforms}|${vendors}|${minYear}|${maxYear}`, () =>
		CPUS.filter(
			(entry) =>
				platforms.includes(entry.platform) &&
				vendors.includes(entry.vendor) &&
				entry.year >= minYear &&
				entry.year <= maxYear
		).map((entry) => ({ entry, weight: 1 }))
	);

	return withRandom(resolveRandom(options.random), () =>
		collectFrom(
			// Only the options a processor has: a `startsWith` slipped past the types
			// would otherwise filter parts by their first letter.
			{ count: options.count, unique: options.unique },
			outcomes,
			(entry) => writeCpu(entry, includeVendor),
			(entry) => ({
				cpu: writeCpu(entry, includeVendor),
				vendor: entry.vendor,
				model: entry.model,
				platform: entry.platform,
				year: entry.year
			})
		)
	);
}
