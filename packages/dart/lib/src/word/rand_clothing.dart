import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// What people wear, and what it is made of.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.clothing] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randClothing(language: WordLanguage.ko, count: 3); // [두루마기, 양말, 외투]
/// randClothing(language: WordLanguage.en, count: 3); // [Cardigan, Mitten, Overcoat]
/// ```
List<String> randClothing({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.clothing,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
