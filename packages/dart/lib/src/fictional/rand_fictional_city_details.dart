import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalCity], along with what each place was built from: the place
/// and its name in the language drawn for it, its kind, and the same place in
/// each language of [language] under `forms`.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randFictionalCityDetails(
///   language: {WordLanguage.en, WordLanguage.ru},
///   includeKind: true,
/// ).first;
/// // FictionalPlaceDetail(Ashwick Springs, Ashwick, springs, city, en,
/// //   {en: Ashwick Springs, ru: Эшуик-Спрингс})
/// ```
List<FictionalPlaceDetail> randFictionalCityDetails({
  Set<WordLanguage>? language,
  bool? includeKind,
  FictionalKindStyle? kindStyle,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateFictionalPlaceDetails(
  LocationLevel.city,
  language: language,
  includeKind: includeKind,
  kindStyle: kindStyle,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
