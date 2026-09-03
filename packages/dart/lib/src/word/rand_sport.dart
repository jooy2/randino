import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Sports and the things people play.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.sport] to `randWordDetails` — Dart has
/// no overloads, and fourteen more functions for it would be fourteen too many.
///
/// ```dart
/// randSport(language: WordLanguage.ko, count: 3); // [축구, 야구, 양궁]
/// randSport(language: WordLanguage.en, count: 3); // [Soccer, Baseball, Archery]
/// ```
List<String> randSport({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.sport,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
