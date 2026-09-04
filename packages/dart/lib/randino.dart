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
/// randNickname(language: WordLanguage.en); // ['MistyOwl']
/// ```
///
/// Every parameter is optional and named, and a null enum means "every one of
/// them" — `randName()` with nothing passed returns one name in one of the
/// nine supported languages.
library;

export 'src/constants.dart' show randCountMax, randLengthMax, randLengthMin;
export 'src/decorate/data/index.dart'
    show affixCharset, affixLengthDefault, affixLengthMax, affixSeparatorDefault;
export 'src/decorate/rand_modifier.dart' show randModifier;
export 'src/decorate/rand_modifier_all.dart' show randModifierAll;
export 'src/decorate/rand_prefix.dart' show randPrefix;
export 'src/decorate/rand_prefix_all.dart' show randPrefixAll;
export 'src/decorate/rand_suffix.dart' show randSuffix;
export 'src/decorate/rand_suffix_all.dart' show randSuffixAll;
export 'src/name/data/index.dart' show nameLanguages;
export 'src/name/name_length_range.dart' show nameLengthRange;
export 'src/name/name_supports_middle_name.dart' show nameSupportsMiddleName;
export 'src/name/name_supports_roman.dart' show nameSupportsRoman;
export 'src/name/rand_name.dart' show randName;
export 'src/name/rand_name_details.dart' show randNameDetails;
export 'src/nickname/nickname_length_range.dart' show nicknameLengthRange;
export 'src/nickname/rand_nickname.dart' show randNickname;
export 'src/nickname/rand_nickname_details.dart' show randNicknameDetails;
export 'src/types.dart'
    show
        LengthRange,
        ModifierKind,
        NameDetail,
        NameGender,
        NameLanguage,
        NameScript,
        NicknameDetail,
        RandRealism,
        WordDetail,
        WordLanguage,
        WordSlot,
        WordTheme;
export 'src/word/data/index.dart' show wordLanguages, wordThemes;
export 'src/word/rand_animal.dart' show randAnimal;
export 'src/word/rand_body.dart' show randBody;
export 'src/word/rand_clothing.dart' show randClothing;
export 'src/word/rand_color.dart' show randColor;
export 'src/word/rand_concept.dart' show randConcept;
export 'src/word/rand_drink.dart' show randDrink;
export 'src/word/rand_emotion.dart' show randEmotion;
export 'src/word/rand_finance.dart' show randFinance;
export 'src/word/rand_food.dart' show randFood;
export 'src/word/rand_gem.dart' show randGem;
export 'src/word/rand_job.dart' show randJob;
export 'src/word/rand_music.dart' show randMusic;
export 'src/word/rand_myth.dart' show randMyth;
export 'src/word/rand_nature.dart' show randNature;
export 'src/word/rand_object.dart' show randObject;
export 'src/word/rand_place.dart' show randPlace;
export 'src/word/rand_plant.dart' show randPlant;
export 'src/word/rand_product.dart' show randProduct;
export 'src/word/rand_space.dart' show randSpace;
export 'src/word/rand_sport.dart' show randSport;
export 'src/word/rand_tech.dart' show randTech;
export 'src/word/rand_time.dart' show randTime;
export 'src/word/rand_tool.dart' show randTool;
export 'src/word/rand_vehicle.dart' show randVehicle;
export 'src/word/rand_weather.dart' show randWeather;
export 'src/word/rand_word.dart' show randWord;
export 'src/word/rand_word_details.dart' show randWordDetails;
export 'src/word/word_length_range.dart' show wordLengthRange;
