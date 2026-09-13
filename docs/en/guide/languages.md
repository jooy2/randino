# Supported languages

randino generates in nine languages, each with its own pools, its own name order and its own romanization. Every generator takes a language, and mixes all of the ones it supports when you leave it out. Locations are the exception to nine: they are [two languages so far](#locations).

| Code | Language   | Native     | Person names | Words and nicknames | Sentences | Locations |
| ---- | ---------- | ---------- | :----------: | :-----------------: | :-------: | :-------: |
| `en` | English    | English    |      ✅      |         ✅          |    ✅     |    ✅     |
| `ko` | Korean     | 한국어     |      ✅      |         ✅          |    ✅     |    ✅     |
| `ja` | Japanese   | 日本語     |      ✅      |         ✅          |    ✅     |     —     |
| `zh` | Chinese    | 中文       |      ✅      |         ✅          |    ✅     |     —     |
| `it` | Italian    | Italiano   |      ✅      |         ✅          |    ✅     |     —     |
| `de` | German     | Deutsch    |      ✅      |         ✅          |    ✅     |     —     |
| `ru` | Russian    | Русский    |      ✅      |         ✅          |    ✅     |     —     |
| `es` | Spanish    | Español    |      ✅      |         ✅          |    ✅     |     —     |
| `vi` | Vietnamese | Tiếng Việt |      ✅      |         ✅          |    ✅     |     —     |

::: lang js

The codes are string literals, and they are also available at runtime as `NAME_LANGUAGES`, `WORD_LANGUAGES` and `LOCATION_LANGUAGES`.

```javascript
import { LOCATION_LANGUAGES, NAME_LANGUAGES, WORD_LANGUAGES } from 'randino';

NAME_LANGUAGES; // ['en', 'ko', 'ja', 'zh', 'it', 'de', 'ru', 'es', 'vi']
WORD_LANGUAGES; // ['en', 'ko', 'ja', 'zh', 'vi', 'es', 'it', 'de', 'ru']
LOCATION_LANGUAGES; // ['en', 'ko']
```

:::

::: lang dart

The codes are the members of three enums, and the lists are also available as `nameLanguages`, `wordLanguages` and `locationLanguages`.

```dart
import 'package:randino/randino.dart';

NameLanguage.ko.name; // 'ko'
nameLanguages; // every NameLanguage, in presentation order
wordLanguages; // every WordLanguage, in presentation order
locationLanguages; // [LocationLanguage.en, LocationLanguage.ko]
```

:::

::: lang py

The codes are `Literal` types, so a checker rejects a code that does not exist, and the tuples are also available at runtime as `NAME_LANGUAGES`, `WORD_LANGUAGES` and `LOCATION_LANGUAGES`.

```python
from randino import LOCATION_LANGUAGES, NAME_LANGUAGES, WORD_LANGUAGES

NAME_LANGUAGES  # ('en', 'ko', 'ja', 'zh', 'it', 'de', 'ru', 'es', 'vi')
WORD_LANGUAGES  # ('en', 'ko', 'ja', 'zh', 'vi', 'es', 'it', 'de', 'ru')
LOCATION_LANGUAGES  # ('en', 'ko')
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

The word pools cover every one of the nine, and so do `randWord`, the twenty-nine themed generators and `randNickname`. What differs between the languages is where the modifier goes and whether it changes shape beside the noun, and each language says both in its own frames and agreement rules.

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

The shapes belong to the language, so Vietnamese writes its own: the modifier behind the noun, the possessed thing in front of its owner. A language that inflects tags each noun with its gender and lists the endings a modifier changes, so Spanish writes `gato dorado` beside `luna dorada` without either form being stored twice. A noun with no singular at all, such as `ножницы`, `gafas` or `Jeans`, is tagged plural instead, because no singular modifier can stand beside it.

Every language the name generator knows has word pools too, so `language` means the same nine codes on every generator in the package.

Japanese and Chinese reach a second noun only through の and 的. A bare noun-noun compound needs a particle more often than not in either language, and reads as garbled once the base word is abstract.

## Sentences

Every language writes sentences too, and each declares the shapes its own grammar can carry. What differs is where the verb stands, how a phrase is marked, and which shapes the language can write at all.

| Code | Language | Shapes it declares | A sentence |
| --- | --- | --- | --- |
| `ko` | Korean | every one, verb last | 검은 고양이가 숲에서 잠잔다. |
| `ja` | Japanese | every one, verb last | ハンバーガーが暗礁で冷める。 |
| `zh` | Chinese | every one, place before the verb | 巨乌贼又品尝朱红椰汁。 |
| `en` | English | every one, verb second | The angler cleans the towel in the balcony. |
| `vi` | Vietnamese | every one, verb second | Lông mi run trong khe núi. |
| `es` | Spanish | every one, verb second | La vía láctea brilla en la roca pobre. |
| `it` | Italian | every one, place without article | Il birraio audace dimentica l'eclissi. |
| `de` | German | no object, no place | Im Frühling blüht eine Chrysantheme noch. |
| `ru` | Russian | no object, no place | Спутанный юпитер едва светлеет. |

German and Russian are narrower for the same reason. Both would put an object in the accusative and a place in another case again, and each case changes the noun's own ending or the article in front of it, so they do not declare the shapes that need one. Asking for one falls back to the closest they have. [Sentences](../sentence/) covers this in full.

## Locations {#locations}

A location is real or it is nothing, so a language has locations only when its country publishes the list of its divisions. That is not enough on its own: the list also has to come free of conditions, because every condition on the data would pass to everyone who installs this package.

- **No attribution to carry.** A dataset under CC BY or a government licence that requires the source to be named would make every app built on randino name it too.
- **No uncertain copyright.** A list with no stated terms, or one its publisher calls internal, stays out.
- **No disputed territory.** A list that settles a border question one way stays out, whichever way it settles it.

| Code | Country | Locations | Why |
| --- | --- | :-: | --- |
| `ko` | 대한민국 | ✅ | 국토교통부 publishes its legal divisions with no conditions on use |
| `en` | United States | ✅ | Census Bureau files are a U.S. Government work, with no copyright |
| `ja` | 日本 | — | The official code list requires the source to be named |
| `es` | España | — | INE data is CC BY 4.0, which requires the source to be named |
| `it` | Italia | — | ISTAT data is CC BY 4.0, which requires the source to be named |
| `de` | Deutschland | — | Destatis permits reuse only with the source named |
| `zh` | 中国 | — | No published list meets all three conditions |
| `vi` | Việt Nam | — | No published list meets all three conditions |
| `ru` | Россия | — | No published list meets all three conditions |

[`randLocation`](../location/rand-location) covers what each supported country's locations hold.
