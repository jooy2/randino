# randTime

When something happens, from a moment to a season.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'time'" dart="WordTheme.time" py="&quot;time&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randTime } from 'randino';

randTime({ language: 'en', count: 3 }); // ['Twilight', 'Solstice', 'Eternity']
randTime({ language: 'en', output: 'detail' });
// [{ word: 'Twilight', language: 'en', theme: 'time' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randTime(language: WordLanguage.en, count: 3); // [Twilight, Solstice, Eternity]
```

Returns `List<String>`. For the detail form, pass `WordTheme.time` to `randWordDetails` — Dart has no overloads, and twenty-four more functions for it would be twenty-four too many.

:::

::: lang py

```python
from randino import rand_time

rand_time(language="en", count=3)  # ['Twilight', 'Solstice', 'Eternity']
rand_time(language="en", output="detail")
# [WordDetail(word='Twilight', language='en', theme='time')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
