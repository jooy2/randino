import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Plants: trees, flowers, leaves and what grows on them.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.plant] to `randWordDetails` — Dart has
/// no overloads, and twenty-four more functions for it would be twenty-four too many.
///
/// ```dart
/// randPlant(language: WordLanguage.ko, count: 3); // [나무, 민들레, 꽃]
/// randPlant(language: WordLanguage.en, count: 3); // [Treetop, Blossom, Fern]
/// ```
List<String> randPlant({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.plant,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
