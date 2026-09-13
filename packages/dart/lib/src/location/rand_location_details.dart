import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// [randLocation], reporting every level each location names.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randLocationDetails(language: LocationLanguage.ko).first;
/// // LocationDetail(대한민국 서울특별시 종로구 청운동, ko, district,
/// //   대한민국, 서울특별시, 종로구, 청운동)
/// ```
List<LocationDetail> randLocationDetails({
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
}) => generateLocationDetails(
  form: LocationForm.path,
  level: level,
  language: language,
  count: count,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
