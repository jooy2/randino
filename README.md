<img src="docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![npm latest package](https://img.shields.io/npm/v/randino/latest.svg)](https://www.npmjs.com/package/randino) [![npm downloads](https://img.shields.io/npm/dm/randino.svg)](https://www.npmjs.com/package/randino) [![pub package](https://img.shields.io/pub/v/randino.svg)](https://pub.dev/packages/randino) [![pypi package](https://img.shields.io/pypi/v/randino.svg)](https://pypi.org/project/randino/) ![Commit Count](https://img.shields.io/github/commit-activity/y/jooy2/randino) ![Stars](https://img.shields.io/github/stars/jooy2/randino?style=social)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option, every language and every example, with **JavaScript**, **Dart** or **Python** picked in the sidebar. This README is the overview, and each package has a quick start of its own.

---

**randino** generates random text in the language you ask for: person names, nicknames, everyday words and whole sentences. One function per kind of text, one set of options, and a dataset per language.

- **Person names** read like names people carry: Emma Clover, Jack Reeves, each with its English pronunciation. 9 languages.
- **Nicknames** are handles for a game or a website: MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across twenty-five themes and never from person names, they run to over forty million combinations in Korean and in English before a random suffix is added.
- **Words** are those twenty-five themes on their own: `randWord`, and a function per theme, from `randAnimal` and `randFood` to `randGem`.
- **Sentences** are whole statements in the language's own grammar, from `randSentence`. A verb states what can do it and what it can be done to, so the words of one sentence belong together: 여우가 사과를 먹는다, The brave lion runs quietly.
- **Decorators** attach something to a string you already have rather than generating one: a random token with `randSuffix` and `randPrefix`, a word with `randModifier`.
- One options set per generator: language, length, count, and a `realism` setting that goes from real words to fully invented ones.
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

Pure Dart — it imports nothing but `dart:math`, so it runs on the VM, on the web and inside Flutter on every platform. Options are named parameters rather than an options object, which is the one deliberate difference from the JavaScript API. [**The Dart quick start**](packages/dart/README.md) has the rest.

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

Pure Python — it imports nothing outside the standard library, and ships a `py.typed` marker so mypy and Pyright read its annotations. Options are keyword-only arguments in `snake_case`; the values are the same strings the JavaScript package takes, typed as `Literal`. [**The Python quick start**](packages/python/README.md) has the rest.

## Supported languages

Every generator takes a language, or mixes every language it supports when you leave it out. All nine are covered everywhere: what used to keep a language out of the word pools was word order or agreement between a modifier and its noun, and both are the language's own data now.

| Code | Language   | Native     | Person names | Words and nicknames | Sentences |
| ---- | ---------- | ---------- | :----------: | :-----------------: | :-------: |
| `en` | English    | English    |      ✅      |         ✅          |    ✅     |
| `ko` | Korean     | 한국어     |      ✅      |         ✅          |    ✅     |
| `ja` | Japanese   | 日本語     |      ✅      |         ✅          |    ✅     |
| `zh` | Chinese    | 中文       |      ✅      |         ✅          |    ✅     |
| `it` | Italian    | Italiano   |      ✅      |         ✅          |    ✅     |
| `de` | German     | Deutsch    |      ✅      |         ✅          |    ✅     |
| `ru` | Russian    | Русский    |      ✅      |         ✅          |    ✅     |
| `es` | Spanish    | Español    |      ✅      |         ✅          |    ✅     |
| `vi` | Vietnamese | Tiếng Việt |      ✅      |         ✅          |    ✅     |

A sentence is the one place where a language can still be narrower than the others. Each declares the shapes its own grammar carries, so German writes no object and Russian no place — both would put the noun in a case its own ending has to change for.

## What it generates

| Generator      | JavaScript and Dart          | Python                       | Example             |
| -------------- | ---------------------------- | ---------------------------- | ------------------- |
| Person names   | `randName`                   | `rand_name`                  | Emma Clover, Jack Reeves |
| Nicknames      | `randNickname`               | `rand_nickname`              | MistyOwl, CraneVoyage |
| Words          | `randWord`, `randAnimal`, …  | `rand_word`, `rand_animal`, … | Lantern, Otter |
| Sentences      | `randSentence`               | `rand_sentence`              | The brave lion runs quietly. |
| Decorators     | `randSuffix`, `randPrefix`, `randModifier` | `rand_suffix`, `rand_prefix`, `rand_modifier` | MistyOwl_nVtRC, MistyOwl |

Each generator returns strings by default, or one detail object per result with <code>output: 'detail'</code> — both scripts of a name, or the words a nickname was built from. The Dart package spells that as a second function (`randNameDetails`), because Dart has no way to make one function's return type depend on an argument.

The full option tables, the twenty-five word themes and the romanization rules are on the [documentation site](https://randino.cdget.com).

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
