import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Places — where people gather, live and pass through.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.place] to `randWordDetails` — Dart has
/// no overloads, and seventeen more functions for it would be seventeen too many.
///
/// ```dart
/// randPlace(language: WordLanguage.ko, count: 3); // [시장, 광장, 마을]
/// randPlace(language: WordLanguage.en, count: 3); // [Market, Plaza, Village]
/// ```
List<String> randPlace({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.place,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
