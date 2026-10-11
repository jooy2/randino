<img src="docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![npm latest package](https://img.shields.io/npm/v/randino/latest.svg)](https://www.npmjs.com/package/randino) [![npm downloads](https://img.shields.io/npm/dm/randino.svg)](https://www.npmjs.com/package/randino) [![pub package](https://img.shields.io/pub/v/randino.svg)](https://pub.dev/packages/randino) [![pypi package](https://img.shields.io/pypi/v/randino.svg)](https://pypi.org/project/randino/) ![Commit Count](https://img.shields.io/github/commit-activity/y/jooy2/randino) ![Stars](https://img.shields.io/github/stars/jooy2/randino?style=social)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option, language and example, for **JavaScript**, **Dart** and **Python**.

---

**randino** generates random sample data in nine languages: person names, nicknames, words, sentences, real places, ages, genders, organizations, dates and phone numbers, and the operating system, hardware and files of a sample machine. Use it to seed a database, fill a mockup or suggest a nickname at sign-up.

- **Written the way each language writes it.** Names, nicknames and sentences follow the language's own script, word order and grammar: 김민준, Emma Clover, 여우가 사과를 먹는다.
- **Real only where it should be.** Places and system values are real, such as 서울특별시 종로구 and Apple iPhone 15 Pro. Organizations are invented from stems chosen to be nobody's brand, and nicknames are never built from person names.
- **One set of options.** `count`, `minLength`, `maxLength`, `startsWith`, `unique` and `realism` mean the same thing wherever they appear, and `output: 'detail'` shows what a result was built from.
- **Seeded or secure.** Every function takes a `random` source: a seeded one for a fixture that must repeat, a secure one for a token nobody may predict.
- **No runtime dependencies**, in any of the three packages.

## Packages

| Package                                      | Registry                                                 | Requires                          | Quick start                             |
| -------------------------------------------- | -------------------------------------------------------- | --------------------------------- | --------------------------------------- |
| [`packages/javascript`](packages/javascript) | [npm: `randino`](https://www.npmjs.com/package/randino)   | Node.js 22 or later, or a browser | [README](packages/javascript/README.md) |
| [`packages/dart`](packages/dart)             | [pub.dev: `randino`](https://pub.dev/packages/randino)    | Dart 3.7 or newer (Flutter 3.29)  | [README](packages/dart/README.md)       |
| [`packages/python`](packages/python)         | [PyPI: `randino`](https://pypi.org/project/randino/)      | Python 3.10 or newer              | [README](packages/python/README.md)     |

All three generate from the same datasets under the same rules, so `randName({ language: 'ko' })`, `randName(language: NameLanguage.ko)` and `rand_name(language="ko")` draw from the same pools. Each package versions independently and keeps its own `CHANGELOG.md`.

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

ESM with type declarations. More in the [**JavaScript quick start**](packages/javascript/README.md).

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

Pure Dart: it imports only `dart:math`, so it runs on the VM, on the web and in Flutter. Options are named parameters instead of an options object. More in the [**Dart quick start**](packages/dart/README.md).

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

Pure Python with a `py.typed` marker. Options are keyword-only arguments in `snake_case` and take the same string values as the JavaScript package. More in the [**Python quick start**](packages/python/README.md).

## Supported languages

A generator that writes text takes a `language`, and mixes every language it supports when you leave it out. The rest work differently: an age and a system value have no language, a date uses one only for month and weekday names, and a phone number takes a country.

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

Locations cover only countries that publish their divisions free of conditions, and the [checklist](https://randino.cdget.com/guide/languages#locations) says which do. `randCountry` is the exception and names every country in all nine languages.

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
| Phone numbers  | `randPhone`                  | `rand_phone`                 | 010-4821-####, (415) 726-#### |
| Operating systems | `randOs`                  | `rand_os`                    | Windows 11, macOS Sonoma 14.5 |
| Devices        | `randDevice`                 | `rand_device`                | Apple iPhone 15 Pro, Dell XPS 13 9310 |
| Processors     | `randCpu`                    | `rand_cpu`                   | Intel Core i7-13700K, Apple M3 Pro |
| Graphics       | `randGpu`                    | `rand_gpu`                   | NVIDIA GeForce RTX 4090, Qualcomm Adreno 740 |
| Architectures  | `randArchitecture`           | `rand_architecture`          | x86_64, arm64 |
| Memory         | `randRam`                    | `rand_ram`                   | 16 GB, 512 MB |
| Storage        | `randDiskType`, `randDiskSize` | `rand_disk_type`, `rand_disk_size` | SSD, 1 TB |
| Resolutions    | `randResolution`             | `rand_resolution`            | 1920x1080, 390x844 |
| Versions       | `randVersion`                | `rand_version`               | 2.14.3, 2024.3.1 |
| App stores     | `randAppStore`               | `rand_app_store`             | Google Play Store, Steam |
| File extensions | `randFileExtension`         | `rand_file_extension`        | .pdf, .png |
| MIME types     | `randMimeType`               | `rand_mime_type`             | application/pdf, image/png |
| Decorators     | `randSuffix`, `randPrefix`, `randModifier` | `rand_suffix`, `rand_prefix`, `rand_modifier` | MistyOwl_nVtRC, MistyOwl |

Each generator returns strings, or a detail object per result with `output: 'detail'`. Dart has no way to change a return type by argument, so it has a second function instead, such as `randNameDetails`. The phone numbers in the table have their last four digits written as `#`; the library returns every digit. The full option tables, the twenty-nine word themes and the romanization rules are on the [documentation site](https://randino.cdget.com).

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

## Disclaimer

randino draws its values at random, so some will match real things by chance: a person's name, a company, a phone number in service, a nickname already taken. Any such match is a coincidence, and no value refers to a real person or organization. The product names the system generators write belong to their owners, and randino is not affiliated with any of them.

Use the values as sample data for development, testing, research and teaching. Do not use them to impersonate anyone, to deceive people or services, or to contact the holder of a drawn phone number. Putting them in a commercial product, or anywhere people may take them as real, is at your own risk. The software and its output come without warranty, and the copyright holder, the authors, the contributors and the maintainers are not liable for any use of them. None of this changes the MIT License. The [full disclaimer](https://randino.cdget.com/guide/disclaimer) has the details.

## License

Please see the [LICENSE](LICENSE) file for more information about project owners, usage rights, and more.
