import 'package:randino/src/nickname/nickname_generator.dart';
import 'package:randino/src/types.dart';

/// Generate nicknames along with the pieces each one was built from.
///
/// Takes the same parameters as `randNickname`. Useful when you need the words
/// on their own — to highlight the base word, or to group by theme.
///
/// ```dart
/// randNicknameDetails(language: WordLanguage.ko);
/// // [NicknameDetail(멋진사자, [멋진, 사자], ko, animal)]
/// ```
List<NicknameDetail> randNicknameDetails({
  WordLanguage? language,
  WordTheme? theme,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? wordSeparator,
  String? startsWith,
  bool unique = false,
}) => generateNicknameDetails(
  language: language,
  theme: theme,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  wordSeparator: wordSeparator,
  startsWith: startsWith,
  unique: unique,
);
