# randGender

샘플 인물의 성별을 만들어 `count`개만큼 문자열로 돌려줍니다. `여성`, `Female`, `Weiblich`처럼 그 언어의 가입 양식이 쓰는 표기 그대로입니다. 남성과 여성이 같은 비율로 나오고, 요청하면 두 가지가 더 나옵니다. 성별을 밝히지 않은 경우와, 훨씬 드물게 나오는 제3의 성입니다. [`output: 'detail'`](#the-detail-output)을 주면 표기마다 그 코드도 알려 줍니다.

::: lang js

```javascript
import { randGender } from 'randino';

randGender({ language: 'ko', count: 3 });
// ['여성', '남성', '여성']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randGender(language: WordLanguage.ko, count: 3);
// [여성, 남성, 여성]
```

:::

::: lang py

```python
from randino import rand_gender

rand_gender(language="ko", count=3)
# ['여성', '남성', '여성']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 아무것도 주지 않은 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 표기를 쓸 언어. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 결과마다 언어를 하나씩 고릅니다. |
| <Lang js="includeUnknown" dart="includeUnknown" py="include_unknown" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 이따금 `unknown`을 돌려줍니다. 성별을 적지 않은 기록입니다. |
| <Lang js="includeNonbinary" dart="includeNonbinary" py="include_nonbinary" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 드물게 `nonbinary`를 돌려줍니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 성별 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 표기를 두 번 돌려주지 않습니다. 표기가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 성별마다 `GenderDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 얼마나 자주 나오나 {#how-often}

남성과 여성은 반반입니다. 나머지 둘은 요청해야 켜지고, 켜도 드물게 나오므로 샘플이 여전히 사람들의 목록처럼 읽힙니다.

| 켠 옵션 | 남성 | 여성 | 미상 | 논바이너리 |
| --- | --: | --: | --: | --: |
| 없음 | 50% | 50% | — | — |
| <Lang js="includeUnknown" dart="includeUnknown" py="include_unknown" code /> | 45.5% | 45.5% | 9.1% | — |
| <Lang js="includeNonbinary" dart="includeNonbinary" py="include_nonbinary" code /> | 49.5% | 49.5% | — | 1.1% |
| 둘 다 | 45% | 45% | 9% | 1% |

논바이너리는 100번에 한 번꼴로, 실제 설문에서 나오는 비율과 같은 자릿수입니다. 미상은 11번에 한 번꼴이라, 50명짜리 샘플이면 그 값을 보여 주는 화면도 거의 확실히 한 번은 거칩니다.

::: lang js

```javascript
randGender({ language: 'en', includeUnknown: true, count: 5 });
// ['Male', 'Female', 'Unknown', 'Female', 'Male']

randGender({ language: 'de', includeNonbinary: true, includeUnknown: true, count: 5 });
// ['Weiblich', 'Männlich', 'Weiblich', 'Divers', 'Männlich']
```

:::

::: lang dart

```dart
randGender(language: WordLanguage.en, includeUnknown: true, count: 5);
// [Male, Female, Unknown, Female, Male]

randGender(language: WordLanguage.de, includeNonbinary: true, includeUnknown: true, count: 5);
// [Weiblich, Männlich, Weiblich, Divers, Männlich]
```

:::

::: lang py

```python
rand_gender(language="en", include_unknown=True, count=5)
# ['Male', 'Female', 'Unknown', 'Female', 'Male']

rand_gender(language="de", include_nonbinary=True, include_unknown=True, count=5)
# ['Weiblich', 'Männlich', 'Weiblich', 'Divers', 'Männlich']
```

:::

## 표기 {#labels}

언어마다 사람을 가리키는 명사가 아니라, 가입 양식이나 기록 표가 쓰는 낱말을 씁니다.

| 코드 | `male`    | `female`  | `nonbinary`         | `unknown`      |
| ---- | --------- | --------- | ------------------- | -------------- |
| `en` | Male      | Female    | Non-binary          | Unknown        |
| `ko` | 남성      | 여성      | 논바이너리          | 미상           |
| `ja` | 男性      | 女性      | ノンバイナリー      | 不明           |
| `zh` | 男        | 女        | 非二元性别          | 未知           |
| `vi` | Nam       | Nữ        | Phi nhị nguyên giới | Không xác định |
| `es` | Masculino | Femenino  | No binario          | Desconocido    |
| `it` | Maschile  | Femminile | Non binario         | Sconosciuto    |
| `de` | Männlich  | Weiblich  | Divers              | Unbekannt      |
| `ru` | Мужской   | Женский   | Небинарный          | Не указан      |

독일어는 자국 양식에 실제로 있는 세 번째 선택지인 `Divers`를 씁니다. 스페인어·이탈리아어·러시아어는 성별 항목을 가리키는 낱말(`sexo`, `genere`, `пол`)에 맞춰 형용사를 씁니다. 그 언어의 양식이 실제로 그렇게 적습니다.

## 상세 출력 {#the-detail-output}

상세 출력에는 표기 옆에 코드가 함께 들어 있어서, `female`로 저장하고 `여성`으로 보여 줄 수 있습니다. `male`과 `female`은 [`randName`](../name/rand-name)의 `gender`가 받는 코드와 같으므로, 뽑은 성별로 이름을 뽑을 목록을 고를 수 있습니다.

::: lang js

```javascript
randGender({ language: 'ko', output: 'detail' });
// [{ gender: '여성', code: 'female', language: 'ko' }]
```

:::

::: lang dart

```dart
randGenderDetails(language: WordLanguage.ko).first; // GenderDetail(여성, female, ko)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randGender`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_gender(language="ko", output="detail")
# [GenderDetail(gender='여성', code='female', language='ko')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `gender` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 표기. |
| `code` | `GenderCode` | `male`, `female`, `nonbinary`, `unknown` 중 하나. 언어와 관계없이 같습니다. |
| `language` | `WordLanguage` | 표기를 쓴 언어. |

## 함께 보기 {#see-also}

- [`randAge`](../age/rand-age) — 함께 쓸 나이.
- [`randName`](../name/rand-name) — 그 성별의 목록에서 뽑은 이름.
