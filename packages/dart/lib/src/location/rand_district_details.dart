import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// [randDistrict], reporting the city, region and country each district is in.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randDistrictDetails(language: LocationLanguage.ko).first;
/// // LocationDetail(역삼동, ko, district, 대한민국, 서울특별시, 강남구, 역삼동)
/// ```
List<LocationDetail> randDistrictDetails({
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
}) => generateLocationDetails(
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
);
