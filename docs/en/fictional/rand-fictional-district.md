# randFictionalDistrict

Generates the names of districts that do not exist — the parts of a city a story moves between — and returns `count` of them as strings. A district usually carries the kind of place it is beside its name — `Gruger Park`, `Evelyn Bay` — and its name is spelled in Latin letters first and written by its sound in every other language. Given a [list of languages](#several-languages), it returns each district in every one of them, keyed by language, and [`output: 'detail'`](#the-detail-output) reports what each was built from.

::: lang js

```javascript
import { randFictionalDistrict } from 'randino';

randFictionalDistrict({ language: 'en', count: 3 }); // ['Gruger Park', 'Evelyn Bay', 'Hadley']
randFictionalDistrict({ language: 'ko', count: 3 }); // ['그루거 파크', '이블린 베이', '해들리']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalDistrict(language: WordLanguage.en, count: 3); // [Gruger Park, Evelyn Bay, Hadley]
randFictionalDistrict(language: WordLanguage.ko, count: 3); // [그루거 파크, 이블린 베이, 해들리]
```

:::

::: lang py

```python
from randino import rand_fictional_district

rand_fictional_district(language="en", count=3)  # ['Gruger Park', 'Evelyn Bay', 'Hadley']
rand_fictional_district(language="ko", count=3)  # ['그루거 파크', '이블린 베이', '해들리']
```

:::

## Options

<FictionalPlaceOptions />

## Names {#names}

A district is named the way a real one usually is, after a family or a person, `Gruger`, `Evelyn`, `Hadley`, or with an English name built like a town's: about seventy of its own in the data and the hundred and fifty family names [`randFictionalName`](./rand-fictional-name) uses. `realism: 'invented'` puts one together instead, out of two English halves (`Deep` + `grove`) or out of syllables, like a person's name (`Kalira`). `mixed` decides per district.

## Kinds {#kinds}

<Lang js="includeKind" dart="includeKind" py="include_kind" code /> writes the kind of place beside the name. Left out, it is written for about seven districts in ten.

| Kind      | English          | Korean          | Korean, translated |
| --------- | ---------------- | --------------- | ------------------ |
| `park`    | `Gruger Park`    | `그루거 파크`   | `그루거 공원`      |
| `bay`     | `Gruger Bay`     | `그루거 베이`   | `그루거만`         |
| `hills`   | `Gruger Hills`   | `그루거 힐스`   | `그루거 언덕`      |
| `heights` | `Gruger Heights` | `그루거 하이츠` | `그루거 고지`      |
| `square`  | `Gruger Square`  | `그루거 스퀘어` | `그루거 광장`      |
| `quarter` | `Gruger Quarter` | `그루거 쿼터`   | `그루거 지구`      |
| `gardens` | `Gruger Gardens` | `그루거 가든스` | `그루거 정원`      |
| `market`  | `Gruger Market`  | `그루거 마켓`   | `그루거 시장`      |
| `docks`   | `Gruger Docks`   | `그루거 독스`   | `그루거 부두`      |
| `terrace` | `Gruger Terrace` | `그루거 테라스` | —                  |
| `green`   | `Gruger Green`   | `그루거 그린`   | `그루거 녹지`      |
| `grove`   | `Gruger Grove`   | `그루거 그로브` | `그루거 숲`        |
| `end`     | `Gruger End`     | `그루거 엔드`   | —                  |
| `row`     | `Gruger Row`     | `그루거 로`     | `그루거 거리`      |
| `village` | `Gruger Village` | `그루거 빌리지` | `그루거 마을`      |

A kind the name already says is not written beside it: `Ashgrove` is never `Ashgrove Grove`.

## How a kind is written {#kind-style}

A kind is written in each language's own words, and some languages write a foreign place's kind two ways: by the English word in its own script (`그루거 파크`, `グルーガー・パーク`, `Гругер-парк`) or by its own word (`그루거 공원`, `グルーガー公園`, `Парк Гругер`). Left to itself, a language keeps the English word for a district's kind, the way `Central Park` and `Pearl Harbor` keep theirs, and the languages written in Latin letters write it as it is: `Gruger Park`. <Lang js="kindStyle" dart="kindStyle" py="kind_style" code /> decides it instead:

- <Lang js="'borrowed'" dart="FictionalKindStyle.borrowed" py="&quot;borrowed&quot;" code /> writes the English word, which is what a district gets anyway.
- <Lang js="'translated'" dart="FictionalKindStyle.translated" py="&quot;translated&quot;" code /> writes the language's own word: `그루거 공원`, `Parque Gruger`, `Grugerpark`.

A kind with no word of a language's own is written the same both ways, and Chinese translates every kind, because it never writes one by its sound: `格鲁格公园`.

## Several languages at once {#several-languages}

A game or a book shows the same map to every player in the player's own language, so `language` also takes a list, and a list returns every district in every language of it, keyed by code in the order you gave:

::: lang js

```javascript
randFictionalDistrict({ language: ['ko', 'en', 'zh'], includeKind: true });
// [{ ko: '이블린 베이', en: 'Evelyn Bay', zh: '伊芙琳湾' }]
```

:::

::: lang dart

```dart
randFictionalDistrictForms({WordLanguage.ko, WordLanguage.en, WordLanguage.zh}, includeKind: true);
// [{WordLanguage.ko: 이블린 베이, WordLanguage.en: Evelyn Bay, WordLanguage.zh: 伊芙琳湾}]
```

Dart cannot change a return type by argument, so the list is a function of its own, `randFictionalDistrictForms`, which takes the languages first and the same named parameters as `randFictionalDistrict` after them. A set keeps the order it was written in, and that is the order of each map.

:::

::: lang py

```python
rand_fictional_district(language=["ko", "en", "zh"], include_kind=True)
# [{'ko': '이블린 베이', 'en': 'Evelyn Bay', 'zh': '伊芙琳湾'}]
```

:::

Each district is drawn in the first language of the list and written in the rest, so the first is the one `startsWith` and the length range read. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> is not a list: it draws one language per district, the way every generator does. `unique` compares the districts themselves, so `Gruger Park` and `그루거 파크` are one. `startsWith` reads the district's own name, not a kind written in front of it: `Evelyn Bay` starts with `E`.

## Length {#length}

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole district, kind and all. When only a district with a kind, or only one without, can land inside the range, a kind left to chance is decided by the range, and a kind whose words leave no name room is passed over. A range nothing reaches is answered with the closest district there is.

## The detail output {#the-detail-output}

::: lang js

```javascript
randFictionalDistrict({
	language: ['en', 'ko', 'ja', 'zh', 'ru'],
	includeKind: true,
	output: 'detail'
});
// [{ place: 'Ashworth Row', name: 'Ashworth', kind: 'row', level: 'district', language: 'en',
//    forms: { en: 'Ashworth Row', ko: '애시워스 로', ja: 'アシュワース・ロウ',
//             zh: '阿什沃思街', ru: 'Эшворт-Роу' } }]
```

:::

::: lang dart

```dart
randFictionalDistrictDetails(language: {WordLanguage.en, WordLanguage.ko}, includeKind: true).first;
// FictionalPlaceDetail(Ashworth Row, Ashworth, row, district, en,
//   {en: Ashworth Row, ko: 애시워스 로})
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randFictionalDistrict`, except that `language` is a set: one language, or several for `forms` the way a list gives them in the other two packages.

:::

::: lang py

```python
rand_fictional_district(language=["en", "ko"], include_kind=True, output="detail")
# [FictionalPlaceDetail(place='Ashworth Row', name='Ashworth', kind='row', level='district',
#                       language='en', forms={'en': 'Ashworth Row', 'ko': '애시워스 로'})]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `place` | <Lang js="string" dart="String" py="str" code /> | The district in `language`, kind and all: what a call of one language returns. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The district's own name in `language`, without its kind. |
| `kind` | <Lang js="FictionalPlaceKind &#124; null" dart="FictionalPlaceKind?" py="FictionalPlaceKind &#124; None" code /> | The kind written beside the name, or <Lang js="null" dart="null" py="None" code /> for none. |
| `level` | `LocationLevel` | Always `district` here. |
| `language` | `WordLanguage` | The language `place` is written in: the one drawn, or the first of a list. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | The same district in every language the call asked for, in the order it asked for them: what a list returns. |

A made-up name can still match a real place somewhere; see the [disclaimer](../guide/disclaimer#coincidence).

## See also

- [`randFictionalCountry`](./rand-fictional-country), [`randFictionalRegion`](./rand-fictional-region) and [`randFictionalCity`](./rand-fictional-city) — the rest of the map.
- [`randFictionalName`](./rand-fictional-name) — the people who live there.
- [`randDistrict`](../location/rand-district) — the districts that do exist.
