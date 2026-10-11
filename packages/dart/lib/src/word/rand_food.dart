import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_ingredient.dart';
import 'package:randino/src/word/rand_word.dart';

/// Prepared food: dishes, soups, noodles, bread, desserts and snacks — what is
/// eaten as it is served. What it is cooked from is [randIngredient], and
/// vegetables and fruit have their own.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.food] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randFood(language: WordLanguage.ko, count: 3); // [밥, 떡볶이, 빵]
/// randFood(language: WordLanguage.en, count: 3); // [Pizza, Noodle, Dumpling]
/// ```
List<String> randFood({
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
  theme: WordTheme.food,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
