import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Money, and the words for what is done with it.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.finance] to `randWordDetails` — Dart has
/// no overloads, and seventeen more functions for it would be seventeen too many.
///
/// ```dart
/// randFinance(language: WordLanguage.ko, count: 3); // [이자, 환율, 장부]
/// randFinance(language: WordLanguage.en, count: 3); // [Ledger, Yield, Escrow]
/// ```
List<String> randFinance({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.finance,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
