<img src="docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![npm latest package](https://img.shields.io/npm/v/randino/latest.svg)](https://www.npmjs.com/package/randino) [![npm downloads](https://img.shields.io/npm/dm/randino.svg)](https://www.npmjs.com/package/randino) [![pub package](https://img.shields.io/pub/v/randino.svg)](https://pub.dev/packages/randino) [![pypi package](https://img.shields.io/pypi/v/randino.svg)](https://pypi.org/project/randino/) ![Commit Count](https://img.shields.io/github/commit-activity/y/jooy2/randino) ![Stars](https://img.shields.io/github/stars/jooy2/randino?style=social)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option, every language and every example, with **JavaScript**, **Dart** or **Python** picked in the sidebar. This README is the overview, and each package has a quick start of its own.

---

**randino** generates random text in the language you ask for: person names, nicknames, everyday words, whole sentences and real locations, the ages, genders, dates and phone numbers to go with them, organizations that do not exist, and the real operating system, device, processor, memory and storage of a sample machine. One function per kind of value, one set of options, and a dataset per language.

- **Person names** read like names people carry: Emma Clover, Jack Reeves, each with its English pronunciation. 9 languages.
- **Nicknames** are handles for a game or a website: MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across twenty-nine themes and never from person names, they run to over forty million combinations in Korean and in English before a random suffix is added.
- **Words** are those twenty-nine themes on their own: `randWord`, and a function per theme, from `randAnimal` and `randFood` to `randGem`.
- **Sentences** are whole statements in the language's own grammar, from `randSentence`. A verb states what can do it and what it can be done to, so the words of one sentence belong together: 여우가 사과를 먹는다, The brave lion runs quietly.
- **Locations** are real places written out from the country down, from `randLocation`: 대한민국 경기도 수원시 장안구 파장동, Pasadena, California, United States. Every division is one the country publishes, nothing goes below a neighbourhood or a city, and only countries that publish that list free of conditions are in — Korea and the United States so far. `randCountry` names every country, all 249 of ISO 3166-1, in all nine languages.
- **Ages** are whole numbers from `randAge`, drawn along a curve shaped like a population rather than evenly, so a sample of people is mostly adults and thins out past seventy.
- **Genders** are the labels a form in the language writes, from `randGender`: 여성, Female, Weiblich. Male and female split evenly, and an unstated gender and a third gender are there when you ask for them.
- **Organizations** are companies, schools, offices and associations that do not exist, from `randOrganization`: (주)새솔테크, Westbrook High School, Stadtwerke Bergtal. A company may carry its legal form, and the stems are chosen to be nobody's brand.
- **Dates** are drawn evenly from a range and written out in UTC by a format of your own, from `randDate`: 2024-03-15T14:07:32.481Z, 2024년 3월 15일 금요일, 15 марта 2024. Month and weekday names come in all nine languages. `unit` hands back one part on its own, from the year down to the millisecond.
- **Phone numbers** are written the way their country writes them, from `randPhone`: 010-4821-3967, (415) 726-0193, 8 (912) 345-67-89, in nine countries, with the country code and E.164 a parameter away. A number opens on a block the country really gives out, so it can by chance be somebody's: it is sample data, never a number to call or text. `fictional` keeps to the numbers the United States and Germany set aside for films and books, which nobody is given.
- **System values** describe a sample machine with real products rather than invented ones. `randOs` writes an operating system the way its release is known — Windows 11 Pro 23H2 (Build 22631), macOS Sonoma 14.5, Android 14 (API 34) — from Windows 95 to the releases of October 2026, and `randDevice` a real phone, tablet or laptop by its maker's name — Apple iPhone 15 Pro, Samsung Galaxy Tab S9, Lenovo ThinkPad X1 Carbon Gen 11. `randCpu` writes a real processor, Intel Core i7-13700K, Apple M3 Pro, Qualcomm Snapdragon 8 Gen 3, and `minYear` and `maxYear` keep each of the three to what was out in a given year. `randRam` writes the memory a machine is sold with, 8 GB, 16 GB, 512 MB, mostly the common sizes and never with a decimal point, `randDiskType` the kind of storage it has, SSD, HDD, UFS, and `randDiskSize` how much it holds, 512 GB, 1 TB.
- **Decorators** attach something to a string you already have rather than generating one: a random token with `randSuffix` and `randPrefix`, a word with `randModifier`.
- One options set per generator: language, length, count, a `realism` setting that goes from real words to fully invented ones, and a `vocabulary` setting that keeps to the everyday words.
- **Every generator and decorator takes a `random`** — where the draws come from. A secure source for a value nobody may predict, a seeded one for a fixture that has to come out the same every run.
- **No runtime dependencies**, in any of the packages.

## Packages

| Package                                      | Registry                                                 | Requires                          | Quick start                             |
| -------------------------------------------- | -------------------------------------------------------- | --------------------------------- | --------------------------------------- |
| [`packages/javascript`](packages/javascript) | [npm: `randino`](https://www.npmjs.com/package/randino)   | Node.js 22 or later, or a browser | [README](packages/javascript/README.md) |
| [`packages/dart`](packages/dart)             | [pub.dev: `randino`](https://pub.dev/packages/randino)    | Dart 3.7 or newer (Flutter 3.29)  | [README](packages/dart/README.md)       |
| [`packages/python`](packages/python)         | [PyPI: `randino`](https://pypi.org/project/randino/)      | Python 3.10 or newer              | [README](packages/python/README.md)     |

All three generate from **the same datasets and the same rules**, so `randName({ language: 'ko' })`, `randName(language: NameLanguage.ko)` and `rand_name(language="ko")` draw from the same pools and honour the same options. They **version independently** and keep separate changelogs ([`packages/javascript/CHANGELOG.md`](packages/javascript/CHANGELOG.md), [`packages/dart/CHANGELOG.md`](packages/dart/CHANGELOG.md) and [`packages/python/CHANGELOG.md`](packages/python/CHANGELOG.md)), so a release on one side is not a release on the others and the numbers will not always agree.

## Install

### JavaScript / TypeScript

```bash
npm install randino
```

```javascript
import { randName, randNickname, randSuffix } from 'randino';

randName({ language: 'en', count: 3 });
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

randName({ language: 'en', gender: 'female', includeMiddleName: true });
// ['Grace Amelia Bennett']

randNickname({ language: 'en', count: 3 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

randSuffix(randNickname({ language: 'en', count: 2 }));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5']
```

ESM, typed, and no runtime dependencies. [**The JavaScript quick start**](packages/javascript/README.md) has the rest.

### Dart / Flutter

```bash
dart pub add randino
```

```dart
import 'package:randino/randino.dart';

randName(language: NameLanguage.en, count: 3);
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

randName(language: NameLanguage.en, gender: NameGender.female, includeMiddleName: true);
// ['Grace Amelia Bennett']

randNickname(language: WordLanguage.en, count: 3);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

randSuffixAll(randNickname(language: WordLanguage.en, count: 2));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5']
```

Pure Dart. It imports nothing but `dart:math`, so it runs on the VM, on the web and inside Flutter on every platform. Options are named parameters rather than an options object, which is the one deliberate difference from the JavaScript API. [**The Dart quick start**](packages/dart/README.md) has the rest.

### Python

```bash
pip install randino
```

```python
from randino import rand_name, rand_nickname, rand_suffix

rand_name(language="en", count=3)
# ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

rand_name(language="en", gender="female", include_middle_name=True)
# ['Grace Amelia Bennett']

rand_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

rand_suffix(rand_nickname(language="en", count=2))
# ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5']
```

Pure Python. It imports nothing outside the standard library and ships a `py.typed` marker, so mypy and Pyright read its annotations. Options are keyword-only arguments in `snake_case`; the values are the same strings the JavaScript package takes, typed as `Literal`. [**The Python quick start**](packages/python/README.md) has the rest.

## Supported languages

Every generator but `randAge`, `randDate`, `randPhone` and the system generators takes a language, or mixes every language it supports when you leave it out; an age has none, a date's language only writes its month and weekday names and is English unless you name another, a phone number takes the country each language is spoken in first, and an operating system, a device or a processor is written by the name it was released under, and a size has no language. All nine are covered by every generator but one, including the word pools: where a modifier goes and how it agrees with its noun are part of each language's own data.

| Code | Language   | Native     | Person names | Words and nicknames | Sentences | Organizations | Locations |
| ---- | ---------- | ---------- | :----------: | :-----------------: | :-------: | :-----------: | :-------: |
| `en` | English    | English    |      ✅      |         ✅          |    ✅     |      ✅       |    ✅     |
| `ko` | Korean     | 한국어     |      ✅      |         ✅          |    ✅     |      ✅       |    ✅     |
| `ja` | Japanese   | 日本語     |      ✅      |         ✅          |    ✅     |      ✅       |     —     |
| `zh` | Chinese    | 中文       |      ✅      |         ✅          |    ✅     |      ✅       |     —     |
| `it` | Italian    | Italiano   |      ✅      |         ✅          |    ✅     |      ✅       |     —     |
| `de` | German     | Deutsch    |      ✅      |         ✅          |    ✅     |      ✅       |     —     |
| `ru` | Russian    | Русский    |      ✅      |         ✅          |    ✅     |      ✅       |     —     |
| `es` | Spanish    | Español    |      ✅      |         ✅          |    ✅     |      ✅       |     —     |
| `vi` | Vietnamese | Tiếng Việt |      ✅      |         ✅          |    ✅     |      ✅       |     —     |

A sentence is the one place where a language can be narrower than the others. Each declares the shapes its own grammar carries, so German writes no object and Russian no place, because both would put the noun in a case its own ending has to change for.

Locations are the generator that is not in all nine. A language has them only when its country publishes its divisions with no attribution to carry, no uncertain terms and no disputed territory, and the [checklist](https://randino.cdget.com/guide/languages#locations) says which do. Country names are the exception: `randCountry` has every country in every language.

## What it generates

| Generator      | JavaScript and Dart          | Python                       | Example             |
| -------------- | ---------------------------- | ---------------------------- | ------------------- |
| Person names   | `randName`                   | `rand_name`                  | Emma Clover, Jack Reeves |
| Nicknames      | `randNickname`               | `rand_nickname`              | MistyOwl, CraneVoyage |
| Words          | `randWord`, `randAnimal`, …  | `rand_word`, `rand_animal`, … | Lantern, Otter |
| Sentences      | `randSentence`               | `rand_sentence`              | The brave lion runs quietly. |
| Locations      | `randLocation`, `randCity`, … | `rand_location`, `rand_city`, … | 대한민국 서울특별시 종로구 청운동 |
| Ages           | `randAge`                    | `rand_age`                   | 34, 8, 71 |
| Genders        | `randGender`                 | `rand_gender`                | 여성, Female, Weiblich |
| Organizations  | `randOrganization`           | `rand_organization`          | (주)새솔테크, Westbrook High School |
| Dates          | `randDate`                   | `rand_date`                  | 2024-03-15T14:07:32.481Z, 37 |
| Phone numbers  | `randPhone`                  | `rand_phone`                 | 010-4821-3967, (415) 726-0193 |
| Operating systems | `randOs`                  | `rand_os`                    | Windows 11, macOS Sonoma 14.5 |
| Devices        | `randDevice`                 | `rand_device`                | Apple iPhone 15 Pro, Dell XPS 13 9310 |
| Processors     | `randCpu`                    | `rand_cpu`                   | Intel Core i7-13700K, Apple M3 Pro |
| Memory         | `randRam`                    | `rand_ram`                   | 16 GB, 512 MB |
| Storage        | `randDiskType`, `randDiskSize` | `rand_disk_type`, `rand_disk_size` | SSD, 1 TB |
| Decorators     | `randSuffix`, `randPrefix`, `randModifier` | `rand_suffix`, `rand_prefix`, `rand_modifier` | MistyOwl_nVtRC, MistyOwl |

Each generator returns strings by default, or one detail object per result with <code>output: 'detail'</code>: both scripts of a name, or the words a nickname was built from. The Dart package spells that as a second function (`randNameDetails`), because Dart has no way to make one function's return type depend on an argument.

The full option tables, the twenty-nine word themes and the romanization rules are on the [documentation site](https://randino.cdget.com).

## Repository layout

```
packages/
  javascript/   The npm package — TypeScript source in lib/, tests in test/
  dart/         The pub.dev package — Dart source in lib/, tests in test/
  python/       The PyPI package — Python source in src/, tests in tests/
docs/           The documentation site (VitePress), English and Korean
tools/          Repository tooling: the parity check, the dataset emitter, the location writer
```

Each package owns its own `README.md` and `CHANGELOG.md`, because npm, pub.dev and PyPI all read those from the package root. This file is the only one that describes all of them at once.

## Contributing

Anyone can contribute to the project by reporting new issues or submitting a pull request. For more information, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Please see the [LICENSE](LICENSE) file for more information about project owners, usage rights, and more.
