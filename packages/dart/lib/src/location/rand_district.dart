import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// Generate the divisions inside a city: a Korean 읍·면·동.
///
/// The legal 동 an address is written with, not the administrative one a
/// community centre serves, and never a 리 below it.
///
/// Only Korean locations have this level, so `language: LocationLanguage.en`
/// returns nothing and a null [language] draws Korean.
///
/// ```dart
/// randDistrict(language: LocationLanguage.ko, count: 3); // [역삼동, 조치원읍, 한림읍]
/// ```
List<String> randDistrict({
  LocationLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateLocationDetails(
    form: LocationForm.unit,
    level: LocationLevel.district,
    language: language,
    count: count,
    minLength: minLength,
    maxLength: maxLength,
    startsWith: startsWith,
    unique: unique,
    random: random,
  ))
    detail.location,
];
