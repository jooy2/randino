import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Ideas out of the humanities and the social world.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.concept] to `randWordDetails` — Dart has
/// no overloads, and fourteen more functions for it would be fourteen too many.
///
/// ```dart
/// randConcept(language: WordLanguage.ko, count: 3); // [자유, 평화, 진리]
/// randConcept(language: WordLanguage.en, count: 3); // [Freedom, Peace, Truth]
/// ```
List<String> randConcept({
  WordLanguage? language,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.concept,
  count: count,
  style: style,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
