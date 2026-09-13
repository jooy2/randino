# randCountry

그 언어의 위치가 속한 나라를, 그 언어가 제 나라를 부르는 이름으로 돌려줍니다. 언어마다 하나뿐이라 여러 나라가 나오게 하려면 `language: 'all'`을 써야 하고, [`randLocation`](./rand-location)이 쓰는 모든 위치의 맨 앞이 이 이름입니다.

::: lang js

```javascript
import { randCountry } from 'randino';

randCountry({ language: 'ko' }); // ['대한민국']
randCountry({ count: 3 }); // ['대한민국', '대한민국', 'United States']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randCountry(language: LocationLanguage.ko); // [대한민국]
randCountry(count: 3); // [대한민국, 대한민국, United States]
```

상세 출력은 `randCountryDetails`입니다.

:::

::: lang py

```python
from randino import rand_country

rand_country(language="ko")  # ['대한민국']
rand_country(count=3)  # ['대한민국', '대한민국', 'United States']
```

:::

세계 여러 나라의 목록은 아닙니다. 그런 목록은 어느 지역을 나라로 칠지 정하는 일이고, 무작위 데이터 라이브러리가 답할 문제가 아닙니다.

## 옵션 {#options}

<LocationOptions />

## 함께 보기 {#see-also}

- [`randLocation`](./rand-location) — 나라와 그 아래 모든 단계.
- [`randRegion`](./rand-region) — 나라 바로 아래 단계.
