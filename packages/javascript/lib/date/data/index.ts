import type { DateUnit } from '../../_types/global.js';

// The parts of a date, largest first.
export const DATE_UNITS: readonly DateUnit[] = [
	'year',
	'month',
	'day',
	'hour',
	'minute',
	'second',
	'millisecond'
];

/**
 * The earliest and the latest instant a date may be, as milliseconds since the
 * epoch: `0001-01-01T00:00:00.000Z` and `9999-12-31T23:59:59.999Z`. Every package
 * can hold a year of four digits and Python can hold no more, so a range is held
 * inside them rather than inside what JavaScript's own `Date` reaches.
 */
export const DATE_FLOOR = -62135596800000;
export const DATE_CEILING = 253402300799999;

/**
 * The range when a bound is left out: `1900-01-01T00:00:00.000Z` to
 * `2099-12-31T23:59:59.999Z`, the twentieth and twenty-first centuries. Written
 * out rather than counted back from today, so that a seeded `random` hands back
 * the same dates on every run, and a bound left out never contradicts the one
 * that was written: past either end, it moves to `DATE_FLOOR` or `DATE_CEILING`.
 */
export const DATE_MIN_DEFAULT = -2208988800000;
export const DATE_MAX_DEFAULT = 4102444799999;

/** ISO 8601 in UTC, the way `Date.prototype.toISOString` writes it. */
export const DATE_FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
