import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Nature and its phenomena — sky, weather, water, land.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.nature] to `randWordDetails` — Dart has
/// no overloads, and seventeen more functions for it would be seventeen too many.
///
/// ```dart
/// randNature(language: WordLanguage.ko, count: 3); // [하늘, 노을, 바람]
/// randNature(language: WordLanguage.en, count: 3); // [Sky, Sunset, Breeze]
/// ```
List<String> randNature({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.nature,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
