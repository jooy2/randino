import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Kinds of music: genres and their sub-genres, from techno and grunge to
/// K-pop, and the kinds of piece a composer writes.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.genre] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randGenre(language: WordLanguage.ko, count: 3); // [재즈, 테크노, 교향곡]
/// randGenre(language: WordLanguage.en, count: 3); // [Jazz, Techno, Symphony]
/// ```
List<String> randGenre({
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
  theme: WordTheme.genre,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
