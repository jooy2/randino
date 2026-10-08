// The device generator: a real phone, tablet or laptop, by the name its maker
// gave it.
//
// Nothing is invented and nothing is weighted. Every option narrows the models
// a draw may land on, and every model left is as likely as the next.

import { collect, resolveMany, resolveRandom, resolveYears } from '../_internal/generate.js';
import { pick, withRandom } from '../_internal/utils.js';
import type { DeviceDetail, RandDeviceOptions } from '../_types/global.js';
import { DEVICES, DEVICE_TYPES } from './data/index.js';
import type { DeviceEntry } from './data/index.js';

/**
 * `entry` with its maker in front, unless the model already opens on the maker's
 * name: `Xiaomi 14` and `OnePlus 12` are never written with the maker twice.
 */
export function writeDevice(entry: DeviceEntry, includeVendor: boolean): string {
	return includeVendor && !entry.model.startsWith(entry.vendor)
		? `${entry.vendor} ${entry.model}`
		: entry.model;
}

export function generateDeviceDetails(options: RandDeviceOptions = {}): DeviceDetail[] {
	const types = resolveMany(options.type, DEVICE_TYPES, DEVICE_TYPES);
	const [minYear, maxYear] = resolveYears(options.minYear, options.maxYear);
	const includeVendor = options.includeVendor !== false;
	// Worked out once per call rather than per draw: a call of ten thousand would
	// otherwise filter the catalog ten thousand times.
	const candidates = DEVICES.filter(
		(entry) => types.includes(entry.type) && entry.year >= minYear && entry.year <= maxYear
	);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			// Only the options a device has: a `startsWith` slipped past the types
			// would otherwise filter models by their first letter.
			{ count: candidates.length ? options.count : 0, unique: options.unique },
			() => {
				const entry = pick(candidates);

				return {
					device: writeDevice(entry, includeVendor),
					vendor: entry.vendor,
					model: entry.model,
					type: entry.type,
					year: entry.year
				};
			},
			(detail) => detail.device
		)
	);
}
