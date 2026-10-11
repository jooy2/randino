import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_monster.dart';
import 'package:randino/src/word/rand_word.dart';

/// Magic and what myth is made of: spells, curses, prophecies, relics, potions
/// and the realms of myth. The creatures are [randMonster].
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.myth] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randMyth(language: WordLanguage.ko, count: 3); // [저주, 부적, 용궁]
/// randMyth(language: WordLanguage.en, count: 3); // [Curse, Amulet, Elixir]
/// ```
List<String> randMyth({
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
  theme: WordTheme.myth,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
