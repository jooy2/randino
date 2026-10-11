// The category's public constants, apart from the catalog they describe: a
// catalog is built by a call at the top of its module, which a bundler has to
// keep, so a constant beside it brought the whole catalog along.

import type { DeviceType, DeviceVendor } from '../../_types/global.js';

export const DEVICE_TYPES: readonly DeviceType[] = ['phone', 'tablet', 'laptop'];

/** Every maker the catalog holds a device of, in the order the catalog lists them. */
export const DEVICE_VENDORS: readonly DeviceVendor[] = [
	'Apple',
	'Samsung',
	'Google',
	'Xiaomi',
	'OnePlus',
	'Sony',
	'LG',
	'Huawei',
	'Motorola',
	'Nothing',
	'Nokia',
	'HTC',
	'BlackBerry',
	'Microsoft',
	'Amazon',
	'Lenovo',
	'Dell',
	'HP',
	'ASUS',
	'Razer'
];
