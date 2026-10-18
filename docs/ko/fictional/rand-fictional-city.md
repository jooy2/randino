# randFictionalCity

이야기나 게임의 지도에 쓸, 존재하지 않는 도시와 마을의 이름을 만들어 `count`개만큼 문자열로 돌려줍니다. 이름 옆에 장소의 종류를 붙일 수 있고(`Port Ravenford`, 또는 그냥 `Ashwick`), 이름은 라틴 문자로 먼저 정해진 뒤 다른 언어에서는 소리대로 적습니다. [언어 목록](#several-languages)을 주면 도시마다 모든 언어로 적은 결과를 언어 코드별로 돌려주고, [`output: 'detail'`](#the-detail-output)을 주면 무엇으로 만들었는지도 알려 줍니다.

::: lang js

```javascript
import { randFictionalCity } from 'randino';

randFictionalCity({ language: 'en', count: 3 }); // ['Ashwick', 'Port Ravenford', 'Hollowbrook Falls']
randFictionalCity({ language: 'ko', count: 3 }); // ['애시윅', '포트 레이븐퍼드', '할로브룩 폴스']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalCity(language: WordLanguage.en, count: 3);
// [Ashwick, Port Ravenford, Hollowbrook Falls]
randFictionalCity(language: WordLanguage.ko, count: 3); // [애시윅, 포트 레이븐퍼드, 할로브룩 폴스]
```

:::

::: lang py

```python
from randino import rand_fictional_city

rand_fictional_city(language="en", count=3)  # ['Ashwick', 'Port Ravenford', 'Hollowbrook Falls']
rand_fictional_city(language="ko", count=3)  # ['애시윅', '포트 레이븐퍼드', '할로브룩 폴스']
```

:::

## 옵션 {#options}

<FictionalPlaceOptions />

## 이름 {#names}

도시 이름은 영어가 마을에 이름을 붙이는 방식으로 지었고(`Ashwick`, `Hollowbrook`, `Mapleford`), 데이터에 약 120개가 있습니다. `realism: 'invented'`는 `Raven`, `Silver`, `Briar` 같은 앞부분과 `ford`, `haven`, `wick` 같은 뒷부분을 이어 새로 만들고, 이렇게 만들 수 있는 이름은 2천 개쯤입니다. `mixed`는 도시마다 정합니다.

영국 지명이 여러 곳에서 되풀이되듯, 이렇게 지은 이름이 어딘가의 작은 실제 마을과 같을 수는 있습니다. 하지만 유명한 곳이나 유명한 게임·영화·책이 지어낸 곳과는 같지 않습니다. 단어 두 개가 우연히 만드는 `Hollywood`, `Kingston`, `Riverwood`는 막아 둡니다.

## 종류 {#kinds}

<Lang js="includeKind" dart="includeKind" py="include_kind" code />를 켜면 이름 옆에 장소의 종류를 붙입니다. 생략하면 도시 다섯 개 중 두 개꼴로 붙습니다.

| 종류       | 영어               | 한국어            | 한국어, 번역어  |
| ---------- | ------------------ | ----------------- | --------------- |
| `city`     | `Ashwick City`     | `애시윅 시티`     | `애시윅시`      |
| `town`     | `Ashwick Town`     | `애시윅 타운`     | `애시윅 마을`   |
| `port`     | `Port Ashwick`     | `포트 애시윅`     | `애시윅항`      |
| `harbor`   | `Ashwick Harbor`   | `애시윅 하버`     | `애시윅 항구`   |
| `falls`    | `Ashwick Falls`    | `애시윅 폴스`     | `애시윅 폭포`   |
| `crossing` | `Ashwick Crossing` | `애시윅 크로싱`   | `애시윅 나루`   |
| `bridge`   | `Ashwick Bridge`   | `애시윅 브리지`   | `애시윅교`      |
| `springs`  | `Ashwick Springs`  | `애시윅 스프링스` | `애시윅 온천`   |
| `landing`  | `Ashwick Landing`  | `애시윅 랜딩`     | `애시윅 선착장` |
| `village`  | `Ashwick Village`  | `애시윅 빌리지`   | `애시윅 마을`   |

이름이 이미 말하는 종류는 붙이지 않습니다. `Galeport`가 `Port Galeport`가 되는 일은 없습니다.

## 종류를 적는 방식 {#kind-style}

종류는 각 언어의 말로 적습니다. 어떤 언어는 외국 지명의 종류를 두 가지로 적습니다. 영어 단어를 그 언어의 글자로 적거나(`애시윅 스프링스`, `アッシュウィック・スプリングス`, `Эшуик-Спрингс`), 그 언어의 말로 옮겨 적습니다(`애시윅 온천`, `アッシュウィック温泉`, `Источники Эшуик`). 따로 정하지 않으면 도시의 종류는 영어 단어를 그대로 씁니다. `Central Park`, `Pearl Harbor`를 여러 언어가 영어 단어 그대로 적는 것과 같고, 라틴 문자를 쓰는 언어는 `Ashwick Springs`처럼 그대로 적습니다. <Lang js="kindStyle" dart="kindStyle" py="kind_style" code />로 직접 정할 수 있습니다.

- <Lang js="'borrowed'" dart="FictionalKindStyle.borrowed" py="&quot;borrowed&quot;" code />는 영어 단어를 씁니다. 도시는 원래 이렇게 적습니다.
- <Lang js="'translated'" dart="FictionalKindStyle.translated" py="&quot;translated&quot;" code />는 그 언어의 말로 적습니다. `애시윅 온천`, `Manantiales de Ashwick`, `Bad Ashwick`가 됩니다.

그 언어의 말이 따로 없는 종류는 어느 쪽이든 같게 적습니다. 중국어는 종류를 소리대로 적는 일이 없어서 언제나 옮겨 적습니다(`阿什威克泉`).

## 여러 언어로 한 번에 {#several-languages}

게임이나 책은 같은 지도를 플레이어마다 그 사람의 언어로 보여 줍니다. 그래서 `language`에는 목록도 줄 수 있고, 목록을 주면 도시마다 목록의 모든 언어로 적은 결과를 준 순서대로 언어 코드에 담아 돌려줍니다.

::: lang js

```javascript
randFictionalCity({ language: ['ko', 'en', 'ru'], includeKind: true });
// [{ ko: '애시윅 스프링스', en: 'Ashwick Springs', ru: 'Эшуик-Спрингс' }]
```

:::

::: lang dart

```dart
randFictionalCityForms({WordLanguage.ko, WordLanguage.en, WordLanguage.ru}, includeKind: true);
// [{WordLanguage.ko: 애시윅 스프링스, WordLanguage.en: Ashwick Springs, WordLanguage.ru: Эшуик-Спрингс}]
```

Dart는 인자에 따라 반환 타입을 바꿀 수 없어서 목록은 별도 함수 `randFictionalCityForms`로 받습니다. 언어를 첫 인자로 받고, 나머지는 `randFictionalCity`와 같은 이름 있는 매개변수입니다. 집합은 적은 순서를 유지하고, 그 순서가 각 맵의 순서입니다.

:::

::: lang py

```python
rand_fictional_city(language=["ko", "en", "ru"], include_kind=True)
# [{'ko': '애시윅 스프링스', 'en': 'Ashwick Springs', 'ru': 'Эшуик-Спрингс'}]
```

:::

도시는 목록의 첫 언어로 뽑고 나머지 언어로 옮겨 적습니다. 그래서 `startsWith`와 길이 범위는 첫 언어를 기준으로 봅니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />은 목록이 아니라서, 다른 생성 함수처럼 도시마다 언어 하나를 고릅니다. `unique`는 도시 자체를 비교하므로 `Port Ravenford`와 `포트 레이븐퍼드`는 하나로 셉니다. `startsWith`는 앞에 붙는 종류가 아니라 도시의 이름을 봅니다. `Port Ravenford`는 `R`로 시작합니다.

## 길이 {#length}

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 종류까지 포함한 전체 길이입니다. 종류를 붙여야만, 또는 빼야만 범위에 들어갈 수 있으면 운에 맡긴 종류도 범위에 맞춰 정하고, 이름이 들어갈 자리를 남기지 못하는 종류는 건너뜁니다. 아무것도 범위에 닿지 않으면 가장 가까운 길이로 답합니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randFictionalCity({
	language: ['en', 'ko', 'ja', 'zh', 'ru'],
	includeKind: true,
	output: 'detail'
});
// [{ place: 'Penhallow Village', name: 'Penhallow', kind: 'village', level: 'city', language: 'en',
//    forms: { en: 'Penhallow Village', ko: '펜할로 빌리지', ja: 'ペンハロウ・ヴィレッジ',
//             zh: '彭哈洛村', ru: 'Пенхэллоу-Виллидж' } }]
```

:::

::: lang dart

```dart
randFictionalCityDetails(language: {WordLanguage.en, WordLanguage.ko}, includeKind: true).first;
// FictionalPlaceDetail(Penhallow Village, Penhallow, village, city, en,
//   {en: Penhallow Village, ko: 펜할로 빌리지})
```

Dart에는 오버로드도 유니언 타입도 없어서 상세 출력은 별도 함수입니다. `randFictionalCity`와 같은 매개변수를 받되, `language`는 집합입니다. 언어 하나를 주거나, 다른 두 패키지의 목록처럼 `forms`를 여러 언어로 받으려면 여러 개를 줍니다.

:::

::: lang py

```python
rand_fictional_city(language=["en", "ko"], include_kind=True, output="detail")
# [FictionalPlaceDetail(place='Penhallow Village', name='Penhallow', kind='village', level='city',
#                       language='en', forms={'en': 'Penhallow Village', 'ko': '펜할로 빌리지'})]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `place` | <Lang js="string" dart="String" py="str" code /> | `language`로 적은, 종류까지 포함한 도시. 언어 하나를 준 호출이 돌려주는 문자열입니다. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 종류를 뺀 도시의 이름. |
| `kind` | <Lang js="FictionalPlaceKind &#124; null" dart="FictionalPlaceKind?" py="FictionalPlaceKind &#124; None" code /> | 이름 옆에 붙인 종류. 없으면 <Lang js="null" dart="null" py="None" code />입니다. |
| `level` | `LocationLevel` | 여기서는 항상 `city`입니다. |
| `language` | `WordLanguage` | `place`를 적은 언어. 고른 언어이거나 목록의 첫 언어입니다. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | 요청한 모든 언어로 적은 같은 도시. 요청한 순서대로 담기며, 목록을 준 호출이 돌려주는 값입니다. |

지어낸 이름도 어딘가의 실제 지명과 우연히 같을 수 있습니다. [면책 조항](../guide/disclaimer#coincidence)을 보세요.

## 함께 보기 {#see-also}

- [`randFictionalCountry`](./rand-fictional-country), [`randFictionalRegion`](./rand-fictional-region), [`randFictionalDistrict`](./rand-fictional-district): 지도의 나머지.
- [`randFictionalName`](./rand-fictional-name): 그곳에 사는 사람들.
- [`randCity`](../location/rand-city): 실제로 있는 도시.
