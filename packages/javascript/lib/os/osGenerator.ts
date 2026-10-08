// The OS generator: a real release, written the way the release is known.
//
// Nothing is invented. A draw picks a line of operating systems, then one of its
// releases, then — when the caller asked for one — one of that release's builds,
// and every option narrows what may be picked rather than shaping what is
// written afterwards.

import { collect, resolvePlatforms, resolveRandom, resolveYears } from '../_internal/generate.js';
import { pick, pickWeighted, withRandom } from '../_internal/utils.js';
import type { OsDetail, RandOsOptions } from '../_types/global.js';
import { OS_FAMILIES, OS_RELEASES } from './data/index.js';
import type { OsBuild, OsFamily, OsRelease } from './data/index.js';

/** A release a call may land on, with the builds of it the call may write. */
type Candidate = { release: OsRelease; builds: readonly OsBuild[] };

/** `release` written out, with `build` and `edition` where the call asked for them. */
export function writeOs(release: OsRelease, build: OsBuild | null, edition: string | null): string {
	// A template with no `{b}` writes its build in the version's place: macOS 14 at
	// a point release is `14.5`, never `14 14.5`.
	const inPlace = !release.template.includes('{b}');

	return release.template
		.replace('{v}', build && inPlace ? build.text : release.version)
		.replace('{e}', edition ? ` ${edition}` : '')
		.replace('{b}', build && !inPlace ? ` ${build.text}` : '');
}

/**
 * The releases one call may land on, grouped by line. Worked out once per call:
 * a year range is read against every release and every build, and a call of ten
 * thousand would otherwise read them all ten thousand times.
 *
 * With `includeBuild` the year that counts is the build's — the thing the result
 * names — so a release none of whose builds is inside the range is left out, and
 * one without builds is read by its own year.
 */
function candidatesFor(options: RandOsOptions): Map<OsFamily, Candidate[]> {
	const platforms = resolvePlatforms(options.platform);
	const [minYear, maxYear] = resolveYears(options.minYear, options.maxYear);
	const byBuild = options.includeVersion !== false && options.includeBuild === true;
	const inRange = (year: number) => year >= minYear && year <= maxYear;
	const families = new Map<OsFamily, Candidate[]>();

	for (const release of OS_RELEASES) {
		if (!platforms.includes(OS_FAMILIES[release.family].platform)) continue;

		const builds =
			byBuild && release.builds.length
				? release.builds.filter((build) => inRange(build.year))
				: null;

		if (builds ? builds.length === 0 : !inRange(release.year)) continue;

		const line = families.get(release.family) ?? [];

		line.push({ release, builds: builds ?? [] });
		families.set(release.family, line);
	}

	return families;
}

export function generateOsDetails(options: RandOsOptions = {}): OsDetail[] {
	const families = candidatesFor(options);
	const lines = [...families.keys()];
	const includeVersion = options.includeVersion !== false;
	const includeEdition = includeVersion && options.includeEdition === true;

	return withRandom(resolveRandom(options.random), () =>
		collect(
			// Only the options an operating system has: a `startsWith` slipped past
			// the types would otherwise filter releases by their first letter.
			{ count: lines.length ? options.count : 0, unique: options.unique },
			() => {
				const family = pickWeighted(lines, (line) => OS_FAMILIES[line].weight);
				const { release, builds } = pick(families.get(family)!);
				const build = builds.length ? pick(builds) : null;
				const edition = includeEdition && release.editions.length ? pick(release.editions) : null;

				return {
					os: includeVersion ? writeOs(release, build, edition) : release.name,
					name: release.name,
					version: includeVersion ? release.version : null,
					build: build?.text ?? null,
					edition,
					platform: OS_FAMILIES[family].platform,
					year: build?.year ?? release.year
				};
			},
			(detail) => detail.os
		)
	);
}
