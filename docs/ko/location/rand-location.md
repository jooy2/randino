# randLocation

실제 위치를 만들어 `count`개만큼 문자열로 돌려줍니다. 나라부터 지정한 단계까지를 그 언어가 주소를 쓰는 방식대로 이어 씁니다. 모든 행정구역은 그 나라가 직접 공개한 것이고, 나란히 적힌 상위 구역 안에 실제로 있습니다. [`output: 'detail'`](#the-detail-output)을 주면 단계마다 따로 알려 줍니다.

한국의 읍·면·동, 미국의 도시보다 아래로는 내려가지 않습니다. 도로명도 건물도 번지도 없으니, 결과는 장소일 뿐 누군가의 주소가 되지 않습니다.

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

## 옵션 {#options}

모든 옵션은 선택 사항이며, 기본값은 위의 인자 없는 호출이 사용하는 값입니다.

<LocationOptions level />

`level`을 뺀 같은 표가 아래 네 단계 함수에도 들어 있습니다. `realism`은 없습니다. 위치는 실제 장소이거나 위치가 아니거나 둘 중 하나라서, 지어낼 것이 없습니다.

Dart에는 `output`이 없습니다. 거기서는 [상세 출력](#the-detail-output)이 `randLocationDetails`입니다.

## 언어와 나라 {#languages}

언어마다 그 나라의 장소를, 그 나라가 주소를 쓰는 순서대로 씁니다. 한국어는 나라부터 내려가고, 영어는 도시부터 올라갑니다.

| 코드 | 나라          | 단계                        |
| ---- | ------------- | --------------------------- |
| `ko` | 대한민국      | 시·도 → 시·군·구 → 읍·면·동 |
| `en` | United States | 주 → 도시                   |

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

패키지가 지원하는 나머지 일곱 언어에는 국가 아래 단계의 위치가 없습니다. 다만 [`randCountry`](./rand-country)는 9개 언어 모두로 모든 국가 이름을 씁니다. 행정구역은 조건 없이 공개하는 나라만 넣기 때문입니다. 이 패키지를 쓰는 사람이 출처 표기를 떠안지 않아야 하고, 목록에 분쟁 지역이 없어야 합니다. 지금은 이 두 나라만 그렇습니다. 지원 여부는 [지원 언어](../guide/languages#locations)에 정리해 두었습니다.

## 어디까지 쓸지 {#level}

`level`은 위치가 멈추는 단계입니다. `country`, `region`, `city`, `district` 중 하나이고 기본값은 `district`입니다. 그 단계가 없는 나라는 가진 단계 중 가장 낮은 곳에서 멈추므로, 영어 위치는 도시보다 길어지지 않습니다.

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

어떤 단계에 구역이 없는 곳은 그 위에서 멈춥니다. 세종특별자치시에는 시·군·구가 없어서 `level: 'city'`에서는 `대한민국 세종특별자치시`로 나오고, `district`에서는 읍·면·동이 시 이름 바로 뒤에 붙습니다.

멈추는 단계의 구역은 모두 같은 확률로 뽑힙니다. 한국 위치라면 인구와 상관없이 약 5천 개 읍·면·동 가운데 하나를 고르게 고릅니다.

## 길이와 첫 글자 {#length}

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 나라 이름과 구분자까지 포함한 문자열 전체의 길이를 재며, 최대 <Lang js="RAND_LOCATION_LENGTH_MAX" dart="randLocationLengthMax" py="RAND_LOCATION_LENGTH_MAX" code />(100)까지입니다. 맞는 위치가 없으면 빈 결과 대신 가장 가까운 길이의 위치로 답합니다.

<Lang js="startsWith" dart="startsWith" py="starts_with" code />는 문자열의 첫 글자와 비교합니다. 한국어 위치는 늘 나라 이름의 `대`로 시작하니, 이 옵션은 네 단계 함수에서 더 쓸모가 있습니다.

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

## 단계마다 함수가 하나씩 {#levels}

단계마다 함수가 따로 있고, 위치 전체가 아니라 이름 하나만 돌려줍니다. 그중 [`randCountry`](./rand-country)만은 그 언어의 나라를 넘어, 전 세계 249개 국가와 지역의 이름을 모든 단어 언어로 씁니다.

[`randCountry`](./rand-country) · [`randRegion`](./rand-region) · [`randCity`](./rand-city) · [`randDistrict`](./rand-district)

## 상세 출력 {#the-detail-output}

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

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다.

:::

::: lang py

```python
rand_location(language="ko", output="detail")
# [LocationDetail(location='대한민국 전남광주통합특별시 서구 양동', language='ko', level='district',
#                 country='대한민국', region='전남광주통합특별시', city='서구', district='양동')]
```

:::

`level`은 결과가 닿은 가장 낮은 단계입니다. 영어 위치는 모두 `city`이고, `level: 'city'`로 뽑은 세종특별자치시는 `region`입니다. 결과에 없는 단계는 `null`이라서, 세종특별자치시의 `city`는 언제나 `null`입니다.

## 데이터 출처 {#data}

| 코드 | 공개 기관                                                                 | 기준       |
| ---- | ------------------------------------------------------------------------- | ---------- |
| `ko` | 국토교통부, 전국 법정동 (공공데이터포털 15063424), 이용허락범위 제한 없음 | 2026-07-29 |
| `en` | U.S. Census Bureau, 2026 Gazetteer places, 미국 연방정부 저작물           | 2026       |

위치 맨 앞의 나라 이름은 [`randCountry`](./rand-country)와 같은 표에서 가져옵니다. 목록은 tz 데이터베이스에 실린 ISO 3166-1(퍼블릭 도메인)이고, 이름은 Wikidata(CC0)입니다.

한국의 읍·면·동은 주민센터가 맡는 행정동이 아니라 주소에 쓰는 법정동입니다. 일반구가 있는 시는 구와 함께 씁니다(`수원시 장안구`). 미국의 도시는 50개 주와 워싱턴 D.C.에 있는 모든 법인 도시와 인구조사 지정 지역(CDP)이며, 법적 명칭 표기를 뗀 이름으로 씁니다(`Pasadena city`가 아니라 `Pasadena`). 푸에르토리코와 그 밖의 속령은 주가 아니므로 넣지 않았습니다.

행정구역은 바뀝니다. 2026년 7월 1일에는 광주광역시와 전라남도가 전남광주통합특별시가 됐습니다. 각 릴리스에는 빌드한 시점의 목록이 들어 있습니다.

## 함께 보기 {#see-also}

- [`randCity`](./rand-city) — 위치 전체 대신 구역 이름 하나.
- [지원 언어](../guide/languages#locations) — 위치를 지원하는 언어와, 나머지를 지원하지 않는 이유.
- [상수](../reference/constants) — `LOCATION_LANGUAGES`, `LOCATION_LEVELS`, 길이 상한.
