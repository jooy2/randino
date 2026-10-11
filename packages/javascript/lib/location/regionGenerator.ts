// The draw behind `randRegion`, kept apart from `locationGenerator`. A region is
// one of a few dozen names, and drawing it out of the outline put the whole
// outline — every US place and every 읍·면·동 — in any bundle that imported the
// function. This reads the regions file instead, and the narrowing every
// location generator shares.

import {
	collect,
	languagesWriting,
	resolveLength,
	resolvePrefix,
	resolveRandom
} from '../_internal/generate.js';
import { pick, randInt, withRandom } from '../_internal/utils.js';
import type {
	LocationDetail,
	LocationLanguage,
	RandLocationUnitOptions
} from '../_types/global.js';
import { LOCATION_LANGUAGES, resolveLocationLanguage } from './data/constants.js';
import { LOCATION_REGIONS } from './data/regions.js';
import { inRange, narrow } from './narrow.js';
import type { Texts } from './narrow.js';

// Each language's regions as a list `narrow` can read, made the first time the
// language is drawn from.
const pools = new Map<LocationLanguage, Texts>();

function poolOf(language: LocationLanguage): Texts {
	let pool = pools.get(language);

	if (!pool) {
		const texts = LOCATION_REGIONS[language].regions;
		const lengths = texts.map((text) => text.length);

		pool = { texts, shortest: Math.min(...lengths), longest: Math.max(...lengths) };
		pools.set(language, pool);
	}

	return pool;
}

/** Regions, the way `generateLocationDetails` draws the region level by name alone. */
export function generateRegionDetails(options: RandLocationUnitOptions = {}): LocationDetail[] {
	const language = resolveLocationLanguage(options.language);
	const prefix = resolvePrefix(options.startsWith);
	const minLength = resolveLength(options.minLength);
	const maxLength = resolveLength(options.maxLength);
	const candidates = languagesWriting(language, LOCATION_LANGUAGES, prefix).flatMap((code) => {
		const pool = poolOf(code);
		const indexes = narrow(pool, prefix, minLength, maxLength);

		return indexes === null || indexes.length ? [{ code, pool, indexes }] : [];
	});
	const fitting = candidates.filter(({ pool, indexes }) =>
		inRange(pool, indexes, minLength, maxLength)
	);
	const drawn = fitting.length ? fitting : candidates;

	if (!drawn.length) {
		return [];
	}

	return withRandom(resolveRandom(options.random), () =>
		collect(
			options,
			() => {
				const { code, pool, indexes } = pick(drawn);
				const name = pool.texts[indexes ? pick(indexes) : randInt(0, pool.texts.length - 1)];

				return {
					location: name,
					language: code,
					level: 'region',
					country: LOCATION_REGIONS[code].country,
					region: name,
					city: null,
					district: null
				};
			},
			(detail) => detail.location
		)
	);
}
