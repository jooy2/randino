# randFictionalCountry

Generates the names of countries that do not exist, for the map of a story or a game, and returns `count` of them as strings. A country may carry the kind of state it is beside its name — `Kingdom of Edlin`, `Glacia` on its own — and its name is spelled in Latin letters first and written by its sound in every other language. With [`output: 'detail'`](#the-detail-output) it writes each country in every language you asked for.

::: lang js

```javascript
import { randFictionalCountry } from 'randino';

randFictionalCountry({ language: 'en', count: 3 }); // ['Kingdom of Edlin', 'Glacia', 'Castavia Empire']
randFictionalCountry({ language: 'ko', count: 3 }); // ['에들린 왕국', '글래시아', '카스타비아 제국']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalCountry(language: {WordLanguage.en}, count: 3);
// [Kingdom of Edlin, Glacia, Castavia Empire]
randFictionalCountry(language: {WordLanguage.ko}, count: 3); // [에들린 왕국, 글래시아, 카스타비아 제국]
```

:::

::: lang py

```python
from randino import rand_fictional_country

rand_fictional_country(language="en", count=3)  # ['Kingdom of Edlin', 'Glacia', 'Castavia Empire']
rand_fictional_country(language="ko", count=3)  # ['에들린 왕국', '글래시아', '카스타비아 제국']
```

:::

## Options

<FictionalPlaceOptions />

## Names {#names}

A country's name is a sweeping Latin-sounding one, `Valoria`, `Sylvaria`, `Glacia`, out of about a hundred the data holds, among them the legendary lands that belong to everybody's stories: `Avalon`, `Lyonesse`, `Lemuria`. `realism: 'invented'` puts one together out of syllables instead, an opening, at most one middle syllable and an ending such as `-ria` or `-heim` (`Sil` + `va` + `ria`), and there are tens of thousands of those. `mixed` decides per country.

None of them is a real country's name in any of the nine languages, and none is a place a well-known game, film or book made up: `Hyrule`, `Narnia` and `Westeros` are out, and so is an invented name that only one language would read as a real country, such as `Senegar`, which Japanese writes `セネガル`.

## Kinds {#kinds}

<Lang js="includeKind" dart="includeKind" py="include_kind" code /> writes the kind of state beside the name. Left out, it is a coin flip per country.

| Kind            | English                 | Korean          | Korean, borrowed    |
| --------------- | ----------------------- | --------------- | ------------------- |
| `kingdom`       | `Kingdom of Edlin`      | `에들린 왕국`   | `에들린 킹덤`       |
| `empire`        | `Edlin Empire`          | `에들린 제국`   | `에들린 엠파이어`   |
| `republic`      | `Republic of Edlin`     | `에들린 공화국` | `에들린 리퍼블릭`   |
| `principality`  | `Principality of Edlin` | `에들린 공국`   | —                   |
| `archduchy`     | `Archduchy of Edlin`    | `에들린 대공국` | —                   |
| `duchy`         | `Duchy of Edlin`        | `에들린 공작령` | —                   |
| `federation`    | `Edlin Federation`      | `에들린 연방`   | `에들린 페더레이션` |
| `confederation` | `Edlin Confederation`   | `에들린 연합`   | —                   |
| `dominion`      | `Dominion of Edlin`     | `에들린 자치령` | `에들린 도미니언`   |
| `theocracy`     | `Theocracy of Edlin`    | `에들린 신성국` | —                   |
| `isles`         | `Edlin Isles`           | `에들린 제도`   | —                   |

## How a kind is written {#kind-style}

A kind is written in each language's own words, and some languages write a foreign place's kind two ways: by its own word (`에들린 왕국`, `エドリン王国`, `Королевство Эдлин`, `Reino de Edlin`) or by the English word in its own script (`에들린 킹덤`, `エドリン・キングダム`). Left to itself, a language translates the kind of a country, the way it translates `United Kingdom`. <Lang js="kindStyle" dart="kindStyle" py="kind_style" code /> decides it instead:

- <Lang js="'borrowed'" dart="FictionalKindStyle.borrowed" py="&quot;borrowed&quot;" code /> writes the English word, in the language's script where it has one in use (`에들린 킹덤`), and as it is in the languages written in Latin letters (`Kingdom of Edlin` in Spanish too).
- <Lang js="'translated'" dart="FictionalKindStyle.translated" py="&quot;translated&quot;" code /> writes the language's own word, which is what a country gets anyway.

A kind with no borrowed word in use in a language is written in its own word either way — Korean writes no `프린시펄리티` — and Chinese translates every kind, because it never writes one by its sound.

::: lang js

```javascript
randFictionalCountry({ language: 'ko', includeKind: true, kindStyle: 'borrowed', count: 2 });
// ['에들린 킹덤', '바렌시아 엠파이어']
```

:::

::: lang dart

```dart
randFictionalCountry(
  language: {WordLanguage.ko},
  includeKind: true,
  kindStyle: FictionalKindStyle.borrowed,
  count: 2,
);
// [에들린 킹덤, 바렌시아 엠파이어]
```

:::

::: lang py

```python
rand_fictional_country(language="ko", include_kind=True, kind_style="borrowed", count=2)
# ['에들린 킹덤', '바렌시아 엠파이어']
```

:::

## Several languages at once {#several-languages}

`language` takes a list as well as one language. The value form draws one language of the list for each country; the detail form also writes every country in every language of the list, in the order you gave, under `forms`. `unique` compares the countries themselves, so `Kingdom of Edlin` and `에들린 왕국` are one. `startsWith` reads the country's own name, not a kind written in front of it: `Kingdom of Edlin` starts with `E`.

## Length {#length}

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole country, kind and all. When only a country with a kind, or only one without, can land inside the range, a kind left to chance is decided by the range, and a kind whose words leave no name room is passed over. A range nothing reaches is answered with the closest country there is.

## The detail output {#the-detail-output}

::: lang js

```javascript
randFictionalCountry({
	language: ['en', 'ko', 'ja', 'zh', 'ru'],
	includeKind: true,
	output: 'detail'
});
// [{ place: 'Ilvaris Isles', name: 'Ilvaris', kind: 'isles', level: 'country', language: 'en',
//    forms: { en: 'Ilvaris Isles', ko: '일바리스 제도', ja: 'イルヴァリス諸島',
//             zh: '伊尔瓦里斯群岛', ru: 'Острова Ильварис' } }]
```

:::

::: lang dart

```dart
randFictionalCountryDetails(language: {WordLanguage.en, WordLanguage.ko}, includeKind: true).first;
// FictionalPlaceDetail(Ilvaris Isles, Ilvaris, isles, country, en,
//   {en: Ilvaris Isles, ko: 일바리스 제도})
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randFictionalCountry`.

:::

::: lang py

```python
rand_fictional_country(language=["en", "ko"], include_kind=True, output="detail")
# [FictionalPlaceDetail(place='Ilvaris Isles', name='Ilvaris', kind='isles', level='country',
#                       language='en', forms={'en': 'Ilvaris Isles', 'ko': '일바리스 제도'})]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `place` | <Lang js="string" dart="String" py="str" code /> | The country in `language`, kind and all, as the value form returns it. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The country's own name in `language`, without its kind. |
| `kind` | <Lang js="FictionalPlaceKind &#124; null" dart="FictionalPlaceKind?" py="FictionalPlaceKind &#124; None" code /> | The kind written beside the name, or <Lang js="null" dart="null" py="None" code /> for none. |
| `level` | `LocationLevel` | Always `country` here. |
| `language` | `WordLanguage` | The language `place` is written in. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | The same country in every language the call asked for, in the order it asked for them. |

A made-up name can still match a real place somewhere; see the [disclaimer](../guide/disclaimer#coincidence).

## See also

- [`randFictionalRegion`](./rand-fictional-region), [`randFictionalCity`](./rand-fictional-city) and [`randFictionalDistrict`](./rand-fictional-district) — the rest of the map.
- [`randFictionalName`](./rand-fictional-name) — the people who live there.
- [`randCountry`](../location/rand-country) — the countries that do exist.
