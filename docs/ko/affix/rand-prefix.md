# randPrefix

문자열 하나, 또는 배열 안의 모든 문자열 앞에 무작위 토큰을 붙입니다. [`randSuffix`](./rand-suffix)의 거울상이며, 구분자가 앞에 와야 하는 곳을 위한 것입니다. 샤드, 테넌트, 딱히 정렬 기준이 없는 키 같은 것들입니다.

::: lang js

```javascript
import { randNickname, randPrefix } from 'randino';

randPrefix('멋진사자'); // 'nVtRC_멋진사자'
randPrefix('order-4021', { length: 4, separator: '-' }); // 'k3Rm-order-4021'

randPrefix(randNickname({ language: 'en', count: 2 }));
// ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
```

| 옵션        | 타입                 | 기본값 | 설명                                       |
| ----------- | -------------------- | ------ | ------------------------------------------ |
| `value`     | `string \| string[]` | —      | 앞에 붙일 대상. 옵션이 아니라 첫 번째 인자 |
| `length`    | `number`             | `5`    | 토큰의 글자 수. `1` … `32`로 제한          |
| `separator` | `string`             | `'_'`  | 토큰과 값 사이에 들어감                    |
| `charset`   | `string`             | _내장_ | 토큰을 뽑아 쓸 문자들                      |

`string`에는 `string`을, `string[]`에는 `string[]`을 반환합니다.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPrefix('멋진사자'); // 'nVtRC_멋진사자'
randPrefix('order-4021', length: 4, separator: '-'); // 'k3Rm-order-4021'

randPrefixAll(randNickname(language: NicknameLanguage.en, count: 2));
// ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
```

| 파라미터    | 타입      | 기본값 | 설명                              |
| ----------- | --------- | ------ | --------------------------------- |
| `value`     | `String`  | —      | 앞에 붙일 대상. 위치 인자         |
| `length`    | `int`     | `5`    | 토큰의 글자 수. `1` … `32`로 제한 |
| `separator` | `String`  | `'_'`  | 토큰과 값 사이에 들어감           |
| `charset`   | `String?` | `null` | 토큰을 뽑아 쓸 문자들             |

`String`을 반환합니다. **리스트 형태는 `randPrefixAll`이며**, `randSuffixAll`이 존재하는 이유와 같습니다.

:::

::: lang py

```python
from randino import rand_nickname, rand_prefix

rand_prefix("멋진사자")  # 'nVtRC_멋진사자'
rand_prefix("order-4021", length=4, separator="-")  # 'k3Rm-order-4021'

rand_prefix(rand_nickname(language="en", count=2))
# ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
```

| 인자        | 타입               | 기본값 | 설명                                                |
| ----------- | ------------------ | ------ | --------------------------------------------------- |
| `value`     | `str \| list[str]` | —      | 앞에 붙일 대상. 위치 인자이며, 나머지는 키워드 전용 |
| `length`    | `int`              | `5`    | 토큰의 글자 수. `1` … `32`로 제한                   |
| `separator` | `str`              | `"_"`  | 토큰과 값 사이에 들어감                             |
| `charset`   | `str`              | `""`   | 토큰을 뽑아 쓸 문자들. 비어 있으면 기본값           |

`str`에는 `str`을, `list[str]`에는 `list[str]`을 반환합니다.

:::

## 나머지는 전부 `randSuffix`와 같습니다 {#everything-else-is-rand-suffix}

토큰, 기본값, 값 제한, 값마다 새 토큰을 뽑는다는 규칙까지 모두 동일합니다. 두 함수는 구현을 공유하고 토큰이 어느 쪽에 붙는지만 다릅니다. [`randSuffix`](./rand-suffix)의 문자 집합 설명이 여기에도 그대로 적용됩니다.

## 함께 보기

- [`randSuffix`](./rand-suffix) — 같은 토큰을 앞이 아니라 뒤에.
- [상수](../reference/constants) — 기본 문자 집합과 길이 상한.
