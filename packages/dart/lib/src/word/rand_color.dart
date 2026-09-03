import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Colours, from the plain ones to the ones with a history.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.color] to `randWordDetails` — Dart has
/// no overloads, and twenty-four more functions for it would be twenty-four too many.
///
/// ```dart
/// randColor(language: WordLanguage.ko, count: 3); // [주홍, 연두, 쪽빛]
/// randColor(language: WordLanguage.en, count: 3); // [Crimson, Teal, Ochre]
/// ```
List<String> randColor({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.color,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
