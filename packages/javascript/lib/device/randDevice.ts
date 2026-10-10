import type { DeviceDetail, RandDeviceOptions } from '../_types/global.js';
import { generateDeviceDetails } from './deviceGenerator.js';

/**
 * Generate real phones, tablets and laptops, by the names their makers gave
 * them.
 *
 * Every model is one that came out, written with its generation or year where
 * the line is told apart by one: `iPad (10th generation)`, `ThinkPad X1 Carbon
 * Gen 11`, `MacBook Air (M2, 2022)`. `minYear` and `maxYear` keep to the models
 * released in those years.
 *
 * @example
 * randDevice(); // ['Samsung Galaxy S24 Ultra']
 * randDevice({ type: 'laptop', count: 2 }); // ['Lenovo ThinkPad T14 Gen 3', 'Apple MacBook Air (M2, 2022)']
 * randDevice({ type: 'phone', includeVendor: false }); // ['Pixel 8 Pro']
 * randDevice({ type: ['phone', 'tablet'], maxYear: 2012 }); // ['Apple iPad 2']
 */
export function randDevice(options?: RandDeviceOptions & { output?: 'value' }): string[];
/**
 * Generate devices along with the maker, the model, the kind and the year.
 *
 * `output: 'detail'` returns a `DeviceDetail` per device instead of a string.
 *
 * @example
 * randDevice({ output: 'detail' });
 * // [{ device: 'Google Pixel 8', vendor: 'Google', model: 'Pixel 8', type: 'phone', year: 2023 }]
 */
export function randDevice(options: RandDeviceOptions & { output: 'detail' }): DeviceDetail[];
export function randDevice(options: RandDeviceOptions = {}): string[] | DeviceDetail[] {
	options ??= {};

	const details = generateDeviceDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.device);
}
