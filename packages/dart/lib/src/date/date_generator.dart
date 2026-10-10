// The date generator: an instant drawn evenly from a range, then written out
// by a format or handed back one part at a time.
//
// Everything here is UTC unless the caller names an offset. A date drawn in the
// machine's own time zone would come out differently on two machines from the
// same seed, and an hour that a daylight-saving change skips would be a date no
// clock ever showed; a fixed offset has neither problem.

import 'dart:math';

import 'package:randino/src/date/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';

// Longest first, so `YYYY` is never read as two `YY` nor `MMMM` as two `MM`.
// Text in brackets is written as it is, and so is anything that is not a token.
final RegExp _tokens = RegExp(
  r'\[([^\]]*)]|YYYY|YY|MMMM|MMM|MM?|DD?|dddd|ddd|HH?|hh?|mm?|ss?|SSS|A|a|ZZ|Z',
);

// The widest offset a clock is set to is fourteen hours; anything up to a day
// short of it is still an offset, and a day or more is not one.
const int _offsetLimit = 24 * 60;

/// [utcOffset] as milliseconds east of UTC, whole minutes only. A day or more
/// is not an offset a clock could be set to, and reads as UTC.
int resolveOffset(Duration? utcOffset) {
  final minutes = utcOffset?.inMinutes ?? 0;

  return minutes.abs() < _offsetLimit ? minutes * 60000 : 0;
}

/// The first and the last millisecond a call may land on, for dates read at
/// [shift] milliseconds east of UTC.
///
/// A `DateTime` is the instant it holds, whether it is local or UTC. A bound
/// left out never contradicts the one that was written: past the default at
/// either end, it moves to the end of what a date may be. The defaults and the
/// limits are dates on a calendar, so they move with the offset: the range left
/// out is 1900 to 2099 on the clock the dates are written in, and no date is
/// written with a year outside 1 to 9999.
(int, int) dateRange(DateTime? minDate, DateTime? maxDate, int shift) {
  final floor = dateFloor - shift;
  final ceiling = dateCeiling - shift;
  final minDefault = dateMinDefault - shift;
  final maxDefault = dateMaxDefault - shift;
  final low = minDate?.millisecondsSinceEpoch;
  final high = maxDate?.millisecondsSinceEpoch;
  final min = low ?? (high != null && high < minDefault ? floor : minDefault);
  final max = high ?? (low != null && low > maxDefault ? ceiling : maxDefault);
  final top = clampInt(max, floor, ceiling);
  final bottom = clampInt(min, floor, ceiling);

  // A range the wrong way round keeps `maxDate`, the same way a length range
  // keeps `maxLength`: it is the bound a caller is usually holding to.
  return (bottom < top ? bottom : top, top);
}

String _pad(int value, int width) => '$value'.padLeft(width, '0');

/// An offset in minutes as ISO 8601 writes it: `+09:00`, or `+0900` without
/// the colon.
String _zone(int minutes, {required bool colon}) {
  final size = minutes.abs();

  return '${minutes < 0 ? '-' : '+'}${_pad(size ~/ 60, 2)}${colon ? ':' : ''}${_pad(size % 60, 2)}';
}

/// What one token of a format writes for [date], in [names], for a date read
/// at [offset] minutes east of UTC.
String _write(String token, DateTime date, DateNames names, int offset) => switch (token) {
  'YYYY' => _pad(date.year, 4),
  'YY' => _pad(date.year % 100, 2),
  'MMMM' => names.months[date.month - 1],
  'MMM' => names.monthsShort[date.month - 1],
  'MM' => _pad(date.month, 2),
  'M' => '${date.month}',
  'DD' => _pad(date.day, 2),
  'D' => '${date.day}',
  'dddd' => names.weekdays[date.weekday - 1],
  'ddd' => names.weekdaysShort[date.weekday - 1],
  'HH' => _pad(date.hour, 2),
  'H' => '${date.hour}',
  'hh' => _pad(date.hour % 12 == 0 ? 12 : date.hour % 12, 2),
  'h' => '${date.hour % 12 == 0 ? 12 : date.hour % 12}',
  'mm' => _pad(date.minute, 2),
  'm' => '${date.minute}',
  'ss' => _pad(date.second, 2),
  's' => '${date.second}',
  'SSS' => _pad(date.millisecond, 3),
  // UTC is `Z` in ISO 8601, which is what keeps the default format the string
  // `toIso8601String` writes.
  'Z' => offset == 0 ? 'Z' : _zone(offset, colon: true),
  'ZZ' => _zone(offset, colon: false),
  'A' => names.meridiem[date.hour < 12 ? 0 : 1],
  _ => names.meridiemLower[date.hour < 12 ? 0 : 1],
};

/// [date] written out by [format], in the names of [language], for a date
/// read at [offset] minutes east of UTC.
String formatDate(DateTime date, String format, WordLanguage language, {int offset = 0}) {
  final names = dateNames[language]!;

  return format.replaceAllMapped(
    _tokens,
    (match) => match.group(1) ?? _write(match.group(0)!, date, names, offset),
  );
}

/// A whole number from [min] to [max], both included.
///
/// Through a double rather than `nextInt`, which takes no bound past 2^32: a
/// range of two centuries is some six trillion milliseconds.
int _drawBetween(int min, int max) {
  final drawn = min + (randDouble() * (max - min + 1)).floor();

  return drawn > max ? max : drawn;
}

/// What `randDate`, `randDateUnit` and `randDateDetails` all do.
///
/// [write] is false when the caller is handed a unit and nothing else, which
/// leaves `date` empty: formatting a date nobody reads was most of the time a
/// call spent.
List<DateDetail> generateDateDetails({
  int count = 1,
  DateTime? minDate,
  DateTime? maxDate,
  DateUnit? unit,
  String format = dateFormatDefault,
  WordLanguage? language = WordLanguage.en,
  Duration? utcOffset,
  bool unique = false,
  Random? random,
  bool write = true,
}) {
  final shift = resolveOffset(utcOffset);
  final (min, max) = dateRange(minDate, maxDate, shift);
  // A format that writes nothing is no format at all.
  final written = format.isEmpty ? dateFormatDefault : format;

  return withRandom(
    random,
    () => collect<DateDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        final timestamp = _drawBetween(min, max);
        // The parts read at the offset: a `DateTime` that is UTC in name, holding
        // the clock the date is written on.
        final date = DateTime.fromMillisecondsSinceEpoch(timestamp + shift, isUtc: true);
        final WordLanguage drawn = language ?? pick(wordLanguages);

        return DateDetail(
          date: write ? formatDate(date, written, drawn, offset: shift ~/ 60000) : '',
          timestamp: timestamp,
          year: date.year,
          month: date.month,
          day: date.day,
          hour: date.hour,
          minute: date.minute,
          second: date.second,
          millisecond: date.millisecond,
          weekday: date.weekday,
          language: drawn,
        );
      },
      // Deduplicated by what the caller is handed: two dates in one minute are
      // one result when `unit` asks for the minute.
      keyOf: (detail) => unit == null ? detail.date : '${detail[unit]}',
    ),
  );
}
