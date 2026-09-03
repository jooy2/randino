# randNature

Nature and its phenomena — sky, weather, water, land.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'nature'" dart="WordTheme.nature" py="&quot;nature&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randNature } from 'randino';

randNature({ language: 'en', count: 3 }); // ['Sky', 'Sunset', 'Breeze']
randNature({ language: 'en', output: 'detail' });
// [{ word: 'Sky', language: 'en', theme: 'nature' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNature(language: WordLanguage.en, count: 3); // [Sky, Sunset, Breeze]
```

Returns `List<String>`. For the detail form, pass `WordTheme.nature` to `randWordDetails` — Dart has no overloads, and seventeen more functions for it would be seventeen too many.

:::

::: lang py

```python
from randino import rand_nature

rand_nature(language="en", count=3)  # ['Sky', 'Sunset', 'Breeze']
rand_nature(language="en", output="detail")
# [WordDetail(word='Sky', language='en', theme='nature')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other sixteen, and the words each one holds.
