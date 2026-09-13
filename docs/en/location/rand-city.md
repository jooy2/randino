# randCity

The divisions a region is made of: a Korean 시·군·구, or a US city, town, village or census designated place.

[`randLocation`](./rand-location) with `level` fixed to <Lang js="'city'" dart="LocationLevel.city" py="&quot;city&quot;" code />, handing back the division's name alone rather than the whole location.

::: lang js

```javascript
import { randCity } from 'randino';

randCity({ language: 'ko', count: 3 }); // ['함안군', '영덕군', '여수시']
randCity({ language: 'en', count: 3 }); // ['Donora', 'Blue Ridge', 'Chesilhurst']
randCity({ language: 'ko', output: 'detail' });
// [{ location: '중랑구', language: 'ko', level: 'city',
//    country: '대한민국', region: '서울특별시', city: '중랑구', district: null }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randCity(language: LocationLanguage.ko, count: 3); // [함안군, 영덕군, 여수시]
randCity(language: LocationLanguage.en, count: 3); // [Donora, Blue Ridge, Chesilhurst]
```

The detail form is `randCityDetails`.

:::

::: lang py

```python
from randino import rand_city

rand_city(language="ko", count=3)  # ['함안군', '영덕군', '여수시']
rand_city(language="en", count=3)  # ['Donora', 'Blue Ridge', 'Chesilhurst']
```

:::

A Korean 구 that is one of a city's districts rather than a local government of its own is written with its city, the way an address writes it: `수원시 장안구`, not `장안구`. 세종특별자치시 has no 시·군·구 at all, so it never comes back from here.

The same name can come back from different regions — Korea has a `중구` in five of them and twenty-eight US states have a `Franklin` — and `unique` compares the names, not the places. The detail output says which region each one is in.

::: lang js

```javascript
randCity({ language: 'ko', startsWith: '수', count: 3 }); // ['수영구', '수성구', '수원시 장안구']
randCity({ language: 'en', maxLength: 5, count: 3 }); // ['Loco', 'Bruin', 'Keota']
```

:::

::: lang dart

```dart
randCity(language: LocationLanguage.ko, startsWith: '수', count: 3); // [수영구, 수성구, 수원시 장안구]
```

:::

::: lang py

```python
rand_city(language="ko", starts_with="수", count=3)  # ['수영구', '수성구', '수원시 장안구']
```

:::

## Options

<LocationOptions />

## See also

- [`randLocation`](./rand-location) — the city with the region and country above it.
- [`randDistrict`](./rand-district) — the level below the city, which only Korea has.
