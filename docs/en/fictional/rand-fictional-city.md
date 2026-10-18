# randFictionalCity

Generates the names of cities and towns that do not exist, for the map of a story or a game, and returns `count` of them as strings. A city may carry the kind of place it is beside its name — `Port Ravenford`, `Ashwick` on its own — and its name is spelled in Latin letters first and written by its sound in every other language. Given a [list of languages](#several-languages), it returns each city in every one of them, keyed by language, and [`output: 'detail'`](#the-detail-output) reports what each was built from.

::: lang js

```javascript
import { randFictionalCity } from 'randino';

randFictionalCity({ language: 'en', count: 3 }); // ['Ashwick', 'Port Ravenford', 'Hollowbrook Falls']
randFictionalCity({ language: 'ko', count: 3 }); // ['애시윅', '포트 레이븐퍼드', '할로브룩 폴스']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalCity(language: WordLanguage.en, count: 3);
// [Ashwick, Port Ravenford, Hollowbrook Falls]
randFictionalCity(language: WordLanguage.ko, count: 3); // [애시윅, 포트 레이븐퍼드, 할로브룩 폴스]
```

:::

::: lang py

```python
from randino import rand_fictional_city

rand_fictional_city(language="en", count=3)  # ['Ashwick', 'Port Ravenford', 'Hollowbrook Falls']
rand_fictional_city(language="ko", count=3)  # ['애시윅', '포트 레이븐퍼드', '할로브룩 폴스']
```

:::

## Options

<FictionalPlaceOptions />

## Names {#names}

A city's name is built the way English names its towns, `Ashwick`, `Hollowbrook`, `Mapleford`, out of about 120 the data holds. `realism: 'invented'` joins two English halves instead, a front such as `Raven`, `Silver` or `Briar` and a back such as `ford`, `haven` or `wick`, and there are some two thousand of those. `mixed` decides per city.

A name built this way can match a small real town somewhere, the way English town names repeat. It never matches a famous one or a place a well-known game, film or book made up: `Hollywood`, `Kingston` and `Riverwood` are what two of the halves would spell, and they are kept out.

## Kinds {#kinds}

<Lang js="includeKind" dart="includeKind" py="include_kind" code /> writes the kind of place beside the name. Left out, it is written for about two cities in five.

| Kind       | English            | Korean            | Korean, translated |
| ---------- | ------------------ | ----------------- | ------------------ |
| `city`     | `Ashwick City`     | `애시윅 시티`     | `애시윅시`         |
| `town`     | `Ashwick Town`     | `애시윅 타운`     | `애시윅 마을`      |
| `port`     | `Port Ashwick`     | `포트 애시윅`     | `애시윅항`         |
| `harbor`   | `Ashwick Harbor`   | `애시윅 하버`     | `애시윅 항구`      |
| `falls`    | `Ashwick Falls`    | `애시윅 폴스`     | `애시윅 폭포`      |
| `crossing` | `Ashwick Crossing` | `애시윅 크로싱`   | `애시윅 나루`      |
| `bridge`   | `Ashwick Bridge`   | `애시윅 브리지`   | `애시윅교`         |
| `springs`  | `Ashwick Springs`  | `애시윅 스프링스` | `애시윅 온천`      |
| `landing`  | `Ashwick Landing`  | `애시윅 랜딩`     | `애시윅 선착장`    |
| `village`  | `Ashwick Village`  | `애시윅 빌리지`   | `애시윅 마을`      |

A kind the name already says is not written beside it: `Galeport` is never `Port Galeport`.

## How a kind is written {#kind-style}

A kind is written in each language's own words, and some languages write a foreign place's kind two ways: by the English word in its own script (`애시윅 스프링스`, `アッシュウィック・スプリングス`, `Эшуик-Спрингс`) or by its own word (`애시윅 온천`, `アッシュウィック温泉`, `Источники Эшуик`). Left to itself, a language keeps the English word for a city's kind, the way `Central Park` and `Pearl Harbor` keep theirs, and the languages written in Latin letters write it as it is: `Ashwick Springs`. <Lang js="kindStyle" dart="kindStyle" py="kind_style" code /> decides it instead:

- <Lang js="'borrowed'" dart="FictionalKindStyle.borrowed" py="&quot;borrowed&quot;" code /> writes the English word, which is what a city gets anyway.
- <Lang js="'translated'" dart="FictionalKindStyle.translated" py="&quot;translated&quot;" code /> writes the language's own word: `애시윅 온천`, `Manantiales de Ashwick`, `Bad Ashwick`.

A kind with no word of a language's own is written the same both ways, and Chinese translates every kind, because it never writes one by its sound: `阿什威克泉`.

## Several languages at once {#several-languages}

A game or a book shows the same map to every player in the player's own language, so `language` also takes a list, and a list returns every city in every language of it, keyed by code in the order you gave:

::: lang js

```javascript
randFictionalCity({ language: ['ko', 'en', 'ru'], includeKind: true });
// [{ ko: '애시윅 스프링스', en: 'Ashwick Springs', ru: 'Эшуик-Спрингс' }]
```

:::

::: lang dart

```dart
randFictionalCityForms({WordLanguage.ko, WordLanguage.en, WordLanguage.ru}, includeKind: true);
// [{WordLanguage.ko: 애시윅 스프링스, WordLanguage.en: Ashwick Springs, WordLanguage.ru: Эшуик-Спрингс}]
```

Dart cannot change a return type by argument, so the list is a function of its own, `randFictionalCityForms`, which takes the languages first and the same named parameters as `randFictionalCity` after them. A set keeps the order it was written in, and that is the order of each map.

:::

::: lang py

```python
rand_fictional_city(language=["ko", "en", "ru"], include_kind=True)
# [{'ko': '애시윅 스프링스', 'en': 'Ashwick Springs', 'ru': 'Эшуик-Спрингс'}]
```

:::

Each city is drawn in the first language of the list and written in the rest, so the first is the one `startsWith` and the length range read. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> is not a list: it draws one language per city, the way every generator does. `unique` compares the cities themselves, so `Port Ravenford` and `포트 레이븐퍼드` are one. `startsWith` reads the city's own name, not a kind written in front of it: `Port Ravenford` starts with `R`.

## Length {#length}

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole city, kind and all. When only a city with a kind, or only one without, can land inside the range, a kind left to chance is decided by the range, and a kind whose words leave no name room is passed over. A range nothing reaches is answered with the closest city there is.

## The detail output {#the-detail-output}

::: lang js

```javascript
randFictionalCity({
	language: ['en', 'ko', 'ja', 'zh', 'ru'],
	includeKind: true,
	output: 'detail'
});
// [{ place: 'Penhallow Village', name: 'Penhallow', kind: 'village', level: 'city', language: 'en',
//    forms: { en: 'Penhallow Village', ko: '펜할로 빌리지', ja: 'ペンハロウ・ヴィレッジ',
//             zh: '彭哈洛村', ru: 'Пенхэллоу-Виллидж' } }]
```

:::

::: lang dart

```dart
randFictionalCityDetails(language: {WordLanguage.en, WordLanguage.ko}, includeKind: true).first;
// FictionalPlaceDetail(Penhallow Village, Penhallow, village, city, en,
//   {en: Penhallow Village, ko: 펜할로 빌리지})
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randFictionalCity`, except that `language` is a set: one language, or several for `forms` the way a list gives them in the other two packages.

:::

::: lang py

```python
rand_fictional_city(language=["en", "ko"], include_kind=True, output="detail")
# [FictionalPlaceDetail(place='Penhallow Village', name='Penhallow', kind='village', level='city',
#                       language='en', forms={'en': 'Penhallow Village', 'ko': '펜할로 빌리지'})]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `place` | <Lang js="string" dart="String" py="str" code /> | The city in `language`, kind and all: what a call of one language returns. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The city's own name in `language`, without its kind. |
| `kind` | <Lang js="FictionalPlaceKind &#124; null" dart="FictionalPlaceKind?" py="FictionalPlaceKind &#124; None" code /> | The kind written beside the name, or <Lang js="null" dart="null" py="None" code /> for none. |
| `level` | `LocationLevel` | Always `city` here. |
| `language` | `WordLanguage` | The language `place` is written in: the one drawn, or the first of a list. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | The same city in every language the call asked for, in the order it asked for them: what a list returns. |

A made-up name can still match a real place somewhere; see the [disclaimer](../guide/disclaimer#coincidence).

## See also

- [`randFictionalCountry`](./rand-fictional-country), [`randFictionalRegion`](./rand-fictional-region) and [`randFictionalDistrict`](./rand-fictional-district) — the rest of the map.
- [`randFictionalName`](./rand-fictional-name) — the people who live there.
- [`randCity`](../location/rand-city) — the cities that do exist.
