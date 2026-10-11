import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// What food is made from, short of a vegetable or a fruit: meat, grain,
/// dairy, seasonings, sauces, spices and herbs.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.ingredient] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randIngredient(language: WordLanguage.ko, count: 3); // [간장, 밀가루, 버터]
/// randIngredient(language: WordLanguage.en, count: 3); // [Flour, Butter, Cinnamon]
/// ```
List<String> randIngredient({
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
  theme: WordTheme.ingredient,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
