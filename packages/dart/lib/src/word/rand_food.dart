import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Food and drink, the everyday kind.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.food] to `randWordDetails` — Dart has
/// no overloads, and seventeen more functions for it would be seventeen too many.
///
/// ```dart
/// randFood(language: WordLanguage.ko, count: 3); // [밥, 떡볶이, 빵]
/// randFood(language: WordLanguage.en, count: 3); // [Rice, Noodle, Dumpling]
/// ```
List<String> randFood({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.food,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
