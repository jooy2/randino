# randMusic

Music: instruments, forms and the words around them.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'music'" dart="WordTheme.music" py="&quot;music&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randMusic } from 'randino';

randMusic({ language: 'en', count: 3 }); // ['Piano', 'Fiddle', 'Symphony']
randMusic({ language: 'en', output: 'detail' });
// [{ word: 'Piano', language: 'en', theme: 'music' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMusic(language: WordLanguage.en, count: 3); // [Piano, Fiddle, Symphony]
```

Returns `List<String>`. For the detail form, pass `WordTheme.music` to `randWordDetails` — Dart has no overloads, and seventeen more functions for it would be seventeen too many.

:::

::: lang py

```python
from randino import rand_music

rand_music(language="en", count=3)  # ['Piano', 'Fiddle', 'Symphony']
rand_music(language="en", output="detail")
# [WordDetail(word='Piano', language='en', theme='music')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other sixteen, and the words each one holds.
