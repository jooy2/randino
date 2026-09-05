# randPlace

Places — where people gather, live and pass through.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'place'" dart="WordTheme.place" py="&quot;place&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randPlace } from 'randino';

randPlace({ language: 'en', count: 3 }); // ['Market', 'Plaza', 'Village']
randPlace({ language: 'en', output: 'detail' });
// [{ word: 'Market', language: 'en', theme: 'place' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPlace(language: WordLanguage.en, count: 3); // [Market, Plaza, Village]
```

Returns `List<String>`. For the detail form, pass `WordTheme.place` to `randWordDetails` — Dart has no overloads, and twenty-five more functions for it would be twenty-five too many.

:::

::: lang py

```python
from randino import rand_place

rand_place(language="en", count=3)  # ['Market', 'Plaza', 'Village']
rand_place(language="en", output="detail")
# [WordDetail(word='Market', language='en', theme='place')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
