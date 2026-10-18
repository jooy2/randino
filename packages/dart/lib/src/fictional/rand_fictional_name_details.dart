import 'dart:math';

import 'package:randino/src/fictional/name_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalName], along with the gender behind each name: the name in its
/// language, its gender, and the same name in every language asked for under
/// `forms`.
///
/// A null [language] draws a language per name, the way [randFictionalName]
/// does, and `forms` holds all nine. A set, an empty one being every language,
/// draws every name in its first language and writes it in each language of
/// the set, the way [randFictionalNameForms] does: `name` and `language` are
/// the first, and `forms` is the whole set in its order.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randFictionalNameDetails(language: {WordLanguage.en, WordLanguage.ko}).first;
/// // FictionalNameDetail(Artemis, female, en, {en: Artemis, ko: 아르테미스})
/// ```
List<FictionalNameDetail> randFictionalNameDetails({
  Set<WordLanguage>? language,
  NameGender? gender,
  bool includeSurname = false,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateFictionalNameDetails(
  language: language,
  listed: language != null,
  gender: gender,
  includeSurname: includeSurname,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
