import type { AppStoreDetail, RandAppStoreOptions } from '../_types/global.js';
import { generateAppStoreDetails } from './appStoreGenerator.js';

/**
 * Generate real app stores, by the name each is known by: `Google Play Store`,
 * `Apple App Store`, `Microsoft Store`, `Steam`.
 *
 * Google Play and Apple's App Store are most of the phones, and the Microsoft
 * Store, Steam and the Mac App Store most of the desktops; `platform` keeps to
 * one of the two, and Google Play is never a desktop's. `includeCompany: false`
 * writes the store's own name without its company.
 *
 * @example
 * randAppStore(); // ['Google Play Store']
 * randAppStore({ platform: 'desktop', count: 3 }); // ['Steam', 'Microsoft Store', 'Mac App Store']
 * randAppStore({ platform: 'mobile', includeCompany: false }); // ['App Store']
 */
export function randAppStore(options?: RandAppStoreOptions & { output?: 'value' }): string[];
/**
 * Generate app stores along with their own names and the companies that run them.
 *
 * `output: 'detail'` returns an `AppStoreDetail` per store instead of a string.
 *
 * @example
 * randAppStore({ output: 'detail' });
 * // [{ store: 'Samsung Galaxy Store', name: 'Galaxy Store', company: 'Samsung', platform: 'mobile' }]
 */
export function randAppStore(options: RandAppStoreOptions & { output: 'detail' }): AppStoreDetail[];
export function randAppStore(options: RandAppStoreOptions = {}): string[] | AppStoreDetail[] {
	options ??= {};

	const details = generateAppStoreDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.store);
}
