// The category's public constants, apart from the catalog they describe: a
// catalog is built by a call at the top of its module, which a bundler has to
// keep, so a constant beside it brought the whole catalog along.

import type { DeviceType } from '../../_types/global.js';

export const DEVICE_TYPES: readonly DeviceType[] = ['phone', 'tablet', 'laptop'];
