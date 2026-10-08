import 'dart:math';

import 'package:randino/src/date/data/index.dart';
import 'package:randino/src/date/date_generator.dart';
import 'package:randino/src/types.dart';

/// [randDate], along with every part each date was built from.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randDateDetails().first.year; // 1987
/// ```
List<DateDetail> randDateDetails({
  int count = 1,
  DateTime? minDate,
  DateTime? maxDate,
  String format = dateFormatDefault,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateDateDetails(
  count: count,
  minDate: minDate,
  maxDate: maxDate,
  format: format,
  unique: unique,
  random: random,
);
