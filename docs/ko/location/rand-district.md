# randDistrict

시·군·구 안의 행정구역인 읍·면·동을 돌려줍니다. 주민센터가 맡는 행정동이 아니라 주소에 쓰는 법정동이며, 읍·면 아래의 리는 넣지 않았습니다.

`level`을 <Lang js="'district'" dart="LocationLevel.district" py="&quot;district&quot;" code />로 고정한 [`randLocation`](./rand-location)이며, 위치 전체가 아니라 구역 이름만 돌려줍니다.

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

상세 출력은 `randDistrictDetails`입니다.

:::

::: lang py

```python
from randino import rand_district

rand_district(language="ko", count=3)  # ['가현동', '겸면', '행주외동']
```

:::

이 단계는 한국 위치에만 있습니다. 영어로 요청하면 빈 결과가 돌아오고, `language`를 생략하면 구역이 없는 나라에 뽑기를 낭비하지 않고 한국어로만 뽑습니다.

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

## 옵션 {#options}

<LocationOptions />

## 함께 보기 {#see-also}

- [`randLocation`](./rand-location) — 읍·면·동 위의 모든 단계를 붙인 위치.
- [`randCity`](./rand-city) — 읍·면·동 바로 위 단계.
