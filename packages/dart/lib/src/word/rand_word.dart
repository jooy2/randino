import 'package:randino/src/types.dart';
import 'package:randino/src/word/word_generator.dart';

/// Generate everyday words — the vocabulary a nickname is built from, on its
/// own.
///
/// Animals, things, nature, ideas: twenty-five themes, in nine languages. Person
/// names are never used.
///
/// [theme] picks what the words are about; the twenty-five `rand…` functions
/// beside this one are the same generator with one theme already chosen. A null
/// [language] or [theme] means every one of them.
///
/// ```dart
/// randWord(language: WordLanguage.ko, theme: WordTheme.animal, count: 3);
/// // [여우, 고래, 수달]
/// randWord(language: WordLanguage.en, count: 2); // [Lantern, Meadow]
/// ```
List<String> randWord({
  WordLanguage? language,
  WordTheme? theme,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => [
  for (final detail in generateWordDetails(
    language: language,
    theme: theme,
    count: count,
    realism: realism,
    minLength: minLength,
    maxLength: maxLength,
    startsWith: startsWith,
    unique: unique,
  ))
    detail.word,
];
