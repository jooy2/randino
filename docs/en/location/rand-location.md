# randLocation

Generates real locations and returns `count` of them as strings, each written out from the country down to the level you ask for, the way its language writes a location. Every division is one the country itself publishes, and each one sits inside the division written beside it. With [`output: 'detail'`](#the-detail-output) it reports every level on its own.

Nothing goes below a Korean 읍·면·동 or a US city. There is no street, no building and no number, so a result is a place and never somebody's address.

::: lang js

```javascript
import { randLocation } from 'randino';

randLocation();
// ['Tull, Arkansas, United States']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randLocation();
// [Tull, Arkansas, United States]
```

:::

::: lang py

```python
from randino import rand_location

rand_location()
# ['Tull, Arkansas, United States']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

<LocationOptions level />

The same table, minus `level` and `includeCountry`, is on each of the four level functions below. There is no `realism`: a location is a real place or it is not a location, so there is nothing to invent.

Dart has no `output`; [the detail output](#the-detail-output) is `randLocationDetails` there.

## Languages and countries {#languages}

A language writes the places of its own country, in the order that country writes an address: Korean from the country down, English from the city up.

| Code | Country       | Levels                      |
| ---- | ------------- | --------------------------- |
| `ko` | 대한민국      | 시·도 → 시·군·구 → 읍·면·동 |
| `en` | United States | state → city                |

::: lang js

```javascript
randLocation({ language: 'ko', count: 3 });
// ['대한민국 경기도 양평군 단월면', '대한민국 충청남도 공주시 월송동', '대한민국 충청북도 청주시 서원구 미평동']

randLocation({ language: 'en', count: 3 });
// ['Diamond Springs, California, United States', 'Gig Harbor, Washington, United States', 'Pisgah, Alabama, United States']
```

:::

::: lang dart

```dart
randLocation(language: LocationLanguage.ko, count: 3);
// [대한민국 경기도 양평군 단월면, 대한민국 충청남도 공주시 월송동, 대한민국 충청북도 청주시 서원구 미평동]
```

:::

::: lang py

```python
rand_location(language="ko", count=3)
# ['대한민국 경기도 양평군 단월면', '대한민국 충청남도 공주시 월송동', '대한민국 충청북도 청주시 서원구 미평동']
```

:::

The other seven languages the package writes have no locations below the country, though [`randCountry`](./rand-country) names every country in all nine. A country qualifies when it publishes its divisions free of conditions — no attribution a user of this package would have to carry, and no disputed territory in the list — and so far only these two do. [Supported languages](../guide/languages#locations) keeps the checklist.

## How far down {#level}

`level` is where the location stops: `country`, `region`, `city` or `district`, which is the default. A country without the level stops at the deepest one it has, so an English location is never longer than its city.

::: lang js

```javascript
randLocation({ language: 'ko', level: 'city', count: 2 });
// ['대한민국 대전광역시 대덕구', '대한민국 서울특별시 서대문구']

randLocation({ language: 'en', level: 'region', count: 2 });
// ['Maryland, United States', 'Michigan, United States']
```

:::

::: lang dart

```dart
randLocation(language: LocationLanguage.ko, level: LocationLevel.city, count: 2);
// [대한민국 대전광역시 대덕구, 대한민국 서울특별시 서대문구]
```

:::

::: lang py

```python
rand_location(language="ko", level="city", count=2)
# ['대한민국 대전광역시 대덕구', '대한민국 서울특별시 서대문구']
```

:::

A branch that has no division at a level stops above it. 세종특별자치시 has no 시·군·구, so at `level: 'city'` it comes back as `대한민국 세종특별자치시`, and at `district` its 읍·면·동 follow the region directly.

Every division is drawn as often as any other at the level the location stops at, so a Korean location is one of some five thousand 읍·면·동 picked evenly, whatever the population behind it.

## Without the country {#include-country}

A location opens on its country, which says something when `language` is left to mix and nothing once it is fixed. <Lang js="includeCountry: false" dart="includeCountry: false" py="include_country=False" code /> leaves it out of the string; the detail still reports `country`.

::: lang js

```javascript
randLocation({ language: 'ko', includeCountry: false, count: 2 });
// ['경기도 양평군 단월면', '충청남도 공주시 월송동']

randLocation({ language: 'en', includeCountry: false, count: 2 });
// ['Diamond Springs, California', 'Gig Harbor, Washington']
```

:::

::: lang dart

```dart
randLocation(language: LocationLanguage.ko, includeCountry: false, count: 2);
// [경기도 양평군 단월면, 충청남도 공주시 월송동]
```

:::

::: lang py

```python
rand_location(language="ko", include_country=False, count=2)
# ['경기도 양평군 단월면', '충청남도 공주시 월송동']
```

:::

A location at `level: 'country'` is the country and nothing else, so it is written either way.

## Length and first character {#length}

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> measure the whole string, country and separators included, up to <Lang js="RAND_LOCATION_LENGTH_MAX" dart="randLocationLengthMax" py="RAND_LOCATION_LENGTH_MAX" code /> (100). A range nothing fits is answered with the locations closest to it rather than with none.

<Lang js="startsWith" dart="startsWith" py="starts_with" code /> matches the first character of the string, which for Korean is the `대` of the country unless the country is left out: with <Lang js="includeCountry: false" dart="includeCountry: false" py="include_country=False" code />, `startsWith: '서'` draws from 서울특별시. The length options measure the string as it is written, with or without the country.

::: lang js

```javascript
randLocation({ language: 'ko', maxLength: 14, count: 3 });
// ['대한민국 경기도 광주시 역동', '대한민국 경기도 시흥시 포동', '대한민국 경기도 광주시 삼동']

randLocation({ language: 'en', startsWith: 'S', count: 2 });
// ['Sun City, Kansas, United States', 'Smithton, Pennsylvania, United States']
```

:::

::: lang dart

```dart
randLocation(language: LocationLanguage.ko, maxLength: 14, count: 3);
// [대한민국 경기도 광주시 역동, 대한민국 경기도 시흥시 포동, 대한민국 경기도 광주시 삼동]
```

:::

::: lang py

```python
rand_location(language="ko", max_length=14, count=3)
# ['대한민국 경기도 광주시 역동', '대한민국 경기도 시흥시 포동', '대한민국 경기도 광주시 삼동']
```

:::

## One function per level {#levels}

Each level has a function of its own, which hands back one name rather than the whole location. [`randCountry`](./rand-country) is the one that reaches past the language's own country: it names any of the world's 249 countries and territories, in any word language.

[`randCountry`](./rand-country) · [`randRegion`](./rand-region) · [`randCity`](./rand-city) · [`randDistrict`](./rand-district)

## The detail output {#the-detail-output}

::: lang js

```javascript
randLocation({ language: 'ko', output: 'detail' });
// [{ location: '대한민국 전남광주통합특별시 서구 양동', language: 'ko', level: 'district',
//    country: '대한민국', region: '전남광주통합특별시', city: '서구', district: '양동' }]
```

:::

::: lang dart

```dart
final detail = randLocationDetails(language: LocationLanguage.ko).first;

detail.city; // 서구
```

Dart has neither overloads nor union types, so the detail form is its own function.

:::

::: lang py

```python
rand_location(language="ko", output="detail")
# [LocationDetail(location='대한민국 전남광주통합특별시 서구 양동', language='ko', level='district',
#                 country='대한민국', region='전남광주통합특별시', city='서구', district='양동')]
```

:::

`level` is the deepest level the result names: `city` for every English location, and `region` for 세종특별자치시 at `level: 'city'`. A level the result does not name is `null`, which is why 세종특별자치시's `city` always is.

## Where the data comes from {#data}

| Code | Published by                                                              | As of      |
| ---- | ------------------------------------------------------------------------- | ---------- |
| `ko` | 국토교통부, 전국 법정동 (공공데이터포털 15063424), 이용허락범위 제한 없음 | 2026-07-29 |
| `en` | U.S. Census Bureau, 2026 Gazetteer places, a U.S. Government work         | 2026       |

The country a location opens on is the name [`randCountry`](./rand-country) gives it, from the same table: ISO 3166-1 as the tz database lists it (public domain), named by Wikidata (CC0).

A Korean district is the legal 동 an address is written with, not the administrative 동 a community centre serves, and a 시 with 일반구 is written with its 구 (`수원시 장안구`). A US city is every incorporated place and census designated place in the fifty states and the District of Columbia, named without its legal description (`Pasadena`, not `Pasadena city`). Puerto Rico and the Island Areas are not among the states.

The divisions change: 광주광역시 and 전라남도 became 전남광주통합특별시 on 2026-07-01. A release carries the lists as they stood when it was built.

## See also

- [`randCity`](./rand-city) — one division's name rather than the whole location.
- [Supported languages](../guide/languages#locations) — which languages have locations, and why the rest do not.
- [Constants](../reference/constants) — `LOCATION_LANGUAGES`, `LOCATION_LEVELS` and the length bound.
