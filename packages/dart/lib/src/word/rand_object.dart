import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Everyday things: what is on a desk, in a bag, around a house.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.object] to `randWordDetails` — Dart has
/// no overloads, and twenty-four more functions for it would be twenty-four too many.
///
/// ```dart
/// randObject(language: WordLanguage.ko, count: 3); // [물병, 연필, 우산]
/// randObject(language: WordLanguage.en, count: 3); // [Bottle, Pencil, Umbrella]
/// ```
List<String> randObject({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.object,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
