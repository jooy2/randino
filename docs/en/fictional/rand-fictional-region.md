# randFictionalRegion

Generates the names of regions that do not exist — provinces, valleys, coasts and the like — for the map of a story or a game, and returns `count` of them as strings. A region may carry the kind of place it is beside its name — `County of Zorvalia`, `Brightvale` on its own — and its name is spelled in Latin letters first and written by its sound in every other language. With [`output: 'detail'`](#the-detail-output) it writes each region in every language you asked for.

::: lang js

```javascript
import { randFictionalRegion } from 'randino';

randFictionalRegion({ language: 'en', count: 3 }); // ['Silverfen Valley', 'Altheria', 'Isle of Lumeria']
randFictionalRegion({ language: 'ko', count: 3 }); // ['실버펜 계곡', '알테리아', '루메리아섬']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalRegion(language: {WordLanguage.en}, count: 3);
// [Silverfen Valley, Altheria, Isle of Lumeria]
randFictionalRegion(language: {WordLanguage.ko}, count: 3); // [실버펜 계곡, 알테리아, 루메리아섬]
```

:::

::: lang py

```python
from randino import rand_fictional_region

rand_fictional_region(language="en", count=3)  # ['Silverfen Valley', 'Altheria', 'Isle of Lumeria']
rand_fictional_region(language="ko", count=3)  # ['실버펜 계곡', '알테리아', '루메리아섬']
```

:::

## Options

<FictionalPlaceOptions />

## Names {#names}

A region's name is either a sweeping Latin-sounding one, `Altheria`, `Halveria`, like a country's, or an English one built the way English names its moors and dales, `Brightvale`, `Ravenmoor`, `Wintermere` — about 130 of them in the data. `realism: 'invented'` puts one together instead, out of syllables (`Eli` + `heim`) or out of two English halves (`Silver` + `heath`), half the time each, and there are tens of thousands of those. `mixed` decides per region.

None of them is a real country's name in any of the nine languages, and none is a place a well-known game, film or book made up: `Westmarch`, `Riverwood` and `Winterfell` are what two of the halves would spell, and they are kept out.

## Kinds {#kinds}

<Lang js="includeKind" dart="includeKind" py="include_kind" code /> writes the kind of place beside the name. Left out, it is a coin flip per region.

| Kind        | English               | Korean          | Korean, borrowed  |
| ----------- | --------------------- | --------------- | ----------------- |
| `province`  | `Silverfen Province`  | `실버펜주`      | —                 |
| `march`     | `Silverfen March`     | `실버펜 변경령` | —                 |
| `county`    | `County of Silverfen` | `실버펜 백작령` | `실버펜 카운티`   |
| `barony`    | `Barony of Silverfen` | `실버펜 남작령` | —                 |
| `highlands` | `Silverfen Highlands` | `실버펜 고원`   | `실버펜 하이랜드` |
| `lowlands`  | `Silverfen Lowlands`  | `실버펜 저지대` | —                 |
| `valley`    | `Silverfen Valley`    | `실버펜 계곡`   | `실버펜 밸리`     |
| `forest`    | `Silverfen Forest`    | `실버펜 숲`     | `실버펜 포레스트` |
| `plains`    | `Silverfen Plains`    | `실버펜 평원`   | —                 |
| `coast`     | `Silverfen Coast`     | `실버펜 해안`   | `실버펜 코스트`   |
| `peninsula` | `Silverfen Peninsula` | `실버펜 반도`   | —                 |
| `moors`     | `Silverfen Moors`     | `실버펜 황야`   | —                 |
| `wilds`     | `Silverfen Wilds`     | `실버펜 황무지` | —                 |
| `isle`      | `Isle of Silverfen`   | `실버펜섬`      | —                 |
| `frontier`  | `Silverfen Frontier`  | `실버펜 변경`   | `실버펜 프런티어` |

A kind the name already says is not written beside it: `Highmoor` is never `Highmoor Moors`.

## How a kind is written {#kind-style}

A kind is written in each language's own words, and some languages write a foreign place's kind two ways: by its own word (`실버펜 계곡`, `シルバーフェン渓谷`, `Долина Силверфен`, `Valle de Silverfen`) or by the English word in its own script (`실버펜 밸리`, `シルバーフェン・ヴァレー`, `Силверфен-Вэлли`). Left to itself, a language translates the kind of a region, the way it translates `Death Valley` into `Valle de la Muerte` and `Долина Смерти`. <Lang js="kindStyle" dart="kindStyle" py="kind_style" code /> decides it instead:

- <Lang js="'borrowed'" dart="FictionalKindStyle.borrowed" py="&quot;borrowed&quot;" code /> writes the English word, in the language's script where it has one in use (`실버펜 밸리`), and as it is in the languages written in Latin letters (`Silverfen Valley`).
- <Lang js="'translated'" dart="FictionalKindStyle.translated" py="&quot;translated&quot;" code /> writes the language's own word, which is what a region gets anyway.

A kind with no borrowed word in use in a language is written in its own word either way — Korean writes no `프로빈스` — and Chinese translates every kind, because it never writes one by its sound: `西尔弗芬谷`.

## Several languages at once {#several-languages}

`language` takes a list as well as one language. The value form draws one language of the list for each region; the detail form also writes every region in every language of the list, in the order you gave, under `forms`. `unique` compares the regions themselves, so `Silverfen Valley` and `실버펜 계곡` are one. `startsWith` reads the region's own name, not a kind written in front of it: `Isle of Lumeria` starts with `L`.

## Length {#length}

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole region, kind and all. When only a region with a kind, or only one without, can land inside the range, a kind left to chance is decided by the range, and a kind whose words leave no name room is passed over. A range nothing reaches is answered with the closest region there is.

## The detail output {#the-detail-output}

::: lang js

```javascript
randFictionalRegion({
	language: ['en', 'ko', 'ja', 'zh', 'ru'],
	includeKind: true,
	output: 'detail'
});
// [{ place: 'Novaria Frontier', name: 'Novaria', kind: 'frontier', level: 'region', language: 'en',
//    forms: { en: 'Novaria Frontier', ko: '노바리아 변경', ja: 'ノヴァリア辺境',
//             zh: '诺瓦里亚边疆', ru: 'Пограничье Новария' } }]
```

:::

::: lang dart

```dart
randFictionalRegionDetails(language: {WordLanguage.en, WordLanguage.ko}, includeKind: true).first;
// FictionalPlaceDetail(Novaria Frontier, Novaria, frontier, region, en,
//   {en: Novaria Frontier, ko: 노바리아 변경})
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randFictionalRegion`.

:::

::: lang py

```python
rand_fictional_region(language=["en", "ko"], include_kind=True, output="detail")
# [FictionalPlaceDetail(place='Novaria Frontier', name='Novaria', kind='frontier', level='region',
#                       language='en', forms={'en': 'Novaria Frontier', 'ko': '노바리아 변경'})]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `place` | <Lang js="string" dart="String" py="str" code /> | The region in `language`, kind and all, as the value form returns it. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The region's own name in `language`, without its kind. |
| `kind` | <Lang js="FictionalPlaceKind &#124; null" dart="FictionalPlaceKind?" py="FictionalPlaceKind &#124; None" code /> | The kind written beside the name, or <Lang js="null" dart="null" py="None" code /> for none. |
| `level` | `LocationLevel` | Always `region` here. |
| `language` | `WordLanguage` | The language `place` is written in. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | The same region in every language the call asked for, in the order it asked for them. |

A made-up name can still match a real place somewhere; see the [disclaimer](../guide/disclaimer#coincidence).

## See also

- [`randFictionalCountry`](./rand-fictional-country), [`randFictionalCity`](./rand-fictional-city) and [`randFictionalDistrict`](./rand-fictional-district) — the rest of the map.
- [`randFictionalName`](./rand-fictional-name) — the people who live there.
- [`randRegion`](../location/rand-region) — the regions that do exist.
