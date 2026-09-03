import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// The vocabulary of computers and the networks between them.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.tech] to `randWordDetails` — Dart has
/// no overloads, and twenty-four more functions for it would be twenty-four too many.
///
/// ```dart
/// randTech(language: WordLanguage.ko, count: 3); // [서버, 캐시, 대역]
/// randTech(language: WordLanguage.en, count: 3); // [Server, Cache, Subnet]
/// ```
List<String> randTech({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.tech,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
