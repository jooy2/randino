import 'dart:math';

import 'package:randino/src/fictional/name_generator.dart';
import 'package:randino/src/types.dart';

/// Generate names for the characters of a story or a game: the names a novel,
/// a game or a tabletop campaign gives its cast, rather than the names of real
/// people in one country.
///
/// A name is spelled in Latin letters first, English and British names among
/// them, and written by its sound in every other language: `Artemis` is
/// `아르테미스` in Korean and `アルテミス` in Japanese. A null [language], the
/// default, draws a language per name. A null [gender] picks one per name, and
/// [includeSurname] follows the given name with a family name (`Elara
/// Blackwood`): a character in a story or a game is usually known by one name.
///
/// [randFictionalNameForms] writes every name in several languages at once.
///
/// ```dart
/// randFictionalName(language: WordLanguage.en, count: 3); // [Alice, Arsis, Emily]
/// randFictionalName(language: WordLanguage.ko, gender: NameGender.female, count: 3);
/// // [앨리스, 트리아, 베리]
/// randFictionalName(language: WordLanguage.ja, includeSurname: true); // [アスター・シンクレア]
/// ```
List<String> randFictionalName({
  WordLanguage? language,
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
    language: language == null ? null : {language},
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
    detail.name,
];
