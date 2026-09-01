# nameSupportsMiddleName

해당 언어에 중간 이름이 있는지 알려 줍니다. 한국어, 일본어, 중국어 이름에는 중간 부분이 없으므로 <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code />이 무시됩니다. 옆의 두 헬퍼와 마찬가지로 순수 함수이며, 생성기와 같은 방식으로 언어를 받습니다.

::: lang js

```javascript
import { nameSupportsMiddleName } from 'randino';

nameSupportsMiddleName('en'); // true
nameSupportsMiddleName('ko'); // false
nameSupportsMiddleName(); // true — 섞인 결과에는 중간 이름이 있는 언어가 포함됩니다
```

| 파라미터   | 타입                 | 기본값  | 설명                      |
| ---------- | -------------------- | ------- | ------------------------- |
| `language` | `NameLanguageOption` | `'all'` | 언어, 또는 `'all'`로 전체 |

`boolean`을 반환합니다.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nameSupportsMiddleName(NameLanguage.en); // true
nameSupportsMiddleName(NameLanguage.ko); // false
nameSupportsMiddleName(); // true — 섞인 결과에는 중간 이름이 있는 언어가 포함됩니다
```

| 파라미터   | 타입            | 기본값 | 설명                   |
| ---------- | --------------- | ------ | ---------------------- |
| `language` | `NameLanguage?` | `null` | 언어, 또는 null로 전체 |

`bool`을 반환합니다.

:::

::: lang py

```python
from randino import name_supports_middle_name

name_supports_middle_name("en")  # True
name_supports_middle_name("ko")  # False
name_supports_middle_name()  # True — 섞인 결과에는 중간 이름이 있는 언어가 포함됩니다
```

| 파라미터   | 타입                 | 기본값  | 설명                      |
| ---------- | -------------------- | ------- | ------------------------- |
| `language` | `NameLanguageOption` | `"all"` | 언어, 또는 `"all"`로 전체 |

`bool`을 반환합니다.

:::

아무 일도 하지 않는 체크박스를 보여 주는 대신, 체크박스를 감추는 데 쓰세요.

## 함께 보기

- [`randName`](./rand-name) — 이 함수가 답해 주는 중간 이름 옵션.
- [`nameLengthRange`](./name-length-range) — 중간 이름이 있는 언어에서만 그것을 세는 함수.
- [지원 언어](../guide/languages) — 어떤 언어에 중간 이름이 있는지 정리한 표.
