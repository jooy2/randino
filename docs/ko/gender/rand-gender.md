# randGender

샘플 인물의 성별을 만들어 `count`개만큼 문자열로 돌려줍니다. `여성`, `Female`, `Weiblich`처럼 그 언어의 가입 양식이 쓰는 표기 그대로입니다. 남성과 여성이 같은 비율로 나오고, 요청하면 두 가지가 더 나옵니다. 성별을 밝히지 않은 경우와, 훨씬 드물게 나오는 제3의 성입니다. 제3의 성은 [본인이 스스로를 부르는 명칭](#identities)으로 쓸 수도 있습니다. [`output: 'detail'`](#the-detail-output)을 주면 표기마다 그 코드도 알려 줍니다.

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
| <Lang js="nonbinaryIdentity" dart="nonbinaryIdentity" py="nonbinary_identity" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | `nonbinary`를 양식의 선택지 대신 [정체성 명칭](#identities)(`젠더플루이드`, `에이젠더`)으로 씁니다. <Lang js="includeNonbinary" dart="includeNonbinary" py="include_nonbinary" code />를 켜지 않으면 아무 효과가 없습니다. |
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

## 정체성 명칭 {#identities}

양식은 두 성별 밖의 모든 사람에게 칸 하나를 내주지만, 그 칸에 표시하는 사람들은 스스로를 여러 이름으로 부릅니다. <Lang js="nonbinaryIdentity" dart="nonbinaryIdentity" py="nonbinary_identity" code />를 켜면 `nonbinary`가 뽑혔을 때 양식의 표기 대신 그 이름 가운데 하나를 씁니다. `code`는 그대로 `nonbinary`이므로 저장한 기록은 달라지지 않고, 표기만 바뀝니다. [상세 출력](#the-detail-output)의 `identity`에는 어떤 명칭이었는지가 언어와 관계없이 같은 값으로 들어 있어서, `Genderfluid`와 `젠더플루이드`를 같은 명칭으로 셀 수 있습니다.

::: lang js

```javascript
randGender({ language: 'ko', includeNonbinary: true, nonbinaryIdentity: true, count: 5 });
// ['여성', '남성', '젠더플루이드', '남성', '여성']
```

:::

::: lang dart

```dart
randGender(language: WordLanguage.ko, includeNonbinary: true, nonbinaryIdentity: true, count: 5);
// [여성, 남성, 젠더플루이드, 남성, 여성]
```

:::

::: lang py

```python
rand_gender(language="ko", include_nonbinary=True, nonbinary_identity=True, count=5)
# ['여성', '남성', '젠더플루이드', '남성', '여성']
```

:::

명칭 목록은 [Gender Census](https://www.gendercensus.com/)의 선택지 가운데 두 성별 밖의 성별을 가리키는 것들이고, 각 명칭은 2024년 조사에서 표시된 비율만큼 나옵니다. 나머지 선택지는 다른 것을 가리키거나(`trans`, `queer`, `gender non-conforming`) 같은 명칭의 다른 표기입니다(`enby`). 투스피릿이나 히즈라처럼 특정 문화권에 속한 정체성은 넣지 않았습니다. 아홉 언어 가운데 어느 언어로 뽑힌 가상 인물이든 그 정체성을 쓸 근거가 없기 때문입니다.

| 명칭         | `nonbinary` 가운데 비율 |
| ------------ | ----------------------: |
| 논바이너리   |                   37.5% |
| 젠더퀴어     |                   20.6% |
| 젠더플루이드 |                   15.6% |
| 에이젠더     |                   14.4% |
| 데미걸       |                    4.4% |
| 데미보이     |                    3.8% |
| 바이젠더     |                    3.8% |

대부분의 언어는 영어 낱말을 그대로 쓰거나 자기 문자로 옮겨 적습니다. 스페인어·베트남어·중국어는 번역해서 씁니다. 독일어는 `Divers` 대신 `Nichtbinär`를 씁니다. `Divers`는 양식의 선택지일 뿐, 누군가 스스로를 부르는 이름이 아니기 때문입니다.

| 코드 | Non-binary | Genderqueer | Genderfluid | Agender | Demigirl | Demiboy | Bigender |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `en` | Non-binary | Genderqueer | Genderfluid | Agender | Demigirl | Demiboy | Bigender |
| `ko` | 논바이너리 | 젠더퀴어 | 젠더플루이드 | 에이젠더 | 데미걸 | 데미보이 | 바이젠더 |
| `ja` | ノンバイナリー | ジェンダークィア | ジェンダーフルイド | アジェンダー | デミガール | デミボーイ | バイジェンダー |
| `zh` | 非二元性别 | 性别酷儿 | 性别流动 | 无性别 | 半女性 | 半男性 | 双性别 |
| `vi` | Phi nhị nguyên giới | Nghi hoặc giới | Linh hoạt giới | Vô giới | Bán nữ | Bán nam | Song giới |
| `es` | No binario | Genderqueer | Género fluido | Agénero | Demichica | Demichico | Bigénero |
| `it` | Non binario | Genderqueer | Genderfluid | Agender | Demigirl | Demiboy | Bigender |
| `de` | Nichtbinär | Genderqueer | Genderfluid | Agender | Demigirl | Demiboy | Bigender |
| `ru` | Небинарный | Гендерквир | Гендерфлюид | Агендер | Демигерл | Демибой | Бигендер |

## 상세 출력 {#the-detail-output}

상세 출력에는 표기 옆에 코드가 함께 들어 있어서, `female`로 저장하고 `여성`으로 보여 줄 수 있습니다. `male`과 `female`은 [`randName`](../name/rand-name)의 `gender`가 받는 코드와 같으므로, 뽑은 성별로 이름을 뽑을 목록을 고를 수 있습니다.

::: lang js

```javascript
randGender({ language: 'ko', output: 'detail' });
// [{ gender: '여성', code: 'female', language: 'ko', identity: null }]
```

:::

::: lang dart

```dart
randGenderDetails(language: WordLanguage.ko).first; // GenderDetail(여성, female, ko, null)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randGender`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_gender(language="ko", output="detail")
# [GenderDetail(gender='여성', code='female', language='ko', identity=None)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `gender` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 표기. |
| `code` | `GenderCode` | `male`, `female`, `nonbinary`, `unknown` 중 하나. 언어와 관계없이 같습니다. |
| `language` | `WordLanguage` | 표기를 쓴 언어. |
| `identity` | <Lang js="NonbinaryIdentity &#124; null" dart="NonbinaryIdentity?" py="NonbinaryIdentity &#124; None" code /> | 표기가 나타내는 [정체성 명칭](#identities). `nonbinary`, `genderqueer`, `genderfluid`, `agender`, `demigirl`, `demiboy`, `bigender` 중 하나이고 언어와 관계없이 같습니다. <Lang js="nonbinaryIdentity" dart="nonbinaryIdentity" py="nonbinary_identity" code />가 명칭을 쓴 경우가 아니면 <Lang js="null" dart="null" py="None" code />입니다. |

## 함께 보기 {#see-also}

- [`randAge`](../age/rand-age) — 함께 쓸 나이.
- [`randName`](../name/rand-name) — 그 성별의 목록에서 뽑은 이름.
