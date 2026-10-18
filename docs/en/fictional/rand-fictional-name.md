# randFictionalName

Generates names for the characters of a story or a game and returns `count` of them as strings: the names a novel, a game or a tabletop campaign gives its cast, rather than the names of real people in one country. A name is spelled in Latin letters first, English and British names among them, and written by its sound in every other language, so `Artemis` is `아르테미스` in Korean and `アルテミス` in Japanese. With [`output: 'detail'`](#the-detail-output) it writes each name in every language you asked for.

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

randFictionalName(language: {WordLanguage.en}, count: 3); // [Alice, Arsis, Emily]
randFictionalName(language: {WordLanguage.ko}, gender: NameGender.female, count: 3);
// [앨리스, 트리아, 베리]
randFictionalName(language: {WordLanguage.ja}, includeSurname: true); // [アスター・シンクレア]
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
| `language` | <Lang js="FictionalLanguageOption" dart="Set&lt;WordLanguage&gt;?" py="FictionalLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Language, or [languages](#several-languages), to write the names in. Several draw one per name. |
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

`language` takes a list as well as one language. The value form draws one language of the list for each name, the way <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws one of all nine. The detail form also writes every name in every language of the list, in the order you gave, under `forms`:

::: lang js

```javascript
randFictionalName({ language: ['en', 'ko', 'ja'], output: 'detail' });
// [{ name: 'Artemis', gender: 'female', language: 'en',
//    forms: { en: 'Artemis', ko: '아르테미스', ja: 'アルテミス' } }]
```

:::

::: lang dart

```dart
randFictionalNameDetails(language: {WordLanguage.en, WordLanguage.ko, WordLanguage.ja}).first.forms;
// {WordLanguage.en: Artemis, WordLanguage.ko: 아르테미스, WordLanguage.ja: アルテミス}
```

A set keeps the order it was written in, and that is the order of `forms`.

:::

::: lang py

```python
rand_fictional_name(language=["en", "ko", "ja"], output="detail")
# [FictionalNameDetail(name='Artemis', gender='female', language='en',
#                      forms={'en': 'Artemis', 'ko': '아르테미스', 'ja': 'アルテミス'})]
```

:::

`unique` compares the names themselves, not the strings: `Artemis` and `아르테미스` are one name, and only one of them comes back.

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
randFictionalName(language: {WordLanguage.en}, realism: RandRealism.invented, count: 5);
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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randFictionalName`.

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
| `name` | <Lang js="string" dart="String" py="str" code /> | The name in `language`, as the value form returns it. |
| `gender` | `NameGender` | Whose name it is. |
| `language` | `WordLanguage` | The language `name` is written in. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | The same name in every language the call asked for, in the order it asked for them. |

A name can match a real person's or a character's somewhere; see the [disclaimer](../guide/disclaimer#coincidence).

## See also

- [`randFictionalCountry`](./rand-fictional-country) and the other place functions — the map the character lives on.
- [`randName`](../name/rand-name) — the names real people carry in one language.
- [`randNickname`](../nickname/rand-nickname) — a handle built from everyday words.
