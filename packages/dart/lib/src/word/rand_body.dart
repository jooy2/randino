import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// The parts of a body, inside and out.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.body] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randBody(language: WordLanguage.ko, count: 3); // [손목, 어깨, 심장]
/// randBody(language: WordLanguage.en, count: 3); // [Wrist, Shoulder, Heart]
/// ```
List<String> randBody({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.body,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
