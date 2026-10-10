// The category's public constants, apart from the catalog they describe: a
// catalog is built by a call at the top of its module, which a bundler has to
// keep, so a constant beside it brought the whole catalog along.

import type { CpuVendor } from '../../_types/global.js';

/** Every maker the catalog holds a part of, in the order the catalog lists them. */
export const CPU_VENDORS: readonly CpuVendor[] = [
	'Intel',
	'AMD',
	'Apple',
	'Qualcomm',
	'Samsung',
	'MediaTek',
	'Google',
	'HiSilicon'
];
