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
/// randName(language: NameLanguage.ko, count: 3); // ['김태윤', '원동혁', '조진우']
/// randNickname(language: NicknameLanguage.en); // ['MistyOwl']
/// ```
///
/// Every parameter is optional and named, and a null enum means "every one of
/// them" — `randName()` with nothing passed returns one name in one of the
/// nine supported languages.
library;

export 'src/affix/data/index.dart'
    show affixCharset, affixLengthDefault, affixLengthMax, affixSeparatorDefault;
export 'src/affix/rand_prefix.dart' show randPrefix;
export 'src/affix/rand_prefix_all.dart' show randPrefixAll;
export 'src/affix/rand_suffix.dart' show randSuffix;
export 'src/affix/rand_suffix_all.dart' show randSuffixAll;
export 'src/constants.dart' show randCountMax, randLengthMax, randLengthMin;
export 'src/name/data/index.dart' show nameLanguages;
export 'src/name/name_length_range.dart' show nameLengthRange;
export 'src/name/name_supports_middle_name.dart' show nameSupportsMiddleName;
export 'src/name/name_supports_roman.dart' show nameSupportsRoman;
export 'src/name/rand_name.dart' show randName;
export 'src/name/rand_name_details.dart' show randNameDetails;
export 'src/nickname/data/index.dart' show nicknameLanguages, nicknameThemes;
export 'src/nickname/nickname_length_range.dart' show nicknameLengthRange;
export 'src/nickname/rand_nickname.dart' show randNickname;
export 'src/nickname/rand_nickname_details.dart' show randNicknameDetails;
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
