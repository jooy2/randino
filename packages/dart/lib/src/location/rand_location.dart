import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// Generate real locations, written out from the country down to [level] the way
/// the language writes one.
///
/// Every division is one the country itself publishes, and each sits inside the
/// one written beside it. A country without [level] stops at the deepest level it
/// has, and a null [language] means every language.
///
/// Nothing goes below a Korean 읍·면·동 or a US city — no street, no building, no
/// number — so a result is a place, never somebody's address.
///
/// ```dart
/// randLocation(language: LocationLanguage.ko); // [대한민국 경기도 수원시 장안구 파장동]
/// randLocation(language: LocationLanguage.en); // [Pasadena, California, United States]
/// randLocation(language: LocationLanguage.ko, level: LocationLevel.city, count: 2);
/// // [대한민국 경상남도 창원시 진해구, 대한민국 충청북도 단양군]
/// ```
List<String> randLocation({
  LocationLanguage? language,
  LocationLevel level = LocationLevel.district,
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
    form: LocationForm.path,
    level: level,
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
