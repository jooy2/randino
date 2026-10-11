import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Vegetables, the way a kitchen counts them — roots, greens, onions,
/// peppers, squash and mushrooms.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.vegetable] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randVegetable(language: WordLanguage.ko, count: 3); // [당근, 양파, 시금치]
/// randVegetable(language: WordLanguage.en, count: 3); // [Carrot, Onion, Spinach]
/// ```
List<String> randVegetable({
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
  theme: WordTheme.vegetable,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
