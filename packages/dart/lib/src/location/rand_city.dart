import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// Generate the divisions a region is made of: a Korean 시·군·구, written with its
/// city where it is one of a city's districts (`수원시 장안구`), or a US city,
/// town, village or census designated place.
///
/// A name can come back more than once from different regions — Korea has a
/// `중구` in five of them — and [unique] compares the names. A null [language]
/// means every language.
///
/// ```dart
/// randCity(language: LocationLanguage.ko, count: 3); // [강남구, 수원시 장안구, 양평군]
/// randCity(language: LocationLanguage.en, count: 2); // [Pasadena, Burlington]
/// ```
List<String> randCity({
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
    level: LocationLevel.city,
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
