import type { CpuDetail, RandCpuOptions } from '../_types/global.js';
import { generateCpuDetails } from './cpuGenerator.js';

/**
 * Generate real processors, by the names their makers gave them.
 *
 * Intel, AMD, Apple and Qualcomm parts for desktops and laptops, and the
 * systems-on-chip of phones and tablets from Apple, Qualcomm, Samsung,
 * MediaTek, Google and HiSilicon. `minYear` and `maxYear` keep to the parts
 * whose first machines went on sale in those years.
 *
 * @example
 * randCpu(); // ['Intel Core i7-13700K']
 * randCpu({ platform: 'mobile', count: 2 }); // ['Qualcomm Snapdragon 8 Gen 3', 'Apple A17 Pro']
 * randCpu({ platform: 'desktop', maxYear: 2012 }); // ['AMD Phenom II X4 940']
 * randCpu({ includeVendor: false }); // ['Ryzen 7 7800X3D']
 */
export function randCpu(options?: RandCpuOptions & { output?: 'value' }): string[];
/**
 * Generate processors along with the maker, the model, the platform and the year.
 *
 * `output: 'detail'` returns a `CpuDetail` per processor instead of a string.
 *
 * @example
 * randCpu({ output: 'detail' });
 * // [{ cpu: 'Apple M3 Pro', vendor: 'Apple', model: 'M3 Pro', platform: 'desktop', year: 2023 }]
 */
export function randCpu(options: RandCpuOptions & { output: 'detail' }): CpuDetail[];
export function randCpu(options: RandCpuOptions = {}): string[] | CpuDetail[] {
	const details = generateCpuDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.cpu);
}
