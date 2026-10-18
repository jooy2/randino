import 'dart:math';

import 'package:randino/src/fictional/name_generator.dart';
import 'package:randino/src/types.dart';

/// [randFictionalName] in several languages at once, for a game or a book that
/// shows the same character to every reader in the reader's own language.
///
/// Each name is one map, the name in each language of [languages] keyed by it,
/// in the order the set iterates — the order a set literal is written in. An
/// empty set is every word language, in the order of `wordLanguages`. A name is
/// drawn in the first language and written in the rest, so the first is the one
/// [startsWith] reads, and [minLength] and [maxLength] measure: when it does
/// not write [startsWith], the call returns no names.
///
/// Dart has neither overloads nor union types, so a name in several languages
/// is a function of its own rather than the list the npm and PyPI packages take
/// as `language`.
///
/// ```dart
/// randFictionalNameForms({WordLanguage.ko, WordLanguage.en, WordLanguage.ja}, count: 2);
/// // [{WordLanguage.ko: 아르테미스, WordLanguage.en: Artemis, WordLanguage.ja: アルテミス},
/// //  {WordLanguage.ko: 앨리스, WordLanguage.en: Alice, WordLanguage.ja: アリス}]
/// ```
List<Map<WordLanguage, String>> randFictionalNameForms(
  Set<WordLanguage> languages, {
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
}) => [
  for (final detail in generateFictionalNameDetails(
    language: languages,
    listed: true,
    gender: gender,
    includeSurname: includeSurname,
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
