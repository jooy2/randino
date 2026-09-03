import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// What is beyond the sky, from the moon to a galaxy.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.space] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randSpace(language: WordLanguage.ko, count: 3); // [은하, 혜성, 북극성]
/// randSpace(language: WordLanguage.en, count: 3); // [Galaxy, Comet, Nebula]
/// ```
List<String> randSpace({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.space,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
