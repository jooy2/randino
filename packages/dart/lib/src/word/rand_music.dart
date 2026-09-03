import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Music: instruments, forms and the words around them.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.music] to `randWordDetails` — Dart has
/// no overloads, and fourteen more functions for it would be fourteen too many.
///
/// ```dart
/// randMusic(language: WordLanguage.ko, count: 3); // [피아노, 거문고, 교향곡]
/// randMusic(language: WordLanguage.en, count: 3); // [Piano, Fiddle, Symphony]
/// ```
List<String> randMusic({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.music,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
