import type { RamDetail, RandRamOptions } from '../_types/global.js';
import { generateRamDetails } from './ramGenerator.js';

/**
 * Generate amounts of memory a machine is really sold with.
 *
 * 8 and 16 GB are the most common, the sizes of old phones and of workstations
 * the rarest. Each size is written in the largest unit it is a whole number of,
 * or in the `unit` named, and never with a decimal point. `minSize` and
 * `maxSize` bound the sizes, in `unit` or in gigabytes for `'auto'`.
 *
 * @example
 * randRam(); // ['16 GB']
 * randRam({ count: 3 }); // ['8 GB', '16 GB', '4 GB']
 * randRam({ unit: 'MB' }); // ['8192 MB']
 * randRam({ minSize: 32, includeUnit: false }); // ['64']
 */
export function randRam(options?: RandRamOptions & { output?: 'value' }): string[];
/**
 * Generate amounts of memory along with the number, the unit and the bytes.
 *
 * `output: 'detail'` returns a `RamDetail` per size instead of a string.
 *
 * @example
 * randRam({ output: 'detail' }); // [{ ram: '16 GB', value: 16, unit: 'GB', bytes: 17179869184 }]
 */
export function randRam(options: RandRamOptions & { output: 'detail' }): RamDetail[];
export function randRam(options: RandRamOptions = {}): string[] | RamDetail[] {
	options ??= {};

	const details = generateRamDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.ram);
}
