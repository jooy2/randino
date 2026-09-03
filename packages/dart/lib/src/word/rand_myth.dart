import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Creatures and figures out of myth and folklore.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.myth] to `randWordDetails` — Dart has
/// no overloads, and twenty-four more functions for it would be twenty-four too many.
///
/// ```dart
/// randMyth(language: WordLanguage.ko, count: 3); // [용, 봉황, 구미호]
/// randMyth(language: WordLanguage.en, count: 3); // [Dragon, Phoenix, Griffin]
/// ```
List<String> randMyth({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.myth,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
