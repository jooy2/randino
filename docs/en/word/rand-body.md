# randBody

The parts of a body, inside and out.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'body'" dart="WordTheme.body" py="&quot;body&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randBody } from 'randino';

randBody({ language: 'en', count: 3 }); // ['Wrist', 'Shoulder', 'Heart']
randBody({ language: 'en', output: 'detail' });
// [{ word: 'Wrist', language: 'en', theme: 'body' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randBody(language: WordLanguage.en, count: 3); // [Wrist, Shoulder, Heart]
```

Returns `List<String>`. For the detail form, pass `WordTheme.body` to `randWordDetails` — Dart has no overloads, and twenty-five more functions for it would be twenty-five too many.

:::

::: lang py

```python
from randino import rand_body

rand_body(language="en", count=3)  # ['Wrist', 'Shoulder', 'Heart']
rand_body(language="en", output="detail")
# [WordDetail(word='Wrist', language='en', theme='body')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
