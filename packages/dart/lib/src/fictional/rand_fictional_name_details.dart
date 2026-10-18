import 'dart:math';

import 'package:randino/src/fictional/name_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalName], along with what each name was built from: the name in
/// the language drawn for it, its gender, and the same name in each language of
/// [language] under `forms`.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randFictionalNameDetails(
///   language: {WordLanguage.en, WordLanguage.ko, WordLanguage.ja},
/// ).first;
/// // FictionalNameDetail(Artemis, female, en, {en: Artemis, ko: 아르테미스, ja: アルテミス})
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
