# randFictionalCountry

이야기나 게임의 지도에 쓸, 존재하지 않는 국가의 이름을 만들어 `count`개만큼 문자열로 돌려줍니다. 이름 옆에 국가의 형태를 붙일 수 있고(`Kingdom of Edlin`, 또는 그냥 `Glacia`), 이름은 라틴 문자로 먼저 정해진 뒤 다른 언어에서는 소리대로 적습니다. [언어 목록](#several-languages)을 주면 국가마다 모든 언어로 적은 결과를 언어 코드별로 돌려주고, [`output: 'detail'`](#the-detail-output)을 주면 무엇으로 만들었는지도 알려 줍니다.

::: lang js

```javascript
import { randFictionalCountry } from 'randino';

randFictionalCountry({ language: 'en', count: 3 }); // ['Kingdom of Edlin', 'Glacia', 'Castavia Empire']
randFictionalCountry({ language: 'ko', count: 3 }); // ['에들린 왕국', '글래시아', '카스타비아 제국']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalCountry(language: WordLanguage.en, count: 3);
// [Kingdom of Edlin, Glacia, Castavia Empire]
randFictionalCountry(language: WordLanguage.ko, count: 3); // [에들린 왕국, 글래시아, 카스타비아 제국]
```

:::

::: lang py

```python
from randino import rand_fictional_country

rand_fictional_country(language="en", count=3)  # ['Kingdom of Edlin', 'Glacia', 'Castavia Empire']
rand_fictional_country(language="ko", count=3)  # ['에들린 왕국', '글래시아', '카스타비아 제국']
```

:::

## 옵션 {#options}

<FictionalPlaceOptions />

## 이름 {#names}

국가 이름은 `Valoria`, `Sylvaria`, `Glacia`처럼 라틴어풍의 웅장한 이름이고, 데이터에 약 100개가 있습니다. 모두의 이야기에 속하는 전설 속 땅(`Avalon`, `Lyonesse`, `Lemuria`)도 들어 있습니다. `realism: 'invented'`는 음절을 이어 새로 만듭니다. 첫 음절, 많아야 하나인 가운데 음절, `-ria`나 `-heim` 같은 끝 음절을 잇는 방식(`Sil` + `va` + `ria`)이고, 이렇게 만들 수 있는 이름은 수만 개입니다. `mixed`는 국가마다 정합니다.

어느 이름도 아홉 언어 어디에서 실제 나라 이름이 되지 않고, 유명한 게임·영화·책이 지어낸 지명이 되지 않습니다. `Hyrule`, `Narnia`, `Westeros`는 빠져 있고, 한 언어에서만 실제 나라로 읽히는 이름도 막아 둡니다. 예를 들어 `Senegar`는 일본어로 `セネガル`(세네갈)가 되므로 만들지 않습니다.

## 종류 {#kinds}

<Lang js="includeKind" dart="includeKind" py="include_kind" code />를 켜면 이름 옆에 국가의 형태를 붙입니다. 생략하면 국가마다 반반으로 정합니다.

| 종류            | 영어                    | 한국어          | 한국어, 외래어      |
| --------------- | ----------------------- | --------------- | ------------------- |
| `kingdom`       | `Kingdom of Edlin`      | `에들린 왕국`   | `에들린 킹덤`       |
| `empire`        | `Edlin Empire`          | `에들린 제국`   | `에들린 엠파이어`   |
| `republic`      | `Republic of Edlin`     | `에들린 공화국` | `에들린 리퍼블릭`   |
| `principality`  | `Principality of Edlin` | `에들린 공국`   | —                   |
| `archduchy`     | `Archduchy of Edlin`    | `에들린 대공국` | —                   |
| `duchy`         | `Duchy of Edlin`        | `에들린 공작령` | —                   |
| `federation`    | `Edlin Federation`      | `에들린 연방`   | `에들린 페더레이션` |
| `confederation` | `Edlin Confederation`   | `에들린 연합`   | —                   |
| `dominion`      | `Dominion of Edlin`     | `에들린 자치령` | `에들린 도미니언`   |
| `theocracy`     | `Theocracy of Edlin`    | `에들린 신성국` | —                   |
| `isles`         | `Edlin Isles`           | `에들린 제도`   | —                   |

## 종류를 적는 방식 {#kind-style}

종류는 각 언어의 말로 적습니다. 어떤 언어는 외국 지명의 종류를 두 가지로 적습니다. 그 언어의 말로 옮겨 적거나(`에들린 왕국`, `エドリン王国`, `Королевство Эдлин`, `Reino de Edlin`), 영어 단어를 그 언어의 글자로 적습니다(`에들린 킹덤`, `エドリン・キングダム`). 따로 정하지 않으면 국가의 종류는 옮겨 적습니다. `United Kingdom`을 `Reino Unido`, `Соединённое Королевство`로 옮기는 것과 같습니다. <Lang js="kindStyle" dart="kindStyle" py="kind_style" code />로 직접 정할 수 있습니다.

- <Lang js="'borrowed'" dart="FictionalKindStyle.borrowed" py="&quot;borrowed&quot;" code />는 영어 단어를 씁니다. 그 언어에서 쓰는 외래어가 있으면 그 글자로(`에들린 킹덤`), 라틴 문자를 쓰는 언어에서는 그대로(`Kingdom of Edlin`) 적습니다.
- <Lang js="'translated'" dart="FictionalKindStyle.translated" py="&quot;translated&quot;" code />는 그 언어의 말로 적습니다. 국가는 원래 이렇게 적습니다.

그 언어에서 쓰는 외래어가 없는 종류는 어느 쪽이든 그 언어의 말로 적습니다. 한국어에는 `프린시펄리티` 같은 말이 없습니다. 중국어는 종류를 소리대로 적는 일이 없어서 언제나 옮겨 적습니다(`埃德林王国`).

::: lang js

```javascript
randFictionalCountry({ language: 'ko', includeKind: true, kindStyle: 'borrowed', count: 2 });
// ['에들린 킹덤', '바렌시아 엠파이어']
```

:::

::: lang dart

```dart
randFictionalCountry(
  language: WordLanguage.ko,
  includeKind: true,
  kindStyle: FictionalKindStyle.borrowed,
  count: 2,
);
// [에들린 킹덤, 바렌시아 엠파이어]
```

:::

::: lang py

```python
rand_fictional_country(language="ko", include_kind=True, kind_style="borrowed", count=2)
# ['에들린 킹덤', '바렌시아 엠파이어']
```

:::

## 여러 언어로 한 번에 {#several-languages}

게임이나 책은 같은 지도를 플레이어마다 그 사람의 언어로 보여 줍니다. 그래서 `language`에는 목록도 줄 수 있고, 목록을 주면 국가마다 목록의 모든 언어로 적은 결과를 준 순서대로 언어 코드에 담아 돌려줍니다.

::: lang js

```javascript
randFictionalCountry({ language: ['ko', 'en'], includeKind: true });
// [{ ko: '에들린 왕국', en: 'Kingdom of Edlin' }]
```

:::

::: lang dart

```dart
randFictionalCountryForms({WordLanguage.ko, WordLanguage.en}, includeKind: true);
// [{WordLanguage.ko: 에들린 왕국, WordLanguage.en: Kingdom of Edlin}]
```

Dart는 인자에 따라 반환 타입을 바꿀 수 없어서 목록은 별도 함수 `randFictionalCountryForms`로 받습니다. 언어를 첫 인자로 받고, 나머지는 `randFictionalCountry`와 같은 이름 있는 매개변수입니다. 집합은 적은 순서를 유지하고, 그 순서가 각 맵의 순서입니다.

:::

::: lang py

```python
rand_fictional_country(language=["ko", "en"], include_kind=True)
# [{'ko': '에들린 왕국', 'en': 'Kingdom of Edlin'}]
```

:::

국가는 목록의 첫 언어로 뽑고 나머지 언어로 옮겨 적습니다. 그래서 `startsWith`와 길이 범위는 첫 언어를 기준으로 봅니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />은 목록이 아니라서, 다른 생성 함수처럼 국가마다 언어 하나를 고릅니다. `unique`는 국가 자체를 비교하므로 `Kingdom of Edlin`과 `에들린 왕국`은 하나로 셉니다. `startsWith`는 앞에 붙는 종류가 아니라 국가의 이름을 봅니다. `Kingdom of Edlin`은 `E`로 시작합니다.

## 길이 {#length}

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 종류까지 포함한 전체 길이입니다. 종류를 붙여야만, 또는 빼야만 범위에 들어갈 수 있으면 운에 맡긴 종류도 범위에 맞춰 정하고, 이름이 들어갈 자리를 남기지 못하는 종류는 건너뜁니다. 아무것도 범위에 닿지 않으면 가장 가까운 길이로 답합니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randFictionalCountry({
	language: ['en', 'ko', 'ja', 'zh', 'ru'],
	includeKind: true,
	output: 'detail'
});
// [{ place: 'Ilvaris Isles', name: 'Ilvaris', kind: 'isles', level: 'country', language: 'en',
//    forms: { en: 'Ilvaris Isles', ko: '일바리스 제도', ja: 'イルヴァリス諸島',
//             zh: '伊尔瓦里斯群岛', ru: 'Острова Ильварис' } }]
```

:::

::: lang dart

```dart
randFictionalCountryDetails(language: {WordLanguage.en, WordLanguage.ko}, includeKind: true).first;
// FictionalPlaceDetail(Ilvaris Isles, Ilvaris, isles, country, en,
//   {en: Ilvaris Isles, ko: 일바리스 제도})
```

Dart에는 오버로드도 유니언 타입도 없어서 상세 출력은 별도 함수입니다. `randFictionalCountry`와 같은 매개변수를 받되, `language`는 집합입니다. 언어 하나를 주거나, 다른 두 패키지의 목록처럼 `forms`를 여러 언어로 받으려면 여러 개를 줍니다.

:::

::: lang py

```python
rand_fictional_country(language=["en", "ko"], include_kind=True, output="detail")
# [FictionalPlaceDetail(place='Ilvaris Isles', name='Ilvaris', kind='isles', level='country',
#                       language='en', forms={'en': 'Ilvaris Isles', 'ko': '일바리스 제도'})]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `place` | <Lang js="string" dart="String" py="str" code /> | `language`로 적은, 종류까지 포함한 국가. 언어 하나를 준 호출이 돌려주는 문자열입니다. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 종류를 뺀 국가의 이름. |
| `kind` | <Lang js="FictionalPlaceKind &#124; null" dart="FictionalPlaceKind?" py="FictionalPlaceKind &#124; None" code /> | 이름 옆에 붙인 종류. 없으면 <Lang js="null" dart="null" py="None" code />입니다. |
| `level` | `LocationLevel` | 여기서는 항상 `country`입니다. |
| `language` | `WordLanguage` | `place`를 적은 언어. 고른 언어이거나 목록의 첫 언어입니다. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | 요청한 모든 언어로 적은 같은 국가. 요청한 순서대로 담기며, 목록을 준 호출이 돌려주는 값입니다. |

지어낸 이름도 어딘가의 실제 지명과 우연히 같을 수 있습니다. [면책 조항](../guide/disclaimer#coincidence)을 보세요.

## 함께 보기 {#see-also}

- [`randFictionalRegion`](./rand-fictional-region), [`randFictionalCity`](./rand-fictional-city), [`randFictionalDistrict`](./rand-fictional-district): 지도의 나머지.
- [`randFictionalName`](./rand-fictional-name): 그곳에 사는 사람들.
- [`randCountry`](../location/rand-country): 실제로 있는 나라.
