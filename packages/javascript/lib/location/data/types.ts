// Internal shape of the per-language location datasets. Not part of the public
// API — consumers only ever see the options types and `LocationDetail`.
//
// Unlike every other dataset in the package, these are not written by hand:
// `tools/location` writes them out of the file the country publishes, into all
// three packages at once.

import type { LocationLevel } from '../../_types/global.js';

/** A level an outline holds: every one but the country, which the dataset names itself. */
export type OutlineLevel = Exclude<LocationLevel, 'country'>;

export interface LocationLanguageData {
	/** The country, the way the language writes its own. */
	country: string;
	/**
	 * Which end a location is written from. Korean writes the country first
	 * (`대한민국 서울특별시 종로구`), English writes it last (`Pasadena, California,
	 * United States`).
	 */
	order: 'largest-first' | 'smallest-first';
	/** What goes between two levels when a location is written out. */
	joiner: string;
	/** The levels the outline holds, largest first. */
	levels: readonly OutlineLevel[];
	/** The divisions themselves, as `outline` in `_internal/parse` reads them. */
	outline: string;
}
