import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalCountry], along with what each place was built from: the place
/// and its name in the language drawn for it, its kind, and the same place in
/// each language of [language] under `forms`.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randFictionalCountryDetails(
///   language: {WordLanguage.en, WordLanguage.ko},
///   includeKind: true,
/// ).first;
/// // FictionalPlaceDetail(Kingdom of Edlin, Edlin, kingdom, country, en,
/// //   {en: Kingdom of Edlin, ko: 에들린 왕국})
/// ```
List<FictionalPlaceDetail> randFictionalCountryDetails({
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
  LocationLevel.country,
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
