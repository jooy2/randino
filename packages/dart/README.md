<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for Dart

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![pub package](https://img.shields.io/pub/v/randino.svg)](https://pub.dev/packages/randino)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **Dart** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — 김민준, Emma Clover, Иванов Иван — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — 멋진사자, MistyOwl, 고양이꼬리. Built from everyday words across fourteen themes, never from person names.
- **Words** are those fourteen themes on their own — `randWord`, plus `randAnimal`, `randFood` and twelve more.
- **Decorators** attach something to a string you already have: `randSuffix`, `randPrefix` and `randModifier`.
- Every parameter is named and optional, and a **null enum means "every one of them"** — `randName()` on its own works.
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

randName();
// ['Emma Clover']

randName(language: NameLanguage.ko, count: 3);
// ['김태윤', '원동혁', '조진우']

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
| `style`                   | `int` (0 real … 100 invented) | `0`   |
| `minLength` / `maxLength` | `int?`          | _language_          |
| `includeSurname`          | `bool`          | `true`              |
| `includeMiddleName`       | `bool`          | `false`             |
| `script`                  | `NameScript`    | `NameScript.native` |
| `startsWith`              | `String?`       | `null`              |
| `unique`                  | `bool`          | `false`             |

`randNameDetails` takes the same parameters except `script`, and returns a `NameDetail` — `native`, `roman`, `language` and `gender` — for each name.

## Nicknames

```dart
randNickname(language: WordLanguage.ko, count: 3);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randNickname(language: WordLanguage.en, count: 2);
// ['FoggyHillside', 'CraneVoyage']

randNickname(language: WordLanguage.ko, theme: WordTheme.animal, count: 2);
// ['깊은연어', '하얀여우갈기']

randNicknameDetails(language: WordLanguage.ko).first;
// NicknameDetail(오래된발견, [오래된, 발견], ko, concept)
```

| Parameter                 | Type                | Default                |
| ------------------------- | ------------------- | ---------------------- |
| `language`                | `WordLanguage?` | `null` — every one     |
| `theme`                   | `WordTheme?`    | `null` — every one     |
| `count`                   | `int`               | `1`                    |
| `style`                   | `int` (0 real … 100 invented) | `0`          |
| `minLength` / `maxLength` | `int?`              | _language_             |
| `wordSeparator`           | `String?`           | _language_             |
| `startsWith`              | `String?`           | `null`                 |
| `unique`                  | `bool`              | `false`                |

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`.

## Words

The pools the nicknames are built from, on their own. Fourteen themes, four languages, and a function per theme.

```dart
randWord(language: WordLanguage.ko, theme: WordTheme.animal, count: 3);
// [여우, 고래, 수달]

randAnimal(language: WordLanguage.en, count: 2); // [Otter, Falcon]
randFood(language: WordLanguage.ko, count: 2); // [떡볶이, 녹차]

randWordDetails(language: WordLanguage.ko, theme: WordTheme.plant).first;
// WordDetail(민들레, ko, plant)

wordLengthRange(language: WordLanguage.ko); // LengthRange(1, 4)
```

| Parameter                 | Type            | Default            |
| ------------------------- | --------------- | ------------------ |
| `language`                | `WordLanguage?` | `null` — every one |
| `theme`                   | `WordTheme?`    | `null` — every one |
| `count`                   | `int`           | `1`                |
| `style`                   | `int`           | `0`                |
| `minLength` / `maxLength` | `int?`          | _pools_            |
| `startsWith`              | `String?`       | `null`             |
| `unique`                  | `bool`          | `false`            |

One function per theme: `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle`, `randProduct`. They return `List<String>`; for the detail form, pass the theme to `randWordDetails`.

## Decorators

`randSuffix`, `randPrefix` and `randModifier` attach something to a string you already have, rather than generating one. They take anything, not just this library's output, which is why none of them is a parameter on a generator — and each of them works with no value at all, handing back the thing it would have attached.

```dart
randSuffix(value: '멋진사자'); // '멋진사자_nVtRC'
randSuffixAll(randNickname(language: WordLanguage.ko, count: 2));
// [달력_U7aNZ, 조용한바구니_RUKAP]

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

`randModifier` attaches a word instead of a token — what `randNickname`'s `includeModifier` used to do, for any string:

```dart
randModifier(value: '사자'); // '멋진사자'
randModifier(value: 'Owl', separator: ' '); // 'Misty Owl'
randModifier(); // '멋진'

randModifierAll(randAnimal(language: WordLanguage.ko, count: 2));
// [오래된곰, 영원한도마뱀]
```

| Parameter   | Type            | Default    |
| ----------- | --------------- | ---------- |
| `value`     | `String?`       | `null`     |
| `language`  | `WordLanguage?` | _script_   |
| `style`     | `int`           | `0`        |
| `separator` | `String?`       | _language_ |

With no `language`, the script of the value picks one, so `'고양이'` is never handed an English modifier.

## Helpers and constants

```dart
nameLengthRange(language: NameLanguage.ko); // LengthRange(3, 3)
nameLengthRange(language: NameLanguage.en, includeMiddleName: true); // LengthRange(12, 24)
nameSupportsMiddleName(NameLanguage.ko); // false
nameSupportsRoman(NameLanguage.en); // false
nicknameLengthRange(language: WordLanguage.ko); // LengthRange(1, 12)
```

`nameLanguages`, `wordLanguages` and `wordThemes` list what the generators accept; `randCountMax`, `randLengthMin` / `Max`, `affixLengthDefault` / `Max`, `affixSeparatorDefault` and `affixCharset` are the bounds and defaults every parameter is clamped to.

## Differences from the npm package

The two generate the same output from the same data, and only the surface is Dart's rather than JavaScript's.

| npm                                | pub.dev                                        |
| ---------------------------------- | ---------------------------------------------- |
| One options object                 | Named parameters                               |
| `language: 'ko'`                   | `language: NameLanguage.ko`                    |
| `language: 'all'` (the default)    | `language` left out, or `null`                 |
| `[number, number]`                 | `LengthRange`, which compares by value         |
| `NameDetail` / `NicknameDetail` interfaces | The same two names, as classes         |
| `output: 'detail'`                 | `randNameDetails` / `randNicknameDetails` / `randWordDetails` |
| `randModifier('사자')`             | `randModifier(value: '사자')` — every parameter is named |
| `randSuffix(['a', 'b'])`           | `randSuffixAll(['a', 'b'])`                    |

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
