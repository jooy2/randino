# randFood

Food and drink, the everyday kind.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'food'" dart="WordTheme.food" py="&quot;food&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randFood } from 'randino';

randFood({ language: 'en', count: 3 }); // ['Rice', 'Noodle', 'Dumpling']
randFood({ language: 'en', output: 'detail' });
// [{ word: 'Rice', language: 'en', theme: 'food' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFood(language: WordLanguage.en, count: 3); // [Rice, Noodle, Dumpling]
```

Returns `List<String>`. For the detail form, pass `WordTheme.food` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_food

rand_food(language="en", count=3)  # ['Rice', 'Noodle', 'Dumpling']
rand_food(language="en", output="detail")
# [WordDetail(word='Rice', language='en', theme='food')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
