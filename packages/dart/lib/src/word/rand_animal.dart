import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Animals — the creatures a nickname is most often built around.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.animal] to `randWordDetails` — Dart has
/// no overloads, and twenty-four more functions for it would be twenty-four too many.
///
/// ```dart
/// randAnimal(language: WordLanguage.ko, count: 3); // [사자, 호랑이, 수달]
/// randAnimal(language: WordLanguage.en, count: 3); // [Lion, Otter, Falcon]
/// ```
List<String> randAnimal({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.animal,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
