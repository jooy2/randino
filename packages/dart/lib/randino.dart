/// randino generates random person names and nicknames in the language you ask
/// for.
///
/// Two generators, kept apart on purpose. **Person names** read like names
/// people actually carry (김민준, Emma Clover) and come with their English
/// pronunciation. **Nicknames** are the handles someone would pick for a game or
/// a website (멋진사자, MistyOwl); they are built from everyday words and never
/// from person names.
///
/// ```dart
/// import 'package:randino/randino.dart';
///
/// randomName(language: NameLanguage.ko, count: 3); // ['김태윤', '원동혁', '조진우']
/// randomNickname(language: NicknameLanguage.en); // ['MistyOwl']
/// ```
///
/// Every parameter is optional and named, and a null enum means "every one of
/// them" — `randomName()` with nothing passed returns one name in one of the
/// nine supported languages.
library;

export 'src/name/data/index.dart' show nameCountMax, nameLanguages, nameLengthMax, nameLengthMin;
export 'src/name/name_length_range.dart' show nameLengthRange;
export 'src/name/name_supports_middle_name.dart' show nameSupportsMiddleName;
export 'src/name/name_supports_roman.dart' show nameSupportsRoman;
export 'src/name/random_name.dart' show randomName;
export 'src/name/random_name_details.dart' show randomNameDetails;
export 'src/nickname/data/index.dart'
    show
        nicknameCountMax,
        nicknameLanguages,
        nicknameLengthMax,
        nicknameLengthMin,
        nicknameSuffixCharset,
        nicknameSuffixLengthMax,
        nicknameThemes;
export 'src/nickname/nickname_length_range.dart' show nicknameLengthRange;
export 'src/nickname/random_nickname.dart' show randomNickname;
export 'src/nickname/random_nickname_details.dart' show randomNicknameDetails;
export 'src/types.dart'
    show
        LengthRange,
        NameDetail,
        NameGender,
        NameLanguage,
        NameScript,
        NicknameDetail,
        NicknameLanguage,
        NicknameTheme;
