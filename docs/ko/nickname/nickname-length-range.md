# nicknameLengthRange

해당 언어가 만들 수 있는 모든 닉네임 길이를 글자 수로 알려 줍니다. [`randNickname`](./rand-nickname)이 <Lang js="minLength" dart="minLength" py="min_length" code />나 <Lang js="maxLength" dart="maxLength" py="max_length" code />를 생략했을 때 사용하는 값이 바로 이것입니다.

::: lang js

```javascript
import { nicknameLengthRange } from 'randino';

nicknameLengthRange('ko'); // [1, 12]
nicknameLengthRange('ko', false); // [1, 8]
nicknameLengthRange('en'); // [3, 30]
nicknameLengthRange('zh'); // [2, 5]
nicknameLengthRange('ko', true, '-'); // [1, 14]
```

| 파라미터          | 타입                     | 기본값  | 설명                                    |
| ----------------- | ------------------------ | ------- | --------------------------------------- |
| `language`        | `NicknameLanguageOption` | `'all'` | 언어, 또는 `'all'`로 전체               |
| `includeModifier` | `boolean`                | `true`  | 수식어가 들어가는 형태를 포함           |
| `wordSeparator`   | `string`                 | —       | 구분자가 단어 사이에 더하는 길이를 포함 |

`[min, max]`를 반환합니다.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nicknameLengthRange(language: NicknameLanguage.ko); // LengthRange(1, 12)
nicknameLengthRange(language: NicknameLanguage.ko, includeModifier: false); // LengthRange(1, 8)
nicknameLengthRange(language: NicknameLanguage.en); // LengthRange(3, 30)
nicknameLengthRange(language: NicknameLanguage.zh); // LengthRange(2, 5)
nicknameLengthRange(language: NicknameLanguage.ko, wordSeparator: '-'); // LengthRange(1, 14)
```

| 파라미터          | 타입                | 기본값 | 설명                                    |
| ----------------- | ------------------- | ------ | --------------------------------------- |
| `language`        | `NicknameLanguage?` | `null` | 언어, 또는 null로 전체                  |
| `includeModifier` | `bool`              | `true` | 수식어가 들어가는 형태를 포함           |
| `wordSeparator`   | `String?`           | `null` | 구분자가 단어 사이에 더하는 길이를 포함 |

값으로 비교되는 `LengthRange`를 반환합니다.

:::

::: lang py

```python
from randino import nickname_length_range

nickname_length_range("ko")  # (1, 12)
nickname_length_range("ko", include_modifier=False)  # (1, 8)
nickname_length_range("en")  # (3, 30)
nickname_length_range("zh")  # (2, 5)
nickname_length_range("ko", word_separator="-")  # (1, 14)
```

| 파라미터 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | `NicknameLanguageOption` | `"all"` | 언어, 또는 `"all"`로 전체 |
| `include_modifier` | `bool` | `True` | 수식어가 들어가는 형태를 포함 |
| `word_separator` | `str \| None` | `None` | 구분자가 단어 사이에 더하는 길이를 포함 |

`tuple[int, int]`를 반환합니다.

:::

## 범위가 넓은 것은 의도된 것입니다

아래쪽 끝은 명사 하나이고 위쪽 끝은 수식어와 명사와 뒤따르는 단어를 모두 더한 것입니다. 그래서 기본 범위는 **모든 형태**를 포함하며, 결과물의 일반적인 모습을 결정하는 것은 범위가 아니라 형태별 가중치입니다. 범위를 좁히는 것이 곧 형태를 빼는 방법입니다.

::: lang js

```javascript
nicknameLengthRange('ko'); // [1, 12] — 모든 형태
randNickname({ language: 'ko', maxLength: 3, count: 3 });
// ['노을', '파란곰', '수달'] — 세 단어가 들어갈 자리가 없습니다
```

:::

::: lang dart

```dart
nicknameLengthRange(language: NicknameLanguage.ko); // LengthRange(1, 12) — 모든 형태
randNickname(language: NicknameLanguage.ko, maxLength: 3, count: 3);
// ['노을', '파란곰', '수달'] — 세 단어가 들어갈 자리가 없습니다
```

:::

::: lang py

```python
nickname_length_range("ko")  # (1, 12) — 모든 형태
rand_nickname(language="ko", max_length=3, count=3)
# ['노을', '파란곰', '수달'] — 세 단어가 들어갈 자리가 없습니다
```

:::

## 범위를 넓히거나 좁히는 두 가지

**구분자는 닉네임의 일부입니다.** 구분자의 길이도 <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code />에 포함되므로, 이 함수에 구분자를 넘겨 보면 남은 범위를 알 수 있습니다.

::: lang js

```javascript
nicknameLengthRange('ko'); // [1, 12]
nicknameLengthRange('ko', true, '-'); // [1, 14] — 가장 긴 형태에는 구분자가 두 개
nicknameLengthRange('en', true, ' '); // [3, 32]
```

:::

::: lang dart

```dart
nicknameLengthRange(language: NicknameLanguage.ko); // LengthRange(1, 12)
nicknameLengthRange(language: NicknameLanguage.ko, wordSeparator: '-'); // LengthRange(1, 14)
nicknameLengthRange(language: NicknameLanguage.en, wordSeparator: ' '); // LengthRange(3, 32)
```

:::

::: lang py

```python
nickname_length_range("ko")  # (1, 12)
nickname_length_range("ko", word_separator="-")  # (1, 14) — 가장 긴 형태에는 구분자가 두 개
nickname_length_range("en", word_separator=" ")  # (3, 32)
```

:::

**무작위 접미사는 이 범위 밖에 있습니다.** [`randSuffix`](../affix/rand-suffix)는 닉네임이 완성된 뒤에 토큰을 붙이므로, <Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 닉네임 전체를 가리키며 빼고 셀 것이 없습니다.

## 함께 보기

- [`randNickname`](./rand-nickname) — 길이 옵션이 쓰이는 곳.
- [상수](../reference/constants) — 모든 길이 옵션이 제한되는 절대 범위.
