import type { DiskSizeDetail, RandDiskSizeOptions } from '../_types/global.js';
import { generateDiskSizeDetails } from './diskSizeGenerator.js';

/**
 * Generate capacities a drive is really sold with.
 *
 * 256 GB, 512 GB and 1 TB are the most common, the small flash of an old phone
 * and the largest hard disks the rarest. Each size is written in the largest
 * unit it is a whole number of, or in the `unit` named, and never with a decimal
 * point; a terabyte is 1000 gigabytes, the way a drive is sold. `minSize` and
 * `maxSize` bound the sizes, in `unit` or in gigabytes for `'auto'`.
 *
 * @example
 * randDiskSize(); // ['512 GB']
 * randDiskSize({ count: 3 }); // ['1 TB', '256 GB', '2 TB']
 * randDiskSize({ unit: 'GB' }); // ['1000 GB']
 * randDiskSize({ minSize: 2000, unit: 'auto' }); // ['4 TB']
 */
export function randDiskSize(options?: RandDiskSizeOptions & { output?: 'value' }): string[];
/**
 * Generate capacities along with the number, the unit and the bytes.
 *
 * `output: 'detail'` returns a `DiskSizeDetail` per size instead of a string.
 *
 * @example
 * randDiskSize({ output: 'detail' }); // [{ size: '1 TB', value: 1, unit: 'TB', bytes: 1000000000000 }]
 */
export function randDiskSize(options: RandDiskSizeOptions & { output: 'detail' }): DiskSizeDetail[];
export function randDiskSize(options: RandDiskSizeOptions = {}): string[] | DiskSizeDetail[] {
	const details = generateDiskSizeDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.size);
}
