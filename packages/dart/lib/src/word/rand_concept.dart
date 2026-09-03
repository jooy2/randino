import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Ideas out of the humanities and the social world.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.concept] to `randWordDetails` — Dart has
/// no overloads, and twenty-four more functions for it would be twenty-four too many.
///
/// ```dart
/// randConcept(language: WordLanguage.ko, count: 3); // [자유, 평화, 진리]
/// randConcept(language: WordLanguage.en, count: 3); // [Freedom, Peace, Truth]
/// ```
List<String> randConcept({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.concept,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
