<img src="docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![npm latest package](https://img.shields.io/npm/v/randino/latest.svg)](https://www.npmjs.com/package/randino) [![npm downloads](https://img.shields.io/npm/dm/randino.svg)](https://www.npmjs.com/package/randino) [![pub package](https://img.shields.io/pub/v/randino.svg)](https://pub.dev/packages/randino) [![pypi package](https://img.shields.io/pypi/v/randino.svg)](https://pypi.org/project/randino/) ![Commit Count](https://img.shields.io/github/commit-activity/y/jooy2/randino) ![Stars](https://img.shields.io/github/stars/jooy2/randino?style=social)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option, every language and every example — pick **JavaScript**, **Dart** or **Python** in the sidebar. This README is the map; each package has a quick start of its own.

---

**randino** generates random text in the language you ask for. Today that is person names and nicknames; the shape it is built in — one function per kind of text, one set of options, per-language datasets — is meant to hold whatever comes next.

- **Person names** read like names people actually carry — 김민준, Emma Clover, Иванов Иван — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — 멋진사자, MistyOwl, 고양이꼬리. Built from everyday words across fourteen themes, never from person names, with over nine million combinations in Korean and English before the unique suffix is added.
- One options set per generator: language, length, count, and a style setting that runs from realistic to fully invented.
- **No runtime dependencies**, in any of the packages.

## Packages

| Package                                      | Registry                                                 | Requires                          | Quick start                             |
| -------------------------------------------- | -------------------------------------------------------- | --------------------------------- | --------------------------------------- |
| [`packages/javascript`](packages/javascript) | [npm: `randino`](https://www.npmjs.com/package/randino)   | Node.js 18 or later, or a browser | [README](packages/javascript/README.md) |
| [`packages/dart`](packages/dart)             | [pub.dev: `randino`](https://pub.dev/packages/randino)    | Dart 3.7 or newer (Flutter 3.29)  | [README](packages/dart/README.md)       |
| [`packages/python`](packages/python)         | [PyPI: `randino`](https://pypi.org/project/randino/)      | Python 3.10 or newer              | [README](packages/python/README.md)     |

All three generate from **the same datasets and the same rules**, so `randName({ language: 'ko' })`, `randName(language: NameLanguage.ko)` and `rand_name(language="ko")` draw from the same pools and honour the same options. They **version independently** and keep separate changelogs — [`packages/javascript/CHANGELOG.md`](packages/javascript/CHANGELOG.md), [`packages/dart/CHANGELOG.md`](packages/dart/CHANGELOG.md) and [`packages/python/CHANGELOG.md`](packages/python/CHANGELOG.md) — so a release on one side is not a release on the others and the numbers will not always agree.

## Install

### JavaScript / TypeScript

```bash
npm install randino
```

```javascript
import { randName, randNickname } from 'randino';

randName({ language: 'ko', count: 3 });
// ['김태윤', '원동혁', '조진우']

randName({ language: 'en', gender: 'female', includeMiddleName: true });
// ['Grace Amelia Bennett']

randNickname({ language: 'ko', count: 3 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randNickname({ baseWord: '고양이', count: 3 });
// ['하얀고양이', '고양이바람', '귀여운고양이뿔']
```

ESM, typed, and no runtime dependencies. [**The JavaScript quick start**](packages/javascript/README.md) has the rest.

### Dart / Flutter

```bash
dart pub add randino
```

```dart
import 'package:randino/randino.dart';

randName(language: NameLanguage.ko, count: 3);
// ['김태윤', '원동혁', '조진우']

randName(language: NameLanguage.en, gender: NameGender.female, includeMiddleName: true);
// ['Grace Amelia Bennett']

randNickname(language: NicknameLanguage.ko, count: 3);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randNickname(baseWord: '고양이', count: 3);
// ['하얀고양이', '고양이바람', '귀여운고양이뿔']
```

Pure Dart — it imports nothing but `dart:math`, so it runs on the VM, on the web and inside Flutter on every platform. Options are named parameters rather than an options object, which is the one deliberate difference from the JavaScript API. [**The Dart quick start**](packages/dart/README.md) has the rest.

### Python

```bash
pip install randino
```

```python
from randino import rand_name, rand_nickname

rand_name(language="ko", count=3)
# ['김태윤', '원동혁', '조진우']

rand_name(language="en", gender="female", include_middle_name=True)
# ['Grace Amelia Bennett']

rand_nickname(language="ko", count=3)
# ['오래된곰', '영원한도마뱀', '귀여운신화다발']

rand_nickname(base_word="고양이", count=3)
# ['하얀고양이', '고양이바람', '귀여운고양이뿔']
```

Pure Python — it imports nothing outside the standard library, and ships a `py.typed` marker so mypy and Pyright read its annotations. Options are keyword-only arguments in `snake_case`; the values are the same strings the JavaScript package takes, typed as `Literal`. [**The Python quick start**](packages/python/README.md) has the rest.

## Supported languages

Every generator takes a language, or mixes every language it supports when you leave it out. The two generators do not cover the same set: a nickname joins a modifier to a noun, which only reads naturally where the language asks for no agreement between them.

| Code | Language   | Native     | Person names | Nicknames |
| ---- | ---------- | ---------- | :----------: | :-------: |
| `en` | English    | English    |      ✅      |    ✅     |
| `ko` | Korean     | 한국어     |      ✅      |    ✅     |
| `ja` | Japanese   | 日本語     |      ✅      |    ✅     |
| `zh` | Chinese    | 中文       |      ✅      |    ✅     |
| `it` | Italian    | Italiano   |      ✅      |    ❌     |
| `de` | German     | Deutsch    |      ✅      |    ❌     |
| `ru` | Russian    | Русский    |      ✅      |    ❌     |
| `es` | Spanish    | Español    |      ✅      |    ❌     |
| `vi` | Vietnamese | Tiếng Việt |      ✅      |    ❌     |

## What it generates

| Generator    | JavaScript and Dart                       | Python                                         | Example             |
| ------------ | ----------------------------------------- | ---------------------------------------------- | ------------------- |
| Person names | `randName`, `randNameDetails`         | `rand_name`, `rand_name_details`           | 김민준 → Kim Minjun |
| Nicknames    | `randNickname`, `randNicknameDetails` | `rand_nickname`, `rand_nickname_details`   | 멋진사자, MistyOwl  |

The full option tables, the fourteen nickname themes and the romanization rules are on the [documentation site](https://randino.cdget.com).

## Repository layout

```
packages/
  javascript/   The npm package — TypeScript source in lib/, tests in test/
  dart/         The pub.dev package — Dart source in lib/, tests in test/
  python/       The PyPI package — Python source in src/, tests in tests/
docs/           The documentation site (VitePress), English and Korean
```

Each package owns its own `README.md` and `CHANGELOG.md`, because npm, pub.dev and PyPI all read those from the package root. This file is the only one that describes all of them at once.

## Contributing

Anyone can contribute to the project by reporting new issues or submitting a pull request. For more information, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Please see the [LICENSE](LICENSE) file for more information about project owners, usage rights, and more.
