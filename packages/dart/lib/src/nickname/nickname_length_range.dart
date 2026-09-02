import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/nickname/nickname_generator.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';

/// Every nickname length the language can produce, in characters, which is what
/// `randNickname` falls back to when `minLength` or `maxLength` is omitted.
///
/// The lower end is a bare noun and the upper end a modifier, a noun and a
/// trailing word together, so the range is wide on purpose — the shape of each
/// nickname is picked inside it. A [wordSeparator] widens it by what it adds
/// between the words, and a null [language] spans every language at once.
///
/// ```dart
/// nicknameLengthRange(language: WordLanguage.ko); // LengthRange(1, 12)
/// nicknameLengthRange(language: WordLanguage.en); // LengthRange(3, 30)
/// nicknameLengthRange(language: WordLanguage.ko, wordSeparator: '-'); // LengthRange(1, 14)
/// ```
LengthRange nicknameLengthRange({WordLanguage? language, String? wordSeparator}) {
  final languages = language == null ? wordLanguages : <WordLanguage>[language];
  var min = 1 << 30;
  var max = 0;

  for (final code in languages) {
    final range = naturalRange(code, wordSeparator);

    if (range.min < min) min = range.min;
    if (range.max > max) max = range.max;
  }

  return LengthRange(
    clampInt(min, randLengthMin, randLengthMax),
    clampInt(max, randLengthMin, randLengthMax),
  );
}
