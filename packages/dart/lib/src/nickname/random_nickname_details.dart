import 'package:randino/src/nickname/nickname_generator.dart';
import 'package:randino/src/types.dart';

/// Generate nicknames along with the pieces each one was built from.
///
/// Takes the same parameters as `randomNickname`. Useful when you need the words
/// on their own — to highlight the base word, to group by theme, or to store the
/// unique suffix separately from the nickname.
///
/// ```dart
/// randomNicknameDetails(language: NicknameLanguage.ko, uniqueSuffix: true);
/// // [NicknameDetail(멋진사자_gDe2C, [멋진, 사자], ko, animal)]
/// ```
List<NicknameDetail> randomNicknameDetails({
  NicknameLanguage? language,
  NicknameTheme? theme,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  bool includeModifier = true,
  String? wordSeparator,
  String? baseWord,
  bool uniqueSuffix = false,
  int uniqueSuffixLength = 5,
  String uniqueSuffixSeparator = '_',
  String? uniqueSuffixCharset,
  String? startsWith,
  bool unique = false,
}) => generateNicknameDetails(
  language: language,
  theme: theme,
  count: count,
  style: style,
  minLength: minLength,
  maxLength: maxLength,
  includeModifier: includeModifier,
  wordSeparator: wordSeparator,
  baseWord: baseWord,
  uniqueSuffix: uniqueSuffix,
  uniqueSuffixLength: uniqueSuffixLength,
  uniqueSuffixSeparator: uniqueSuffixSeparator,
  uniqueSuffixCharset: uniqueSuffixCharset,
  startsWith: startsWith,
  unique: unique,
);
