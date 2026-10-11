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
/// randDistrict(language: LocationLanguage.ko, short: true, count: 3); // [역삼, 조치원, 목동]
/// ```
List<String> randDistrict({
  LocationLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Write the district by its short name, without the kind it is: `봉천동` as `봉천` and `조치원읍` as `조치원`, while `목동` stays `목동`.
  /// The rule is [randLocation]'s `short`.
  bool short = false,

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
    short: short,
    random: random,
  ))
    detail.location,
];
