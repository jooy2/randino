// The CPU generator: a real processor, by the name its maker gave it.
//
// Nothing is invented and nothing is weighted. Every option narrows the parts a
// draw may land on, and every part left is as likely as the next.

import { collect, resolvePlatforms, resolveRandom, resolveYears } from '../_internal/generate.js';
import { pick, withRandom } from '../_internal/utils.js';
import type { CpuDetail, RandCpuOptions } from '../_types/global.js';
import { CPUS } from './data/index.js';
import type { CpuEntry } from './data/index.js';

/** `entry` with its maker in front, or alone. */
export function writeCpu(entry: CpuEntry, includeVendor: boolean): string {
	return includeVendor ? `${entry.vendor} ${entry.model}` : entry.model;
}

export function generateCpuDetails(options: RandCpuOptions = {}): CpuDetail[] {
	const platforms = resolvePlatforms(options.platform);
	const [minYear, maxYear] = resolveYears(options.minYear, options.maxYear);
	const includeVendor = options.includeVendor !== false;
	// Worked out once per call rather than per draw: a call of ten thousand would
	// otherwise filter the catalog ten thousand times.
	const candidates = CPUS.filter(
		(entry) => platforms.includes(entry.platform) && entry.year >= minYear && entry.year <= maxYear
	);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			// Only the options a processor has: a `startsWith` slipped past the types
			// would otherwise filter parts by their first letter.
			{ count: candidates.length ? options.count : 0, unique: options.unique },
			() => {
				const entry = pick(candidates);

				return {
					cpu: writeCpu(entry, includeVendor),
					vendor: entry.vendor,
					model: entry.model,
					platform: entry.platform,
					year: entry.year
				};
			},
			(detail) => detail.cpu
		)
	);
}
