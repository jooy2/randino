// The category's public constants, apart from the catalog they describe: a
// catalog is built by a call at the top of its module, which a bundler has to
// keep, so a constant beside it brought the whole catalog along.

import type { RamType, RamUnit } from '../../_types/global.js';

export const RAM_UNITS: readonly RamUnit[] = ['MB', 'GB'];

/** Every kind of memory, the desktop ones first, each line oldest first. */
export const RAM_TYPES: readonly RamType[] = [
	'DDR',
	'DDR2',
	'DDR3',
	'DDR4',
	'DDR5',
	'LPDDR',
	'LPDDR2',
	'LPDDR3',
	'LPDDR4',
	'LPDDR4X',
	'LPDDR5',
	'LPDDR5X'
];
