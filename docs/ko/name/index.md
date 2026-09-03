# 사람 이름

randino는 실제로 쓰이는 이름을 생성합니다. Emma Clover, Jack Reeves 같은 이름을 9개 언어로, 각 언어의 문자와 함께 영어 발음까지 만들어 냅니다. 폼, 시드 데이터, 목업, 픽스처 같은 샘플 데이터를 위한 기능입니다.

::: lang js

```javascript
import { randName } from 'randino';

randName({ language: 'en', count: 3 });
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randName(language: NameLanguage.en, count: 3);
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

::: lang py

```python
from randino import rand_name

rand_name(language="en", count=3)
# ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

## 제공되는 기능

| 함수 | 반환값 |
| --- | --- |
| [`randName`](./rand-name) | 이름 문자열, 또는 [이름마다 상세 정보](./rand-name#the-detail-output) |
| [`nameLengthRange`](./name-length-range) | 해당 언어에서 전체 이름의 자연스러운 길이 범위 |
| [`nameSupportsMiddleName`](./name-supports-middle-name) | 해당 언어에 중간 이름이 있는지 여부 |
| [`nameSupportsRoman`](./name-supports-roman) | 로마자 표기가 결과를 바꾸는지 여부 |

## 옵션의 동작 방식

두 생성기는 대부분의 옵션을 공유합니다. 아래는 사용하기 전에 동작을 알아 두면 좋은 옵션들입니다.

### `style` — 실제 이름과 만들어낸 이름

기본값인 `0`에서는 모든 요소를 실제로 쓰이는 이름 풀에서 뽑고, **그 범위를 벗어나지 않습니다**. 길이 범위가 여러 이름 길이를 허용할 때도, 길이를 먼저 굴린 다음 없는 길이를 만들어내는 대신 풀이 실제로 제공할 수 있는 길이 중에서 고릅니다.

`100`에 가까워지면 이름을 만들어냅니다. 라틴 문자와 키릴 문자는 음절 템플릿으로, 한국어·일본어·중국어는 이름에 쓰이는 글자를 자유롭게 조합해서 만듭니다. 중간값은 **이름마다, 그리고 요소마다** 따로 결정하므로 `50`은 한 배치 안에서, 때로는 한 이름 안에서 실제 요소와 만들어낸 요소를 섞습니다.

::: lang js

```javascript
randName({ language: 'en', style: 100, count: 3 });
// ['Deder Kuvoun', 'Jaihil Brouvinn', 'Thoowoun Wiatou']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.en, style: 100, count: 3);
// ['Deder Kuvoun', 'Jaihil Brouvinn', 'Thoowoun Wiatou']
```

:::

::: lang py

```python
rand_name(language="en", style=100, count=3)
# ['Deder Kuvoun', 'Jaihil Brouvinn', 'Thoowoun Wiatou']
```

:::

### 분포가 가파른 언어에서는 성씨에 가중치를 둡니다

한국어, 중국어, 베트남어의 성씨는 **실제 사용 빈도에 비례해서** 뽑습니다. 소수의 성씨가 인구 대부분을 차지하기 때문입니다. 한국어 이름의 약 5분의 1이 김씨로, 베트남어 이름의 5분의 2가 Nguyễn으로 나오며 이는 실제 명단과 같은 모습입니다. 풀에서 균등하게 뽑으면 김씨는 75명 중 1명이 되는데, 이것이야말로 출력이 한국어처럼 읽히지 않게 만드는 가장 큰 요인입니다.

나머지 여섯 언어는 성씨 분포의 꼬리가 충분히 길어서 균등 추출로도 실제와 자릿수가 맞습니다. 그래서 빈도표를 두지 않았습니다.

### 길이는 고유 표기를 기준으로 셉니다 {#length}

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 **요소 사이의 공백을 포함한 고유 표기의 글자 수**를 셉니다. 요청한 구조가 항상 우선합니다. 요청한 요소를 담기에 범위가 너무 좁으면, 요청한 성이나 중간 이름을 빼는 대신 생성기가 만들 수 있는 가장 가까운 이름을 돌려줍니다.

공백으로 구분되는 언어에서는 풀에서 다시 뽑는 방식으로 범위를 맞추므로, 아주 좁은 범위는 최선의 근사치가 됩니다. 한국어, 일본어, 중국어는 이름을 음절 단위로 조합하기 때문에 범위를 정확히 맞춥니다.

둘 다 생략하면 각 언어의 고유한 범위를 사용하며, 그 값은 <Lang js="nameLengthRange" dart="nameLengthRange" py="name_length_range" code />가 알려 줍니다. 이 기본값은 **언어별로** 결정되므로, 여러 언어를 섞어도 한국어 이름이 스페인어 이름의 길이에 맞춰 늘어나지 않습니다.

### `startsWith`는 이름 전체의 첫 글자에 적용됩니다

성이 먼저 오는 언어에서는 성에, 그 외에는 이름에 적용됩니다. 성을 끄면 언제나 이름에 적용됩니다. 실제 이름 중에 그 글자로 시작하는 것이 없어도 빈 결과가 아니라 이름을 돌려줍니다. 라틴 문자와 키릴 문자는 이름을 만들어내고(`Q` → `Qivu Railooth`), 한중일 문자는 그 글자 자체를 이름의 한 요소로 씁니다(`앙` + `지수` → `앙지수`).

전달한 문자열 중 첫 글자만 사용하며, 대소문자는 구분하지 않습니다.

### `unique`는 기본적으로 꺼져 있습니다

요청한 개수를 그대로 받기 위해서입니다. 중복을 제거하려면 켜면 되는데, 풀은 유한하므로 큰 개수를 요청하면 무한히 반복하는 대신 **더 적은** 개수를 돌려줍니다.

### 성별

`gender`는 이름을 어느 풀에서 뽑을지 결정합니다. 대부분의 언어에서는 그게 전부이고, 결과만 봐서는 알 수 없습니다. 한국어 이름은 자기가 어느 풀에서 왔는지 드러내지 않으니까요. 러시아어가 예외입니다. 부칭과 성이 모두 굴절해서 `Иванов`는 `Иванова`가 되고 `Николаевич`는 `Николаевна`가 됩니다.

생략하면 이름마다 성별을 하나씩 고릅니다. 어느 쪽이 쓰였는지는 [상세 출력](./rand-name#the-detail-output)이 알려 줍니다.
