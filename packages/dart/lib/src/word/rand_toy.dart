import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Toys and games, the things and the play a childhood is made of.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.toy] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randToy(language: WordLanguage.ko, count: 3); // [팽이, 연, 딱지]
/// randToy(language: WordLanguage.en, count: 3); // [Kite, Yoyo, Domino]
/// ```
List<String> randToy({
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
  theme: WordTheme.toy,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
