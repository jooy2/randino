import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Sounds and voices, and the words a language has for them.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.sound] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randSound(language: WordLanguage.ko, count: 3); // [속삭임, 함성, 바스락]
/// randSound(language: WordLanguage.en, count: 3); // [Whisper, Chime, Rustle]
/// ```
List<String> randSound({
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
  theme: WordTheme.sound,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
