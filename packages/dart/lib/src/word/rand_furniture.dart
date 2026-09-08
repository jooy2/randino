import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Furniture and the furnishings of a home.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.furniture] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randFurniture(language: WordLanguage.ko, count: 3); // [흔들의자, 요람, 책장]
/// randFurniture(language: WordLanguage.en, count: 3); // [Hammock, Cradle, Wardrobe]
/// ```
List<String> randFurniture({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  RandVocabulary vocabulary = RandVocabulary.full,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.furniture,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
