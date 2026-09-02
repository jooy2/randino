# randPlace

Places — where people gather, live and pass through.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'place'" dart="WordTheme.place" py="&quot;place&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randPlace } from 'randino';

randPlace({ language: 'ko', count: 3 }); // ['시장', '광장', '마을']
randPlace({ language: 'en', output: 'detail' });
// [{ word: 'Market', language: 'en', theme: 'place' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPlace(language: WordLanguage.ko, count: 3); // [시장, 광장, 마을]
randPlace(language: WordLanguage.en, count: 3); // [Market, Plaza, Village]
```

Returns `List<String>`. For the detail form, pass `WordTheme.place` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_place

rand_place(language="ko", count=3)  # ['시장', '광장', '마을']
rand_place(language="en", output="detail")
# [WordDetail(word='Market', language='en', theme='place')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
