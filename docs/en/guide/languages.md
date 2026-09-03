# Supported languages

randino generates in nine languages, each with its own pools, its own name order and its own romanization. Every generator takes a language, and mixes all of the ones it supports when you leave it out.

| Code | Language   | Native     | Person names | Words and nicknames |
| ---- | ---------- | ---------- | :----------: | :-----------------: |
| `en` | English    | English    |      ✅      |         ✅          |
| `ko` | Korean     | 한국어     |      ✅      |         ✅          |
| `ja` | Japanese   | 日本語     |      ✅      |         ✅          |
| `zh` | Chinese    | 中文       |      ✅      |         ✅          |
| `it` | Italian    | Italiano   |      ✅      |         ❌          |
| `de` | German     | Deutsch    |      ✅      |         ❌          |
| `ru` | Russian    | Русский    |      ✅      |         ❌          |
| `es` | Spanish    | Español    |      ✅      |         ❌          |
| `vi` | Vietnamese | Tiếng Việt |      ✅      |         ❌          |

::: lang js

The codes are string literals, and they are also available at runtime as `NAME_LANGUAGES` and `WORD_LANGUAGES`.

```javascript
import { NAME_LANGUAGES, WORD_LANGUAGES } from 'randino';

NAME_LANGUAGES; // ['en', 'ko', 'ja', 'zh', 'it', 'de', 'ru', 'es', 'vi']
WORD_LANGUAGES; // ['en', 'ko', 'ja', 'zh']
```

:::

::: lang dart

The codes are the members of two enums, and the lists are also available as `nameLanguages` and `wordLanguages`.

```dart
import 'package:randino/randino.dart';

NameLanguage.ko.name; // 'ko'
nameLanguages; // every NameLanguage, in presentation order
wordLanguages; // [WordLanguage.en, .ko, .ja, .zh]
```

:::

::: lang py

The codes are `Literal` types, so a checker rejects a code that does not exist, and the tuples are also available at runtime as `NAME_LANGUAGES` and `WORD_LANGUAGES`.

```python
from randino import NAME_LANGUAGES, WORD_LANGUAGES

NAME_LANGUAGES  # ('en', 'ko', 'ja', 'zh', 'it', 'de', 'ru', 'es', 'vi')
WORD_LANGUAGES  # ('en', 'ko', 'ja', 'zh')
```

:::

## Person names

Each language decides three things: which part of a name comes first, whether there is a middle part at all, and how the native form becomes an English pronunciation.

| Code | Name order   | Middle name      | Example                         |
| ---- | ------------ | ---------------- | ------------------------------- |
| `en` | given first  | yes              | Paisley Lewis                   |
| `ko` | family first | no               | 김태윤 → Kim Taeyun             |
| `ja` | family first | no               | 山口直人 → Yamaguchi Naoto      |
| `zh` | family first | no               | 赵勇轩 → Zhao Yongxuan          |
| `it` | given first  | yes              | Giorgia Mancini                 |
| `de` | given first  | yes              | Johanna Wolf                    |
| `ru` | given first  | yes (patronymic) | Иван Семёнов → Ivan Semyonov    |
| `es` | given first  | yes              | Gonzalo Martín → Gonzalo Martin |
| `vi` | family first | yes              | Đặng Quân → Dang Quan           |

Korean, Japanese and Chinese have no middle part, so the middle-name option is ignored for them rather than inventing one. There is a helper that answers that question directly: [`nameSupportsMiddleName`](../name/name-supports-middle-name).

### Romanization

Romanization is the **English pronunciation of the native form**, not a translation, and each script gets there its own way:

- **Latin scripts** drop their diacritics: `Pérez` → `Perez`, `Müller` → `Muller`, `Đỗ` → `Do`.
- **Cyrillic** is transliterated character by character: `Семёнов` → `Semyonov`.
- **Korean** follows the Revised Romanization of Korean, including the sound changes between syllables — `석민` is `Seongmin` and not `Seokmin` — with the conventional spelling for surnames, so `김` is `Kim` rather than `Gim`.
- **Japanese and Chinese** carry the reading on each character, so `佐藤` is `Sato` and `王` is `Wang`.

English is the one language where romanizing changes nothing, because the names are already in the Latin alphabet.

## Words and nicknames {#words-and-nicknames}

The word pools — and so `randWord`, the twenty-five themed generators and `randNickname` — cover every one of the nine. What differs between them is where the modifier goes and whether it changes shape beside the noun, and each language says both in its own frames and agreement rules.

| Code | Language   | Shapes                         | Example                    |
| ---- | ---------- | ------------------------------ | -------------------------- |
| `ko` | Korean     | modifier, trailing word        | 멋진사자, 고양이꼬리       |
| `en` | English    | modifier, trailing word        | MistyOwl, CatTail          |
| `ja` | Japanese   | modifier (attributive form)    | 青いライオン, 星の影       |
| `zh` | Chinese    | modifier, 的 before a verb     | 快乐熊猫, 奔跑的狮子       |
| `vi` | Vietnamese | modifier **after** the noun    | mèo xanh, đuôi mèo         |
| `es` | Spanish    | modifier after, **agreeing**   | gato azul, luna dorada     |
| `it` | Italian    | modifier after, **agreeing**   | gatto azzurro, luna dorata |
| `de` | German     | modifier **before**, declining | blauer Wal, blaue Katze    |
| `ru` | Russian    | modifier **before**, declining | синий кит, синяя рыба      |

Neither word order nor agreement keeps a language out any more. The shapes belong to the language, so Vietnamese writes its own — the modifier behind the noun, the possessed thing in front of its owner. And a language that inflects tags each noun with its gender and lists the endings a modifier changes, so Spanish writes `gato dorado` beside `luna dorada` without either form being stored twice.

Every language the name generator knows now has word pools too, so `language` means the same nine codes on every generator in the package.

Japanese and Chinese reach a second noun only through の and 的. A bare noun-noun compound needs a particle more often than not in either language, or reads as garbled once the base word is abstract, so the shape that has one is the shape they got.
