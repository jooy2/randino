import 'dart:math';

import 'package:randino/src/date/date_generator.dart';
import 'package:randino/src/types.dart';

/// [randDate], one part of each date at a time, as a number.
///
/// The part is read off a date drawn from the range, so `DateUnit.minute` is
/// `0` to `59` and `DateUnit.year` keeps inside [minDate] and [maxDate].
/// [unique] never repeats the part: an hour has sixty minutes, and no more.
/// [utcOffset] reads the part at a fixed offset from UTC, so the hour is the
/// hour on that clock.
///
/// Dart has neither overloads nor union types, so a part on its own is a
/// function of its own rather than the `unit` option the npm and PyPI packages
/// take.
///
/// ```dart
/// randDateUnit(DateUnit.minute, count: 3); // [37, 4, 52]
/// randDateUnit(DateUnit.year, minDate: DateTime.utc(2000), maxDate: DateTime.utc(2009), count: 3); // [2004, 2000, 2007]
/// ```
List<int> randDateUnit(
  DateUnit unit, {
  int count = 1,
  DateTime? minDate,
  DateTime? maxDate,
  Duration? utcOffset,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateDateDetails(
    count: count,
    minDate: minDate,
    maxDate: maxDate,
    unit: unit,
    utcOffset: utcOffset,
    unique: unique,
    random: random,
  ))
    detail[unit],
];
