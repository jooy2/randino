// The version generator: a version number in one of three schemes, its parts
// drawn with the small numbers most often.

import { collect, resolveMany, resolveRandom, resolveWhole } from '../_internal/generate.js';
import { pick, pickWeighted, randInt, random, chance, withRandom } from '../_internal/utils.js';
import type { RandVersionOptions, VersionDetail, VersionFormat } from '../_types/global.js';
import {
	CALVER_SCHEMES,
	VERSION_FORMATS,
	VERSION_PARTS,
	VERSION_PRERELEASES,
	VERSION_PRERELEASE_CHANCE,
	VERSION_YEAR_CEILING,
	VERSION_YEAR_FLOOR,
	VERSION_YEAR_MAX_DEFAULT,
	VERSION_YEAR_MIN_DEFAULT
} from './data/index.js';

const PRERELEASES = Object.keys(VERSION_PRERELEASES);

/**
 * A number from `[low, high]`, each one weighted by one over its distance from
 * `low` plus one: the bottom is most likely, and a number is about twice as
 * likely as the one twice as far up.
 */
export function smallNumber([low, high]: readonly [number, number]): number {
	let total = 0;

	for (let n = low; n <= high; n++) {
		total += 1 / (n - low + 1);
	}

	let roll = random() * total;

	for (let n = low; n <= high; n++) {
		roll -= 1 / (n - low + 1);

		if (roll < 0) {
			return n;
		}
	}

	return high;
}

/**
 * `minYear` and `maxYear` as the years a calendar version may come from. A bound
 * left out moves out of the way of the one that was written, and a range the
 * wrong way round keeps `maxYear`.
 */
export function resolveVersionYears(minYear: unknown, maxYear: unknown): [number, number] {
	const low = resolveWhole(
		minYear,
		VERSION_YEAR_MIN_DEFAULT,
		VERSION_YEAR_FLOOR,
		VERSION_YEAR_CEILING
	);
	const high = resolveWhole(
		maxYear,
		Math.max(VERSION_YEAR_MAX_DEFAULT, low),
		VERSION_YEAR_FLOOR,
		VERSION_YEAR_CEILING
	);

	return [Math.min(low, high), high];
}

function daysIn(year: number, month: number): number {
	return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function pad(value: number): string {
	return String(value).padStart(2, '0');
}

type Drawn = Omit<VersionDetail, 'version' | 'format'> & { written: string };

function drawSemver(includePrerelease: boolean): Drawn {
	const parts = [
		smallNumber(VERSION_PARTS.major),
		smallNumber(VERSION_PARTS.minor),
		smallNumber(VERSION_PARTS.patch)
	];
	const prerelease =
		includePrerelease && chance(VERSION_PRERELEASE_CHANCE)
			? `${pickWeighted(PRERELEASES, (label) => VERSION_PRERELEASES[label])}.${smallNumber(VERSION_PARTS.prerelease)}`
			: null;

	return {
		written: parts.join('.') + (prerelease ? `-${prerelease}` : ''),
		scheme: 'MAJOR.MINOR.PATCH',
		parts,
		prerelease,
		year: null
	};
}

function drawCalver([low, high]: [number, number]): Drawn {
	const { scheme } = pickWeighted(CALVER_SCHEMES, (each) => each.weight);
	const year = randInt(low, high);
	const month = randInt(1, 12);
	const parts: number[] = [];
	// Each token is drawn in the order it is written, so a scheme draws only the
	// parts it has.
	const written = scheme
		.split('.')
		.map((token) => {
			switch (token) {
				case 'YYYY':
					parts.push(year);

					return String(year);
				case 'YY':
					parts.push(year - 2000);

					return String(year - 2000);
				case 'MM':
					parts.push(month);

					return String(month);
				case '0M':
					parts.push(month);

					return pad(month);
				case '0D': {
					const day = randInt(1, daysIn(year, month));

					parts.push(day);

					return pad(day);
				}
				case 'MINOR': {
					const release = smallNumber(VERSION_PARTS.release);

					parts.push(release);

					return String(release);
				}
				default: {
					const micro = smallNumber(VERSION_PARTS.micro);

					parts.push(micro);

					return String(micro);
				}
			}
		})
		.join('.');

	return { written, scheme, parts, prerelease: null, year };
}

function drawNumber(): Drawn {
	const number = smallNumber(VERSION_PARTS.number);

	return {
		written: String(number),
		scheme: 'MAJOR',
		parts: [number],
		prerelease: null,
		year: null
	};
}

export function generateVersionDetails(options: RandVersionOptions = {}): VersionDetail[] {
	const formats =
		options.format === 'all'
			? VERSION_FORMATS
			: resolveMany(options.format, VERSION_FORMATS, ['semver'] as const);
	const prefix = typeof options.prefix === 'string' ? options.prefix : '';
	const includePrerelease = options.includePrerelease === true;
	const years = resolveVersionYears(options.minYear, options.maxYear);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: options.count, unique: options.unique },
			() => {
				const format: VersionFormat = pick(formats);
				const { written, ...rest } =
					format === 'semver'
						? drawSemver(includePrerelease)
						: format === 'calver'
							? drawCalver(years)
							: drawNumber();

				return { version: prefix + written, format, ...rest };
			},
			(detail) => detail.version
		)
	);
}
