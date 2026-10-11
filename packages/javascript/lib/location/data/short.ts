// How each location language writes a division by its short name, the way a
// place is said rather than registered. Written by hand in all three packages
// and compared by `tools/parity`, unlike the outlines `tools/location` writes.

import type { LocationLanguage } from '../../_types/global.js';
import type { OutlineLevel } from './types.js';

/** How a language shortens a division's name. */
export interface ShortRule {
	/**
	 * The kinds a name at each level ends on, which `short` leaves off. Longest
	 * first, so `통합특별시` is tried before `특별시`. A name ending on none of them
	 * is written whole: a `가` (`종로1가`) or a `로` (`세종로`) is part of the name.
	 */
	kinds: Record<OutlineLevel, readonly string[]>;
	/**
	 * The fewest characters a name keeps. A kind that would leave fewer stays on,
	 * so `중구` is not `중` and `목동` is not `목`.
	 */
	stem: number;
	/**
	 * The halves a first-level division is told apart by. A region whose stem is
	 * three characters ending on one goes by its first character and the half:
	 * `충청북도` is `충북`, `경상남도` is `경남`.
	 */
	halves: readonly string[];
}

/**
 * Each location language's rule, or `null` for one whose names carry no kind:
 * a US state or place is its name alone, and the `City` of `Kansas City` is part
 * of it.
 */
export const LOCATION_SHORT: Record<LocationLanguage, ShortRule | null> = {
	en: null,
	ko: {
		kinds: {
			region: ['통합특별시', '특별자치시', '특별자치도', '특별시', '광역시', '도'],
			city: ['시', '군', '구'],
			district: ['동', '읍', '면']
		},
		stem: 2,
		halves: ['남', '북']
	}
};
