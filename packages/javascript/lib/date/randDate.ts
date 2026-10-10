import type { DateDetail, DateUnit, RandDateOptions } from '../_types/global.js';
import { generateDateDetails, resolveDateUnit } from './dateGenerator.js';

/**
 * Generate one part of each date, as a number.
 *
 * The part is read off a date drawn from the range, so `unit: 'minute'` is `0`
 * to `59` and `unit: 'year'` keeps inside `minDate` and `maxDate`.
 *
 * @example
 * randDate({ unit: 'minute', count: 3 }); // [37, 4, 52]
 * randDate({ unit: 'year', minDate: '2000', maxDate: '2009', count: 3 }); // [2004, 2000, 2007]
 */
export function randDate(options: RandDateOptions & { unit: DateUnit; output?: 'value' }): number[];
/**
 * Generate dates, drawn evenly from a range and written out in UTC, or at the
 * offset `utcOffset` names.
 *
 * The range defaults to the years 1900 to 2099, and `format` defaults to ISO
 * 8601. A string bound names a span, so `maxDate: '2024-12-31'` reaches the last
 * millisecond of that day.
 *
 * @example
 * randDate(); // ['1987-06-21T08:14:51.302Z']
 * randDate({ minDate: '2024-01-01', maxDate: '2024-12-31', format: 'YYYY-MM-DD' }); // ['2024-07-09']
 * randDate({ format: 'YYYY년 M월 D일 HH:mm', count: 2 }); // ['2031년 3월 4일 19:40', '1958년 11월 27일 06:02']
 * randDate({ utcOffset: '+09:00' }); // ['1987-06-21T17:14:51.302+09:00']
 */
export function randDate(
	options?: RandDateOptions & { unit?: undefined; output?: 'value' }
): string[];
/**
 * Generate dates along with every part they were built from.
 *
 * `output: 'detail'` returns a `DateDetail` per date instead of a string or a
 * number: the date as `format` writes it, its timestamp, and each part on its own.
 *
 * @example
 * randDate({ output: 'detail' });
 * // [{ date: '1987-06-21T08:14:51.302Z', timestamp: 551261691302, year: 1987, month: 6,
 * //    day: 21, hour: 8, minute: 14, second: 51, millisecond: 302 }]
 */
export function randDate(options: RandDateOptions & { output: 'detail' }): DateDetail[];
export function randDate(options: RandDateOptions = {}): string[] | number[] | DateDetail[] {
	const unit = resolveDateUnit(options.unit);
	const details = generateDateDetails(options, options.output === 'detail' || unit === null);

	if (options.output === 'detail') {
		return details;
	}

	return unit ? details.map((detail) => detail[unit]) : details.map((detail) => detail.date);
}
