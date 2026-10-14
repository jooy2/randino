// The app store generator: a store people really get apps from, drawn by how
// common it is on the platform it is drawn for.

import { collectFrom, resolvePlatforms, resolveRandom } from '../_internal/generate.js';
import { shares, withRandom } from '../_internal/utils.js';
import type { AppStoreDetail, RandAppStoreOptions } from '../_types/global.js';
import { APP_STORES } from './data/index.js';

export function generateAppStoreDetails(options: RandAppStoreOptions = {}): AppStoreDetail[] {
	const includeCompany = options.includeCompany !== false;
	// One list per platform, worked out once per call rather than per draw.
	const pools = resolvePlatforms(options.platform).map((platform) =>
		APP_STORES.filter((entry) => entry.platform === platform)
	);

	// The platform first, so `'all'` is half stores of each kind rather than
	// whichever kind the table happens to list more stores for.
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
			(entry) => (includeCompany ? entry.full : entry.name),
			(entry) => ({
				store: includeCompany ? entry.full : entry.name,
				name: entry.name,
				company: entry.company,
				platform: entry.platform
			})
		)
	);
}
