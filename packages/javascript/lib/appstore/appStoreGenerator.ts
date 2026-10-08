// The app store generator: a store people really get apps from, drawn by how
// common it is on the platform it is drawn for.

import { collect, resolvePlatforms, resolveRandom } from '../_internal/generate.js';
import { pick, pickWeighted, withRandom } from '../_internal/utils.js';
import type { AppStoreDetail, RandAppStoreOptions } from '../_types/global.js';
import { APP_STORES } from './data/index.js';

export function generateAppStoreDetails(options: RandAppStoreOptions = {}): AppStoreDetail[] {
	const includeCompany = options.includeCompany !== false;
	// One list per platform, worked out once per call rather than per draw.
	const pools = resolvePlatforms(options.platform).map((platform) =>
		APP_STORES.filter((entry) => entry.platform === platform)
	);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: options.count, unique: options.unique },
			() => {
				// The platform first, so `'all'` is half stores of each kind rather
				// than whichever kind the table happens to list more stores for.
				const entry = pickWeighted(pick(pools), (each) => each.weight);

				return {
					store: includeCompany ? entry.full : entry.name,
					name: entry.name,
					company: entry.company,
					platform: entry.platform
				};
			},
			(detail) => detail.store
		)
	);
}
