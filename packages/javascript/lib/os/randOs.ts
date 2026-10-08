import type { OsDetail, RandOsOptions } from '../_types/global.js';
import { generateOsDetails } from './osGenerator.js';

/**
 * Generate real operating systems, written the way each release is known.
 *
 * Windows, macOS, Ubuntu, Debian and Fedora on the desktop, Android, iOS and
 * iPadOS on mobile. `includeBuild` writes the build or the point release, and
 * `includeEdition` an edition where the release has one. `minYear` and `maxYear`
 * keep to the releases out in those years, so `maxYear: 2015` is what was out by
 * the end of 2015.
 *
 * @example
 * randOs(); // ['Windows 10']
 * randOs({ platform: 'mobile', count: 3 }); // ['Android 9 Pie', 'iOS 17', 'Android 13']
 * randOs({ includeBuild: true, includeEdition: true }); // ['Windows 11 Pro 23H2 (Build 22631)']
 * randOs({ platform: 'desktop', maxYear: 2010 }); // ['Mac OS X Snow Leopard 10.6']
 */
export function randOs(options?: RandOsOptions & { output?: 'value' }): string[];
/**
 * Generate operating systems along with the pieces each one was written from.
 *
 * `output: 'detail'` returns an `OsDetail` per system instead of a string.
 *
 * @example
 * randOs({ includeBuild: true, output: 'detail' });
 * // [{ os: 'macOS Sonoma 14.5', name: 'macOS', version: '14', build: '14.5',
 * //    edition: null, platform: 'desktop', year: 2024 }]
 */
export function randOs(options: RandOsOptions & { output: 'detail' }): OsDetail[];
export function randOs(options: RandOsOptions = {}): string[] | OsDetail[] {
	const details = generateOsDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.os);
}
