# randFictionalName

Generates names for the characters of a story or a game and returns `count` of them as strings: the names a novel, a game or a tabletop campaign gives its cast, rather than the names of real people in one country. A name is spelled in Latin letters first, English and British names among them, and written by its sound in every other language, so `Artemis` is `아르테미스` in Korean and `アルテミス` in Japanese. Given a [list of languages](#several-languages), it returns every name in each of them, keyed by language, for a game that shows one character to every player in the player's own language.

::: lang js

```javascript
import { randFictionalName } from 'randino';

randFictionalName({ language: 'en', count: 3 }); // ['Alice', 'Arsis', 'Emily']
randFictionalName({ language: 'ko', gender: 'female', count: 3 }); // ['앨리스', '트리아', '베리']
randFictionalName({ language: 'ja', includeSurname: true }); // ['アスター・シンクレア']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalName(language: WordLanguage.en, count: 3); // [Alice, Arsis, Emily]
randFictionalName(language: WordLanguage.ko, gender: NameGender.female, count: 3);
// [앨리스, 트리아, 베리]
randFictionalName(language: WordLanguage.ja, includeSurname: true); // [アスター・シンクレア]
```

:::

::: lang py

```python
from randino import rand_fictional_name

rand_fictional_name(language="en", count=3)  # ['Alice', 'Arsis', 'Emily']
rand_fictional_name(language="ko", gender="female", count=3)  # ['앨리스', '트리아', '베리']
rand_fictional_name(language="ja", include_surname=True)  # ['アスター・シンクレア']
```

:::

## Options

Every option is optional, and the defaults are what a call with nothing in it uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="FictionalLanguageOption" dart="WordLanguage?" py="FictionalLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Language of the names, <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> to draw one per name, or a [list](#several-languages) to write every name in each language of it. |
| `gender` | <Lang js="NameGenderOption" dart="NameGender?" py="NameGenderOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Whose name: a man's, a woman's, or either, decided per name. |
| <Lang js="includeSurname" dart="includeSurname" py="include_surname" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Follow the given name with a family name. A character in a story is usually known by one name, so it is off. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many names to return. Clamped to `0` … `10000`. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | Whether each part is a name the data holds or one [put together](#invented-names) out of syllables. `mixed` decides per part. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _no bound_ | Minimum length of the whole name, surname and all. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _no bound_ | Maximum length of the whole name. Clamped to `40`. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | Keep only names that start with this character, in the language the name is written in. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same name twice, in any language. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `FictionalNameDetail` per name. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## A name for a character {#a-name-for-a-character}

[`randName`](../name/rand-name) writes the names real people carry in one country, and at `realism: 'invented'` it makes up names that still read like that one language: `김두다`, `Patrick Silver`. [`randNickname`](../nickname/rand-nickname) builds a handle out of everyday words. This one writes the kind of name a story gives its characters: `Alice`, `Arsis`, `Berry`, `Tria`, `Emily`.

Most of them are names people really carry, English, Welsh, Irish, Norse, Greek and Latin ones among them, and the rest are made up to sit beside them, the way a story's cast usually mixes both. None of them belongs to one well-known work: `Arwen`, `Yennefer` and `Arthas` are left out because the name is that work's, while `Guinevere`, `Artemis` and `Freya` are in, because Arthurian, Greek and Norse stories belong to everybody.

There are about 180 men's names, about 190 women's names and about 120 family names.

## One name in every language {#one-name-in-every-language}

A fictional name is one name however it is written. It is spelled in Latin letters, and every other language writes it by its sound, the way a translated novel or a localized game would:

| Language                     | `Artemis`    | `Elara Blackwood`        |
| ---------------------------- | ------------ | ------------------------ |
| `en`, `vi`, `es`, `it`, `de` | `Artemis`    | `Elara Blackwood`        |
| `ko`                         | `아르테미스` | `엘라라 블랙우드`        |
| `ja`                         | `アルテミス` | `エララ・ブラックウッド` |
| `zh`                         | `阿尔忒弥斯` | `埃拉拉·布莱克伍德`      |
| `ru`                         | `Артемис`    | `Элара Блэквуд`          |

English, Vietnamese, Spanish, Italian and German keep a made-up name the way it is spelled. Japanese and Chinese write a dot between a given name and a family name, the way they write any foreign name. Each spelling is the one a reader of that language expects for the name rather than a letter-by-letter one: `Alice` is `앨리스` and `Элис`, and a Chinese woman's name takes the characters Chinese gives one, `爱丽丝`.

`startsWith` is the first character in the language the name is written in, so `startsWith: '아'` asks a Korean name to start with `아`. Japanese writes these names in katakana, and a hiragana character is read as the katakana one: `あ` finds `アリス`.

## Several languages at once {#several-languages}

A game or a book shows one character to every player in the player's own language, so `language` also takes a list, and a list returns every name in every language of it, keyed by code in the order you gave:

::: lang js

```javascript
randFictionalName({ language: ['ko', 'en', 'ja'], count: 2 });
// [{ ko: '아르테미스', en: 'Artemis', ja: 'アルテミス' },
//  { ko: '앨리스', en: 'Alice', ja: 'アリス' }]
```

The return type follows the list: `form.ko` is a `string`, and a language you did not ask for is not there to read.

:::

::: lang dart

```dart
randFictionalNameForms({WordLanguage.ko, WordLanguage.en, WordLanguage.ja}, count: 2);
// [{WordLanguage.ko: 아르테미스, WordLanguage.en: Artemis, WordLanguage.ja: アルテミス},
//  {WordLanguage.ko: 앨리스, WordLanguage.en: Alice, WordLanguage.ja: アリス}]
```

Dart cannot change a return type by argument, so the list is a function of its own, `randFictionalNameForms`, which takes the languages first and the same named parameters as `randFictionalName` after them. A set keeps the order it was written in, and that is the order of each map.

:::

::: lang py

```python
rand_fictional_name(language=["ko", "en", "ja"], count=2)
# [{'ko': '아르테미스', 'en': 'Artemis', 'ja': 'アルテミス'},
#  {'ko': '앨리스', 'en': 'Alice', 'ja': 'アリス'}]
```

:::

Each name is drawn in the first language of the list and written in the rest, so the first is the one `startsWith` and the length range read: a Korean list asked for `maxLength: 4` keeps the Korean name to four characters, whatever its English spelling comes out at. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> is not a list: it draws one language per name, the way every generator does. `unique` compares the names themselves, so `Artemis` and `아르테미스` are one name.

## Invented names {#invented-names}

`realism: 'invented'` puts a name together out of syllables rather than drawing one: an opening, at most one middle syllable, and an ending that says whether it is a man's or a woman's name. `Al` and `dric` make `Aldric`, `Va`, `le` and `ria` make `Valeria`. Each syllable carries its own spelling in every script, so an invented name is written in all nine languages at once: `Ed` and `lyn` are `Edlyn`, `에들린`, `エドリン`, `埃德琳` and `Эдлин`. A family name is put together the same way out of two English halves, `Black` and `wood`.

There are tens of thousands of them. None is a real country's name in any of the nine languages, a famous character or place, or a word any of the languages reads as an obscenity — the test suite tries every one of them to keep it that way. `realism: 'mixed'` decides per part, so a name can pair a given name from the data with an invented family name.

::: lang js

```javascript
randFictionalName({ language: 'en', realism: 'invented', count: 5 });
// ['Ganora', 'Ordan', 'Ralyn', 'Melmus', 'Serseran']
randFictionalName({ language: 'ko', realism: 'invented', count: 3 }); // ['말마르', '칼피란', '에르노르']
```

:::

::: lang dart

```dart
randFictionalName(language: WordLanguage.en, realism: RandRealism.invented, count: 5);
// [Ganora, Ordan, Ralyn, Melmus, Serseran]
```

:::

::: lang py

```python
rand_fictional_name(language="en", realism="invented", count=5)
# ['Ganora', 'Ordan', 'Ralyn', 'Melmus', 'Serseran']
```

:::

A first character no name in the data starts with is answered with an invented one that does, whatever `realism` is.

## Length {#length}

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole name in the language it is written in, surname and all. The parts are drawn to land inside the range rather than drawn again until one does: a family name is chosen to leave room for a given name, and a man's or a woman's name is chosen when only one of them reaches the range in that language. With several languages in play, a language whose names cannot reach the range is left out while another's can. A range nothing reaches is answered with the closest name there is.

## The detail output {#the-detail-output}

::: lang js

```javascript
randFictionalName({ language: ['en', 'zh'], includeSurname: true, output: 'detail' });
// [{ name: 'Elara Blackwood', gender: 'female', language: 'en',
//    forms: { en: 'Elara Blackwood', zh: '埃拉拉·布莱克伍德' } }]
```

:::

::: lang dart

```dart
randFictionalNameDetails(language: {WordLanguage.en, WordLanguage.zh}, includeSurname: true).first;
// FictionalNameDetail(Elara Blackwood, female, en, {en: Elara Blackwood, zh: 埃拉拉·布莱克伍德})
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randFictionalName`, except that `language` is a set: one language, or several for `forms` the way a list gives them in the other two packages.

:::

::: lang py

```python
rand_fictional_name(language=["en", "zh"], include_surname=True, output="detail")
# [FictionalNameDetail(name='Elara Blackwood', gender='female', language='en',
#                      forms={'en': 'Elara Blackwood', 'zh': '埃拉拉·布莱克伍德'})]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `name` | <Lang js="string" dart="String" py="str" code /> | The name in `language`: what a call of one language returns. |
| `gender` | `NameGender` | Whose name it is. |
| `language` | `WordLanguage` | The language `name` is written in: the one drawn, or the first of a list. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | The same name in every language the call asked for, in the order it asked for them: what a list returns. |

A name can match a real person's or a character's somewhere; see the [disclaimer](../guide/disclaimer#coincidence).

## See also

- [`randFictionalCountry`](./rand-fictional-country) and the other place functions — the map the character lives on.
- [`randName`](../name/rand-name) — the names real people carry in one language.
- [`randNickname`](../nickname/rand-nickname) — a handle built from everyday words.
