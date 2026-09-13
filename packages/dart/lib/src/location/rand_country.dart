import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// The country a language's locations are in, the way the language writes it.
///
/// There is one per language — a null [language] is how more than one comes
/// back — and it is the top of every location `randLocation` writes.
///
/// ```dart
/// randCountry(language: LocationLanguage.ko); // [대한민국]
/// randCountry(count: 3); // [United States, 대한민국, 대한민국]
/// ```
List<String> randCountry({
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
    level: LocationLevel.country,
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
