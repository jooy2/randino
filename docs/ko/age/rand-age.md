# randAge

샘플 인물의 나이를 만들어 `count`개만큼 정수(만 나이)로 돌려줍니다. 모든 나이를 고르게 뽑지 않고 인구 분포를 닮은 곡선을 따르므로, 어린이나 일흔 넘은 사람보다 청년이 훨씬 자주 나옵니다. [`output: 'detail'`](#the-detail-output)을 주면 각 나이가 어느 연령대에 속하는지도 알려 줍니다.

나이에는 언어가 없으므로, 생성 함수 가운데 유일하게 `language`를 받지 않습니다.

::: lang js

```javascript
import { randAge } from 'randino';

randAge();
// [34]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randAge();
// [34]
```

:::

::: lang py

```python
from randino import rand_age

rand_age()
# [34]
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <Lang js="minAge" dart="minAge" py="min_age" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | `0` | 돌려줄 가장 어린 나이. `0` … `120`으로 제한됩니다. |
| <Lang js="maxAge" dart="maxAge" py="max_age" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | `100` | 돌려줄 가장 많은 나이. `0` … `120`으로 제한되며, 생략했는데 <Lang js="minAge" dart="minAge" py="min_age" code />가 `100`보다 크면 `120`이 됩니다. |
| `group` | <Lang js="AgeGroupOption" dart="Set&lt;AgeGroup&gt;?" py="AgeGroupOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 어느 연령대에서 뽑을지. [연령대](#groups)를 보세요. |
| `distribution` | `AgeDistribution` | <Lang js="'population'" dart="AgeDistribution.population" py="&quot;population&quot;" code /> | `population`은 [곡선](#how-ages-are-spread)을 따르고, `uniform`은 범위 안의 모든 나이를 같은 확률로 뽑습니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 나이 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 나이를 두 번 돌려주지 않습니다. 범위가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 숫자, 또는 나이마다 `AgeDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

범위를 거꾸로 주면 <Lang js="maxAge" dart="maxAge" py="max_age" code />를 지킵니다. 다른 생성 함수의 길이 옵션이 최댓값을 지키는 것과 같은 이유로, 호출하는 쪽이 보통 붙들고 있는 쪽이 최댓값이기 때문입니다.

::: lang js

```javascript
randAge({ minAge: 18, count: 3 }); // [22, 45, 31]
randAge({ minAge: 30, maxAge: 39, count: 3 }); // [33, 30, 37]
```

:::

::: lang dart

```dart
randAge(minAge: 18, count: 3); // [22, 45, 31]
randAge(minAge: 30, maxAge: 39, count: 3); // [33, 30, 37]
```

:::

::: lang py

```python
rand_age(min_age=18, count=3)  # [22, 45, 31]
rand_age(min_age=30, max_age=39, count=3)  # [33, 30, 37]
```

:::

## 나이가 퍼지는 방식 {#how-ages-are-spread}

0세부터 100세까지 고르게 뽑으면 90대가 20대만큼 나옵니다. 샘플 인물 목록은 그렇게 생기지 않았으므로, 기본 추첨은 곡선을 따릅니다. 25세에서 35세 사이가 가장 높고, 어린이는 그보다 낮으며, 중년을 지나며 완만하게 줄다가 일흔을 넘으면 빠르게 떨어집니다. 기본 범위에서는 다음과 같은 비율이 됩니다.

| 나이     | 비율  |
| -------- | ----- |
| 0~12세   | 10.7% |
| 13~19세  | 9.0%  |
| 20~39세  | 33.8% |
| 40~64세  | 33.7% |
| 65~100세 | 12.9% |
| 80~100세 | 2.2%  |

이 곡선은 특정 나라의 인구 조사가 아니라 인구 일반의 모양입니다. 측정한 값이 아니라 직접 정한 값입니다. 인구 조사 자료는 자체 이용 조건이 붙는 데이터셋이고, 어느 나라의 모양도 샘플 데이터에 맞지 않습니다. 한국은 50대에서, 나이지리아는 0세에서 가장 높습니다.

범위를 좁혀도 곡선은 그대로 적용되므로, `minAge: 60`에서도 62세가 88세보다 자주 나옵니다. `distribution: 'uniform'`을 주면 곡선을 끄고 범위 안의 모든 나이를 같은 확률로 뽑습니다.

::: lang js

```javascript
randAge({ minAge: 60, count: 5 }); // [62, 68, 61, 75, 64]
randAge({ minAge: 60, distribution: 'uniform', count: 5 }); // [91, 63, 77, 88, 70]
```

:::

::: lang dart

```dart
randAge(minAge: 60, count: 5); // [62, 68, 61, 75, 64]
randAge(minAge: 60, distribution: AgeDistribution.uniform, count: 5); // [91, 63, 77, 88, 70]
```

:::

::: lang py

```python
rand_age(min_age=60, count=5)  # [62, 68, 61, 75, 64]
rand_age(min_age=60, distribution="uniform", count=5)  # [91, 63, 77, 88, 70]
```

:::

곡선은 `120`까지 이어지고 거기서 0이 됩니다. 100세는 이미 2만 번에 한 번꼴이라 기본 범위는 `100`에서 멈춥니다. <Lang js="minAge" dart="minAge" py="min_age" code />를 `100`보다 크게 주면, 아무도 쓰지 않은 상한과 부딪히지 않도록 <Lang js="maxAge" dart="maxAge" py="max_age" code />의 기본값이 `120`으로 바뀝니다.

## 연령대 {#groups}

`group`은 다음 연령대를 가리킵니다.

| 연령대   | 나이      |
| -------- | --------- |
| `child`  | 0~12세    |
| `teen`   | 13~19세   |
| `adult`  | 20~64세   |
| `senior` | 65세 이상 |

`teen`은 영어로 "-teen"으로 끝나는 나이이고, `senior`는 대부분의 연금·통계 제도가 노년으로 세기 시작하는 나이에서 시작합니다.

::: lang js

연령대 하나, 또는 여러 연령대를 담은 배열을 줍니다.

```javascript
randAge({ group: 'teen', count: 3 }); // [15, 13, 18]
randAge({ group: ['adult', 'senior'], count: 3 }); // [41, 70, 28]
```

:::

::: lang dart

연령대의 집합을 줍니다. 빈 집합은 아무것도 고르지 않은 것이므로 `null`처럼 모든 연령대가 됩니다.

```dart
randAge(group: {AgeGroup.teen}, count: 3); // [15, 13, 18]
randAge(group: {AgeGroup.adult, AgeGroup.senior}, count: 3); // [41, 70, 28]
```

:::

::: lang py

연령대 하나, 또는 여러 연령대를 담은 시퀀스를 줍니다.

```python
rand_age(group="teen", count=3)  # [15, 13, 18]
rand_age(group=("adult", "senior"), count=3)  # [41, 70, 28]
```

:::

연령대는 범위를 대신하지 않고 범위 안을 좁힙니다. 그래서 `group: 'adult'`에 <Lang js="maxAge" dart="maxAge" py="max_age" code />가 `30`이면 20세에서 30세 사이에서 뽑습니다. 범위 안에 해당 나이가 하나도 없는 연령대는 범위가 답할 수 없는 요청이고, 이때는 범위를 따릅니다. 연령대를 주지 않은 것처럼 <Lang js="minAge" dart="minAge" py="min_age" code />부터 <Lang js="maxAge" dart="maxAge" py="max_age" code />까지에서 뽑습니다. 범위는 직접 쓴 숫자이고, 연령대는 그 숫자를 부르는 이름일 뿐이기 때문입니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randAge({ output: 'detail' });
// [{ age: 16, group: 'teen' }]
```

:::

::: lang dart

```dart
randAgeDetails().first; // AgeDetail(16, teen)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randAge`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_age(output="detail")
# [AgeDetail(age=16, group='teen')]
```

:::

| 필드    | 타입                                          | 설명                   |
| ------- | --------------------------------------------- | ---------------------- |
| `age`   | <Lang js="number" dart="int" py="int" code /> | 만 나이.               |
| `group` | `AgeGroup`                                    | 그 나이가 속한 연령대. |

## 함께 보기 {#see-also}

- [`randGender`](../gender/rand-gender) — 나이와 함께 쓸 성별.
- [`randName`](../name/rand-name) — 나이와 함께 쓸 이름.
