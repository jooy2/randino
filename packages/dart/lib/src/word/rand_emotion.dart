import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// What someone feels, from joy to a quiet regret.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.emotion] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randEmotion(language: WordLanguage.ko, count: 3); // [그리움, 설렘, 안도]
/// randEmotion(language: WordLanguage.en, count: 3); // [Longing, Delight, Relief]
/// ```
List<String> randEmotion({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.emotion,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
