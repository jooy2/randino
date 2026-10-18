// The app store generator: a store people really get apps from, drawn by how
// common it is on the platform it is drawn for.

import {
	collectFrom,
	keptOutcomes,
	resolvePlatforms,
	resolveRandom
} from '../_internal/generate.js';
import type { Outcome } from '../_internal/generate.js';
import { shares, withRandom } from '../_internal/utils.js';
import type { AppStoreDetail, RandAppStoreOptions } from '../_types/global.js';
import { APP_STORES } from './data/index.js';

// The stores each set of platforms leaves, kept so a call does not work them out again.
const kept = /*#__PURE__*/ new Map<string, readonly Outcome<(typeof APP_STORES)[number]>[]>();

export function generateAppStoreDetails(options: RandAppStoreOptions = {}): AppStoreDetail[] {
	const includeCompany = options.includeCompany !== false;
	const platforms = resolvePlatforms(options.platform);
	// The platform first, so `'all'` is half stores of each kind rather than
	// whichever kind the table happens to list more stores for.
	const outcomes = keptOutcomes(kept, String(platforms), () => {
		const pools = platforms.map((platform) =>
			APP_STORES.filter((entry) => entry.platform === platform)
		);

		return pools.flatMap((pool) =>
			shares(pool, (entry) => entry.weight).map((share, index) => ({
				entry: pool[index],
				weight: share / pools.length
			}))
		);
	});

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
