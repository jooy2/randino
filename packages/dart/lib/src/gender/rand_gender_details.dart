import 'dart:math';

import 'package:randino/src/gender/gender_generator.dart';
import 'package:randino/src/types.dart';

/// [randGender], along with the code behind each label, so the code can be
/// stored while the label is shown.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randGenderDetails(language: WordLanguage.ko).first; // GenderDetail(여성, female, ko)
/// ```
List<GenderDetail> randGenderDetails({
  WordLanguage? language,
  int count = 1,
  bool includeUnknown = false,
  bool includeNonbinary = false,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateGenderDetails(
  language: language,
  count: count,
  includeUnknown: includeUnknown,
  includeNonbinary: includeNonbinary,
  unique: unique,
  random: random,
);
