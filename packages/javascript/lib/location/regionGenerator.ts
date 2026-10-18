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
import { shortName } from './shorten.js';

// Each language's regions as a list `narrow` can read, written the way the call
// asks and made the first time the language is drawn from that way. `names` are
// the regions as the country publishes them, which the detail reports.
type RegionPool = Texts & { names: readonly string[] };

const pools = /*#__PURE__*/ new Map<string, RegionPool>();

function poolOf(language: LocationLanguage, short: boolean): RegionPool {
	const key = `${language}:${short}`;
	let pool = pools.get(key);

	if (!pool) {
		const names = LOCATION_REGIONS[language].regions;
		const texts = short ? names.map((name) => shortName(language, 'region', name)) : names;
		const lengths = texts.map((text) => text.length);

		pool = { names, texts, shortest: Math.min(...lengths), longest: Math.max(...lengths) };
		pools.set(key, pool);
	}

	return pool;
}

/** Regions, the way `generateLocationDetails` draws the region level by name alone. */
export function generateRegionDetails(options: RandLocationUnitOptions = {}): LocationDetail[] {
	const language = resolveLocationLanguage(options.language);
	const prefix = resolvePrefix(options.startsWith);
	const minLength = resolveLength(options.minLength);
	const maxLength = resolveLength(options.maxLength);
	const short = options.short === true;
	const candidates = languagesWriting(language, LOCATION_LANGUAGES, prefix).flatMap((code) => {
		const pool = poolOf(code, short);
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
				const index = indexes ? pick(indexes) : randInt(0, pool.texts.length - 1);

				return {
					location: pool.texts[index],
					language: code,
					level: 'region',
					country: LOCATION_REGIONS[code].country,
					region: pool.names[index],
					city: null,
					district: null
				};
			},
			(detail) => detail.location
		)
	);
}
