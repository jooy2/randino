// The short name a division goes by, which `short` writes in place of the one
// the country publishes. Kept apart from the generators so that `randRegion`,
// which reaches none of the outlines, can share it.

import type { LocationLanguage } from '../_types/global.js';
import { LOCATION_SHORT } from './data/short.js';
import type { OutlineLevel } from './data/types.js';

/**
 * A division's name the way `short` writes it: `서울특별시` is `서울`, `충청북도`
 * `충북`, and `수원시 장안구`, a city's district written with its city, is
 * `수원 장안`. A language with no rule writes the name as it is.
 */
export function shortName(language: LocationLanguage, level: OutlineLevel, name: string): string {
	const rule = LOCATION_SHORT[language];

	if (!rule) {
		return name;
	}

	return name
		.split(' ')
		.map((word) => {
			const kind = rule.kinds[level].find((ending) => word.endsWith(ending));

			if (!kind || word.length - kind.length < rule.stem) {
				return word;
			}

			const stem = word.slice(0, -kind.length);

			return level === 'region' && stem.length === 3 && rule.halves.includes(stem[2])
				? stem[0] + stem[2]
				: stem;
		})
		.join(' ');
}
