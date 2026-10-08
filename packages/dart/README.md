<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for Dart

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![pub package](https://img.shields.io/pub/v/randino.svg)](https://pub.dev/packages/randino)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **Dart** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names, nicknames, words, sentences, real locations, ages, genders, organizations, dates and phone numbers in the language you ask for, and real operating systems, devices, processors, graphics, architectures, memory, storage and screen resolutions for a sample machine, and software version numbers.

- **Person names** read like names people carry: Emma Clover, Jack Reeves, each with its English pronunciation. 9 languages.
- **Nicknames** are handles for a game or a website: MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across twenty-nine themes, and never from person names.
- **Words** are those twenty-nine themes on their own: `randWord`, plus `randAnimal`, `randFood` and twenty-seven more.
- **Sentences** are whole statements in the language's own grammar, from `randSentence`. The verb decides what can stand beside it, so the words of one sentence belong together.
- **Locations** are real places down to a neighbourhood or a city, from `randLocation`: Korean and US divisions, as each country publishes them.
- **Ages** are whole numbers drawn along a curve shaped like a population, from `randAge`, so a sample of people is mostly adults.
- **Genders** are the labels a form in the language writes, from `randGender`: 여성, Female, Weiblich. An unstated gender and a third gender are there when you ask for them.
- **Organizations** are companies, schools, offices and associations that do not exist, from `randOrganization`: (주)새솔테크, Westbrook High School, Stadtwerke Bergtal.
- **Dates** are drawn evenly from a range and written out in UTC by a format of your own, from `randDate`, or one part at a time from `randDateUnit`.
- **Phone numbers** are written the way their country writes them, from `randPhone`, in nine countries. They open on blocks the country really gives out, so one can by chance be real: sample data, never a number to call.
- **System values** describe a sample machine with real products: an operating system from `randOs`, written the way its release is known, `Windows 11 Pro 23H2 (Build 22631)`, a phone, tablet or laptop from `randDevice`, `Apple iPhone 15 Pro`, its processor and graphics from `randCpu` and `randGpu`, `Intel Core i7-13700K`, `NVIDIA GeForce RTX 4090`, the architecture from `randArchitecture`, `x86_64`, its memory from `randRam`, `16 GB`, its storage from `randDiskType` and `randDiskSize`, `SSD`, `1 TB`, its screen from `randResolution`, `1920x1080`, and a version number from `randVersion`, `2.14.3`.
- **Decorators** attach something to a string you already have: `randSuffix`, `randPrefix` and `randModifier`.
- Every parameter is named and optional, and a **null enum means "every one of them"**, so `randName()` on its own works.
- **Pure Dart, no dependencies.** It imports nothing but `dart:math`, so it runs on the VM, on the web and inside Flutter on every platform.
- **Every generator and decorator takes a `random`.** `Random.secure()` for a value nobody may predict, `Random(42)` for one that has to come out the same every run.

This is the Dart package. The [npm package](https://www.npmjs.com/package/randino) and the [PyPI package](https://pypi.org/project/randino/) are the other two, and all three generate from the same datasets under the same rules. They version independently, so the numbers on pub.dev, npm and PyPI will not always agree.

## Install

```bash
dart pub add randino
```

Requires **Dart 3.7 or newer** (Flutter 3.29). There is nothing else to install.

## Person names

```dart
import 'package:randino/randino.dart';

randName();
// ['Emma Clover']

randName(language: NameLanguage.en, count: 3);
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

randName(language: NameLanguage.ko, script: NameScript.roman);
// ['Kim Minjun']

randName(
  language: NameLanguage.en,
  gender: NameGender.female,
  includeMiddleName: true,
);
// ['Grace Amelia Bennett']

randNameDetails(language: NameLanguage.ko).first;
// NameDetail(여미주, Yeo Miju, ko, female)
```

| Parameter                 | Type            | Default             |
| ------------------------- | --------------- | ------------------- |
| `language`                | `NameLanguage?` | `null` — every one  |
| `gender`                  | `NameGender?`   | `null` — one per name |
| `count`                   | `int`           | `1`                 |
| `realism`                 | `RandRealism`             | `RandRealism.real` |
| `minLength` / `maxLength` | `int?`          | _language_          |
| `includeSurname`          | `bool`          | `true`              |
| `includeMiddleName`       | `bool`          | `false`             |
| `script`                  | `NameScript`    | `NameScript.native` |
| `startsWith`              | `String?`       | `null`              |
| `unique`                  | `bool`          | `false`             |

`randNameDetails` takes the same parameters except `script`, and returns a `NameDetail` for each name, carrying `native`, `roman`, `language` and `gender`.

## Nicknames

```dart
randNickname(language: WordLanguage.en, count: 3);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

randNickname(language: WordLanguage.en, theme: WordTheme.animal, count: 2);
// ['FloatingFalcon', 'ChewyOtter']

randNickname(language: WordLanguage.en, slots: {WordSlot.action}, count: 2);
// ['CountingHarmonics', 'HaulingBurrito']

randNicknameDetails(language: WordLanguage.en).first;
// NicknameDetail(MistyOwl, [Misty, Owl], en, animal)
```

| Parameter                 | Type                | Default                |
| ------------------------- | ------------------- | ---------------------- |
| `language`                | `WordLanguage?` | `null` — every one     |
| `theme`                   | `WordTheme?`    | `null` — every one     |
| `slots`                   | `Set<WordSlot>?` | `null` — every shape  |
| `count`                   | `int`               | `1`                    |
| `realism`                 | `RandRealism`             | `RandRealism.real` |
| `vocabulary`              | `RandVocabulary`          | `RandVocabulary.full` |
| `minLength` / `maxLength` | `int?`              | _language_             |
| `wordSeparator`           | `String?`           | _language_             |
| `startsWith`              | `String?`           | `null`                 |
| `unique`                  | `bool`              | `false`                |

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`, `color`, `finance`, `tech`, `weather`, `space`, `time`, `emotion`, `body`, `clothing`, `tool`, `drink`, `toy`, `sound`, `person`, `furniture`.

## Words

The pools the nicknames are built from, on their own. Twenty-nine themes, nine languages, and a function per theme.

```dart
randWord(language: WordLanguage.en, theme: WordTheme.animal, count: 3);
// [Otter, Falcon, Lynx]

randAnimal(language: WordLanguage.en, count: 2); // [Turtle, Crane]
randFood(language: WordLanguage.en, count: 2); // [Dumpling, Cocoa]

randWordDetails(language: WordLanguage.en, theme: WordTheme.plant).first;
// WordDetail(Cedar, en, plant)

wordLengthRange(language: WordLanguage.en); // LengthRange(3, 11)
```

| Parameter                 | Type            | Default            |
| ------------------------- | --------------- | ------------------ |
| `language`                | `WordLanguage?` | `null` — every one |
| `theme`                   | `WordTheme?`    | `null` — every one |
| `count`                   | `int`           | `1`                |
| `realism`                 | `RandRealism`   | `RandRealism.real` |
| `vocabulary`              | `RandVocabulary`| `RandVocabulary.full` |
| `minLength` / `maxLength` | `int?`          | _pools_            |
| `startsWith`              | `String?`       | `null`             |
| `unique`                  | `bool`          | `false`            |

One function per theme: `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle`, `randProduct`, `randColor`, `randFinance`, `randTech`, `randWeather`, `randSpace`, `randTime`, `randEmotion`, `randBody`, `randClothing`, `randTool`, `randDrink`, `randToy`, `randSound`, `randPerson`, `randFurniture`. They return `List<String>`; for the detail form, pass the theme to `randWordDetails`.

## Sentences

Whole statements, written the way the language writes them. The nouns are the same pools the words and nicknames come from, and what a sentence adds is the grammar: a verb that states what can do it and what it can be done to, and the shapes each language allows.

```dart
randSentence(language: WordLanguage.en, count: 3);
// [The brave lion runs quietly., The otter swims in the cove., The sky is blue.]

randSentence(language: WordLanguage.ko, count: 2);
// [검은 고양이가 숲에서 잠잔다., 여우가 사과를 먹는다.]

randSentence(language: WordLanguage.en, shape: SentenceShape.simple);
// [The gondola passes.]
randSentence(language: WordLanguage.en, include: <String>['brave', 'lion']);
// [The brave lion yawns quietly.]

randSentenceDetails(language: WordLanguage.ko).first;
// SentenceDetail(검은 고양이가 숲에서 잠잔다., [검은 고양이, 숲, 잠잔다], ko, animal)

sentenceLengthRange(WordLanguage.en); // LengthRange(12, 92)
```

| Parameter                 | Type                  | Default            |
| ------------------------- | --------------------- | ------------------ |
| `language`                | `WordLanguage?`       | `null` — every one |
| `theme`                   | `WordTheme?`          | `null` — every one |
| `shape`                   | `SentenceShape?`      | `null` — every one |
| `slots`                   | `Set<SentenceSlot>?`  | `null` — every one |
| `include`                 | `List<String>`        | `const []`         |
| `type`                    | `Set<SentenceType>?`  | `null` — drawn     |
| `quote`                   | `SentenceQuote?`      | `null`             |
| `style`                   | `SentenceStyle?`      | `null` — drawn     |
| `sentences`               | `int`                 | `1`                |
| `includeName`             | `bool?`               | `null` — drawn     |
| `count`                   | `int`                 | `1`                |
| `realism`                 | `RandRealism`         | `RandRealism.real` |
| `vocabulary`              | `RandVocabulary`      | `RandVocabulary.common` |
| `minLength` / `maxLength` | `int?`                | _language_         |
| `startsWith`              | `String?`             | `null`             |
| `unique`                  | `bool`                | `false`            |

`slots` names the parts a shape may carry beside its subject: `object`, `place`, `time`, `manner`, `state`, `quantity`, `money`, `date`, `clock`, or an empty set for a subject and its predicate alone. A language declares its own shapes, so German has no `object` and Russian no `place`, because both would mark those with a case their nouns have to change for. Asking for one falls back to the closest shape the language does have.

`include` puts words you name into every sentence. A word the pools hold goes in the phrase it belongs to, and a word from anywhere else is used as a noun.

`type` is what the sentence does: a statement, a question, an exclamation, a line that trails off, or one somebody says or thinks. `style` is the speech level, which Korean writes four of. `sentences` puts up to ten of them in one string, about one subject. `includeName` puts a generated person's name where a person can stand. Left out, the three of them are drawn per result.

## Locations

Real places, written out from the country down the way the language writes one. Every division is one the country itself publishes, inside the one written beside it, and nothing goes below a Korean 읍·면·동 or a US city, so a result is never somebody's address. Korean and English only: a country is in when its list comes with no conditions a user of this package would inherit.

```dart
randLocation(language: LocationLanguage.ko, count: 2);
// [대한민국 경기도 양평군 단월면, 대한민국 충청북도 청주시 서원구 미평동]
randLocation(language: LocationLanguage.en, level: LocationLevel.city);
// [Gig Harbor, Washington, United States]

randRegion(language: LocationLanguage.en, count: 3); // [Idaho, Georgia, Vermont]
randCity(language: LocationLanguage.ko, count: 3); // [함안군, 영덕군, 여수시]
randDistrict(count: 3); // [가현동, 겸면, 행주외동]

randCityDetails(language: LocationLanguage.ko).first;
// LocationDetail(중랑구, ko, city, 대한민국, 서울특별시, 중랑구, null)
```

| Parameter                 | Type                | Default                  |
| ------------------------- | ------------------- | ------------------------ |
| `language`                | `LocationLanguage?` | `null` — every one       |
| `level`                   | `LocationLevel`     | `LocationLevel.district` |
| `includeCountry`          | `bool`              | `true`                   |
| `count`                   | `int`               | `1`                      |
| `minLength` / `maxLength` | `int?`              | `null`                   |
| `startsWith`              | `String?`           | `null`                   |
| `unique`                  | `bool`              | `false`                  |

`level` is how far down the location goes: `country`, `region`, `city` or `district`. A country without that level stops at the deepest one it has, so an English location ends at its city. `includeCountry: false` leaves the country out of the string, which is what a fixed `language` usually wants. `randRegion`, `randCity` and `randDistrict` take the same parameters minus `level`, and hand back that one division's name; each has a `…Details` twin, as `randLocation` has `randLocationDetails`. `randCountry` is the exception: it takes a `WordLanguage?` and names any of the 249 ISO 3166-1 countries and territories in any of the nine languages, and `randCountryDetails` adds each one's code as a `CountryDetail`.

## Ages

Ages for sample people, in whole years. The draw follows a curve shaped like a population rather than an even spread: it peaks from 25 to 35, sits lower for children and falls away past seventy, so a third of the ages are in their twenties and thirties and about 2% are past eighty.

```dart
randAge(count: 5); // [27, 8, 41, 63, 30]
randAge(minAge: 18, maxAge: 39, count: 3); // [22, 35, 31]
randAge(group: {AgeGroup.teen, AgeGroup.senior}, count: 3); // [15, 71, 66]
randAge(distribution: AgeDistribution.uniform, count: 3); // [91, 4, 57]

randAgeDetails().first; // AgeDetail(16, teen)
```

| Parameter           | Type              | Default                      |
| ------------------- | ----------------- | ---------------------------- |
| `minAge` / `maxAge` | `int?`            | `0` / `100`                  |
| `group`             | `Set<AgeGroup>?`  | `null` — every group         |
| `distribution`      | `AgeDistribution` | `AgeDistribution.population` |
| `count`             | `int`             | `1`                          |
| `unique`            | `bool`            | `false`                      |

`group` is `child` (0 to 12), `teen` (13 to 19), `adult` (20 to 64) or `senior` (65 and up), and narrows the range rather than replacing it. An age has no language, so `randAge` takes none.

## Genders

Genders for sample people, written the way a form in the language labels them. Male and female split evenly; `includeUnknown` adds a gender nobody stated, about one draw in eleven, and `includeNonbinary` a third gender, about one in a hundred.

```dart
randGender(language: WordLanguage.ko, count: 3); // [여성, 남성, 여성]
randGender(language: WordLanguage.en, includeUnknown: true, count: 3); // [Male, Unknown, Female]
randGender(language: WordLanguage.de, includeNonbinary: true); // [Divers]

randGenderDetails(language: WordLanguage.ko).first; // GenderDetail(여성, female, ko)
```

| Parameter          | Type            | Default            |
| ------------------ | --------------- | ------------------ |
| `language`         | `WordLanguage?` | `null` — every one |
| `includeUnknown`   | `bool`          | `false`            |
| `includeNonbinary` | `bool`          | `false`            |
| `count`            | `int`           | `1`                |
| `unique`           | `bool`          | `false`            |

A `GenderDetail`'s `code` is a `GenderCode` whatever the language, and its `male` and `female` are the two `NameGender` holds.

## Organizations

Companies, schools, government offices, public institutions and associations that do not exist, each written the way its language writes that kind of organization. A company may carry its legal form (`Inc.`, `(주)`, `GmbH`, `ООО`), and the stems are chosen to be nobody's brand.

```dart
randOrganization(language: WordLanguage.ko, count: 3); // [(주)가람에너지, 윤슬교육지원청, 새솔홀딩스]
randOrganization(language: WordLanguage.en, industry: OrganizationIndustry.logistics);
// [Greenbriar Logistics Corp.]
randOrganization(
  language: WordLanguage.de,
  type: {OrganizationType.school, OrganizationType.public},
  count: 2,
);
// [Gymnasium Eschenhain, Stadtbibliothek Tannenhof]

randOrganizationDetails(language: WordLanguage.ko, type: {OrganizationType.company}).first;
// OrganizationDetail((주)새솔테크, 새솔테크, (주), company, tech, ko)
```

| Parameter                 | Type                     | Default             |
| ------------------------- | ------------------------ | ------------------- |
| `language`                | `WordLanguage?`          | `null` — every one  |
| `type`                    | `Set<OrganizationType>?` | `null` — every kind |
| `industry`                | `OrganizationIndustry?`  | `null` — every one  |
| `includeLegalForm`        | `bool?`                  | `null` — drawn      |
| `count`                   | `int`                    | `1`                 |
| `realism`                 | `RandRealism`            | `RandRealism.real`  |
| `minLength` / `maxLength` | `int?`                   | `null`              |
| `startsWith`              | `String?`                | `null`              |
| `unique`                  | `bool`                   | `false`             |

A null `type` draws a kind per result, companies most often. An `industry` is written into a company's name as a word for its business, and naming one with `type` left null asks for companies. `RandRealism.invented` builds the stem from the language's own sounds, for a name nobody has.

## Dates

Dates drawn evenly from a range and written out in UTC. The range defaults to the years 1900 to 2099 and the format to ISO 8601. A `DateTime` bound is the instant it holds, local or UTC.

```dart
randDate(); // [1987-06-21T08:14:51.302Z]
randDate(
  minDate: DateTime.utc(2024),
  maxDate: DateTime.utc(2024, 12, 31, 23, 59, 59, 999),
  format: 'YYYY-MM-DD',
  count: 3,
);
// [2024-07-09, 2024-02-27, 2024-11-30]
randDate(format: 'YYYY년 M월 D일 HH:mm'); // [2031년 3월 4일 19:40]

randDateUnit(DateUnit.minute, count: 5); // [37, 4, 52, 19, 0]
randDateDetails().first.year; // 1987
```

| Parameter             | Type            | Default                      |
| --------------------- | --------------- | ---------------------------- |
| `minDate` / `maxDate` | `DateTime?`     | `null` — 1900 / 2099         |
| `format`              | `String`        | `'YYYY-MM-DDTHH:mm:ss.SSSZ'` |
| `language`            | `WordLanguage?` | `WordLanguage.en`            |
| `utcOffset`           | `Duration?`     | `null` — UTC                 |
| `count`               | `int`           | `1`                          |
| `unique`              | `bool`          | `false`                      |

`format` replaces `YYYY`, `YY`, `MMMM`, `MMM`, `MM`, `M`, `DD`, `D`, `dddd`, `ddd`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`, `SSS`, `A`, `a`, `Z` and `ZZ`, and writes text inside `[` `]` as it is. `MMMM`, `MMM`, `dddd`, `ddd`, `A` and `a` write words, in `language`: English unless another of the nine is named. `utcOffset` writes the dates at a fixed offset, `Duration(hours: 9)`, and `Z` writes it. `randDateUnit` takes a `DateUnit` in place of `format` and returns that part of each date as an `int`, read off a date drawn from the range, so a minute is `0` to `59` and a year keeps inside the range.

## Phone numbers

Phone numbers written the way their country writes them, for the United States, Korea, Japan, China, Vietnam, Spain, Italy, Germany and Russia. Each opens on a mobile block or a city's area code that the country really gives out, and the digits after it are random — so a number can by chance belong to somebody. Use them as sample data, and never call or text one.

```dart
randPhone(country: PhoneCountry.kr, count: 2); // [010-4821-3967, 010-7302-1958]
randPhone(country: PhoneCountry.us, type: PhoneType.landline); // [(212) 846-0147]
randPhone(country: PhoneCountry.kr, includeCountryCode: true); // [+82 10-4821-3967]
randPhone(country: PhoneCountry.kr, includeCountryCode: true, separator: ''); // [+821048213967]

randPhoneDetails(country: PhoneCountry.jp).first;
// PhoneDetail(090-3718-2046, +819037182046, JP, mobile)
```

| Parameter            | Type            | Default                    |
| -------------------- | --------------- | -------------------------- |
| `country`            | `PhoneCountry?` | `null` — every one         |
| `type`               | `PhoneType?`    | `PhoneType.mobile`         |
| `includeCountryCode` | `bool`          | `false`                    |
| `separator`          | `String?`       | `null` — the country's own |
| `fictional`          | `bool`          | `false`                    |
| `count`              | `int`           | `1`                        |
| `unique`             | `bool`          | `false`                    |

A null `type` draws a mobile number or a landline per result. `includeCountryCode` drops the trunk prefix the country dials at home, and `separator` replaces the country's own punctuation: `''` writes the digits alone, which with the country code is E.164. `fictional` keeps to the numbers a country sets aside for films and books, which nobody is given: `555-0100` to `555-0199` in the United States and the drama numbers in Germany; the other seven countries reserve none and return nothing.

## System

Values that describe a sample machine. They are real products rather than invented ones, written by the names they were released under, so none of them takes a `language`.

### Operating systems

Windows, macOS, Ubuntu, Debian and Fedora on the desktop, Android, iOS and iPadOS on mobile, every release from the first to the ones out by October 2026, written the way each release is known.

```dart
randOs(count: 3); // [Windows 10, macOS Sonoma 14, Android 9 Pie]
randOs(platform: SystemPlatform.mobile); // [iOS 17]
randOs(includeBuild: true, includeEdition: true); // [Windows 11 Pro 23H2 (Build 22631)]
randOs(platform: SystemPlatform.desktop, maxYear: 2010); // [Mac OS X Snow Leopard 10.6]

randOsDetails(includeBuild: true).first; // OsDetail(Android 14 (API 34), mobile, 2023)
```

| Parameter        | Type              | Default        |
| ---------------- | ----------------- | -------------- |
| `platform`       | `SystemPlatform?` | `null` — both  |
| `minYear`        | `int?`            | `null` — none  |
| `maxYear`        | `int?`            | `null` — none  |
| `includeVersion` | `bool`            | `true`         |
| `includeBuild`   | `bool`            | `false`        |
| `includeEdition` | `bool`            | `false`        |
| `count`          | `int`             | `1`            |
| `unique`         | `bool`            | `false`        |

A draw picks the line first — Windows is about two desktops in three, Android about three phones in five — and a release inside it second. `minYear` and `maxYear` read the year a release came out, or with `includeBuild` the year of the build written, and a range nothing came out in returns nothing.

### Devices

Real phones, tablets and laptops, by the names their makers gave them, from the first iPhone to the devices released by the end of 2025. A desktop PC is left out: it is built from parts and has no model name of its own.

```dart
randDevice(count: 2); // [Samsung Galaxy S24 Ultra, Apple iPad (10th generation)]
randDevice(type: {DeviceType.laptop}); // [Lenovo ThinkPad X1 Carbon Gen 11]
randDevice(type: {DeviceType.phone, DeviceType.tablet}, maxYear: 2012); // [Apple iPhone 4]
randDevice(type: {DeviceType.phone}, includeVendor: false); // [Pixel 8 Pro]

randDeviceDetails().first; // DeviceDetail(Google Pixel 8, phone, 2023)
```

| Parameter       | Type               | Default             |
| --------------- | ------------------ | ------------------- |
| `type`          | `Set<DeviceType>?` | `null` — every kind |
| `minYear`       | `int?`             | `null` — none       |
| `maxYear`       | `int?`             | `null` — none       |
| `includeVendor` | `bool`             | `true`              |
| `count`         | `int`              | `1`                 |
| `unique`        | `bool`             | `false`             |

A model is written the way its maker writes it, generation and all, and one whose name already opens on its maker's (`Xiaomi 14`) is never written with the maker twice.

### Processors

Real processors, by the names their makers gave them: Intel, AMD, Apple and Qualcomm parts for desktops and laptops, and the chips of phones and tablets from Apple, Qualcomm, Samsung, MediaTek, Google and HiSilicon, from the Pentium 4 to the parts out by the end of 2025.

```dart
randCpu(count: 2); // [Intel Core i7-13700K, Apple A17 Pro]
randCpu(platform: SystemPlatform.desktop, maxYear: 2012); // [AMD Phenom II X4 940]
randCpu(platform: SystemPlatform.mobile, includeVendor: false); // [Snapdragon 8 Gen 3]

randCpuDetails().first; // CpuDetail(Apple M3 Pro, desktop, 2023)
```

| Parameter       | Type              | Default       |
| --------------- | ----------------- | ------------- |
| `platform`      | `SystemPlatform?` | `null` — both |
| `minYear`       | `int?`            | `null` — none |
| `maxYear`       | `int?`            | `null` — none |
| `includeVendor` | `bool`            | `true`        |
| `count`         | `int`             | `1`           |
| `unique`        | `bool`            | `false`       |

### Graphics

Real graphics processors, by the names their makers gave them: NVIDIA, AMD and Intel cards, laptop GPUs and integrated graphics for desktops and laptops, and the GPUs of phones and tablets from Qualcomm, Arm and Samsung, from the GeForce 8800 GTX to the parts out by the end of 2025. A Radeon from before the end of 2010 is written as ATI sold it.

```dart
randGpu(count: 2); // [NVIDIA GeForce RTX 3060, Qualcomm Adreno 740]
randGpu(platform: SystemPlatform.desktop, maxYear: 2010); // [ATI Radeon HD 4870]

randGpuDetails().first; // GpuDetail(Intel Arc A770, desktop, 2022)
```

It takes `randCpu`'s parameters: `platform`, `minYear`, `maxYear` and `includeVendor`.

### Architectures

Processor architectures, by the names a download page most often lists them under: `x86_64` and `arm64` nearly every time, the 32-bit `x86` and `armv7` the rest. `includeRare` adds RISC-V, POWER, IBM Z, MIPS, LoongArch and SPARC, about one draw in twenty together.

```dart
randArchitecture(count: 3); // [x86_64, arm64, x86_64]
randArchitecture(includeRare: true, count: 3); // [arm64, riscv64, x86_64]

randArchitectureDetails().first; // ArchitectureDetail(x86_64, 64)
```

The detail's `aliases` are the names Debian, Windows, Node and the kernel use instead.

### Memory

Amounts of memory a machine is really sold with, from 512 MB to a terabyte, drawn by how common each one is: 8 and 16 GB are most of a sample. A size is only written in a unit it is a whole number of, so nothing carries a decimal point; a gigabyte is 1024 megabytes, the way an operating system counts.

```dart
randRam(count: 3); // [8 GB, 16 GB, 4 GB]
randRam(unit: RamUnit.mb); // [8192 MB]
randRam(minSize: 16, maxSize: 64); // [32 GB]
randRam(includeUnit: false); // [16]

randRamDetails().first; // RamDetail(16 GB, 17179869184)
```

| Parameter     | Type       | Default       |
| ------------- | ---------- | ------------- |
| `unit`        | `RamUnit?` | `null` — fits |
| `includeUnit` | `bool`     | `true`        |
| `minSize`     | `int?`     | `null` — none |
| `maxSize`     | `int?`     | `null` — none |
| `count`       | `int`      | `1`           |
| `unique`      | `bool`     | `false`       |

A null `unit` writes each size in the largest unit it is whole in; `RamUnit.gb` or `RamUnit.mb` keeps to the sizes whole in that unit. `minSize` and `maxSize` are in `unit`, or in gigabytes for a null one, and a range no real size is inside returns nothing.

### Storage

The kind of storage a machine has, by the platform it is drawn for: an SSD or a hard disk on a desktop or a laptop, UFS or eMMC on a phone or a tablet.

```dart
randDiskType(platform: SystemPlatform.desktop, count: 3); // [SSD, HDD, SSD]
randDiskType(platform: SystemPlatform.mobile); // [UFS]

randDiskTypeDetails().first; // DiskTypeDetail(SSD, desktop)
```

| Parameter  | Type              | Default       |
| ---------- | ----------------- | ------------- |
| `platform` | `SystemPlatform?` | `null` — both |
| `count`    | `int`             | `1`           |
| `unique`   | `bool`            | `false`       |

`randDiskSize` writes how much it holds, the way `randRam` writes memory: a size a drive is sold with, drawn by how common it is, in a unit it is whole in. A terabyte is 1000 gigabytes, the way the box counts.

```dart
randDiskSize(count: 3); // [1 TB, 256 GB, 2 TB]
randDiskSize(unit: DiskUnit.gb); // [1000 GB]
randDiskSize(unit: DiskUnit.tb, minSize: 8); // [12 TB]

randDiskSizeDetails().first; // DiskSizeDetail(1 TB, 1000000000000)
```

It takes `randRam`'s parameters, with `unit` a `DiskUnit?`.

### Resolutions

Screen resolutions, the way a browser reports them, with the common ones most often: 1920x1080 is about a quarter of the desktops, and a phone is written portrait, its width first. A scaled display is the size the system lays things out at, so a 1920x1080 laptop at 125% is `1536x864`.

```dart
randResolution(platform: SystemPlatform.desktop, count: 3); // [1920x1080, 2560x1440, 1366x768]
randResolution(platform: SystemPlatform.mobile); // [390x844]
randResolution(separator: '×'); // [1920×1080]

randResolutionDetails().first; // ResolutionDetail(1920x1080, desktop)
```

It takes `platform`, `separator`, `count`, `unique` and `random`.

### Versions

Software version numbers, in one of three formats: `semver` (`2.14.3`), `calver`, counted from a year (`2024.3.1`, `24.04`, `2024.03.15`), or `number`, a version that is one number (`42`). Every part is drawn with the small numbers most often, so `0.x` and `x.y.0` come up the way they do in a registry.

```dart
randVersion(count: 3); // [2.14.3, 0.4.0, 1.0.2]
randVersion(format: {VersionFormat.calver}, minYear: 2022); // [2024.3.1]
randVersion(format: null, prefix: 'v', count: 3); // [v1.4.0, v24.04, v42]
randVersion(includePrerelease: true, count: 2); // [3.0.0-rc.1, 0.12.2]

randVersionDetails().first; // VersionDetail(2.14.3, semver)
```

`format` is a `Set<VersionFormat>?`, and a null or empty one draws every format.

## Decorators

`randSuffix`, `randPrefix` and `randModifier` attach something to a string you already have, rather than generating one. They take anything, not just this library's output, which is why none of them is a parameter on a generator. Each of them also works with no value at all, handing back the thing it would have attached.

```dart
randSuffix(value: 'MistyOwl'); // 'MistyOwl_nVtRC'
randSuffixAll(randNickname(language: WordLanguage.en, count: 2));
// [RoundSeason_RVBnC, RowdyDusk_dwtu5]

randPrefix(value: 'order-4021', length: 4, separator: '-'); // 'k3Rm-order-4021'
randSuffix(value: 'MistyOwl', length: 8, charset: '0123456789'); // 'MistyOwl_40218836'
randSuffix(); // 'nVtRC' — the token on its own
```

| Parameter   | Type      | Default    |
| ----------- | --------- | ---------- |
| `length`    | `int`     | `5`        |
| `separator` | `String`  | `'_'`      |
| `charset`   | `String?` | _built-in_ |

A fresh token per value, never one for the batch. The default charset leaves out `0O1lI`, because these end up in names people read aloud and type back in. The `…All` forms are Dart's answer to a signature the other two packages write as `String | List<String>`, and `value` is named rather than positional because Dart cannot make a positional parameter optional alongside named ones.

`randModifier` attaches a word instead of a token, in front of any string:

```dart
randModifier(value: 'Owl'); // 'MistyOwl'
randModifier(value: 'Owl', separator: ' '); // 'Misty Owl'
randModifier(value: 'Owl', kind: ModifierKind.action); // 'CountingOwl'
randModifier(); // 'Misty'

randModifierAll(randAnimal(language: WordLanguage.en, count: 2));
// [TwinklingLynx, OnyxCrane]
```

| Parameter   | Type            | Default    |
| ----------- | --------------- | ---------- |
| `value`     | `String?`       | `null`     |
| `language`  | `WordLanguage?` | _script_   |
| `realism`   | `RandRealism`   | `RandRealism.real` |
| `kind`      | `ModifierKind?` | `null`     |
| `separator` | `String?`       | _language_ |

With no `language`, the script of the value picks one, so `'고양이'` is never handed an English modifier.

## Helpers and constants

```dart
nameLengthRange(language: NameLanguage.ko); // LengthRange(2, 3)
nameLengthRange(language: NameLanguage.en, includeMiddleName: true); // LengthRange(11, 32)
nameSupportsMiddleName(NameLanguage.ko); // false
nameSupportsRoman(NameLanguage.en); // false
nicknameLengthRange(language: WordLanguage.ko); // LengthRange(1, 13)
sentenceLengthRange(WordLanguage.ko); // LengthRange(5, 43)
```

`nameLanguages`, `wordLanguages`, `wordThemes`, `locationLanguages`, `locationLevels`, `ageGroups`, `organizationTypes`, `organizationIndustries`, `dateUnits`, `phoneCountries`, `phoneTypes`, `systemPlatforms`, `deviceTypes`, `ramUnits`, `diskTypes`, `diskUnits` and `architectures` list what the generators accept; `randCountMax`, `randLengthMin` / `Max`, `randSentenceLengthMax`, `randLocationLengthMax`, `randAgeMax`, `randOrganizationLengthMax`, `affixLengthDefault` / `Max`, `affixSeparatorDefault` and `affixCharset` are the bounds and defaults every parameter is clamped to.

## Differences from the npm package

The two generate the same output from the same data, and only the surface is Dart's rather than JavaScript's.

| npm                                | pub.dev                                        |
| ---------------------------------- | ---------------------------------------------- |
| One options object                 | Named parameters                               |
| `language: 'ko'`                   | `language: NameLanguage.ko`                    |
| `language: 'all'` (the default)    | `language` left out, or `null`                 |
| `[number, number]`                 | `LengthRange`, which compares by value         |
| `NameDetail` / `NicknameDetail` interfaces | The same two names, as classes         |
| `output: 'detail'`                 | `randNameDetails` / `randNicknameDetails` / `randWordDetails` / `randSentenceDetails` / `randLocationDetails` / `randOsDetails` / `randDeviceDetails` / `randCpuDetails` / `randGpuDetails` / `randArchitectureDetails` / `randRamDetails` / `randDiskTypeDetails` / `randDiskSizeDetails` / `randResolutionDetails` / `randVersionDetails` … |
| `randDate({ unit: 'minute' })`     | `randDateUnit(DateUnit.minute)`                |
| `randModifier('Owl')`             | `randModifier(value: 'Owl')` — every parameter is named |
| `randSuffix(['a', 'b'])`           | `randSuffixAll(['a', 'b'])`                    |
| `include: 'lion'` or `['lion']`    | `include: ['lion']` — a list either way        |

The last two are the same limitation twice: Dart has neither overloads nor union types, so one function cannot return `List<String>` for one argument and `List<NameDetail>` for another. Where npm and PyPI pick the shape with an option, pub.dev picks it with a second function.

## Development

```bash
dart pub get
dart test
dart analyze
dart format .
```

## License

MIT © [CDGet](https://cdget.com)
