# nameSupportsRoman

로마자 표기를 요청했을 때 고유 표기와 다른 결과가 나오는지 알려 줍니다. `false`를 돌려주는 것은 영어뿐입니다. 영어 이름은 이미 라틴 알파벳으로 쓰여 있기 때문입니다. 옆의 두 헬퍼와 마찬가지로 순수 함수이며, 생성기와 같은 방식으로 언어를 받습니다.

::: lang js

```javascript
import { nameSupportsRoman } from 'randino';

nameSupportsRoman('ko'); // true
nameSupportsRoman('en'); // false
```

| 파라미터   | 타입                 | 기본값  | 설명                      |
| ---------- | -------------------- | ------- | ------------------------- |
| `language` | `NameLanguageOption` | `'all'` | 언어, 또는 `'all'`로 전체 |

`boolean`을 반환합니다.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nameSupportsRoman(NameLanguage.ko); // true
nameSupportsRoman(NameLanguage.en); // false
```

| 파라미터   | 타입            | 기본값 | 설명                   |
| ---------- | --------------- | ------ | ---------------------- |
| `language` | `NameLanguage?` | `null` | 언어, 또는 null로 전체 |

`bool`을 반환합니다.

:::

::: lang py

```python
from randino import name_supports_roman

name_supports_roman("ko")  # True
name_supports_roman("en")  # False
```

| 파라미터   | 타입                 | 기본값  | 설명                      |
| ---------- | -------------------- | ------- | ------------------------- |
| `language` | `NameLanguageOption` | `"all"` | 언어, 또는 `"all"`로 전체 |

`bool`을 반환합니다.

:::

## 함께 보기

- [`randName`](./rand-name) — 이 함수가 답해 주는 문자 체계 옵션.
- [`randName`의 상세 출력](./rand-name#the-detail-output) — 두 표기를 한 번에 돌려주므로 물어볼 필요가 없는 쪽.
- [지원 언어](../guide/languages) — 각 언어가 쓰는 로마자 표기 규칙.
