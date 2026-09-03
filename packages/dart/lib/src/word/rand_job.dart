import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// The trades and roles people hold. Never a person name — which is why there is no `Baker` or `Hunter` here.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.job] to `randWordDetails` — Dart has
/// no overloads, and twenty-four more functions for it would be twenty-four too many.
///
/// ```dart
/// randJob(language: WordLanguage.ko, count: 3); // [기사, 마법사, 대장장이]
/// randJob(language: WordLanguage.en, count: 3); // [Wizard, Ranger, Blacksmith]
/// ```
List<String> randJob({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.job,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
