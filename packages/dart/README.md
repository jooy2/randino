<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for Dart

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![pub package](https://img.shields.io/pub/v/randino.svg)](https://pub.dev/packages/randino)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **Dart** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — Emma Clover, Jack Reeves — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across twenty-five themes, never from person names.
- **Words** are those twenty-five themes on their own — `randWord`, plus `randAnimal`, `randFood` and twelve more.
- **Sentences** are whole statements in the language's own grammar — `randSentence`. The verb decides what can stand beside it, so the words of one sentence belong together.
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

`randNameDetails` takes the same parameters except `script`, and returns a `NameDetail` — `native`, `roman`, `language` and `gender` — for each name.

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
| `minLength` / `maxLength` | `int?`              | _language_             |
| `wordSeparator`           | `String?`           | _language_             |
| `startsWith`              | `String?`           | `null`                 |
| `unique`                  | `bool`              | `false`                |

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`, `color`, `finance`, `tech`, `weather`, `space`, `time`, `emotion`, `body`, `clothing`, `tool`, `drink`.

## Words

The pools the nicknames are built from, on their own. Twenty-five themes, nine languages, and a function per theme.

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
| `minLength` / `maxLength` | `int?`          | _pools_            |
| `startsWith`              | `String?`       | `null`             |
| `unique`                  | `bool`          | `false`            |

One function per theme: `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle`, `randProduct`, `randColor`, `randFinance`, `randTech`, `randWeather`, `randSpace`, `randTime`, `randEmotion`, `randBody`, `randClothing`, `randTool`, `randDrink`. They return `List<String>`; for the detail form, pass the theme to `randWordDetails`.

## Sentences

Whole statements, written the way the language writes them. The nouns are the same pools the words and nicknames come from; what a sentence adds is the grammar — a verb that states what can do it and what it can be done to, and the shapes each language allows.

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

sentenceLengthRange(WordLanguage.en); // LengthRange(13, 92)
```

| Parameter                 | Type                  | Default            |
| ------------------------- | --------------------- | ------------------ |
| `language`                | `WordLanguage?`       | `null` — every one |
| `theme`                   | `WordTheme?`          | `null` — every one |
| `shape`                   | `SentenceShape?`      | `null` — every one |
| `slots`                   | `Set<SentenceSlot>?`  | `null` — every one |
| `include`                 | `List<String>`        | `const []`         |
| `count`                   | `int`                 | `1`                |
| `realism`                 | `RandRealism`         | `RandRealism.real` |
| `minLength` / `maxLength` | `int?`                | _language_         |
| `startsWith`              | `String?`             | `null`             |
| `unique`                  | `bool`                | `false`            |

`slots` names the parts a shape may carry beside its subject: `object`, `place`, `time`, `manner`, `state`, or an empty set for a subject and its predicate alone. A language declares its own shapes, so German has no `object` and Russian no `place` — both mark those with a case their nouns would have to change for — and asking for one falls back to the closest shape the language does have.

`include` puts words you name into every sentence. A word the pools hold goes in the phrase it belongs to, and a word from anywhere else is used as a noun.

## Decorators

`randSuffix`, `randPrefix` and `randModifier` attach something to a string you already have, rather than generating one. They take anything, not just this library's output, which is why none of them is a parameter on a generator — and each of them works with no value at all, handing back the thing it would have attached.

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

`randModifier` attaches a word instead of a token — what `randNickname`'s `includeModifier` used to do, for any string:

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
nameLengthRange(language: NameLanguage.ko); // LengthRange(3, 3)
nameLengthRange(language: NameLanguage.en, includeMiddleName: true); // LengthRange(12, 24)
nameSupportsMiddleName(NameLanguage.ko); // false
nameSupportsRoman(NameLanguage.en); // false
nicknameLengthRange(language: WordLanguage.ko); // LengthRange(1, 13)
sentenceLengthRange(WordLanguage.ko); // LengthRange(6, 41)
```

`nameLanguages`, `wordLanguages` and `wordThemes` list what the generators accept; `randCountMax`, `randLengthMin` / `Max`, `randSentenceLengthMax`, `affixLengthDefault` / `Max`, `affixSeparatorDefault` and `affixCharset` are the bounds and defaults every parameter is clamped to.

## Differences from the npm package

The two generate the same output from the same data, and only the surface is Dart's rather than JavaScript's.

| npm                                | pub.dev                                        |
| ---------------------------------- | ---------------------------------------------- |
| One options object                 | Named parameters                               |
| `language: 'ko'`                   | `language: NameLanguage.ko`                    |
| `language: 'all'` (the default)    | `language` left out, or `null`                 |
| `[number, number]`                 | `LengthRange`, which compares by value         |
| `NameDetail` / `NicknameDetail` interfaces | The same two names, as classes         |
| `output: 'detail'`                 | `randNameDetails` / `randNicknameDetails` / `randWordDetails` / `randSentenceDetails` |
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
