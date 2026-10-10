import type { DiskTypeDetail, RandDiskTypeOptions } from '../_types/global.js';
import { generateDiskTypeDetails } from './diskTypeGenerator.js';

/**
 * Generate the kind of storage a machine has: `SSD`, `HDD`, `UFS`.
 *
 * A desktop or a laptop is mostly an SSD and a hard disk after it, a phone or a
 * tablet UFS or eMMC. `platform` keeps to one of the two.
 *
 * @example
 * randDiskType(); // ['SSD']
 * randDiskType({ platform: 'desktop', count: 3 }); // ['SSD', 'HDD', 'SSD']
 * randDiskType({ platform: 'mobile' }); // ['UFS']
 */
export function randDiskType(options?: RandDiskTypeOptions & { output?: 'value' }): string[];
/**
 * Generate kinds of storage along with the code and the name behind each label.
 *
 * `output: 'detail'` returns a `DiskTypeDetail` per result instead of a string.
 *
 * @example
 * randDiskType({ output: 'detail' });
 * // [{ diskType: 'SSD', code: 'ssd', name: 'Solid State Drive', platform: 'desktop' }]
 */
export function randDiskType(options: RandDiskTypeOptions & { output: 'detail' }): DiskTypeDetail[];
export function randDiskType(options: RandDiskTypeOptions = {}): string[] | DiskTypeDetail[] {
	options ??= {};

	const details = generateDiskTypeDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.diskType);
}
