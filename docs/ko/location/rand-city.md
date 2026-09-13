# randCity

시·도를 이루는 행정구역을 돌려줍니다. 한국은 시·군·구, 미국은 city, town, village, 인구조사 지정 지역(CDP)입니다.

`level`을 <Lang js="'city'" dart="LocationLevel.city" py="&quot;city&quot;" code />로 고정한 [`randLocation`](./rand-location)이며, 위치 전체가 아니라 구역 이름만 돌려줍니다.

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

상세 출력은 `randCityDetails`입니다.

:::

::: lang py

```python
from randino import rand_city

rand_city(language="ko", count=3)  # ['함안군', '영덕군', '여수시']
rand_city(language="en", count=3)  # ['Donora', 'Blue Ridge', 'Chesilhurst']
```

:::

자치구가 아니라 시에 딸린 일반구는 주소에 쓰듯 시와 함께 씁니다. `장안구`가 아니라 `수원시 장안구`입니다. 세종특별자치시에는 시·군·구가 없어서 여기서는 나오지 않습니다.

같은 이름이 다른 시·도에서 여러 번 나올 수 있습니다. 한국에는 `중구`가 다섯 곳에 있고, 미국은 28개 주에 `Franklin`이 있습니다. `unique`는 장소가 아니라 이름을 비교합니다. 어느 시·도의 구역인지는 상세 출력에 나옵니다.

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

## 옵션 {#options}

<LocationOptions />

## 함께 보기 {#see-also}

- [`randLocation`](./rand-location) — 시·도와 나라를 앞에 붙인 위치.
- [`randDistrict`](./rand-district) — 시·군·구 바로 아래 단계. 한국에만 있습니다.
