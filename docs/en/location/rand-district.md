# randDistrict

The divisions inside a city: a Korean 읍·면·동. It is the legal 동 an address is written with rather than the administrative 동 a community centre serves, and never the 리 below a 읍 or 면.

[`randLocation`](./rand-location) with `level` fixed to <Lang js="'district'" dart="LocationLevel.district" py="&quot;district&quot;" code />, handing back the division's name alone rather than the whole location.

::: lang js

```javascript
import { randDistrict } from 'randino';

randDistrict({ language: 'ko', count: 3 }); // ['가현동', '겸면', '행주외동']
randDistrict({ startsWith: '역', count: 3 }); // ['역북동', '역동', '역곡동']
randDistrict({ output: 'detail' });
// [{ location: '차황면', language: 'ko', level: 'district',
//    country: '대한민국', region: '경상남도', city: '산청군', district: '차황면' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randDistrict(language: LocationLanguage.ko, count: 3); // [가현동, 겸면, 행주외동]
```

The detail form is `randDistrictDetails`.

:::

::: lang py

```python
from randino import rand_district

rand_district(language="ko", count=3)  # ['가현동', '겸면', '행주외동']
```

:::

Only Korean locations have this level. Asking for English returns nothing, and leaving `language` out draws Korean rather than spending half the draws on a country that has no districts.

::: lang js

```javascript
randDistrict({ language: 'en' }); // []
```

:::

::: lang dart

```dart
randDistrict(language: LocationLanguage.en); // []
```

:::

::: lang py

```python
rand_district(language="en")  # []
```

:::

<Lang js="short: true" dart="short: true" py="short=True" code /> writes each one without its kind, the way [`randLocation`](./rand-location#short) does: `가현동` is `가현` and `행주외동` is `행주외`, while `겸면`, which would be left one character long, stays `겸면`. The detail's `district` stays the published name.

::: lang js

```javascript
randDistrict({ language: 'ko', short: true, count: 3 }); // ['가현', '겸면', '행주외']
```

:::

::: lang dart

```dart
randDistrict(language: LocationLanguage.ko, short: true, count: 3); // [가현, 겸면, 행주외]
```

:::

::: lang py

```python
rand_district(language="ko", short=True, count=3)  # ['가현', '겸면', '행주외']
```

:::

## Options

<LocationOptions />

## See also

- [`randLocation`](./rand-location) — the district with every level above it.
- [`randCity`](./rand-city) — the level above the district.
