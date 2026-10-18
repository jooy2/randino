import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalCity], along with each place's name and kind: the place and
/// its name in its language, its kind, and the same place in every language
/// asked for under `forms`.
///
/// A null [language] draws a language per place, the way
/// [randFictionalCity] does, and `forms` holds all nine. A set, an empty one being every language,
/// draws every place in its first language and writes it in each language of the set, the
/// way [randFictionalCityForms] does: `place`, `name` and `language` are the
/// first, and `forms` is the whole set in its order.
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
