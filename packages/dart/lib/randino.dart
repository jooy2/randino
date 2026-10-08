/// randino generates random person names, nicknames, words, sentences,
/// locations, ages, genders and organizations in the language you ask for.
///
/// The generators are kept apart on purpose. **Person names** read like names
/// people actually carry (김민준, Emma Clover) and come with their English
/// pronunciation. **Nicknames** are the handles someone would pick for a game or
/// a website (멋진사자, MistyOwl); they are built from everyday words and never
/// from person names. **Words** are those everyday words on their own,
/// **sentences** are whole statements written in the language's own grammar, and
/// **locations** are real places, from the country down to a Korean 읍·면·동 or a
/// US city. **Ages** are whole numbers drawn along a curve shaped like a
/// population, **genders** are the labels a form in the language writes, and
/// **organizations** are companies, schools and offices that do not exist.
///
/// ```dart
/// import 'package:randino/randino.dart';
///
/// randName(language: NameLanguage.ko, count: 3); // ['김태윤', '원동혁', '조진우']
/// randNickname(language: WordLanguage.en); // ['MistyOwl']
/// randSentence(language: WordLanguage.en); // ['The brave lion runs quietly.']
/// ```
///
/// Every parameter is optional and named, and a null enum means "every one of
/// them" — `randName()` with nothing passed returns one name in one of the
/// nine supported languages.
library;

export 'src/age/data/index.dart' show ageGroups;
export 'src/age/rand_age.dart' show randAge;
export 'src/age/rand_age_details.dart' show randAgeDetails;
export 'src/appstore/rand_app_store.dart' show randAppStore;
export 'src/appstore/rand_app_store_details.dart' show randAppStoreDetails;
export 'src/architecture/data/index.dart' show architectures;
export 'src/architecture/rand_architecture.dart' show randArchitecture;
export 'src/architecture/rand_architecture_details.dart' show randArchitectureDetails;
export 'src/constants.dart'
    show
        randAgeMax,
        randCountMax,
        randLengthMax,
        randLengthMin,
        randLocationLengthMax,
        randOrganizationLengthMax,
        randSentenceCountMax,
        randSentenceLengthMax,
        systemPlatforms;
export 'src/cpu/rand_cpu.dart' show randCpu;
export 'src/cpu/rand_cpu_details.dart' show randCpuDetails;
export 'src/date/data/index.dart' show dateUnits;
export 'src/date/rand_date.dart' show randDate;
export 'src/date/rand_date_details.dart' show randDateDetails;
export 'src/date/rand_date_unit.dart' show randDateUnit;
export 'src/decorate/data/index.dart'
    show affixCharset, affixLengthDefault, affixLengthMax, affixSeparatorDefault;
export 'src/decorate/rand_modifier.dart' show randModifier;
export 'src/decorate/rand_modifier_all.dart' show randModifierAll;
export 'src/decorate/rand_prefix.dart' show randPrefix;
export 'src/decorate/rand_prefix_all.dart' show randPrefixAll;
export 'src/decorate/rand_suffix.dart' show randSuffix;
export 'src/decorate/rand_suffix_all.dart' show randSuffixAll;
export 'src/device/data/index.dart' show deviceTypes;
export 'src/device/rand_device.dart' show randDevice;
export 'src/device/rand_device_details.dart' show randDeviceDetails;
export 'src/disk/data/index.dart' show diskTypes, diskUnits;
export 'src/disk/rand_disk_size.dart' show randDiskSize;
export 'src/disk/rand_disk_size_details.dart' show randDiskSizeDetails;
export 'src/disk/rand_disk_type.dart' show randDiskType;
export 'src/disk/rand_disk_type_details.dart' show randDiskTypeDetails;
export 'src/file/data/index.dart' show fileCategories, mimeTopLevels;
export 'src/file/rand_file_extension.dart' show randFileExtension;
export 'src/file/rand_file_extension_details.dart' show randFileExtensionDetails;
export 'src/file/rand_mime_type.dart' show randMimeType;
export 'src/file/rand_mime_type_details.dart' show randMimeTypeDetails;
export 'src/gender/rand_gender.dart' show randGender;
export 'src/gender/rand_gender_details.dart' show randGenderDetails;
export 'src/gpu/rand_gpu.dart' show randGpu;
export 'src/gpu/rand_gpu_details.dart' show randGpuDetails;
export 'src/location/data/index.dart' show locationLanguages, locationLevels;
export 'src/location/rand_city.dart' show randCity;
export 'src/location/rand_city_details.dart' show randCityDetails;
export 'src/location/rand_country.dart' show randCountry;
export 'src/location/rand_country_details.dart' show randCountryDetails;
export 'src/location/rand_district.dart' show randDistrict;
export 'src/location/rand_district_details.dart' show randDistrictDetails;
export 'src/location/rand_location.dart' show randLocation;
export 'src/location/rand_location_details.dart' show randLocationDetails;
export 'src/location/rand_region.dart' show randRegion;
export 'src/location/rand_region_details.dart' show randRegionDetails;
export 'src/name/data/index.dart' show nameLanguages;
export 'src/name/name_length_range.dart' show nameLengthRange;
export 'src/name/name_supports_middle_name.dart' show nameSupportsMiddleName;
export 'src/name/name_supports_roman.dart' show nameSupportsRoman;
export 'src/name/rand_name.dart' show randName;
export 'src/name/rand_name_details.dart' show randNameDetails;
export 'src/nickname/nickname_length_range.dart' show nicknameLengthRange;
export 'src/nickname/rand_nickname.dart' show randNickname;
export 'src/nickname/rand_nickname_details.dart' show randNicknameDetails;
export 'src/organization/data/index.dart' show organizationIndustries, organizationTypes;
export 'src/organization/rand_organization.dart' show randOrganization;
export 'src/organization/rand_organization_details.dart' show randOrganizationDetails;
export 'src/os/rand_os.dart' show randOs;
export 'src/os/rand_os_details.dart' show randOsDetails;
export 'src/phone/data/index.dart' show phoneCountries, phoneTypes;
export 'src/phone/rand_phone.dart' show randPhone;
export 'src/phone/rand_phone_details.dart' show randPhoneDetails;
export 'src/ram/data/index.dart' show ramUnits;
export 'src/ram/rand_ram.dart' show randRam;
export 'src/ram/rand_ram_details.dart' show randRamDetails;
export 'src/resolution/rand_resolution.dart' show randResolution;
export 'src/resolution/rand_resolution_details.dart' show randResolutionDetails;
export 'src/sentence/rand_sentence.dart' show randSentence;
export 'src/sentence/rand_sentence_details.dart' show randSentenceDetails;
export 'src/sentence/sentence_length_range.dart' show sentenceLengthRange;
export 'src/types.dart'
    show
        AgeDetail,
        AgeDistribution,
        AgeGroup,
        AppStoreDetail,
        ArchitectureDetail,
        CountryDetail,
        CpuDetail,
        DateDetail,
        DateUnit,
        DeviceDetail,
        DeviceType,
        DiskSizeDetail,
        DiskType,
        DiskTypeDetail,
        DiskUnit,
        FileCategory,
        FileExtensionDetail,
        GenderCode,
        GenderDetail,
        GpuDetail,
        LengthRange,
        LocationDetail,
        LocationLanguage,
        LocationLevel,
        MimeTopLevel,
        MimeTypeDetail,
        ModifierKind,
        NameDetail,
        NameGender,
        NameLanguage,
        NameScript,
        NicknameDetail,
        OrganizationDetail,
        OrganizationIndustry,
        OrganizationType,
        OsDetail,
        PhoneCountry,
        PhoneDetail,
        PhoneType,
        RamDetail,
        RamUnit,
        RandRealism,
        RandVocabulary,
        ResolutionDetail,
        SentenceDetail,
        SentenceShape,
        SentenceQuote,
        SentenceType,
        SentenceSlot,
        SentenceStory,
        SentenceStyle,
        SentenceTense,
        SystemPlatform,
        VersionDetail,
        VersionFormat,
        WordDetail,
        WordLanguage,
        WordSlot,
        WordTheme;
export 'src/version/data/index.dart' show versionFormats;
export 'src/version/rand_version.dart' show randVersion;
export 'src/version/rand_version_details.dart' show randVersionDetails;
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
export 'src/word/rand_furniture.dart' show randFurniture;
export 'src/word/rand_gem.dart' show randGem;
export 'src/word/rand_job.dart' show randJob;
export 'src/word/rand_music.dart' show randMusic;
export 'src/word/rand_myth.dart' show randMyth;
export 'src/word/rand_nature.dart' show randNature;
export 'src/word/rand_object.dart' show randObject;
export 'src/word/rand_person.dart' show randPerson;
export 'src/word/rand_place.dart' show randPlace;
export 'src/word/rand_plant.dart' show randPlant;
export 'src/word/rand_product.dart' show randProduct;
export 'src/word/rand_sound.dart' show randSound;
export 'src/word/rand_space.dart' show randSpace;
export 'src/word/rand_sport.dart' show randSport;
export 'src/word/rand_tech.dart' show randTech;
export 'src/word/rand_time.dart' show randTime;
export 'src/word/rand_tool.dart' show randTool;
export 'src/word/rand_toy.dart' show randToy;
export 'src/word/rand_vehicle.dart' show randVehicle;
export 'src/word/rand_weather.dart' show randWeather;
export 'src/word/rand_word.dart' show randWord;
export 'src/word/rand_word_details.dart' show randWordDetails;
export 'src/word/word_length_range.dart' show wordLengthRange;
