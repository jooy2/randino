import assert from 'assert';
import { describe, it } from 'node:test';
import { DATE_UNITS, RAND_COUNT_MAX, WORD_LANGUAGES, randDate } from '../dist/index.js';
import type { DateDetail } from '../dist/index.js';
// Internal, but they are what a range is checked against.
import {
	DATE_CEILING,
	DATE_FLOOR,
	DATE_MAX_DEFAULT,
	DATE_MIN_DEFAULT,
	DATE_NAMES
} from '../dist/date/data/index.js';

const SAMPLE = 60;
const LARGE = 6000;

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/** What the platform's own `Date` reads the detail's timestamp as, part by part. */
function agrees(detail: DateDetail): boolean {
	const date = new Date(detail.timestamp);

	return (
		date.getUTCFullYear() === detail.year &&
		date.getUTCMonth() + 1 === detail.month &&
		date.getUTCDate() === detail.day &&
		date.getUTCHours() === detail.hour &&
		date.getUTCMinutes() === detail.minute &&
		date.getUTCSeconds() === detail.second &&
		date.getUTCMilliseconds() === detail.millisecond &&
		((date.getUTCDay() + 6) % 7) + 1 === detail.weekday
	);
}

function inRange(dates: DateDetail[], from: string, to: string): boolean {
	return dates.every(
		(detail) => detail.timestamp >= Date.parse(from) && detail.timestamp <= Date.parse(to)
	);
}

describe('Date', () => {
	it('randDate returns one ISO 8601 date by default', () => {
		const dates = randDate();

		assert.strictEqual(dates.length, 1);
		assert.match(dates[0], ISO);
		// What the platform writes for the same instant, so the default format is
		// ISO 8601 rather than something shaped like it.
		assert.strictEqual(new Date(dates[0]).toISOString(), dates[0]);
	});

	it('returns exactly `count` dates', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randDate({ count }).length, count);
		}

		assert.strictEqual(randDate({ count: -3 }).length, 0);
		assert.strictEqual(randDate({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('the default range is the years 1900 to 2099', () => {
		const dates = randDate({ count: LARGE, output: 'detail' });

		assert.ok(inRange(dates, '1900-01-01T00:00:00.000Z', '2099-12-31T23:59:59.999Z'));
		assert.strictEqual(DATE_MIN_DEFAULT, Date.parse('1900-01-01T00:00:00.000Z'));
		assert.strictEqual(DATE_MAX_DEFAULT, Date.parse('2099-12-31T23:59:59.999Z'));
		assert.strictEqual(DATE_FLOOR, Date.parse('0001-01-01T00:00:00.000Z'));
		assert.strictEqual(DATE_CEILING, Date.parse('9999-12-31T23:59:59.999Z'));
	});

	it('the parts of the detail are the parts of its timestamp', () => {
		for (const detail of randDate({ count: SAMPLE * 5, output: 'detail' })) {
			assert.ok(agrees(detail), JSON.stringify(detail));
			assert.strictEqual(detail.date, new Date(detail.timestamp).toISOString());
		}
	});

	it('a string bound names the whole span it writes', () => {
		// A year, a month and a day as `maxDate` reach their last millisecond, so
		// the evening of the last day is inside the range rather than past it.
		const cases: [string, string, string, string][] = [
			['2024', '2024', '2024-01-01T00:00:00.000Z', '2024-12-31T23:59:59.999Z'],
			['2024-02', '2024-02', '2024-02-01T00:00:00.000Z', '2024-02-29T23:59:59.999Z'],
			['2023-02', '2023-02', '2023-02-01T00:00:00.000Z', '2023-02-28T23:59:59.999Z'],
			['2024-03-15', '2024-03-15', '2024-03-15T00:00:00.000Z', '2024-03-15T23:59:59.999Z'],
			[
				'2024-03-15T10:30',
				'2024-03-15 10:30',
				'2024-03-15T10:30:00.000Z',
				'2024-03-15T10:30:59.999Z'
			],
			[
				'2024-03-15T10:30:15',
				'2024-03-15T10:30:15',
				'2024-03-15T10:30:15.000Z',
				'2024-03-15T10:30:15.999Z'
			]
		];

		for (const [minDate, maxDate, from, to] of cases) {
			const dates = randDate({ minDate, maxDate, count: SAMPLE, output: 'detail' });

			assert.ok(inRange(dates, from, to), `${minDate}..${maxDate}`);
		}

		// The whole of February in a leap year, and nothing past it.
		const days = randDate({ minDate: '2024-02', maxDate: '2024-02', unit: 'day', count: 2000 });

		assert.strictEqual(Math.max(...days), 29);
		assert.strictEqual(Math.min(...days), 1);
	});

	it('a fraction and an offset are read, and the rest is UTC', () => {
		assert.deepStrictEqual(
			randDate({ minDate: '2024-03-15T10:30:15.5', maxDate: '2024-03-15T10:30:15.5', count: 2 }),
			['2024-03-15T10:30:15.500Z', '2024-03-15T10:30:15.500Z']
		);
		// Finer than a millisecond is cut to one, never rounded into the next.
		assert.deepStrictEqual(
			randDate({ minDate: '2024-03-15T10:30:15.4569', maxDate: '2024-03-15T10:30:15.4569' }),
			['2024-03-15T10:30:15.456Z']
		);

		for (const offset of ['+09:00', '+0900', '+09']) {
			const at = `2024-03-15T10:30:15.000${offset}`;

			assert.deepStrictEqual(randDate({ minDate: at, maxDate: at }), ['2024-03-15T01:30:15.000Z']);
		}

		assert.deepStrictEqual(
			randDate({ minDate: '2024-03-15T23:30:00.000-02:30', maxDate: '2024-03-16T02:00:00.000Z' }),
			['2024-03-16T02:00:00.000Z']
		);
	});

	it('a Date and a number are the instant they hold', () => {
		const at = new Date('2024-03-15T10:30:15.123Z');

		assert.deepStrictEqual(randDate({ minDate: at, maxDate: at }), ['2024-03-15T10:30:15.123Z']);
		assert.deepStrictEqual(randDate({ minDate: 0, maxDate: 0 }), ['1970-01-01T00:00:00.000Z']);
		assert.deepStrictEqual(randDate({ minDate: -1, maxDate: -1 }), ['1969-12-31T23:59:59.999Z']);

		for (const detail of randDate({ minDate: 0, maxDate: 999, count: SAMPLE, output: 'detail' })) {
			assert.ok(detail.timestamp >= 0 && detail.timestamp <= 999);
		}
	});

	it('a bound that is not a date is the default', () => {
		for (const bad of [
			'2024-02-30',
			'2024-13',
			'2024-03-15T24:00',
			'tomorrow',
			'',
			new Date(NaN),
			NaN
		]) {
			const dates = randDate({ minDate: bad, maxDate: bad, count: SAMPLE, output: 'detail' });

			assert.ok(
				inRange(dates, '1900-01-01T00:00:00.000Z', '2099-12-31T23:59:59.999Z'),
				String(bad)
			);
		}
	});

	it('a bound left out never contradicts the one that was written', () => {
		const late = randDate({ minDate: '2200', count: SAMPLE, output: 'detail' });
		const early = randDate({ maxDate: '1850', count: SAMPLE, output: 'detail' });

		assert.ok(inRange(late, '2200-01-01T00:00:00.000Z', '9999-12-31T23:59:59.999Z'));
		assert.ok(inRange(early, '0001-01-01T00:00:00.000Z', '1850-12-31T23:59:59.999Z'));
		// Inside the default, it is the default.
		assert.ok(
			inRange(
				randDate({ minDate: '2020', count: SAMPLE, output: 'detail' }),
				'2020-01-01T00:00:00.000Z',
				'2099-12-31T23:59:59.999Z'
			)
		);
	});

	it('the range is clamped, and one the wrong way round keeps maxDate', () => {
		const dates = randDate({ minDate: -1e17, maxDate: 1e17, count: SAMPLE, output: 'detail' });

		assert.ok(
			dates.every((detail) => detail.timestamp >= DATE_FLOOR && detail.timestamp <= DATE_CEILING)
		);
		assert.deepStrictEqual(randDate({ minDate: '2030', maxDate: '2020', count: 2 }), [
			'2020-12-31T23:59:59.999Z',
			'2020-12-31T23:59:59.999Z'
		]);
	});

	it('the first and the last year a date may be are written with four digits', () => {
		assert.deepStrictEqual(
			randDate({ minDate: '0001-01-01T00:00', maxDate: '0001-01-01T00:00', format: 'YYYY YY M D' }),
			['0001 01 1 1']
		);
		assert.deepStrictEqual(
			randDate({
				minDate: '9999-12-31T23:59',
				maxDate: '9999-12-31T23:59',
				format: 'YYYY-MM-DD HH:mm'
			}),
			['9999-12-31 23:59']
		);
		// A year below 100 stays the year it is, not 1900 and something.
		for (const detail of randDate({
			minDate: '0050',
			maxDate: '0099',
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.ok(detail.year >= 50 && detail.year <= 99, String(detail.year));
		}
	});

	it('format writes every token, and text in brackets as it is', () => {
		const at = '2024-03-05T07:08:09.045Z';
		const write = (format: string) => randDate({ minDate: at, maxDate: at, format })[0];

		assert.strictEqual(write('YYYY YY MM M DD D'), '2024 24 03 3 05 5');
		assert.strictEqual(write('HH H hh h mm m ss s SSS A a'), '07 7 07 7 08 8 09 9 045 AM am');
		assert.strictEqual(write('YYYY년 M월 D일'), '2024년 3월 5일');
		assert.strictEqual(write('[Day] D [at] HH:mm'), 'Day 5 at 07:08');
		assert.strictEqual(write('YYYY/MM/DD'), '2024/03/05');

		const evening = '2024-03-05T19:00:00.000Z';

		assert.strictEqual(
			randDate({ minDate: evening, maxDate: evening, format: 'hh:mm A' })[0],
			'07:00 PM'
		);

		const midnight = '2024-03-05T00:00:00.000Z';

		assert.strictEqual(
			randDate({ minDate: midnight, maxDate: midnight, format: 'h A' })[0],
			'12 AM'
		);
		// A format that writes nothing is no format at all.
		assert.match(randDate({ format: '' })[0], ISO);
	});

	it('a bracket with no closing one is text, and so is everything inside a pair', () => {
		const at = '2024-03-05T07:08:09.045Z';
		const write = (format: string) => randDate({ minDate: at, maxDate: at, format })[0];

		assert.strictEqual(write('[YYYY'), '[2024');
		assert.strictEqual(write('[]YYYY'), '2024');
		assert.strictEqual(write('[a[b]YYYY'), 'a[b2024');
		assert.strictEqual(write('YYYY]'), '2024]');
		assert.strictEqual(write('[[YYYY]] D'), '[YYYY] 5');
	});

	it('a format of many unclosed brackets is read in linear time', () => {
		const started = performance.now();
		const [date] = randDate({ format: '['.repeat(50000), count: 20 });

		assert.strictEqual(date, '['.repeat(50000));
		// Quadratic, this took seconds; read once and in one pass, it is milliseconds.
		assert.ok(performance.now() - started < 1000);
	});

	it('the names are written in the language asked for, English by default', () => {
		// 2024-03-15 was a Friday, in the afternoon.
		const at = '2024-03-15T19:05';
		const write = (language?: string) =>
			randDate({
				minDate: at,
				maxDate: at,
				format: 'dddd|ddd|MMMM|MMM|A|a',
				language: language as never
			})[0];

		assert.strictEqual(write(), 'Friday|Fri|March|Mar|PM|pm');

		for (const language of WORD_LANGUAGES) {
			const names = DATE_NAMES[language];

			assert.strictEqual(
				write(language),
				[
					names.weekdays[4],
					names.weekdaysShort[4],
					names.months[2],
					names.monthsShort[2],
					names.meridiem[1],
					names.meridiemLower[1]
				].join('|'),
				language
			);
		}

		assert.strictEqual(write('ko'), '금요일|금|3월|3월|오후|오후');
		assert.strictEqual(write('ru'), 'пятница|пт|марта|мар.|PM|pm');
	});

	it('every month and every day of the week is written', () => {
		for (const language of WORD_LANGUAGES) {
			const months = new Set(
				randDate({ language, format: 'MMMM', count: 600, minDate: '2024', maxDate: '2024' })
			);
			const days = new Set(randDate({ language, format: 'dddd', count: 300 }));

			assert.strictEqual(months.size, 12, language);
			assert.strictEqual(days.size, 7, language);
		}
	});

	it('every language names twelve months, seven days and two halves, none of them twice', () => {
		assert.deepStrictEqual(Object.keys(DATE_NAMES).sort(), [...WORD_LANGUAGES].sort());

		for (const language of WORD_LANGUAGES) {
			const names = DATE_NAMES[language];

			for (const [list, length] of [
				[names.months, 12],
				[names.monthsShort, 12],
				[names.weekdays, 7],
				[names.weekdaysShort, 7],
				[names.meridiem, 2],
				[names.meridiemLower, 2]
			] as const) {
				assert.strictEqual(list.length, length, language);
				assert.strictEqual(new Set(list).size, length, `${language} names a part twice`);
			}
		}
	});

	it("'all' picks a language per date, and the detail says which", () => {
		const details = randDate({
			language: 'all',
			format: 'MMMM dddd',
			count: 300,
			output: 'detail'
		});

		assert.strictEqual(
			new Set(details.map((detail) => detail.language)).size,
			WORD_LANGUAGES.length
		);

		for (const detail of details) {
			const names = DATE_NAMES[detail.language];

			assert.strictEqual(
				detail.date,
				`${names.months[detail.month - 1]} ${names.weekdays[detail.weekday - 1]}`
			);
		}

		assert.ok(
			randDate({ count: 20, output: 'detail' }).every((detail) => detail.language === 'en')
		);
	});

	it('utcOffset writes every part at the offset, and Z writes the offset', () => {
		const dates = randDate({
			utcOffset: '+09:00',
			minDate: '2024-03-15',
			maxDate: '2024-03-15',
			count: SAMPLE,
			output: 'detail'
		});

		// A string bound with no offset of its own is read at the call's: the whole of
		// the 15th in Seoul, which starts at three in the afternoon of the 14th in UTC.
		assert.ok(inRange(dates, '2024-03-14T15:00:00.000Z', '2024-03-15T14:59:59.999Z'));

		for (const detail of dates) {
			assert.match(detail.date, /^2024-03-15T\d{2}:\d{2}:\d{2}\.\d{3}\+09:00$/);
			assert.strictEqual(detail.day, 15);
			// The detail's parts are the ones written, and its timestamp the instant.
			assert.strictEqual(new Date(detail.date).getTime(), detail.timestamp);
		}

		// Minutes east of UTC are the same offset as the string.
		const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

		assert.deepStrictEqual(
			randDate({ utcOffset: 540, count: 5, random: seeded(7) }),
			randDate({ utcOffset: '+09:00', count: 5, random: seeded(7) })
		);
	});

	it('a bound with an offset of its own, a Date and a number keep their instant', () => {
		const at = '2024-03-15T20:00:00.000Z';

		for (const bound of [at, new Date(at), Date.parse(at)]) {
			assert.deepStrictEqual(
				randDate({
					utcOffset: '-05:30',
					minDate: bound,
					maxDate: bound,
					format: 'YYYY-MM-DD HH:mm Z ZZ'
				}),
				['2024-03-15 14:30 -05:30 -0530']
			);
		}

		// UTC is written `Z` by `Z`, which keeps the default format ISO 8601.
		assert.deepStrictEqual(randDate({ minDate: at, maxDate: at, format: 'Z ZZ' }), ['Z +0000']);
	});

	it("the day, the hour and the weekday are the offset clock's", () => {
		// Eight in the evening of Friday in UTC is five in the morning of Saturday in Seoul.
		const at = '2024-03-15T20:00:00.000Z';
		const [detail] = randDate({
			utcOffset: '+09:00',
			minDate: at,
			maxDate: at,
			format: 'dddd HH',
			output: 'detail'
		});

		assert.strictEqual(detail.date, 'Saturday 05');
		assert.deepStrictEqual([detail.day, detail.hour, detail.weekday], [16, 5, 6]);

		for (const hour of randDate({
			utcOffset: '+09:00',
			minDate: '2024-03-15T09:00',
			maxDate: '2024-03-15T17:59',
			unit: 'hour',
			count: SAMPLE
		})) {
			assert.ok(hour >= 9 && hour <= 17, String(hour));
		}
	});

	it('the default range and the limits are on the offset clock', () => {
		for (const utcOffset of ['+14:00', '-12:00']) {
			for (const detail of randDate({ utcOffset, count: SAMPLE, output: 'detail' })) {
				assert.ok(detail.year >= 1900 && detail.year <= 2099, `${utcOffset} ${detail.date}`);
			}
		}

		// No year past the four digits, at either end and either side of UTC.
		for (const detail of randDate({
			utcOffset: '+14:00',
			minDate: '9999',
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.strictEqual(detail.year, 9999);
		}

		for (const detail of randDate({
			utcOffset: '-12:00',
			maxDate: '0001',
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.strictEqual(detail.year, 1);
		}
	});

	it('an offset no clock is set to is UTC', () => {
		for (const utcOffset of ['+25:00', '+09:60', 'Seoul', 1440, -1440, NaN, {}]) {
			assert.match(randDate({ utcOffset: utcOffset as never })[0], ISO, String(utcOffset));
		}
	});

	it('unit returns that part of each date, as a number', () => {
		const spans: Record<string, [number, number]> = {
			year: [1900, 2099],
			month: [1, 12],
			day: [1, 31],
			hour: [0, 23],
			minute: [0, 59],
			second: [0, 59],
			millisecond: [0, 999]
		};

		for (const unit of DATE_UNITS) {
			const values = randDate({ unit, count: LARGE });
			const [low, high] = spans[unit];

			assert.ok(
				values.every((value) => Number.isInteger(value) && value >= low && value <= high),
				unit
			);
		}

		// Every minute of an hour comes up, so the draw spans the whole of it.
		assert.strictEqual(new Set(randDate({ unit: 'minute', count: LARGE })).size, 60);
	});

	it('a unit keeps to the range', () => {
		for (const year of randDate({
			unit: 'year',
			minDate: '2000',
			maxDate: '2009',
			count: SAMPLE
		})) {
			assert.ok(year >= 2000 && year <= 2009, String(year));
		}

		for (const hour of randDate({
			unit: 'hour',
			minDate: '2024-03-15T09:00',
			maxDate: '2024-03-15T17:59',
			count: SAMPLE
		})) {
			assert.ok(hour >= 9 && hour <= 17, String(hour));
		}
	});

	it('unique never repeats, and stops when the range runs out', () => {
		const minutes = randDate({ unit: 'minute', count: 100, unique: true });

		assert.strictEqual(minutes.length, 60);
		assert.deepStrictEqual(
			[...minutes].sort((a, b) => a - b),
			Array.from({ length: 60 }, (_, minute) => minute)
		);

		const days = randDate({
			minDate: '2024-01-01',
			maxDate: '2024-01-10',
			format: 'YYYY-MM-DD',
			count: 20,
			unique: true
		});

		assert.strictEqual(days.length, 10);
		assert.strictEqual(new Set(days).size, 10);
	});

	it('the detail is the whole date even when unit names one part', () => {
		const [detail] = randDate({ unit: 'minute', output: 'detail' });

		assert.match(detail.date, ISO);
		assert.ok(agrees(detail));
	});
});
