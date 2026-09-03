import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Stones and metals, precious and ordinary alike.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.gem] to `randWordDetails` — Dart has
/// no overloads, and seventeen more functions for it would be seventeen too many.
///
/// ```dart
/// randGem(language: WordLanguage.ko, count: 3); // [금, 수정, 흑요석]
/// randGem(language: WordLanguage.en, count: 3); // [Gold, Quartz, Obsidian]
/// ```
List<String> randGem({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.gem,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
