import 'package:randino/randino.dart';
// Internal, but they are what a range is checked against.
import 'package:randino/src/date/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 6000;

final RegExp iso = RegExp(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$');

/// Whether the platform's own `DateTime` reads the detail's timestamp as the
/// same parts.
bool agrees(DateDetail detail) {
  final date = DateTime.fromMillisecondsSinceEpoch(detail.timestamp, isUtc: true);

  return date.year == detail.year &&
      date.month == detail.month &&
      date.day == detail.day &&
      date.hour == detail.hour &&
      date.minute == detail.minute &&
      date.second == detail.second &&
      date.millisecond == detail.millisecond &&
      date.weekday == detail.weekday;
}

bool inRange(List<DateDetail> dates, DateTime from, DateTime to) => dates.every(
  (detail) =>
      detail.timestamp >= from.millisecondsSinceEpoch &&
      detail.timestamp <= to.millisecondsSinceEpoch,
);

/// The one date [format] writes for the instant [at].
String write(DateTime at, String format) =>
    randDate(minDate: at, maxDate: at, format: format).single;

void main() {
  group('Date', () {
    test('randDate returns one ISO 8601 date by default', () {
      final dates = randDate();

      expect(dates, hasLength(1));
      expect(dates.single, matches(iso));
      // What the platform writes for the same instant, so the default format is
      // ISO 8601 rather than something shaped like it.
      expect(DateTime.parse(dates.single).toIso8601String(), dates.single);
    });

    test('returns exactly `count` dates', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randDate(count: count), hasLength(count));
      }

      expect(randDate(count: -3), isEmpty);
      expect(randDate(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('the default range is the years 1900 to 2099', () {
      final dates = randDateDetails(count: large);

      expect(
        inRange(dates, DateTime.utc(1900), DateTime.utc(2099, 12, 31, 23, 59, 59, 999)),
        isTrue,
      );
      expect(dateMinDefault, DateTime.utc(1900).millisecondsSinceEpoch);
      expect(dateMaxDefault, DateTime.utc(2099, 12, 31, 23, 59, 59, 999).millisecondsSinceEpoch);
      expect(dateFloor, DateTime.utc(1).millisecondsSinceEpoch);
      expect(dateCeiling, DateTime.utc(9999, 12, 31, 23, 59, 59, 999).millisecondsSinceEpoch);
    });

    test('the parts of the detail are the parts of its timestamp', () {
      for (final detail in randDateDetails(count: sample * 5)) {
        expect(agrees(detail), isTrue, reason: '$detail');
        expect(
          detail.date,
          DateTime.fromMillisecondsSinceEpoch(detail.timestamp, isUtc: true).toIso8601String(),
        );
      }
    });

    test('a DateTime is the instant it holds, local or UTC', () {
      final at = DateTime.utc(2024, 3, 15, 10, 30, 15, 123);

      expect(randDate(minDate: at, maxDate: at), <String>['2024-03-15T10:30:15.123Z']);

      // A local date is the same instant written in UTC.
      final local = DateTime(2024, 3, 15, 10, 30);

      expect(
        randDateDetails(minDate: local, maxDate: local).single.timestamp,
        local.millisecondsSinceEpoch,
      );

      final from = DateTime.utc(2024, 3, 15, 9);
      final to = DateTime.utc(2024, 3, 15, 17, 59, 59, 999);

      expect(inRange(randDateDetails(minDate: from, maxDate: to, count: sample), from, to), isTrue);
    });

    test('a bound left out never contradicts the one that was written', () {
      final late = randDateDetails(minDate: DateTime.utc(2200), count: sample);
      final early = randDateDetails(maxDate: DateTime.utc(1850), count: sample);

      expect(
        inRange(late, DateTime.utc(2200), DateTime.utc(9999, 12, 31, 23, 59, 59, 999)),
        isTrue,
      );
      expect(inRange(early, DateTime.utc(1), DateTime.utc(1850)), isTrue);
      // Inside the default, it is the default.
      expect(
        inRange(
          randDateDetails(minDate: DateTime.utc(2020), count: sample),
          DateTime.utc(2020),
          DateTime.utc(2099, 12, 31, 23, 59, 59, 999),
        ),
        isTrue,
      );
    });

    test('the range is clamped, and one the wrong way round keeps maxDate', () {
      final dates = randDateDetails(
        minDate: DateTime.utc(-5000),
        maxDate: DateTime.utc(20000),
        count: sample,
      );

      expect(
        dates.every((detail) => detail.timestamp >= dateFloor && detail.timestamp <= dateCeiling),
        isTrue,
      );
      expect(randDate(minDate: DateTime.utc(2030), maxDate: DateTime.utc(2020), count: 2), <String>[
        '2020-01-01T00:00:00.000Z',
        '2020-01-01T00:00:00.000Z',
      ]);
    });

    test('the first and the last year a date may be are written with four digits', () {
      expect(write(DateTime.utc(1), 'YYYY YY M D'), '0001 01 1 1');
      expect(write(DateTime.utc(9999, 12, 31, 23, 59), 'YYYY-MM-DD HH:mm'), '9999-12-31 23:59');

      // A year below 100 stays the year it is.
      for (final detail in randDateDetails(
        minDate: DateTime.utc(50),
        maxDate: DateTime.utc(99),
        count: sample,
      )) {
        expect(detail.year, inInclusiveRange(50, 99));
      }
    });

    test('format writes every token, and text in brackets as it is', () {
      final at = DateTime.utc(2024, 3, 5, 7, 8, 9, 45);

      expect(write(at, 'YYYY YY MM M DD D'), '2024 24 03 3 05 5');
      expect(write(at, 'HH H hh h mm m ss s SSS A a'), '07 7 07 7 08 8 09 9 045 AM am');
      expect(write(at, 'YYYY년 M월 D일'), '2024년 3월 5일');
      expect(write(at, '[Day] D [at] HH:mm'), 'Day 5 at 07:08');
      expect(write(at, 'YYYY/MM/DD'), '2024/03/05');
      expect(write(DateTime.utc(2024, 3, 5, 19), 'hh:mm A'), '07:00 PM');
      expect(write(DateTime.utc(2024, 3, 5), 'h A'), '12 AM');
      // A format that writes nothing is no format at all.
      expect(randDate(format: '').single, matches(iso));
    });

    test('the names are written in the language asked for, English by default', () {
      // 2024-03-15 was a Friday, in the afternoon.
      final at = DateTime.utc(2024, 3, 15, 19, 5);
      String names([WordLanguage? language = WordLanguage.en]) =>
          randDate(
            minDate: at,
            maxDate: at,
            format: 'dddd|ddd|MMMM|MMM|A|a',
            language: language,
          ).single;

      expect(names(), 'Friday|Fri|March|Mar|PM|pm');
      expect(names(WordLanguage.ko), '금요일|금|3월|3월|오후|오후');
      expect(names(WordLanguage.ru), 'пятница|пт|марта|мар.|PM|pm');

      for (final language in wordLanguages) {
        final table = dateNames[language]!;

        expect(
          names(language),
          <String>[
            table.weekdays[4],
            table.weekdaysShort[4],
            table.months[2],
            table.monthsShort[2],
            table.meridiem[1],
            table.meridiemLower[1],
          ].join('|'),
          reason: language.name,
        );
      }
    });

    test('every language names twelve months, seven days and two halves, none twice', () {
      expect(dateNames.keys.toSet(), WordLanguage.values.toSet());

      for (final language in wordLanguages) {
        final table = dateNames[language]!;

        for (final (list, length) in <(List<String>, int)>[
          (table.months, 12),
          (table.monthsShort, 12),
          (table.weekdays, 7),
          (table.weekdaysShort, 7),
          (table.meridiem, 2),
          (table.meridiemLower, 2),
        ]) {
          expect(list, hasLength(length), reason: language.name);
          expect(list.toSet(), hasLength(length), reason: '${language.name} names a part twice');
        }
      }
    });

    test('a null language picks one per date, and the detail says which', () {
      final details = randDateDetails(language: null, format: 'MMMM dddd', count: 300);

      expect(details.map((detail) => detail.language).toSet(), wordLanguages.toSet());

      for (final detail in details) {
        final table = dateNames[detail.language]!;

        expect(
          detail.date,
          '${table.months[detail.month - 1]} ${table.weekdays[detail.weekday - 1]}',
        );
      }

      expect(randDateDetails(count: 20).every((d) => d.language == WordLanguage.en), isTrue);
    });

    test('utcOffset writes every part at the offset, and Z writes the offset', () {
      const seoul = Duration(hours: 9);
      // The default range is 1900 to 2099 on the clock the dates are written in.
      final dates = randDateDetails(utcOffset: seoul, count: sample);

      for (final detail in dates) {
        expect(
          detail.date,
          matches(RegExp(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+09:00$')),
        );
        expect(detail.year, inInclusiveRange(1900, 2099));
        // The written date is the same instant as the timestamp.
        expect(DateTime.parse(detail.date).millisecondsSinceEpoch, detail.timestamp);
      }

      final at = DateTime.utc(2024, 3, 15, 20);

      expect(
        randDate(
          utcOffset: const Duration(hours: -5, minutes: -30),
          minDate: at,
          maxDate: at,
          format: 'YYYY-MM-DD HH:mm Z ZZ',
        ),
        <String>['2024-03-15 14:30 -05:30 -0530'],
      );
      // UTC is written `Z` by `Z`, which keeps the default format ISO 8601.
      expect(randDate(minDate: at, maxDate: at, format: 'Z ZZ'), <String>['Z +0000']);
    });

    test('the day, the hour and the weekday are the offset clock\'s', () {
      // Eight in the evening of Friday in UTC is five in the morning of Saturday
      // in Seoul.
      final at = DateTime.utc(2024, 3, 15, 20);
      final detail =
          randDateDetails(
            utcOffset: const Duration(hours: 9),
            minDate: at,
            maxDate: at,
            format: 'dddd HH',
          ).single;

      expect(detail.date, 'Saturday 05');
      expect(<int>[detail.day, detail.hour, detail.weekday], <int>[16, 5, 6]);

      for (final hour in randDateUnit(
        DateUnit.hour,
        utcOffset: const Duration(hours: 9),
        minDate: DateTime.utc(2024, 3, 15),
        maxDate: DateTime.utc(2024, 3, 15, 8, 59),
        count: sample,
      )) {
        expect(hour, inInclusiveRange(9, 17));
      }
    });

    test('no date is written with a year past four digits, either side of UTC', () {
      for (final detail in randDateDetails(
        utcOffset: const Duration(hours: 14),
        minDate: DateTime.utc(9999),
        count: sample,
      )) {
        expect(detail.year, 9999);
      }

      for (final detail in randDateDetails(
        utcOffset: const Duration(hours: -12),
        maxDate: DateTime.utc(1, 1, 2),
        count: sample,
      )) {
        expect(detail.year, 1);
      }

      // A day or more is no offset, and reads as UTC.
      expect(randDate(utcOffset: const Duration(days: 1)).single, matches(iso));
    });

    test('randDateUnit returns that part of each date, as a number', () {
      const spans = <DateUnit, (int, int)>{
        DateUnit.year: (1900, 2099),
        DateUnit.month: (1, 12),
        DateUnit.day: (1, 31),
        DateUnit.hour: (0, 23),
        DateUnit.minute: (0, 59),
        DateUnit.second: (0, 59),
        DateUnit.millisecond: (0, 999),
      };

      for (final unit in dateUnits) {
        final (low, high) = spans[unit]!;

        for (final value in randDateUnit(unit, count: large)) {
          expect(value, inInclusiveRange(low, high), reason: unit.name);
        }
      }

      // Every minute of an hour comes up, so the draw spans the whole of it.
      expect(randDateUnit(DateUnit.minute, count: large).toSet(), hasLength(60));
    });

    test('a unit keeps to the range', () {
      for (final year in randDateUnit(
        DateUnit.year,
        minDate: DateTime.utc(2000),
        maxDate: DateTime.utc(2009, 12, 31),
        count: sample,
      )) {
        expect(year, inInclusiveRange(2000, 2009));
      }

      // A leap February has twenty-nine days, and every one of them comes up.
      final days = randDateUnit(
        DateUnit.day,
        minDate: DateTime.utc(2024, 2),
        maxDate: DateTime.utc(2024, 2, 29, 23, 59, 59, 999),
        count: 2000,
      );

      expect(days.toSet(), <int>{for (var day = 1; day <= 29; day += 1) day});
    });

    test('unique never repeats, and stops when the range runs out', () {
      final minutes = randDateUnit(DateUnit.minute, count: 100, unique: true);

      expect(minutes, hasLength(60));
      expect(minutes.toSet(), hasLength(60));

      final days = randDate(
        minDate: DateTime.utc(2024),
        maxDate: DateTime.utc(2024, 1, 10, 23, 59, 59, 999),
        format: 'YYYY-MM-DD',
        count: 20,
        unique: true,
      );

      expect(days, hasLength(10));
      expect(days.toSet(), hasLength(10));
    });

    test('the detail reads every part by its unit', () {
      final detail = randDateDetails().single;

      for (final unit in dateUnits) {
        expect(detail[unit], switch (unit) {
          DateUnit.year => detail.year,
          DateUnit.month => detail.month,
          DateUnit.day => detail.day,
          DateUnit.hour => detail.hour,
          DateUnit.minute => detail.minute,
          DateUnit.second => detail.second,
          DateUnit.millisecond => detail.millisecond,
        });
      }
    });
  });
}
