# nameLengthRange

해당 언어에서 전체 이름의 자연스러운 길이 범위를, 고유 표기의 글자 수로 알려 줍니다. [`randName`](./rand-name)이 <Lang js="minLength" dart="minLength" py="min_length" code />나 <Lang js="maxLength" dart="maxLength" py="max_length" code />를 생략했을 때 사용하는 값이 바로 이것입니다. 무언가를 생성하는 대신 언어에 대한 질문에 답하는 순수 함수이며, 언어를 생략하면 모든 언어를 한꺼번에 다룬 답을 돌려줍니다.

::: lang js

```javascript
import { nameLengthRange } from 'randino';

nameLengthRange('ko'); // [2, 3]
nameLengthRange('ko', false); // [1, 2]
nameLengthRange('en'); // [7, 21]
nameLengthRange('en', true, true); // [11, 32]
```

| 파라미터            | 타입                 | 기본값  | 설명                                  |
| ------------------- | -------------------- | ------- | ------------------------------------- |
| `language`          | `NameLanguageOption` | `'all'` | 언어, 또는 `'all'`로 전체             |
| `includeSurname`    | `boolean`            | `true`  | 성을 길이에 포함                      |
| `includeMiddleName` | `boolean`            | `false` | 중간 이름이 있는 언어라면 길이에 포함 |

`[min, max]`를 반환합니다.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nameLengthRange(language: NameLanguage.ko); // LengthRange(2, 3)
nameLengthRange(language: NameLanguage.ko, includeSurname: false); // LengthRange(1, 2)
nameLengthRange(language: NameLanguage.en); // LengthRange(7, 21)
nameLengthRange(language: NameLanguage.en, includeMiddleName: true); // LengthRange(11, 32)
```

| 파라미터            | 타입            | 기본값  | 설명                                  |
| ------------------- | --------------- | ------- | ------------------------------------- |
| `language`          | `NameLanguage?` | `null`  | 언어, 또는 null로 전체                |
| `includeSurname`    | `bool`          | `true`  | 성을 길이에 포함                      |
| `includeMiddleName` | `bool`          | `false` | 중간 이름이 있는 언어라면 길이에 포함 |

값으로 비교되는 `LengthRange`를 반환합니다. `nameLengthRange(language: NameLanguage.ko) == const LengthRange(2, 3)`은 `true`입니다.

:::

::: lang py

```python
from randino import name_length_range

name_length_range("ko")  # (2, 3)
name_length_range("ko", include_surname=False)  # (1, 2)
name_length_range("en")  # (7, 21)
name_length_range("en", include_middle_name=True)  # (11, 32)
```

| 파라미터              | 타입                 | 기본값  | 설명                                  |
| --------------------- | -------------------- | ------- | ------------------------------------- |
| `language`            | `NameLanguageOption` | `"all"` | 언어, 또는 `"all"`로 전체             |
| `include_surname`     | `bool`               | `True`  | 성을 길이에 포함                      |
| `include_middle_name` | `bool`               | `False` | 중간 이름이 있는 언어라면 길이에 포함 |

`tuple[int, int]`를 반환합니다. 이 헬퍼와 옆의 두 헬퍼는 키워드 인자뿐 아니라 위치 인자로도 호출할 수 있습니다. 짧아서 어느 쪽으로 써도 읽히기 때문이며, 키워드 전용인 생성 함수들과는 다릅니다.

:::

## 켜져 있는 요소만 셉니다 {#counts-only-what-is-switched-on}

이것이 알아 둘 만한 부분입니다. 성을 빼면 범위가 좁아지는 대신 느슨해지고, 그렇다고 이름이 늘어나서 빈자리를 채우지도 않습니다. 그리고 없는 중간 이름을 요청해도 범위가 넓어지지 않습니다.

::: lang js

```javascript
nameLengthRange('ko', true, true); // [2, 3] — 한국어에는 중간 이름이 없습니다
```

:::

::: lang dart

```dart
nameLengthRange(language: NameLanguage.ko, includeMiddleName: true);
// LengthRange(2, 3) — 한국어에는 중간 이름이 없습니다
```

:::

::: lang py

```python
name_length_range("ko", include_middle_name=True)
# (2, 3) — 한국어에는 중간 이름이 없습니다
```

:::

## 함께 보기

- [`randName`](./rand-name) — 길이 옵션이 실제로 쓰이는 곳.
- [`nameSupportsMiddleName`](./name-supports-middle-name) — 애초에 셀 중간 이름이 있는지 여부.
- [상수](../reference/constants) — 모든 길이 옵션이 제한되는 절대 범위.
