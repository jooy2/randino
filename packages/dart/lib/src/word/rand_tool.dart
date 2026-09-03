import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// What a hand works with, from a chisel to a plough.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.tool] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randTool(language: WordLanguage.ko, count: 3); // [대패, 곡괭이, 집게]
/// randTool(language: WordLanguage.en, count: 3); // [Chisel, Mallet, Trowel]
/// ```
List<String> randTool({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.tool,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
