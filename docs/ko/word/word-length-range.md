# wordLengthRange

언어의 단어 풀이 담고 있는 가장 짧은 단어와 가장 긴 단어의 글자 수를 알려 줍니다. <Lang js="minLength" dart="minLength" py="min_length" code />나 <Lang js="maxLength" dart="maxLength" py="max_length" code />를 생략했을 때 [`randWord`](./rand-word)가 사용하는 값이 바로 이것입니다.

::: lang js

```javascript
import { wordLengthRange } from 'randino';

wordLengthRange('ko'); // [1, 4]
wordLengthRange('en'); // [3, 11]
wordLengthRange(); // [1, 12] — 모든 언어를 한꺼번에
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

wordLengthRange(language: WordLanguage.ko); // LengthRange(1, 4)
wordLengthRange(language: WordLanguage.en); // LengthRange(3, 11)
wordLengthRange(); // LengthRange(1, 12) — 모든 언어를 한꺼번에
```

:::

::: lang py

```python
from randino import word_length_range

word_length_range("ko")  # (1, 4)
word_length_range("en")  # (3, 11)
word_length_range()  # (1, 12) — 모든 언어를 한꺼번에
```

:::

## 인자

| 인자 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 조회할 언어, 또는 모든 언어. |
| `theme` | <Lang js="WordThemeOption" dart="WordTheme?" py="WordThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 조회할 테마, 또는 모든 테마. |

다른 언어 조회 함수들과 마찬가지로 JavaScript와 Python에서는 위치 인자이고 Dart에서는 이름 있는 인자입니다.

## 테마를 좁히면 범위도 좁아집니다

테마는 그 자체로 하나의 단어 풀이므로, 테마의 범위는 언제나 언어 전체의 범위 안에 들어갑니다.

::: lang js

```javascript
wordLengthRange('en'); // [3, 11]
wordLengthRange('en', 'weather'); // [4, 10]
wordLengthRange('zh'); // [2, 3] — 중국어 명사는 모두 두세 글자입니다
```

:::

::: lang dart

```dart
wordLengthRange(language: WordLanguage.en); // LengthRange(3, 11)
wordLengthRange(language: WordLanguage.en, theme: WordTheme.weather); // LengthRange(4, 10)
wordLengthRange(language: WordLanguage.zh); // LengthRange(2, 3)
```

:::

::: lang py

```python
word_length_range("en")  # (3, 11)
word_length_range("en", "weather")  # (4, 10)
word_length_range("zh")  # (2, 3)
```

:::

풀이 만족시킬 수 없는 범위를 요청해도 오류가 아닙니다. 생성기는 단어를 자르는 대신 가장 가까운 단어로 답합니다.

## 함께 보기

- [`randWord`](./rand-word) — 이 범위를 사용하는 곳.
- [`nicknameLengthRange`](../nickname/nickname-length-range) — 닉네임 전체에 대해 같은 것을 묻는 함수.
