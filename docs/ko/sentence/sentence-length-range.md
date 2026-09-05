# sentenceLengthRange

한 언어가 만들 수 있는 문장 길이의 전체 범위를 글자 수로 돌려줍니다. [`randSentence`](./rand-sentence)에서 `minLength`나 `maxLength`를 생략했을 때 쓰는 값입니다.

::: lang js

```javascript
import { sentenceLengthRange } from 'randino';

sentenceLengthRange('ko'); // [5, 43]
sentenceLengthRange('en'); // [12, 92]
sentenceLengthRange('zh'); // [4, 20]
sentenceLengthRange(); // [4, 105] — 모든 언어를 한꺼번에
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

sentenceLengthRange(WordLanguage.ko); // LengthRange(5, 43)
sentenceLengthRange(WordLanguage.en); // LengthRange(12, 92)
sentenceLengthRange(WordLanguage.zh); // LengthRange(4, 20)
sentenceLengthRange(); // LengthRange(4, 105) — 모든 언어를 한꺼번에
```

:::

::: lang py

```python
from randino import sentence_length_range

sentence_length_range("ko")  # (5, 43)
sentence_length_range("en")  # (12, 92)
sentence_length_range("zh")  # (4, 20)
sentence_length_range()  # (4, 105) — 모든 언어를 한꺼번에
```

:::

| 인자 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 측정할 언어, 또는 모든 언어를 한꺼번에. |

<Lang js="[min, max]" dart="LengthRange" py="(min, max)" code />를 돌려주며 양 끝을 포함합니다.

## 기본 범위 {#why-the-range-is-so-wide}

범위가 넓은 것은 양 끝이 극단이기 때문입니다. 아래쪽 끝은 가장 짧은 형태에 가장 짧은 단어를 넣은 것이고, 위쪽 끝은 가장 긴 형태의 모든 구에 수식어를 붙인 것입니다. 그 사이 어디에 떨어지든 그 언어가 쓸 수 있는 문장이며, 어느 것이 나올지는 범위가 아니라 형태의 가중치가 정합니다.

그래서 범위를 좁히는 것이 쓸모 있습니다. 짧은 범위를 주면 들어가지 못하는 형태가 빠집니다.

::: lang js

```javascript
randSentence({ language: 'en', minLength: 14, maxLength: 26, count: 3 });
// ['The brave wine gathers.', 'The oni lifts the icy tea.', 'The toe aches in the lake.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, minLength: 14, maxLength: 26, count: 3);
// [The brave wine gathers., The oni lifts the icy tea., The toe aches in the lake.]
```

:::

::: lang py

```python
rand_sentence(language="en", min_length=14, max_length=26, count=3)
# ['The brave wine gathers.', 'The oni lifts the icy tea.', 'The toe aches in the lake.']
```

:::

길이는 단어가 아니라 형태를 고릅니다. 수식어가 들어갈 수 없을 만큼 범위가 좁으면 단어를 자르는 대신 수식어를 뺍니다. 어떤 형태로도 만족시킬 수 없는 범위는 가장 가까운 형태로 답합니다.

## 함께 보기 {#see-also}

- [`randSentence`](./rand-sentence) — 이 범위가 속한 생성 함수.
- [상수](../reference/constants) — 두 길이 옵션이 제한되는 상한.
