# randSuffix

문자열 하나, 또는 배열 안의 모든 문자열 뒤에 무작위 토큰을 붙입니다. `MistyOwl`은 `MistyOwl_nVtRC`가 됩니다. 닉네임이 겹칠 가능성이 낮은 정도에서 겹칠 수 없는 상태로 바뀌는 지점이 여기이며, 이 라이브러리가 만든 문자열이 아니어도 상관없이 받습니다.

::: lang js

```javascript
import { randNickname, randSuffix } from 'randino';

randSuffix('MistyOwl'); // 'MistyOwl_nVtRC'
randSuffix('MistyOwl', { length: 8, separator: '-' }); // 'MistyOwl-k3Rm9dQx'

randSuffix(randNickname({ language: 'en', count: 2 }));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5']
```

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `string \| string[]` | — | 뒤에 붙일 대상. 옵션이 아니라 첫 번째 인자. 생략하면 토큰만 |
| `length` | `number` | `5` | 토큰의 글자 수. `1` … `32`로 제한 |
| `separator` | `string` | `'_'` | 값과 토큰 사이에 들어감. 빈 문자열이면 바로 이어 붙음 |
| `charset` | `string` | _내장_ | 토큰을 뽑아 쓸 문자들 |

`string`에는 `string`을, `string[]`에는 `string[]`을 반환합니다.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randSuffix(value: 'MistyOwl'); // 'MistyOwl_nVtRC'
randSuffix(value: 'MistyOwl', length: 8, separator: '-'); // 'MistyOwl-k3Rm9dQx'

randSuffixAll(randNickname(language: WordLanguage.en, count: 2));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5']
```

| 파라미터    | 타입      | 기본값 | 설명                              |
| ----------- | --------- | ------ | --------------------------------- |
| `value`     | `String?` | `null` | 뒤에 붙일 대상. 생략하면 토큰만   |
| `length`    | `int`     | `5`    | 토큰의 글자 수. `1` … `32`로 제한 |
| `separator` | `String`  | `'_'`  | 값과 토큰 사이에 들어감           |
| `charset`   | `String?` | `null` | 토큰을 뽑아 쓸 문자들             |

`String`을 반환합니다. `value`를 포함해 모든 파라미터가 이름 있는 파라미터입니다. Dart는 선택적 위치 파라미터와 이름 있는 파라미터를 함께 쓸 수 없고, 값을 선택 사항으로 만드는 쪽이 짧은 호출보다 가치가 있었습니다. **리스트 형태는 `randSuffixAll`입니다.** `List<String>`을 받아 `List<String>`을 돌려주며, 이름 있는 파라미터는 동일합니다. Dart에는 오버로드도 유니온 타입도 없기 때문에, 하나가 두 형태를 받는 대신 두 함수로 나뉘어 있습니다.

:::

::: lang py

```python
from randino import rand_nickname, rand_suffix

rand_suffix("MistyOwl")  # 'MistyOwl_nVtRC'
rand_suffix("MistyOwl", length=8, separator="-")  # 'MistyOwl-k3Rm9dQx'

rand_suffix(rand_nickname(language="en", count=2))
# ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5']
```

| 인자 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `str \| list[str] \| None` | `None` | 뒤에 붙일 대상. 위치 인자이며 나머지는 키워드 전용. 생략하면 토큰만 |
| `length` | `int` | `5` | 토큰의 글자 수. `1` … `32`로 제한 |
| `separator` | `str` | `"_"` | 값과 토큰 사이에 들어감 |
| `charset` | `str` | `""` | 토큰을 뽑아 쓸 문자들. 비어 있으면 기본값 |

`str`에는 `str`을, `list[str]`에는 `list[str]`을 반환합니다. `@overload`가 이 대응을 그대로 전달하므로 타입 검사기도 어느 쪽인지 압니다.

:::

## 토큰만 얻기 {#the-token-on-its-own}

장식 함수가 붙이는 것은 붙일 대상이 없어도 그 자체로 쓸모가 있으므로, 값은 선택 사항입니다. 값을 주지 않으면 `randSuffix`는 토큰만 돌려줍니다. 구분자는 붙지 않습니다. 사이에 둘 것이 없기 때문입니다.

::: lang js

```javascript
randSuffix(); // 'nVtRC'
randSuffix({ length: 8 }); // 'k3Rm9dQx'
```

첫 번째 인자는 값 또는 옵션이며, 문자열이 옵션 객체가 될 일은 없으므로 두 형태 모두 모호하지 않게 읽힙니다.

:::

::: lang dart

```dart
randSuffix(); // 'nVtRC'
randSuffix(length: 8); // 'k3Rm9dQx'
```

:::

::: lang py

```python
rand_suffix()  # 'nVtRC'
rand_suffix(length=8)  # 'k3Rm9dQx'
```

:::

빈 문자열은 값이고, 값을 주지 않은 것은 값이 아닙니다. <Lang js="randSuffix('')" dart="randSuffix(value: '')" py="rand_suffix(&quot;&quot;)" code />는 구분자까지 포함해 `'_nVtRC'`를 돌려줍니다.

## 값마다 새로 뽑은 토큰 {#a-fresh-token-for-every-value}

한 번의 호출에 하나가 아닙니다. 리스트를 넘길 이유가 바로 이것입니다. 닉네임 100개를 넘기면 서로 다른 토큰 100개가 붙으므로, 서로 간에도 겹치지 않습니다.

::: lang js

```javascript
randSuffix(['Owl', 'Owl', 'Owl']);
// ['Owl_nVtRC', 'Owl_AVcCV', 'Owl_gDe2C']
```

:::

::: lang dart

```dart
randSuffixAll(const ['Owl', 'Owl', 'Owl']);
// ['Owl_nVtRC', 'Owl_AVcCV', 'Owl_gDe2C']
```

:::

::: lang py

```python
rand_suffix(["Owl", "Owl", "Owl"])
# ['Owl_nVtRC', 'Owl_AVcCV', 'Owl_gDe2C']
```

:::

## 기본 문자 집합은 헷갈리는 글자를 뺍니다 {#the-default-charset}

`0`과 `O`, `1`과 `l`과 `I`가 없습니다. 접미사는 한 화면에서 읽어 다른 화면에 입력하는 값이고, 문제가 생기는 지점이 정확히 그 다섯 글자입니다. 더 좁히고 싶다면 더 짧은 문자 집합을 넘기면 됩니다.

::: lang js

```javascript
randSuffix('MistyOwl', { charset: '0123456789' }); // 'MistyOwl_40218'
randSuffix('MistyOwl', { charset: AFFIX_CHARSET.replace(/[A-Z]/g, '') }); // 'MistyOwl_kq3mv'
```

:::

::: lang dart

```dart
randSuffix(value: 'MistyOwl', charset: '0123456789'); // 'MistyOwl_40218'
randSuffix(value: 'MistyOwl', charset: affixCharset.replaceAll(RegExp('[A-Z]'), '')); // 'MistyOwl_kq3mv'
```

:::

::: lang py

```python
rand_suffix("MistyOwl", charset="0123456789")  # 'MistyOwl_40218'
rand_suffix("MistyOwl", charset="".join(c for c in AFFIX_CHARSET if not c.isupper()))
# 'MistyOwl_kq3mv'
```

:::

## 왜 닉네임 옵션이 아닌가 {#why-this-is-not-a-nickname-option}

예전에는 옵션이었습니다. <Lang js="uniqueSuffix" dart="uniqueSuffix" py="unique_suffix" code />과 그 옆의 세 옵션이 그것입니다. 하지만 문자열에 토큰을 붙이는 일은 닉네임에 대한 이야기가 아니라 문자열에 대한 이야기입니다. 별도 함수가 되면서 이름에도, 주문 번호에도, 이미 가지고 있는 무엇에든 쓸 수 있게 되었고, 닉네임 생성기의 길이 옵션은 접미사 앞부분이 아니라 닉네임 전체를 가리키는 값으로 돌아왔습니다.

## 함께 보기

- [`randPrefix`](./rand-prefix) — 같은 토큰을 뒤가 아니라 앞에.
- [`randModifier`](./rand-modifier) — 토큰이 아니라 단어를 붙이는 세 번째 장식 함수.
- [`randNickname`](../nickname/rand-nickname) — 이 함수가 가장 자주 붙는 대상.
- [상수](../reference/constants) — 기본 문자 집합과 길이 상한.
