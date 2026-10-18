import 'dart:math';

import 'package:randino/src/fictional/name_generator.dart';
import 'package:randino/src/types.dart';

/// Generate names for the characters of a story or a game: the names a novel,
/// a game or a tabletop campaign gives its cast, rather than the names of real
/// people in one country.
///
/// A name is spelled in Latin letters first, English and British names among
/// them, and written by its sound in every other language: `Artemis` is
/// `아르테미스` in Korean and `アルテミス` in Japanese. A [language] set draws one
/// language per name, in the order it was written, and a null or empty one
/// draws from every language. A null [gender] picks one per name, and
/// [includeSurname] follows the given name with a family name (`Elara
/// Blackwood`): a character in a story or a game is usually known by one name.
///
/// ```dart
/// randFictionalName(language: {WordLanguage.en}, count: 3); // [Alice, Theron, Elara]
/// randFictionalName(language: {WordLanguage.ko}, gender: NameGender.female, count: 3);
/// // [앨리스, 트리아, 에밀리]
/// randFictionalName(language: {WordLanguage.ja}, includeSurname: true); // [エララ・ブラックウッド]
/// ```
List<String> randFictionalName({
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
}) => [
  for (final detail in generateFictionalNameDetails(
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
  ))
    detail.name,
];
