import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Things you buy — the manufactured end of the vocabulary.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.product] to `randWordDetails` — Dart has
/// no overloads, and fourteen more functions for it would be fourteen too many.
///
/// ```dart
/// randProduct(language: WordLanguage.ko, count: 3); // [노트북, 키보드, 이어폰]
/// randProduct(language: WordLanguage.en, count: 3); // [Laptop, Keyboard, Earphone]
/// ```
List<String> randProduct({
  WordLanguage? language,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.product,
  count: count,
  style: style,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
