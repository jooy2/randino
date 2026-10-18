import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalRegion], along with each place's name and kind: the place and
/// its name in its language, its kind, and the same place in every language
/// asked for under `forms`.
///
/// A null [language] draws a language per place, the way
/// [randFictionalRegion] does, and `forms` holds all nine. A set, an empty one being every language,
/// draws every place in its first language and writes it in each language of the set, the
/// way [randFictionalRegionForms] does: `place`, `name` and `language` are the
/// first, and `forms` is the whole set in its order.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randFictionalRegionDetails(
///   language: {WordLanguage.en, WordLanguage.ja},
///   includeKind: true,
/// ).first;
/// // FictionalPlaceDetail(Novaria Frontier, Novaria, frontier, region, en,
/// //   {en: Novaria Frontier, ja: ノヴァリア辺境})
/// ```
List<FictionalPlaceDetail> randFictionalRegionDetails({
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
  LocationLevel.region,
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
