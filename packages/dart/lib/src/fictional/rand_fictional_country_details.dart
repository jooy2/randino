import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalCountry], along with each place's name and kind: the place and
/// its name in its language, its kind, and the same place in every language
/// asked for under `forms`.
///
/// A null [language] draws a language per place, the way
/// [randFictionalCountry] does, and `forms` holds all nine. A set, an empty one being every language,
/// draws every place in its first language and writes it in each language of the set, the
/// way [randFictionalCountryForms] does: `place`, `name` and `language` are the
/// first, and `forms` is the whole set in its order.
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
  listed: language != null,
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
