# sentenceLengthRange

Every sentence length the language can produce, in characters. That is what [`randSentence`](./rand-sentence) falls back to when `minLength` or `maxLength` is omitted.

::: lang js

```javascript
import { sentenceLengthRange } from 'randino';

sentenceLengthRange('ko'); // [6, 41]
sentenceLengthRange('en'); // [13, 92]
sentenceLengthRange('zh'); // [4, 20]
sentenceLengthRange(); // [4, 102] — every language at once
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

sentenceLengthRange(WordLanguage.ko); // LengthRange(6, 41)
sentenceLengthRange(WordLanguage.en); // LengthRange(13, 92)
sentenceLengthRange(WordLanguage.zh); // LengthRange(4, 20)
sentenceLengthRange(); // LengthRange(4, 102) — every language at once
```

:::

::: lang py

```python
from randino import sentence_length_range

sentence_length_range("ko")  # (6, 41)
sentence_length_range("en")  # (13, 92)
sentence_length_range("zh")  # (4, 20)
sentence_length_range()  # (4, 102) — every language at once
```

:::

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | The language to measure, or every one at once. |

Returns <Lang js="[min, max]" dart="a LengthRange" py="(min, max)" code />, both inclusive.

## Why the range is so wide

The lower end is the shortest shape with the shortest words in it, and the upper end the longest shape with a modifier on every phrase. A sentence that lands anywhere between the two is a sentence the language can write, and which one you get is decided inside that range — by the frame weights, not by the ends.

That is also what makes narrowing it useful. Ask for a short range and the shapes that cannot fit drop out:

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

Length picks the shape, not the words: a range too narrow for a modifier drops the modifier rather than truncating anything. A range no shape of the language can satisfy is answered with the closest one it has.

## See also

- [`randSentence`](./rand-sentence) — the generator these bounds belong to.
- [Constants](../reference/constants) — the ceiling both bounds are clamped to.
