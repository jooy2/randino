# randCountry

국가 이름을 만들어 `count`개만큼 문자열로 돌려줍니다. ISO 3166-1이 코드를 준 국가와 지역 249곳을 그 언어가 부르는 이름으로 씁니다. [`output: 'detail'`](#the-detail-output)을 주면 각 국가의 코드도 알려 줍니다.

모든 단어 언어에 모든 국가의 이름이 있으므로 9개 언어를 모두 받습니다. [`randLocation`](./rand-location)과 나머지 단계 함수는 행정구역을 공개한 나라의 언어만 씁니다.

::: lang js

```javascript
import { randCountry } from 'randino';

randCountry({ language: 'ko', count: 3 }); // ['아르헨티나', '방글라데시', '세인트키츠 네비스']
randCountry({ language: 'en', count: 2 }); // ['Gibraltar', 'Burkina Faso']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randCountry(language: WordLanguage.ko, count: 3); // [아르헨티나, 방글라데시, 세인트키츠 네비스]
randCountry(language: WordLanguage.en, count: 2); // [Gibraltar, Burkina Faso]
```

:::

::: lang py

```python
from randino import rand_country

rand_country(language="ko", count=3)  # ['아르헨티나', '방글라데시', '세인트키츠 네비스']
rand_country(language="en", count=2)  # ['Gibraltar', 'Burkina Faso']
```

:::

## 옵션 {#options}

<LocationOptions country />

## 어떤 국가가 들어 있나 {#which-countries}

목록은 tz 데이터베이스에 실린 ISO 3166-1입니다. 주권 국가와 함께 그린란드, 홍콩, 남극처럼 ISO가 따로 코드를 준 지역도 들어 있습니다. `XK`처럼 ISO가 예약만 해 둔 코드는 없습니다. 국가 목록은 어떤 것이든 몇몇 지역에 대한 입장을 담게 되는데, 이미 모든 국가 선택 목록이 쓰는 표준을 따르면 새로운 입장을 정하지 않고도 설명할 수 있습니다.

이름은 언어별 Wikidata 레이블입니다. 그 언어의 백과사전이 쓰는 이름이라서, 그 백과사전처럼 흔히 부르는 이름과 공식 이름이 섞여 있습니다. `대한민국` 옆에 `미국`이 있고, 러시아어로는 `США`입니다. 문장 중간에 쓰듯 소문자로 시작하는 이름은 대문자로 시작하게 바꿨고, 레이블이 없는 유일한 경우인 베트남어·스페인어·이탈리아어·독일어의 저지섬은 그 언어들이 쓰는 대로 `Jersey`로 적었습니다.

모든 국가는 같은 확률로 뽑힙니다. `unique`는 이름을 비교하므로, `language: 'all'`에 `unique`를 주면 서로 다른 이름에서 멈춥니다. 여러 언어가 똑같이 쓰는 `Andorra`는 한 번만 셉니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randCountry({ language: 'ja', output: 'detail' });
// [{ country: 'サウジアラビア', code: 'SA', language: 'ja' }]
```

:::

::: lang dart

```dart
randCountryDetails(language: WordLanguage.ja).first.code; // SA
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다.

:::

::: lang py

```python
rand_country(language="ja", output="detail")
# [CountryDetail(country='サウジアラビア', code='SA', language='ja')]
```

:::

`code`는 ISO 3166-1의 두 글자 코드이며, 이름을 어느 언어로 쓰든 같습니다.

## 함께 보기 {#see-also}

- [`randLocation`](./rand-location) — 그 언어의 나라 안에 있는 장소와, 맨 앞의 나라 이름.
- [`randRegion`](./rand-region) — 국가 바로 아래 단계.
