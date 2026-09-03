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
/// randNickname(language: WordLanguage.ko, count: 3);
/// // ['멋진사자', '파란물병', '고양이꼬리']
/// randNickname(language: WordLanguage.en);
/// // ['MistyOwl']
/// randSuffixAll(randNickname(language: WordLanguage.ko, count: 2));
/// // ['달리는표범_gDe2C', '조용한노을_nVtRC']
/// randNickname(language: WordLanguage.ko, wordSeparator: ' ', count: 2);
/// // ['멋진 사자', '고양이 꼬리']
/// ```
List<String> randNickname({
  WordLanguage? language,
  WordTheme? theme,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? wordSeparator,
  String? startsWith,
  bool unique = false,
}) =>
    generateNicknameDetails(
      language: language,
      theme: theme,
      count: count,
      realism: realism,
      minLength: minLength,
      maxLength: maxLength,
      wordSeparator: wordSeparator,
      startsWith: startsWith,
      unique: unique,
    ).map((detail) => detail.nickname).toList();
