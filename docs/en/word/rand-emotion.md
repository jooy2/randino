# randEmotion

What someone feels, from joy to a quiet regret.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'emotion'" dart="WordTheme.emotion" py="&quot;emotion&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randEmotion } from 'randino';

randEmotion({ language: 'en', count: 3 }); // ['Longing', 'Delight', 'Relief']
randEmotion({ language: 'en', output: 'detail' });
// [{ word: 'Longing', language: 'en', theme: 'emotion' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randEmotion(language: WordLanguage.en, count: 3); // [Longing, Delight, Relief]
```

Returns `List<String>`. For the detail form, pass `WordTheme.emotion` to `randWordDetails` — Dart has no overloads, and twenty-four more functions for it would be twenty-four too many.

:::

::: lang py

```python
from randino import rand_emotion

rand_emotion(language="en", count=3)  # ['Longing', 'Delight', 'Relief']
rand_emotion(language="en", output="detail")
# [WordDetail(word='Longing', language='en', theme='emotion')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
