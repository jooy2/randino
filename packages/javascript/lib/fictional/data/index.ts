import type { LocationLevel } from '../../_types/global.js';

export { FICTIONAL_AVOID, FICTIONAL_AVOID_INSIDE } from './avoid.js';
export { FICTIONAL_COMPOUNDS } from './compounds.js';
export { FICTIONAL_KINDS } from './kinds.js';
export { FICTIONAL_GIVEN_NAMES, FICTIONAL_SURNAMES } from './names.js';
export { FICTIONAL_PLACES } from './places.js';
export { FICTIONAL_PLACE_ENDINGS, FICTIONAL_SYLLABLES } from './syllables.js';

/**
 * How often a place carries its kind when the caller left `includeKind` out, as a
 * percentage per level. A district is nearly always named with one (`Evelyn
 * Bay`), and a country is as often its name alone (`Glacia`) as a kingdom.
 */
export const FICTIONAL_KIND_CHANCE: Readonly<Record<LocationLevel, number>> = {
	country: 50,
	region: 50,
	city: 40,
	district: 70
};

/** How often an invented name or place takes a `middle` syllable, as a percentage. */
export const FICTIONAL_MIDDLE_CHANCE = 40;

/**
 * How often an invented place is built from syllables (`Silvaria`) rather than
 * from two English halves (`Ravenford`), as a percentage per level. A country is
 * a sweeping Latin name and a city an English town's; a district built from
 * syllables is named like a person (`Kalira Park`).
 */
export const FICTIONAL_SYLLABLE_CHANCE: Readonly<Record<LocationLevel, number>> = {
	country: 100,
	region: 50,
	city: 0,
	district: 40
};
