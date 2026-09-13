# randRegion

나라의 첫 번째 행정구역을 돌려줍니다. 한국은 시·도, 미국은 주와 워싱턴 D.C.입니다. 크기와 상관없이 모두 같은 확률로 뽑힙니다.

`level`을 <Lang js="'region'" dart="LocationLevel.region" py="&quot;region&quot;" code />로 고정한 [`randLocation`](./rand-location)이며, 위치 전체가 아니라 구역 이름만 돌려줍니다.

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

상세 출력은 `randRegionDetails`입니다.

:::

::: lang py

```python
from randino import rand_region

rand_region(language="ko", count=3)  # ['세종특별자치시', '울산광역시', '강원특별자치도']
rand_region(language="en", count=3)  # ['Idaho', 'Georgia', 'Vermont']
```

:::

한국은 16개, 미국은 51개라서 <Lang js="unique: true" dart="unique: true" py="unique=True" code />에 더 큰 `count`를 주면 전부 한 번씩 돌려주고 멈춥니다.

## 옵션 {#options}

<LocationOptions />

## 함께 보기 {#see-also}

- [`randLocation`](./rand-location) — 위로는 나라, 아래로는 하위 구역까지 붙인 위치.
- [`randCity`](./rand-city) — 시·도 바로 아래 단계.
