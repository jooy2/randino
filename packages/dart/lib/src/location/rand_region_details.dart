import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// [randRegion], reporting the country each region is in.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randRegionDetails(language: LocationLanguage.en).first;
/// // LocationDetail(Ohio, en, region, United States, Ohio, null, null)
/// ```
List<LocationDetail> randRegionDetails({
  LocationLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateLocationDetails(
  form: LocationForm.unit,
  level: LocationLevel.region,
  language: language,
  count: count,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
