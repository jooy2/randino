# randGem

Stones and metals, precious and ordinary alike.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'gem'" dart="WordTheme.gem" py="&quot;gem&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randGem } from 'randino';

randGem({ language: 'ko', count: 3 }); // ['금', '수정', '흑요석']
randGem({ language: 'en', output: 'detail' });
// [{ word: 'Gold', language: 'en', theme: 'gem' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randGem(language: WordLanguage.ko, count: 3); // [금, 수정, 흑요석]
randGem(language: WordLanguage.en, count: 3); // [Gold, Quartz, Obsidian]
```

Returns `List<String>`. For the detail form, pass `WordTheme.gem` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_gem

rand_gem(language="ko", count=3)  # ['금', '수정', '흑요석']
rand_gem(language="en", output="detail")
# [WordDetail(word='Gold', language='en', theme='gem')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
