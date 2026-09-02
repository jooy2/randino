# randNature

Nature and its phenomena — sky, weather, water, land.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'nature'" dart="WordTheme.nature" py="&quot;nature&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randNature } from 'randino';

randNature({ language: 'ko', count: 3 }); // ['하늘', '노을', '바람']
randNature({ language: 'en', output: 'detail' });
// [{ word: 'Sky', language: 'en', theme: 'nature' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNature(language: WordLanguage.ko, count: 3); // [하늘, 노을, 바람]
randNature(language: WordLanguage.en, count: 3); // [Sky, Sunset, Breeze]
```

Returns `List<String>`. For the detail form, pass `WordTheme.nature` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_nature

rand_nature(language="ko", count=3)  # ['하늘', '노을', '바람']
rand_nature(language="en", output="detail")
# [WordDetail(word='Sky', language='en', theme='nature')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
