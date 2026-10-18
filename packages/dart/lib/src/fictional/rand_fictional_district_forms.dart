import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalDistrict] in several languages at once, for a game or a book
/// that shows the same map to every reader in the reader's own language.
///
/// Each place is one map, the place in each language of [languages] keyed by
/// it, in the order the set iterates — the order a set literal is written in.
/// An empty set is every word language, in the order of `wordLanguages`. A
/// place is drawn in the first language and written in the rest, so the first
/// is the one [startsWith] reads, and [minLength] and [maxLength] measure: when
/// it does not write [startsWith], the call returns no places.
///
/// Dart has neither overloads nor union types, so a place in several languages
/// is a function of its own rather than the list the npm and PyPI packages take
/// as `language`.
///
/// ```dart
/// randFictionalDistrictForms(
///   {WordLanguage.ko, WordLanguage.en, WordLanguage.zh},
///   includeKind: true,
/// );
/// // [{WordLanguage.ko: 이블린 베이, WordLanguage.en: Evelyn Bay, WordLanguage.zh: 伊芙琳湾}]
/// ```
List<Map<WordLanguage, String>> randFictionalDistrictForms(
  Set<WordLanguage> languages, {
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
}) => [
  for (final detail in generateFictionalPlaceDetails(
    LocationLevel.district,
    language: languages,
    listed: true,
    includeKind: includeKind,
    kindStyle: kindStyle,
    count: count,
    realism: realism,
    minLength: minLength,
    maxLength: maxLength,
    startsWith: startsWith,
    unique: unique,
    random: random,
  ))
    detail.forms,
];
