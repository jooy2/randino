import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Something to drink, hot, cold or fermented.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.drink] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randDrink(language: WordLanguage.ko, count: 3); // [식혜, 보리차, 막걸리]
/// randDrink(language: WordLanguage.en, count: 3); // [Cider, Cordial, Lemonade]
/// ```
List<String> randDrink({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.drink,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
