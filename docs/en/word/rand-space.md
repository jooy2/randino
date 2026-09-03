# randSpace

What is beyond the sky, from the moon to a galaxy.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'space'" dart="WordTheme.space" py="&quot;space&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randSpace } from 'randino';

randSpace({ language: 'en', count: 3 }); // ['Galaxy', 'Comet', 'Nebula']
randSpace({ language: 'en', output: 'detail' });
// [{ word: 'Galaxy', language: 'en', theme: 'space' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randSpace(language: WordLanguage.en, count: 3); // [Galaxy, Comet, Nebula]
```

Returns `List<String>`. For the detail form, pass `WordTheme.space` to `randWordDetails` — Dart has no overloads, and twenty-four more functions for it would be twenty-four too many.

:::

::: lang py

```python
from randino import rand_space

rand_space(language="en", count=3)  # ['Galaxy', 'Comet', 'Nebula']
rand_space(language="en", output="detail")
# [WordDetail(word='Galaxy', language='en', theme='space')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
