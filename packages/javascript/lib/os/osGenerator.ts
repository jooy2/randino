// The OS generator: a real release, written the way the release is known.
//
// Nothing is invented. A draw picks a line of operating systems, then one of its
// releases, then — when the caller asked for one — one of that release's builds,
// and every option narrows what may be picked rather than shaping what is
// written afterwards.

import {
	collectFrom,
	keptOutcomes,
	resolveMany,
	resolvePlatforms,
	resolveRandom,
	resolveYears
} from '../_internal/generate.js';
import type { Outcome } from '../_internal/generate.js';
import { shares, withRandom } from '../_internal/utils.js';
import type { OsDetail, OsFamily, RandOsOptions, SystemPlatform } from '../_types/global.js';
import { OS_FAMILIES, OS_FAMILY_CODES, OS_RELEASES } from './data/index.js';
import type { OsBuild, OsRelease } from './data/index.js';

/** A release a call may land on, with the builds of it the call may write. */
type Candidate = { release: OsRelease; builds: readonly OsBuild[] };

/** The options that decide which releases a call may land on, read once. */
type Asked = {
	platforms: readonly SystemPlatform[];
	named: readonly OsFamily[];
	minYear: number;
	maxYear: number;
	byBuild: boolean;
	byEdition: boolean;
};

/** One result a call may land on: a release of a line, and its build and edition where asked for. */
type Drawn = {
	family: OsFamily;
	release: OsRelease;
	build: OsBuild | null;
	edition: string | null;
};

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
 * `named` and `platforms` both narrow the lines, so a line named that does not
 * run on the platform asked for leaves nothing to draw, rather than either
 * option giving way to the other.
 *
 * With `byBuild` the year that counts is the build's — the thing the result
 * names — so a release none of whose builds is inside the range is left out, and
 * one without builds is read by its own year.
 */
function candidatesFor({
	platforms,
	named,
	minYear,
	maxYear,
	byBuild
}: Asked): Map<OsFamily, Candidate[]> {
	const inRange = (year: number) => year >= minYear && year <= maxYear;
	const families = new Map<OsFamily, Candidate[]>();

	for (const release of OS_RELEASES) {
		if (!named.includes(release.family)) continue;
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

/**
 * Every result `asked` may land on. The line first, by how common it is among
 * the lines left, and the release inside it second, each as likely as the next;
 * then a build and an edition of it where the call asked for them.
 */
function outcomesFor(asked: Asked): Outcome<Drawn>[] {
	const families = candidatesFor(asked);
	const lines = [...families.keys()];
	const outcomes: Outcome<Drawn>[] = [];

	shares(lines, (line) => OS_FAMILIES[line].weight).forEach((share, index) => {
		const family = lines[index];
		const releases = families.get(family)!;

		for (const { release, builds } of releases) {
			const written = builds.length ? builds : [null];
			const editions = asked.byEdition && release.editions.length ? release.editions : [null];
			const weight = share / releases.length / written.length / editions.length;

			for (const build of written) {
				for (const edition of editions) {
					outcomes.push({ entry: { family, release, build, edition }, weight });
				}
			}
		}
	});

	return outcomes;
}

// The results each set of options leaves, kept so a call does not read the
// catalog and its builds again.
const kept = new Map<string, readonly Outcome<Drawn>[]>();

export function generateOsDetails(options: RandOsOptions = {}): OsDetail[] {
	const includeVersion = options.includeVersion !== false;
	const [minYear, maxYear] = resolveYears(options.minYear, options.maxYear);
	const asked: Asked = {
		platforms: resolvePlatforms(options.platform),
		named: resolveMany(options.family, OS_FAMILY_CODES, OS_FAMILY_CODES),
		minYear,
		maxYear,
		byBuild: includeVersion && options.includeBuild === true,
		byEdition: includeVersion && options.includeEdition === true
	};
	const outcomes = keptOutcomes(
		kept,
		`${asked.platforms}|${asked.named}|${minYear}|${maxYear}|${asked.byBuild}|${asked.byEdition}`,
		() => outcomesFor(asked)
	);

	const writeDrawn = ({ release, build, edition }: Drawn) =>
		includeVersion ? writeOs(release, build, edition) : release.name;

	return withRandom(resolveRandom(options.random), () =>
		collectFrom(
			// Only the options an operating system has: a `startsWith` slipped past the
			// types would otherwise filter releases by their first letter.
			{ count: options.count, unique: options.unique },
			outcomes,
			writeDrawn,
			(drawn) => ({
				os: writeDrawn(drawn),
				name: drawn.release.name,
				version: includeVersion ? drawn.release.version : null,
				build: drawn.build?.text ?? null,
				edition: drawn.edition,
				family: drawn.family,
				platform: OS_FAMILIES[drawn.family].platform,
				year: drawn.build?.year ?? drawn.release.year
			})
		)
	);
}
