import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Creatures of myth, folklore and fantasy: dragons and fairies, ghosts and
/// the undead, gods, giants and aliens — every being that is no animal and no
/// person.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.monster] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randMonster(language: WordLanguage.ko, count: 3); // [도깨비, 구미호, 슬라임]
/// randMonster(language: WordLanguage.en, count: 3); // [Dragon, Vampire, Golem]
/// ```
List<String> randMonster({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  RandVocabulary vocabulary = RandVocabulary.full,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => randWord(
  language: language,
  theme: WordTheme.monster,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
