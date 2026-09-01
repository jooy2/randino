import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/nickname/data/index.dart';
import 'package:randino/src/nickname/nickname_generator.dart';
import 'package:randino/src/types.dart';

/// Every nickname length the language can produce, in characters, which is what
/// `randomNickname` falls back to when `minLength` or `maxLength` is omitted.
///
/// The lower end is a bare noun and the upper end a modifier, a noun and a
/// trailing word together, so the range is wide on purpose — the shape of each
/// nickname is picked inside it. A `baseWord` longer than this range widens it,
/// and a [wordSeparator] widens it by what it adds between the words. A null
/// [language] spans every language at once.
///
/// ```dart
/// nicknameLengthRange(language: NicknameLanguage.ko); // LengthRange(1, 12)
/// nicknameLengthRange(language: NicknameLanguage.ko, includeModifier: false); // LengthRange(1, 8)
/// nicknameLengthRange(language: NicknameLanguage.en); // LengthRange(3, 30)
/// nicknameLengthRange(language: NicknameLanguage.ko, wordSeparator: '-'); // LengthRange(1, 14)
/// ```
LengthRange nicknameLengthRange({
  NicknameLanguage? language,
  bool includeModifier = true,
  String? wordSeparator,
}) {
  final languages = language == null ? nicknameLanguages : <NicknameLanguage>[language];
  var min = 1 << 30;
  var max = 0;

  for (final code in languages) {
    final range = naturalRange(code, includeModifier, wordSeparator);

    if (range.min < min) min = range.min;
    if (range.max > max) max = range.max;
  }

  return LengthRange(
    clampInt(min, nicknameLengthMin, nicknameLengthMax),
    clampInt(max, nicknameLengthMin, nicknameLengthMax),
  );
}
