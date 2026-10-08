import 'dart:math';

import 'package:randino/src/date/data/index.dart';
import 'package:randino/src/date/date_generator.dart';

/// Generate dates, drawn evenly from a range and written out in UTC.
///
/// [minDate] defaults to `1900-01-01T00:00:00.000Z` and [maxDate] to
/// `2099-12-31T23:59:59.999Z`; past either default, the bound left out moves
/// to the year 1 or the end of the year 9999 instead, and a range the wrong way
/// round keeps [maxDate]. A `DateTime` is the instant it holds, so
/// `DateTime.utc(2024, 12, 31)` as [maxDate] stops at that midnight.
///
/// [format] writes the date: `YYYY`, `YY`, `M`, `MM`, `D`, `DD`, `H`, `HH`,
/// `h`, `hh`, `m`, `mm`, `s`, `ss`, `SSS`, `A` and `a` are replaced, text
/// inside `[` `]` is written as it is, and so is everything else. It defaults
/// to ISO 8601.
///
/// ```dart
/// randDate(); // [1987-06-21T08:14:51.302Z]
/// randDate(minDate: DateTime.utc(2024), maxDate: DateTime.utc(2024, 12, 31), format: 'YYYY-MM-DD'); // [2024-07-09]
/// randDate(format: 'YYYY년 M월 D일 HH:mm', count: 2); // [2031년 3월 4일 19:40, 1958년 11월 27일 06:02]
/// ```
List<String> randDate({
  int count = 1,
  DateTime? minDate,
  DateTime? maxDate,
  String format = dateFormatDefault,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateDateDetails(
    count: count,
    minDate: minDate,
    maxDate: maxDate,
    format: format,
    unique: unique,
    random: random,
  ))
    detail.date,
];
