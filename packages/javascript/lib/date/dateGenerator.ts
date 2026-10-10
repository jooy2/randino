// The date generator: an instant drawn evenly from a range, then written out by
// a format or handed back one part at a time.
//
// Everything here is UTC. A date drawn in the machine's own time zone would come
// out differently on two machines from the same seed, and an hour that a
// daylight-saving change skips would be a date no clock ever showed.

import { collect, resolveOption, resolveOptional, resolveRandom } from '../_internal/generate.js';
import { clamp, pick, randInt, withRandom } from '../_internal/utils.js';
import type {
	DateDetail,
	DateUnit,
	RandDateOptions,
	WordLanguage,
	WordLanguageOption
} from '../_types/global.js';
import { WORD_LANGUAGES } from '../word/data/index.js';
import {
	DATE_CEILING,
	DATE_FLOOR,
	DATE_FORMAT_DEFAULT,
	DATE_MAX_DEFAULT,
	DATE_MIN_DEFAULT,
	DATE_NAMES,
	DATE_UNITS
} from './data/index.js';
import type { DateNames } from './data/index.js';

const DAY = 86400000;

/** The first and the last millisecond a bound stands for. */
type Span = { start: number; end: number };

/** The parts of a date, which is a detail without the fields worked out from them. */
type Parts = Omit<DateDetail, 'date' | 'timestamp' | 'weekday' | 'language'>;

/** The parts a format writes from, the day of the week among them. */
type Written = Parts & { weekday: number };

// `2024`, `2024-03`, `2024-03-15`, `2024-03-15T14:07`, `2024-03-15 14:07:32.481`,
// with an offset after the time: `Z`, `+09:00`, `+0900` or `+09`.
const ISO_DATE =
	/^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?([Zz]|[+-]\d{2}(?::?\d{2})?)?)?)?)?$/;

// Longest first, so `YYYY` is never read as two `YY` nor `MMMM` as two `MM`. Text
// in brackets is written as it is, and so is anything that is not a token.
const TOKENS = /\[([^\]]*)]|YYYY|YY|MMMM|MMM|MM?|DD?|dddd|ddd|HH?|hh?|mm?|ss?|SSS|A|a|ZZ|Z/g;

// The widest offset a clock is set to is fourteen hours; anything up to a day
// short of it is still an offset, and a day or more is not one.
const OFFSET_LIMIT = 24 * 60;

// `Z`, `+09:00`, `+0900` or `+09`.
const OFFSET = /^(?:[Zz]|([+-])(\d{2})(?::?(\d{2}))?)$/;

function isLeap(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysIn(year: number, month: number): number {
	return month === 2 ? (isLeap(year) ? 29 : 28) : [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/**
 * Milliseconds since the epoch for a UTC date. Through `setUTCFullYear` rather
 * than `Date.UTC`, which reads a year from 0 to 99 as 1900 to 1999.
 */
function timestampOf(parts: Parts): number {
	const date = new Date(0);

	date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
	date.setUTCHours(parts.hour, parts.minute, parts.second, parts.millisecond);

	return date.getTime();
}

/** An offset as milliseconds east of UTC, or `undefined` for one no clock shows. */
function offsetOf(text: string): number | undefined {
	const match = OFFSET.exec(text);

	if (!match) {
		return undefined;
	}

	const [, sign, hours, minutes] = match;

	if (!sign) {
		return 0;
	}

	if (Number(hours) > 23 || Number(minutes ?? 0) > 59) {
		return undefined;
	}

	return (sign === '-' ? -1 : 1) * (Number(hours) * 60 + Number(minutes ?? 0)) * 60000;
}

/**
 * A string as the span it names: `'2024'` is the whole year and `'2024-03-15'`
 * the whole day, so `maxDate: '2024-03-15'` reaches the evening of the 15th
 * rather than stopping at its first millisecond. A string with no offset of its
 * own is read at `shift`, the call's `utcOffset`. A string that is not a date —
 * `'2024-02-30'`, `'24:00'` — names nothing.
 */
function parseDate(text: string, shift: number): Span | undefined {
	const match = ISO_DATE.exec(text.trim());

	if (!match) {
		return undefined;
	}

	const [, year, month, day, hour, minute, second, fraction, offset] = match;
	const parts: Parts = {
		year: Number(year),
		month: Number(month ?? 1),
		day: Number(day ?? 1),
		hour: Number(hour ?? 0),
		minute: Number(minute ?? 0),
		second: Number(second ?? 0),
		// A fraction finer than a millisecond is cut to one, never rounded up into
		// the next.
		millisecond: fraction ? Number(fraction.slice(0, 3).padEnd(3, '0')) : 0
	};
	const own = offset === undefined ? shift : offsetOf(offset);

	if (
		own === undefined ||
		parts.year < 1 ||
		parts.month < 1 ||
		parts.month > 12 ||
		parts.day < 1 ||
		parts.day > daysIn(parts.year, parts.month) ||
		parts.hour > 23 ||
		parts.minute > 59 ||
		parts.second > 59
	) {
		return undefined;
	}

	const start = timestampOf(parts) - own;
	const span = fraction
		? 1
		: second
			? 1000
			: minute
				? 60000
				: day
					? DAY
					: month
						? daysIn(parts.year, parts.month) * DAY
						: (isLeap(parts.year) ? 366 : 365) * DAY;

	return { start, end: start + span - 1 };
}

/**
 * A bound as the span it stands for, or `undefined` for anything that is not a
 * date. A `Date` and a number are one instant each, and an invalid `Date` is
 * nothing, the way a `NaN` is.
 */
function spanOf(value: unknown, shift: number): Span | undefined {
	if (typeof value === 'string') {
		return parseDate(value, shift);
	}

	const time = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : NaN;

	if (!Number.isFinite(time)) {
		return undefined;
	}

	const instant = Math.floor(time);

	return { start: instant, end: instant };
}

/**
 * `utcOffset` as milliseconds east of UTC: a string the way a date string's own
 * offset is read, or a number of minutes. Anything that is not an offset a clock
 * could be set to is UTC.
 */
export function resolveOffset(utcOffset: unknown): number {
	if (typeof utcOffset === 'string') {
		return offsetOf(utcOffset.trim()) ?? 0;
	}

	const minutes = typeof utcOffset === 'number' ? Math.trunc(utcOffset) : NaN;

	return Number.isFinite(minutes) && Math.abs(minutes) < OFFSET_LIMIT ? minutes * 60000 : 0;
}

/**
 * The first and the last millisecond a call may land on, for dates read at
 * `shift`. The defaults and the limits are dates on a calendar, so they move with
 * the offset: the range left out is 1900 to 2099 on the clock the dates are
 * written in, and no date is written with a year outside 1 to 9999.
 */
export function dateRange(options: RandDateOptions, shift: number): [number, number] {
	const floor = DATE_FLOOR - shift;
	const ceiling = DATE_CEILING - shift;
	const minDefault = DATE_MIN_DEFAULT - shift;
	const maxDefault = DATE_MAX_DEFAULT - shift;
	const low = spanOf(options.minDate, shift);
	const high = spanOf(options.maxDate, shift);
	// A bound left out never contradicts the one that was written: past the
	// default at either end, it moves to the end of what a date may be.
	const min = low ? low.start : high && high.end < minDefault ? floor : minDefault;
	const max = high ? high.end : low && low.start > maxDefault ? ceiling : maxDefault;
	const top = clamp(max, floor, ceiling);

	// A range the wrong way round keeps `maxDate`, the same way a length range
	// keeps `maxLength`: it is the bound a caller is usually holding to.
	return [Math.min(clamp(min, floor, ceiling), top), top];
}

/** An offset in minutes as ISO 8601 writes it: `+09:00`, or `+0900` without the colon. */
function zone(minutes: number, colon: boolean): string {
	const sign = minutes < 0 ? '-' : '+';
	const size = Math.abs(minutes);

	return `${sign}${pad(Math.floor(size / 60), 2)}${colon ? ':' : ''}${pad(size % 60, 2)}`;
}

function pad(value: number, width: number): string {
	return String(value).padStart(width, '0');
}

/**
 * What one token of a format writes for a date, in the names of one language, for
 * a date read at `offset` minutes east of UTC.
 */
function write(token: string, parts: Written, names: DateNames, offset: number): string {
	switch (token) {
		case 'YYYY':
			return pad(parts.year, 4);
		case 'YY':
			return pad(parts.year % 100, 2);
		case 'MMMM':
			return names.months[parts.month - 1];
		case 'MMM':
			return names.monthsShort[parts.month - 1];
		case 'MM':
			return pad(parts.month, 2);
		case 'M':
			return String(parts.month);
		case 'DD':
			return pad(parts.day, 2);
		case 'D':
			return String(parts.day);
		case 'dddd':
			return names.weekdays[parts.weekday - 1];
		case 'ddd':
			return names.weekdaysShort[parts.weekday - 1];
		case 'HH':
			return pad(parts.hour, 2);
		case 'H':
			return String(parts.hour);
		case 'hh':
			return pad(parts.hour % 12 || 12, 2);
		case 'h':
			return String(parts.hour % 12 || 12);
		case 'mm':
			return pad(parts.minute, 2);
		case 'm':
			return String(parts.minute);
		case 'ss':
			return pad(parts.second, 2);
		case 's':
			return String(parts.second);
		case 'SSS':
			return pad(parts.millisecond, 3);
		case 'Z':
			// UTC is `Z` in ISO 8601, which is what keeps the default format the
			// string `toISOString` writes.
			return offset ? zone(offset, true) : 'Z';
		case 'ZZ':
			return zone(offset, false);
		case 'A':
			return names.meridiem[parts.hour < 12 ? 0 : 1];
		default:
			return names.meridiemLower[parts.hour < 12 ? 0 : 1];
	}
}

/** A date written out by a format, in the names of `language`, at `offset` minutes east of UTC. */
export function formatDate(
	parts: Written,
	format: string,
	language: WordLanguage,
	offset: number
): string {
	const names = DATE_NAMES[language];

	return format.replace(
		TOKENS,
		(token: string, literal?: string) => literal ?? write(token, parts, names, offset)
	);
}

/** Every part of the date `timestamp` falls on, read at `shift` milliseconds east of UTC. */
function partsOf(timestamp: number, shift: number): Written {
	const date = new Date(timestamp + shift);

	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth() + 1,
		day: date.getUTCDate(),
		hour: date.getUTCHours(),
		minute: date.getUTCMinutes(),
		second: date.getUTCSeconds(),
		millisecond: date.getUTCMilliseconds(),
		// `getUTCDay` counts from Sunday; ISO 8601 counts from Monday.
		weekday: ((date.getUTCDay() + 6) % 7) + 1
	};
}

/** The caller's `format`, or ISO 8601 for one that writes nothing at all. */
function resolveFormat(format: unknown): string {
	return typeof format === 'string' && format ? format : DATE_FORMAT_DEFAULT;
}

/**
 * The caller's `language`, or English for one the package does not know. Not
 * `'all'` by default the way the other generators have it: a format is written in
 * one language, and nine languages' month names in one format is no format.
 */
function resolveDateLanguage(language: unknown): WordLanguageOption {
	return resolveOption<WordLanguageOption>(language, [...WORD_LANGUAGES, 'all'], 'en');
}

/** The caller's `unit`, or `null` for the whole date. */
export function resolveDateUnit(unit: unknown): DateUnit | null {
	return resolveOptional(unit, DATE_UNITS);
}

/**
 * `write` is false when the caller is handed a `unit` and nothing else, which
 * leaves `date` empty: formatting a date nobody reads was most of the time a
 * call of minutes spent.
 */
export function generateDateDetails(options: RandDateOptions = {}, write = true): DateDetail[] {
	const shift = resolveOffset(options.utcOffset);
	const [min, max] = dateRange(options, shift);
	const format = resolveFormat(options.format);
	const unit = resolveDateUnit(options.unit);
	const language = resolveDateLanguage(options.language);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			// Only the options a date has: a `startsWith` slipped past the types would
			// otherwise filter dates by their first digit.
			{ count: options.count, unique: options.unique },
			() => {
				const timestamp = randInt(min, max);
				const parts = partsOf(timestamp, shift);
				const drawn: WordLanguage = language === 'all' ? pick(WORD_LANGUAGES) : language;

				return {
					date: write ? formatDate(parts, format, drawn, shift / 60000) : '',
					timestamp,
					...parts,
					language: drawn
				};
			},
			// Deduplicated by what the caller is handed: two dates in one minute are
			// one result when `unit` asks for the minute.
			(detail) => (unit ? String(detail[unit]) : detail.date)
		)
	);
}
