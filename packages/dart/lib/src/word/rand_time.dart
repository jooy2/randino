import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// When something happens, from a moment to a season.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.time] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randTime(language: WordLanguage.ko, count: 3); // [새벽, 한여름, 찰나]
/// randTime(language: WordLanguage.en, count: 3); // [Twilight, Solstice, Eternity]
/// ```
List<String> randTime({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.time,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
