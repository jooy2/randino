import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/word_generator.dart';

/// Shortest and longest word the language's pools hold, in characters.
///
/// This is what `randWord` falls back to when `minLength` or `maxLength` is
/// omitted. Narrowing the [theme] narrows the range, because a theme is a pool
/// of its own. A null [language] or [theme] spans every one of them.
///
/// ```dart
/// wordLengthRange(language: WordLanguage.ko); // LengthRange(1, 4)
/// wordLengthRange(language: WordLanguage.ko, theme: WordTheme.food); // LengthRange(1, 4)
/// wordLengthRange(language: WordLanguage.en); // LengthRange(3, 11)
/// ```
LengthRange wordLengthRange({WordLanguage? language, WordTheme? theme}) {
  final languages = language == null ? wordLanguages : <WordLanguage>[language];
  var min = 1 << 30;
  var max = 0;

  for (final code in languages) {
    final range = naturalRange(code, theme);

    if (range.min < min) min = range.min;
    if (range.max > max) max = range.max;
  }

  return LengthRange(
    clampInt(min, randLengthMin, randLengthMax),
    clampInt(max, randLengthMin, randLengthMax),
  );
}
