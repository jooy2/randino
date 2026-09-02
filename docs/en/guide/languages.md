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

The word pools — and so `randWord`, the fourteen themed generators and `randNickname` — cover four languages rather than nine, and the reason is grammar rather than effort. A modifier has to sit in front of a noun exactly as it is written in the dictionary, and that only reads naturally where the language asks for no agreement between the two.

| Code | Language | Shapes                      | Example                |
| ---- | -------- | --------------------------- | ---------------------- |
| `ko` | Korean   | modifier, trailing word     | 멋진사자, 고양이꼬리   |
| `en` | English  | modifier, trailing word     | MistyOwl, CatTail      |
| `ja` | Japanese | modifier (attributive form) | 青いライオン, 静かな海 |
| `zh` | Chinese  | modifier                    | 快乐熊猫, 神秘森林     |

The five that are missing are missing for two different reasons:

- **Italian, Spanish, Russian and German inflect the modifier for the noun** — `gatto azzurro` against `luna azzurra`, `blauer Wal` against `blaue Katze`. Supporting them means tagging every noun with its gender and storing every modifier once per gender. Half-agreement output is worse than none, so they are left out until that work is done.
- **Vietnamese puts the modifier after the noun** (`mèo xanh`) and reverses possessive compounds (`đuôi mèo`, not `mèo đuôi`), so it needs a word-order setting the datasets do not have yet.

Japanese and Chinese use the modifier shapes only. A noun-noun compound in those languages needs a particle more often than not, or reads as garbled once the base word is abstract, so the trailing-word shapes are skipped for them.
