# randPlant

Plants: trees, flowers, leaves and what grows on them.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'plant'" dart="WordTheme.plant" py="&quot;plant&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randPlant } from 'randino';

randPlant({ language: 'ko', count: 3 }); // ['나무', '민들레', '솔방울']
randPlant({ language: 'en', output: 'detail' });
// [{ word: 'Treetop', language: 'en', theme: 'plant' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPlant(language: WordLanguage.ko, count: 3); // [나무, 민들레, 솔방울]
randPlant(language: WordLanguage.en, count: 3); // [Treetop, Blossom, Fern]
```

Returns `List<String>`. For the detail form, pass `WordTheme.plant` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_plant

rand_plant(language="ko", count=3)  # ['나무', '민들레', '솔방울']
rand_plant(language="en", output="detail")
# [WordDetail(word='Treetop', language='en', theme='plant')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
