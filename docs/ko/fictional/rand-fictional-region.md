# randFictionalRegion

이야기나 게임의 지도에 쓸, 존재하지 않는 지역(주, 골짜기, 해안 등)의 이름을 만들어 `count`개만큼 문자열로 돌려줍니다. 이름 옆에 지역의 종류를 붙일 수 있고(`County of Zorvalia`, 또는 그냥 `Brightvale`), 이름은 라틴 문자로 먼저 정해진 뒤 다른 언어에서는 소리대로 적습니다. [언어 목록](#several-languages)을 주면 지역마다 모든 언어로 적은 결과를 언어 코드별로 돌려주고, [`output: 'detail'`](#the-detail-output)을 주면 무엇으로 만들었는지도 알려 줍니다.

::: lang js

```javascript
import { randFictionalRegion } from 'randino';

randFictionalRegion({ language: 'en', count: 3 }); // ['Silverfen Valley', 'Altheria', 'Isle of Lumeria']
randFictionalRegion({ language: 'ko', count: 3 }); // ['실버펜 계곡', '알테리아', '루메리아섬']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalRegion(language: WordLanguage.en, count: 3);
// [Silverfen Valley, Altheria, Isle of Lumeria]
randFictionalRegion(language: WordLanguage.ko, count: 3); // [실버펜 계곡, 알테리아, 루메리아섬]
```

:::

::: lang py

```python
from randino import rand_fictional_region

rand_fictional_region(language="en", count=3)  # ['Silverfen Valley', 'Altheria', 'Isle of Lumeria']
rand_fictional_region(language="ko", count=3)  # ['실버펜 계곡', '알테리아', '루메리아섬']
```

:::

## 옵션 {#options}

<FictionalPlaceOptions />

## 이름 {#names}

지역 이름은 국가처럼 라틴어풍의 웅장한 이름(`Altheria`, `Halveria`)이거나, 영어가 황야와 골짜기에 이름을 붙이는 방식으로 지은 영어 이름(`Brightvale`, `Ravenmoor`, `Wintermere`)이며, 데이터에 약 130개가 있습니다. `realism: 'invented'`는 음절을 잇거나(`Eli` + `heim`) 영어 단어 두 개를 이어(`Silver` + `heath`) 반반씩 새로 만들고, 이렇게 만들 수 있는 이름은 수만 개입니다. `mixed`는 지역마다 정합니다.

어느 이름도 아홉 언어 어디에서 실제 나라 이름이 되지 않고, 유명한 게임·영화·책이 지어낸 지명이 되지 않습니다. 단어 두 개가 우연히 만드는 `Westmarch`, `Riverwood`, `Winterfell`도 막아 둡니다.

## 종류 {#kinds}

<Lang js="includeKind" dart="includeKind" py="include_kind" code />를 켜면 이름 옆에 지역의 종류를 붙입니다. 생략하면 지역마다 반반으로 정합니다.

| 종류        | 영어                  | 한국어          | 한국어, 외래어    |
| ----------- | --------------------- | --------------- | ----------------- |
| `province`  | `Silverfen Province`  | `실버펜주`      | —                 |
| `march`     | `Silverfen March`     | `실버펜 변경령` | —                 |
| `county`    | `County of Silverfen` | `실버펜 백작령` | `실버펜 카운티`   |
| `barony`    | `Barony of Silverfen` | `실버펜 남작령` | —                 |
| `highlands` | `Silverfen Highlands` | `실버펜 고원`   | `실버펜 하이랜드` |
| `lowlands`  | `Silverfen Lowlands`  | `실버펜 저지대` | —                 |
| `valley`    | `Silverfen Valley`    | `실버펜 계곡`   | `실버펜 밸리`     |
| `forest`    | `Silverfen Forest`    | `실버펜 숲`     | `실버펜 포레스트` |
| `plains`    | `Silverfen Plains`    | `실버펜 평원`   | —                 |
| `coast`     | `Silverfen Coast`     | `실버펜 해안`   | `실버펜 코스트`   |
| `peninsula` | `Silverfen Peninsula` | `실버펜 반도`   | —                 |
| `moors`     | `Silverfen Moors`     | `실버펜 황야`   | —                 |
| `wilds`     | `Silverfen Wilds`     | `실버펜 황무지` | —                 |
| `isle`      | `Isle of Silverfen`   | `실버펜섬`      | —                 |
| `frontier`  | `Silverfen Frontier`  | `실버펜 변경`   | `실버펜 프런티어` |

이름이 이미 말하는 종류는 붙이지 않습니다. `Highmoor`가 `Highmoor Moors`가 되는 일은 없습니다.

## 종류를 적는 방식 {#kind-style}

종류는 각 언어의 말로 적습니다. 어떤 언어는 외국 지명의 종류를 두 가지로 적습니다. 그 언어의 말로 옮겨 적거나(`실버펜 계곡`, `シルバーフェン渓谷`, `Долина Силверфен`, `Valle de Silverfen`), 영어 단어를 그 언어의 글자로 적습니다(`실버펜 밸리`, `シルバーフェン・ヴァレー`, `Силверфен-Вэлли`). 따로 정하지 않으면 지역의 종류는 옮겨 적습니다. `Death Valley`를 `Valle de la Muerte`, `Долина Смерти`로 옮기는 것과 같습니다. <Lang js="kindStyle" dart="kindStyle" py="kind_style" code />로 직접 정할 수 있습니다.

- <Lang js="'borrowed'" dart="FictionalKindStyle.borrowed" py="&quot;borrowed&quot;" code />는 영어 단어를 씁니다. 그 언어에서 쓰는 외래어가 있으면 그 글자로(`실버펜 밸리`), 라틴 문자를 쓰는 언어에서는 그대로(`Silverfen Valley`) 적습니다.
- <Lang js="'translated'" dart="FictionalKindStyle.translated" py="&quot;translated&quot;" code />는 그 언어의 말로 적습니다. 지역은 원래 이렇게 적습니다.

그 언어에서 쓰는 외래어가 없는 종류는 어느 쪽이든 그 언어의 말로 적습니다. 한국어에는 `프로빈스` 같은 말이 없습니다. 중국어는 종류를 소리대로 적는 일이 없어서 언제나 옮겨 적습니다(`西尔弗芬谷`).

## 여러 언어로 한 번에 {#several-languages}

게임이나 책은 같은 지도를 플레이어마다 그 사람의 언어로 보여 줍니다. 그래서 `language`에는 목록도 줄 수 있고, 목록을 주면 지역마다 목록의 모든 언어로 적은 결과를 준 순서대로 언어 코드에 담아 돌려줍니다.

::: lang js

```javascript
randFictionalRegion({ language: ['ko', 'en'], includeKind: true });
// [{ ko: '실버펜 계곡', en: 'Silverfen Valley' }]
```

:::

::: lang dart

```dart
randFictionalRegionForms({WordLanguage.ko, WordLanguage.en}, includeKind: true);
// [{WordLanguage.ko: 실버펜 계곡, WordLanguage.en: Silverfen Valley}]
```

Dart는 인자에 따라 반환 타입을 바꿀 수 없어서 목록은 별도 함수 `randFictionalRegionForms`로 받습니다. 언어를 첫 인자로 받고, 나머지는 `randFictionalRegion`과 같은 이름 있는 매개변수입니다. 집합은 적은 순서를 유지하고, 그 순서가 각 맵의 순서입니다.

:::

::: lang py

```python
rand_fictional_region(language=["ko", "en"], include_kind=True)
# [{'ko': '실버펜 계곡', 'en': 'Silverfen Valley'}]
```

:::

지역은 목록의 첫 언어로 뽑고 나머지 언어로 옮겨 적습니다. 그래서 `startsWith`와 길이 범위는 첫 언어를 기준으로 봅니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />은 목록이 아니라서, 다른 생성 함수처럼 지역마다 언어 하나를 고릅니다. `unique`는 지역 자체를 비교하므로 `Silverfen Valley`와 `실버펜 계곡`은 하나로 셉니다. `startsWith`는 앞에 붙는 종류가 아니라 지역의 이름을 봅니다. `Isle of Lumeria`는 `L`로 시작합니다.

## 길이 {#length}

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 종류까지 포함한 전체 길이입니다. 종류를 붙여야만, 또는 빼야만 범위에 들어갈 수 있으면 운에 맡긴 종류도 범위에 맞춰 정하고, 이름이 들어갈 자리를 남기지 못하는 종류는 건너뜁니다. 아무것도 범위에 닿지 않으면 가장 가까운 길이로 답합니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randFictionalRegion({
	language: ['en', 'ko', 'ja', 'zh', 'ru'],
	includeKind: true,
	output: 'detail'
});
// [{ place: 'Novaria Frontier', name: 'Novaria', kind: 'frontier', level: 'region', language: 'en',
//    forms: { en: 'Novaria Frontier', ko: '노바리아 변경', ja: 'ノヴァリア辺境',
//             zh: '诺瓦里亚边疆', ru: 'Пограничье Новария' } }]
```

:::

::: lang dart

```dart
randFictionalRegionDetails(language: {WordLanguage.en, WordLanguage.ko}, includeKind: true).first;
// FictionalPlaceDetail(Novaria Frontier, Novaria, frontier, region, en,
//   {en: Novaria Frontier, ko: 노바리아 변경})
```

Dart에는 오버로드도 유니언 타입도 없어서 상세 출력은 별도 함수입니다. `randFictionalRegion`과 같은 매개변수를 받되, `language`는 집합입니다. 언어 하나를 주거나, 다른 두 패키지의 목록처럼 `forms`를 여러 언어로 받으려면 여러 개를 줍니다.

:::

::: lang py

```python
rand_fictional_region(language=["en", "ko"], include_kind=True, output="detail")
# [FictionalPlaceDetail(place='Novaria Frontier', name='Novaria', kind='frontier', level='region',
#                       language='en', forms={'en': 'Novaria Frontier', 'ko': '노바리아 변경'})]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `place` | <Lang js="string" dart="String" py="str" code /> | `language`로 적은, 종류까지 포함한 지역. 언어 하나를 준 호출이 돌려주는 문자열입니다. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 종류를 뺀 지역의 이름. |
| `kind` | <Lang js="FictionalPlaceKind &#124; null" dart="FictionalPlaceKind?" py="FictionalPlaceKind &#124; None" code /> | 이름 옆에 붙인 종류. 없으면 <Lang js="null" dart="null" py="None" code />입니다. |
| `level` | `LocationLevel` | 여기서는 항상 `region`입니다. |
| `language` | `WordLanguage` | `place`를 적은 언어. 고른 언어이거나 목록의 첫 언어입니다. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | 요청한 모든 언어로 적은 같은 지역. 요청한 순서대로 담기며, 목록을 준 호출이 돌려주는 값입니다. |

지어낸 이름도 어딘가의 실제 지명과 우연히 같을 수 있습니다. [면책 조항](../guide/disclaimer#coincidence)을 보세요.

## 함께 보기 {#see-also}

- [`randFictionalCountry`](./rand-fictional-country), [`randFictionalCity`](./rand-fictional-city), [`randFictionalDistrict`](./rand-fictional-district): 지도의 나머지.
- [`randFictionalName`](./rand-fictional-name): 그곳에 사는 사람들.
- [`randRegion`](../location/rand-region): 실제로 있는 지역.
