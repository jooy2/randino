import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/sentence/sentence_generator.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';

/// Every sentence length the language can produce, in characters, which is what
/// `randSentence` falls back to when `minLength` or `maxLength` is omitted.
///
/// The lower end is the shortest shape with the shortest words in it, and the
/// upper end the longest shape with a modifier on every phrase, so the range is
/// wide on purpose — the shape of each sentence is picked inside it. A null
/// [language] spans every language at once.
///
/// ```dart
/// sentenceLengthRange(WordLanguage.ko); // LengthRange(6, 41)
/// sentenceLengthRange(WordLanguage.en); // LengthRange(13, 92)
/// ```
LengthRange sentenceLengthRange([WordLanguage? language]) {
  final languages = language == null ? wordLanguages : <WordLanguage>[language];
  var min = 1 << 30;
  var max = 0;

  for (final code in languages) {
    final range = naturalRange(code);

    if (range.min < min) min = range.min;
    if (range.max > max) max = range.max;
  }

  return LengthRange(
    clampInt(min, randLengthMin, randSentenceLengthMax),
    clampInt(max, randLengthMin, randSentenceLengthMax),
  );
}
