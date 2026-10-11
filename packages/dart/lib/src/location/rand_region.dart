import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// Generate a country's first-level divisions: a Korean 시·도, a US state or the
/// District of Columbia.
///
/// Each is drawn as often as any other, whatever its size. A null [language]
/// means every language.
///
/// ```dart
/// randRegion(language: LocationLanguage.ko, count: 3); // [경기도, 부산광역시, 제주특별자치도]
/// randRegion(language: LocationLanguage.en, count: 2); // [Ohio, New Mexico]
/// randRegion(language: LocationLanguage.ko, short: true, count: 3); // [경기, 부산, 충북]
/// ```
List<String> randRegion({
  LocationLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Write the region by its short name, without the kind it is: `서울특별시` as `서울` and `충청북도` as `충북`.
  /// The rule is [randLocation]'s `short`.
  bool short = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateLocationDetails(
    form: LocationForm.unit,
    level: LocationLevel.region,
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
