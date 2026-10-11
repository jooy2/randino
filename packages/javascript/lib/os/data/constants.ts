// The category's public constants, apart from the catalog they describe: a
// catalog is built by a call at the top of its module, which a bundler has to
// keep, so a constant beside it brought the whole catalog along.

import type { OsFamily } from '../../_types/global.js';

/**
 * Every line of operating systems, desktop ones first, each in the order it is
 * common in. Named apart from `OS_FAMILIES`, the internal table of each line's
 * platform and weight, which is keyed by these.
 */
export const OS_FAMILY_CODES: readonly OsFamily[] = [
	'windows',
	'macos',
	'ubuntu',
	'fedora',
	'debian',
	'android',
	'ios',
	'ipados'
];
