import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_genre.dart';
import 'package:randino/src/word/rand_word.dart';

/// Music and how it is made: instruments, notation, performing and the parts of a
/// song. The kinds of music are [randGenre].
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.music] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randMusic(language: WordLanguage.ko, count: 3); // [피아노, 거문고, 악보]
/// randMusic(language: WordLanguage.en, count: 3); // [Piano, Fiddle, Melody]
/// ```
List<String> randMusic({
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
  theme: WordTheme.music,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
