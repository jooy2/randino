import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// [randCountry], along with the ISO 3166-1 code each country is known by.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randCountryDetails(language: WordLanguage.ja).first;
/// // CountryDetail(サウジアラビア, SA, ja)
/// ```
List<CountryDetail> randCountryDetails({
  WordLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateCountryDetails(
  language: language,
  count: count,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
