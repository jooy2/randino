// The date generator: an instant drawn evenly from a range, then written out
// by a format or handed back one part at a time.
//
// Everything here is UTC. A date drawn in the machine's own time zone would
// come out differently on two machines from the same seed, and an hour that a
// daylight-saving change skips would be a date no clock ever showed.

import 'dart:math';

import 'package:randino/src/date/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

// Longest first, so `YYYY` is never read as two `YY`. Text in brackets is
// written as it is, and so is anything that is not a token.
final RegExp _tokens = RegExp(r'\[([^\]]*)]|YYYY|YY|SSS|MM?|DD?|HH?|hh?|mm?|ss?|A|a');

/// The first and the last millisecond a call may land on.
///
/// A `DateTime` is the instant it holds, whether it is local or UTC. A bound
/// left out never contradicts the one that was written: past the default at
/// either end, it moves to the end of what a date may be.
(int, int) dateRange(DateTime? minDate, DateTime? maxDate) {
  final low = minDate?.millisecondsSinceEpoch;
  final high = maxDate?.millisecondsSinceEpoch;
  final min = low ?? (high != null && high < dateMinDefault ? dateFloor : dateMinDefault);
  final max = high ?? (low != null && low > dateMaxDefault ? dateCeiling : dateMaxDefault);
  final top = clampInt(max, dateFloor, dateCeiling);
  final bottom = clampInt(min, dateFloor, dateCeiling);

  // A range the wrong way round keeps `maxDate`, the same way a length range
  // keeps `maxLength`: it is the bound a caller is usually holding to.
  return (bottom < top ? bottom : top, top);
}

String _pad(int value, int width) => '$value'.padLeft(width, '0');

/// What one token of a format writes for [date].
String _write(String token, DateTime date) => switch (token) {
  'YYYY' => _pad(date.year, 4),
  'YY' => _pad(date.year % 100, 2),
  'MM' => _pad(date.month, 2),
  'M' => '${date.month}',
  'DD' => _pad(date.day, 2),
  'D' => '${date.day}',
  'HH' => _pad(date.hour, 2),
  'H' => '${date.hour}',
  'hh' => _pad(date.hour % 12 == 0 ? 12 : date.hour % 12, 2),
  'h' => '${date.hour % 12 == 0 ? 12 : date.hour % 12}',
  'mm' => _pad(date.minute, 2),
  'm' => '${date.minute}',
  'ss' => _pad(date.second, 2),
  's' => '${date.second}',
  'SSS' => _pad(date.millisecond, 3),
  'A' => date.hour < 12 ? 'AM' : 'PM',
  _ => date.hour < 12 ? 'am' : 'pm',
};

/// [date] written out by [format].
String formatDate(DateTime date, String format) =>
    format.replaceAllMapped(_tokens, (match) => match.group(1) ?? _write(match.group(0)!, date));

/// A whole number from [min] to [max], both included.
///
/// Through a double rather than `nextInt`, which takes no bound past 2^32: a
/// range of two centuries is some six trillion milliseconds.
int _drawBetween(int min, int max) {
  final drawn = min + (randDouble() * (max - min + 1)).floor();

  return drawn > max ? max : drawn;
}

/// What `randDate`, `randDateUnit` and `randDateDetails` all do.
List<DateDetail> generateDateDetails({
  int count = 1,
  DateTime? minDate,
  DateTime? maxDate,
  DateUnit? unit,
  String format = dateFormatDefault,
  bool unique = false,
  Random? random,
}) {
  final (min, max) = dateRange(minDate, maxDate);
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
        final date = DateTime.fromMillisecondsSinceEpoch(timestamp, isUtc: true);

        return DateDetail(
          date: formatDate(date, written),
          timestamp: timestamp,
          year: date.year,
          month: date.month,
          day: date.day,
          hour: date.hour,
          minute: date.minute,
          second: date.second,
          millisecond: date.millisecond,
        );
      },
      // Deduplicated by what the caller is handed: two dates in one minute are
      // one result when `unit` asks for the minute.
      keyOf: (detail) => unit == null ? detail.date : '${detail[unit]}',
    ),
  );
}
