import 'package:randino/src/nickname/nickname_generator.dart';
import 'package:randino/src/types.dart';

/// Generate nicknames along with the pieces each one was built from.
///
/// Takes the same parameters as `randNickname`. Useful when you need the words
/// on their own — to highlight the base word, or to group by theme.
///
/// ```dart
/// randNicknameDetails(language: NicknameLanguage.ko);
/// // [NicknameDetail(멋진사자, [멋진, 사자], ko, animal)]
/// ```
List<NicknameDetail> randNicknameDetails({
  NicknameLanguage? language,
  NicknameTheme? theme,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  bool includeModifier = true,
  String? wordSeparator,
  String? baseWord,
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
  startsWith: startsWith,
  unique: unique,
);
