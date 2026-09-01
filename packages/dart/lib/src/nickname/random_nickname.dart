import 'package:randino/src/nickname/nickname_generator.dart';
import 'package:randino/src/types.dart';

/// Generate nicknames — the kind of handle someone would pick for a game or a
/// website.
///
/// Each one is an everyday word (an animal, a thing, something in nature, an
/// idea) with a modifier in front of it or a second word behind it. Person names
/// are never used.
///
/// Every parameter is optional. A null [language] mixes every supported
/// language and a null [theme] draws from every theme; [minLength] and
/// [maxLength] fall back to what the language can produce, which
/// `nicknameLengthRange` reports.
///
/// ```dart
/// randomNickname(language: NicknameLanguage.ko, count: 3);
/// // ['멋진사자', '파란물병', '고양이꼬리']
/// randomNickname(language: NicknameLanguage.en);
/// // ['MistyOwl']
/// randomNickname(language: NicknameLanguage.ko, uniqueSuffix: true, count: 2);
/// // ['달리는표범_gDe2C', '조용한노을_nVtRC']
/// randomNickname(language: NicknameLanguage.ko, wordSeparator: ' ', count: 2);
/// // ['멋진 사자', '고양이 꼬리']
/// randomNickname(baseWord: '고양이', count: 3);
/// // ['멋진고양이', '고양이발바닥', '파란고양이꼬리']
/// ```
List<String> randomNickname({
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
}) =>
    generateNicknameDetails(
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
    ).map((detail) => detail.nickname).toList();
