# randFictionalDistrict

존재하지 않는 구역, 곧 이야기가 오가는 도시 안의 동네 이름을 만들어 `count`개만큼 문자열로 돌려줍니다. 구역은 대개 이름 옆에 장소의 종류가 붙고(`Gruger Park`, `Evelyn Bay`), 이름은 라틴 문자로 먼저 정해진 뒤 다른 언어에서는 소리대로 적습니다. [`output: 'detail'`](#the-detail-output)을 주면 요청한 모든 언어로 같은 구역을 적어 줍니다.

::: lang js

```javascript
import { randFictionalDistrict } from 'randino';

randFictionalDistrict({ language: 'en', count: 3 }); // ['Gruger Park', 'Evelyn Bay', 'Hadley']
randFictionalDistrict({ language: 'ko', count: 3 }); // ['그루거 파크', '이블린 베이', '해들리']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalDistrict(language: {WordLanguage.en}, count: 3); // [Gruger Park, Evelyn Bay, Hadley]
randFictionalDistrict(language: {WordLanguage.ko}, count: 3); // [그루거 파크, 이블린 베이, 해들리]
```

:::

::: lang py

```python
from randino import rand_fictional_district

rand_fictional_district(language="en", count=3)  # ['Gruger Park', 'Evelyn Bay', 'Hadley']
rand_fictional_district(language="ko", count=3)  # ['그루거 파크', '이블린 베이', '해들리']
```

:::

## 옵션 {#options}

<FictionalPlaceOptions />

## 이름 {#names}

구역은 실제 동네가 흔히 그렇듯 가문이나 사람의 이름(`Gruger`, `Evelyn`, `Hadley`)을 따거나, 마을처럼 지은 영어 이름을 씁니다. 구역만의 이름 약 50개에 [`randFictionalName`](./rand-fictional-name)이 쓰는 성 약 120개를 더해 씁니다. `realism: 'invented'`는 영어 단어 두 개를 잇거나(`Deep` + `grove`) 사람 이름처럼 음절을 이어(`Kalira`) 새로 만듭니다. `mixed`는 구역마다 정합니다.

## 종류 {#kinds}

<Lang js="includeKind" dart="includeKind" py="include_kind" code />를 켜면 이름 옆에 장소의 종류를 붙입니다. 생략하면 구역 열 개 중 일곱 개꼴로 붙습니다.

| 종류      | 영어             | 한국어          | 한국어, 번역어 |
| --------- | ---------------- | --------------- | -------------- |
| `park`    | `Gruger Park`    | `그루거 파크`   | `그루거 공원`  |
| `bay`     | `Gruger Bay`     | `그루거 베이`   | `그루거만`     |
| `hills`   | `Gruger Hills`   | `그루거 힐스`   | `그루거 언덕`  |
| `heights` | `Gruger Heights` | `그루거 하이츠` | `그루거 고지`  |
| `square`  | `Gruger Square`  | `그루거 스퀘어` | `그루거 광장`  |
| `quarter` | `Gruger Quarter` | `그루거 쿼터`   | `그루거 지구`  |
| `gardens` | `Gruger Gardens` | `그루거 가든스` | `그루거 정원`  |
| `market`  | `Gruger Market`  | `그루거 마켓`   | `그루거 시장`  |
| `docks`   | `Gruger Docks`   | `그루거 독스`   | `그루거 부두`  |
| `terrace` | `Gruger Terrace` | `그루거 테라스` | —              |
| `green`   | `Gruger Green`   | `그루거 그린`   | `그루거 녹지`  |
| `grove`   | `Gruger Grove`   | `그루거 그로브` | `그루거 숲`    |
| `end`     | `Gruger End`     | `그루거 엔드`   | —              |
| `row`     | `Gruger Row`     | `그루거 로`     | `그루거 거리`  |
| `village` | `Gruger Village` | `그루거 빌리지` | `그루거 마을`  |

이름이 이미 말하는 종류는 붙이지 않습니다. `Ashgrove`가 `Ashgrove Grove`가 되는 일은 없습니다.

## 종류를 적는 방식 {#kind-style}

종류는 각 언어의 말로 적습니다. 어떤 언어는 외국 지명의 종류를 두 가지로 적습니다. 영어 단어를 그 언어의 글자로 적거나(`그루거 파크`, `グルーガー・パーク`, `Гругер-парк`), 그 언어의 말로 옮겨 적습니다(`그루거 공원`, `グルーガー公園`, `Парк Гругер`). 따로 정하지 않으면 구역의 종류는 영어 단어를 그대로 씁니다. `Central Park`, `Pearl Harbor`를 여러 언어가 영어 단어 그대로 적는 것과 같고, 라틴 문자를 쓰는 언어는 `Gruger Park`처럼 그대로 적습니다. <Lang js="kindStyle" dart="kindStyle" py="kind_style" code />로 직접 정할 수 있습니다.

- <Lang js="'borrowed'" dart="FictionalKindStyle.borrowed" py="&quot;borrowed&quot;" code />는 영어 단어를 씁니다. 구역은 원래 이렇게 적습니다.
- <Lang js="'translated'" dart="FictionalKindStyle.translated" py="&quot;translated&quot;" code />는 그 언어의 말로 적습니다. `그루거 공원`, `Parque Gruger`, `Grugerpark`가 됩니다.

그 언어의 말이 따로 없는 종류는 어느 쪽이든 같게 적습니다. 중국어는 종류를 소리대로 적는 일이 없어서 언제나 옮겨 적습니다(`格鲁格公园`).

## 여러 언어로 한 번에 {#several-languages}

`language`에는 언어 하나 대신 목록을 줄 수 있습니다. 값 출력은 구역마다 목록에서 언어 하나를 고르고, 상세 출력은 여기에 더해 목록의 모든 언어로 적은 표기를 준 순서대로 `forms`에 담습니다. `unique`는 구역 자체를 비교하므로 `Gruger Park`과 `그루거 파크`는 하나로 셉니다. `startsWith`는 앞에 붙는 종류가 아니라 구역의 이름을 봅니다. `Evelyn Bay`은 `E`로 시작합니다.

## 길이 {#length}

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 종류까지 포함한 전체 길이입니다. 종류를 붙여야만, 또는 빼야만 범위에 들어갈 수 있으면 운에 맡긴 종류도 범위에 맞춰 정하고, 이름이 들어갈 자리를 남기지 못하는 종류는 건너뜁니다. 아무것도 범위에 닿지 않으면 가장 가까운 길이로 답합니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randFictionalDistrict({
	language: ['en', 'ko', 'ja', 'zh', 'ru'],
	includeKind: true,
	output: 'detail'
});
// [{ place: 'Ashworth Row', name: 'Ashworth', kind: 'row', level: 'district', language: 'en',
//    forms: { en: 'Ashworth Row', ko: '애시워스 로', ja: 'アシュワース・ロウ',
//             zh: '阿什沃思街', ru: 'Эшворт-Роу' } }]
```

:::

::: lang dart

```dart
randFictionalDistrictDetails(language: {WordLanguage.en, WordLanguage.ko}, includeKind: true).first;
// FictionalPlaceDetail(Ashworth Row, Ashworth, row, district, en,
//   {en: Ashworth Row, ko: 애시워스 로})
```

Dart에는 오버로드도 유니언 타입도 없어서 상세 출력은 별도 함수입니다. `randFictionalDistrict`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_fictional_district(language=["en", "ko"], include_kind=True, output="detail")
# [FictionalPlaceDetail(place='Ashworth Row', name='Ashworth', kind='row', level='district',
#                       language='en', forms={'en': 'Ashworth Row', 'ko': '애시워스 로'})]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `place` | <Lang js="string" dart="String" py="str" code /> | `language`로 적은, 종류까지 포함한 구역. 값 출력이 돌려주는 문자열입니다. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 종류를 뺀 구역의 이름. |
| `kind` | <Lang js="FictionalPlaceKind &#124; null" dart="FictionalPlaceKind?" py="FictionalPlaceKind &#124; None" code /> | 이름 옆에 붙인 종류. 없으면 <Lang js="null" dart="null" py="None" code />입니다. |
| `level` | `LocationLevel` | 여기서는 항상 `district`입니다. |
| `language` | `WordLanguage` | `place`를 적은 언어. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | 요청한 모든 언어로 적은 같은 구역. 요청한 순서대로 담깁니다. |

지어낸 이름도 어딘가의 실제 지명과 우연히 같을 수 있습니다. [면책 조항](../guide/disclaimer#coincidence)을 보세요.

## 함께 보기 {#see-also}

- [`randFictionalCountry`](./rand-fictional-country), [`randFictionalRegion`](./rand-fictional-region), [`randFictionalCity`](./rand-fictional-city): 지도의 나머지.
- [`randFictionalName`](./rand-fictional-name): 그곳에 사는 사람들.
- [`randDistrict`](../location/rand-district): 실제로 있는 구역.
