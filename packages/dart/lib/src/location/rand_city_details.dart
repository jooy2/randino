import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// [randCity], reporting the region and country each city is in.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randCityDetails(language: LocationLanguage.ko).first;
/// // LocationDetail(강남구, ko, city, 대한민국, 서울특별시, 강남구, null)
/// ```
List<LocationDetail> randCityDetails({
  LocationLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Write the city by its short name, without the kind it is: `관악구` as `관악` and `수원시 장안구` as `수원 장안`, while `중구` stays `중구`.
  /// The rule is [randLocation]'s `short`.
  bool short = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateLocationDetails(
  form: LocationForm.unit,
  level: LocationLevel.city,
  language: language,
  count: count,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  short: short,
  random: random,
);
