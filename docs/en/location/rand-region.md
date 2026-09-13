# randRegion

A country's first-level divisions: a Korean 시·도, or a US state or the District of Columbia. Each is drawn as often as any other, whatever its size.

[`randLocation`](./rand-location) with `level` fixed to <Lang js="'region'" dart="LocationLevel.region" py="&quot;region&quot;" code />, handing back the division's name alone rather than the whole location.

::: lang js

```javascript
import { randRegion } from 'randino';

randRegion({ language: 'ko', count: 3 }); // ['세종특별자치시', '울산광역시', '강원특별자치도']
randRegion({ language: 'en', count: 3 }); // ['Idaho', 'Georgia', 'Vermont']
randRegion({ language: 'en', output: 'detail' });
// [{ location: 'Arkansas', language: 'en', level: 'region',
//    country: 'United States', region: 'Arkansas', city: null, district: null }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randRegion(language: LocationLanguage.ko, count: 3); // [세종특별자치시, 울산광역시, 강원특별자치도]
randRegion(language: LocationLanguage.en, count: 3); // [Idaho, Georgia, Vermont]
```

The detail form is `randRegionDetails`.

:::

::: lang py

```python
from randino import rand_region

rand_region(language="ko", count=3)  # ['세종특별자치시', '울산광역시', '강원특별자치도']
rand_region(language="en", count=3)  # ['Idaho', 'Georgia', 'Vermont']
```

:::

Korea has sixteen of them and the United States fifty-one, so <Lang js="unique: true" dart="unique: true" py="unique=True" code /> with a larger `count` returns every one and stops there.

## Options

<LocationOptions />

## See also

- [`randLocation`](./rand-location) — the region with the country above it and the divisions below.
- [`randCity`](./rand-city) — the level below the region.
