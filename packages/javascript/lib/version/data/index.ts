import type { VersionFormat } from '../../_types/global.js';

export const VERSION_FORMATS: readonly VersionFormat[] = ['semver', 'calver', 'number'];

/**
 * The lowest and highest number each part of a version is drawn from. A part is
 * drawn with the small numbers most often — a number is about twice as likely as
 * the one twice as far from the bottom — so `0.x` and `x.y.0` are common and
 * `18.27.30` is rare, the way they are in a registry. `number` is a version that
 * is one number, the way a browser's is; `minor` and `micro` are a calendar
 * version's, counted within its year or month.
 */
export const VERSION_PARTS = {
	major: [0, 20],
	minor: [0, 30],
	patch: [0, 30],
	number: [1, 150],
	release: [1, 4],
	micro: [1, 9],
	prerelease: [1, 9]
} as const satisfies Record<string, readonly [number, number]>;

/** The pre-release labels a semantic version is given, and how often each one. */
export const VERSION_PRERELEASES: Readonly<Record<string, number>> = {
	alpha: 30,
	beta: 35,
	rc: 35
};

/** The percentage of semantic versions given a pre-release under `includePrerelease`. */
export const VERSION_PRERELEASE_CHANCE = 25;

/**
 * The calendar schemes, in CalVer's notation, and how often each one comes up:
 * a year and a release within it (`2024.2`), a year, month and fix
 * (`2024.3.1`), a short year and zero-padded month (`24.04`) with or without a
 * fix, and a whole date (`2024.03.15`). `MINOR` here is the release within a
 * year, never a semantic version's minor.
 */
export const CALVER_SCHEMES: readonly { scheme: string; weight: number }[] = [
	{ scheme: 'YYYY.MINOR', weight: 25 },
	{ scheme: 'YYYY.MM.MICRO', weight: 25 },
	{ scheme: 'YY.0M', weight: 20 },
	{ scheme: 'YY.0M.MICRO', weight: 15 },
	{ scheme: 'YYYY.0M.0D', weight: 15 }
];

/** The years a calendar version is drawn from when the caller names none. */
export const VERSION_YEAR_MIN_DEFAULT = 2010;
export const VERSION_YEAR_MAX_DEFAULT = 2026;

/**
 * The years a calendar version may be counted from at all. CalVer's short year
 * is the year less 2000, so a year outside these has no short form.
 */
export const VERSION_YEAR_FLOOR = 2000;
export const VERSION_YEAR_CEILING = 2099;
