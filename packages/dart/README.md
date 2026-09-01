<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for Dart

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![pub package](https://img.shields.io/pub/v/randino.svg)](https://pub.dev/packages/randino)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **Dart** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — 김민준, Emma Clover, Иванов Иван — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — 멋진사자, MistyOwl, 고양이꼬리. Built from everyday words across fourteen themes, never from person names.
- Every parameter is named and optional, and a **null enum means "every one of them"** — `randomName()` on its own works.
- **Pure Dart, no dependencies.** It imports nothing but `dart:math`, so it runs on the VM, on the web and inside Flutter on every platform.

This is the Dart half. The [npm package](https://www.npmjs.com/package/randino) is the other one, and the two generate from the same datasets under the same rules. They version independently, so this package's number and the npm one's will not always agree.

## Install

```bash
dart pub add randino
```

Requires **Dart 3.7 or newer** (Flutter 3.29). There is nothing else to install.

## Person names

```dart
import 'package:randino/randino.dart';

randomName();
// ['Emma Clover']

randomName(language: NameLanguage.ko, count: 3);
// ['김태윤', '원동혁', '조진우']

randomName(language: NameLanguage.ko, script: NameScript.roman);
// ['Kim Minjun']

randomName(
  language: NameLanguage.en,
  gender: NameGender.female,
  includeMiddleName: true,
);
// ['Grace Amelia Bennett']

randomNameDetails(language: NameLanguage.ko).first;
// NameDetail(여미주, Yeo Miju, ko, female)
```

| Parameter                 | Type            | Default             |
| ------------------------- | --------------- | ------------------- |
| `language`                | `NameLanguage?` | `null` — every one  |
| `gender`                  | `NameGender?`   | `null` — one per name |
| `count`                   | `int`           | `1`                 |
| `style`                   | `int` (0 real … 100 invented) | `0`   |
| `minLength` / `maxLength` | `int?`          | _language_          |
| `includeSurname`          | `bool`          | `true`              |
| `includeMiddleName`       | `bool`          | `false`             |
| `script`                  | `NameScript`    | `NameScript.native` |
| `startsWith`              | `String?`       | `null`              |
| `unique`                  | `bool`          | `false`             |

`randomNameDetails` takes the same parameters except `script`, and returns a `NameDetail` — `native`, `roman`, `language` and `gender` — for each name.

## Nicknames

```dart
randomNickname(language: NicknameLanguage.ko, count: 3);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randomNickname(language: NicknameLanguage.en, count: 2);
// ['FoggyHillside', 'CraneVoyage']

randomNickname(language: NicknameLanguage.ko, theme: NicknameTheme.animal, count: 2);
// ['깊은연어', '하얀여우갈기']

randomNickname(language: NicknameLanguage.ko, uniqueSuffix: true, count: 2);
// ['달력_U7aNZ', '조용한바구니_RUKAP']

randomNickname(baseWord: '고양이', count: 3);
// ['하얀고양이', '고양이바람', '귀여운고양이뿔']

randomNicknameDetails(language: NicknameLanguage.ko, uniqueSuffix: true).first;
// NicknameDetail(오래된발견_zVShs, [오래된, 발견], ko, concept)
```

| Parameter                 | Type                | Default                |
| ------------------------- | ------------------- | ---------------------- |
| `language`                | `NicknameLanguage?` | `null` — every one     |
| `theme`                   | `NicknameTheme?`    | `null` — every one     |
| `count`                   | `int`               | `1`                    |
| `style`                   | `int` (0 real … 100 invented) | `0`          |
| `minLength` / `maxLength` | `int?`              | _language_             |
| `includeModifier`         | `bool`              | `true`                 |
| `wordSeparator`           | `String?`           | _language_             |
| `baseWord`                | `String?`           | `null`                 |
| `uniqueSuffix`            | `bool`              | `false`                |
| `uniqueSuffixLength`      | `int`               | `5`                    |
| `uniqueSuffixSeparator`   | `String`            | `'_'`                  |
| `uniqueSuffixCharset`     | `String?`           | _built-in_             |
| `startsWith`              | `String?`           | `null`                 |
| `unique`                  | `bool`              | `false`                |

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`.

## Helpers and constants

```dart
nameLengthRange(language: NameLanguage.ko); // LengthRange(3, 3)
nameLengthRange(language: NameLanguage.en, includeMiddleName: true); // LengthRange(12, 24)
nameSupportsMiddleName(NameLanguage.ko); // false
nameSupportsRoman(NameLanguage.en); // false
nicknameLengthRange(language: NicknameLanguage.ko); // LengthRange(1, 12)
```

`nameLanguages`, `nicknameLanguages` and `nicknameThemes` list what the generators accept; `nameCountMax`, `nameLengthMin` / `Max`, `nicknameCountMax`, `nicknameLengthMin` / `Max`, `nicknameSuffixLengthMax` and `nicknameSuffixCharset` are the bounds every parameter is clamped to.

## Differences from the npm package

The two generate the same output from the same data, and only the surface is Dart's rather than JavaScript's.

| npm                                | pub.dev                                        |
| ---------------------------------- | ---------------------------------------------- |
| One options object                 | Named parameters                               |
| `language: 'ko'`                   | `language: NameLanguage.ko`                    |
| `language: 'all'` (the default)    | `language` left out, or `null`                 |
| `[number, number]`                 | `LengthRange`, which compares by value         |
| `NameDetail` / `NicknameDetail` interfaces | The same two names, as classes         |

## Development

```bash
dart pub get
dart test
dart analyze
dart format .
```

## License

MIT © [CDGet](https://cdget.com)
