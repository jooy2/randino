# randClothing

What people wear, and what it is made of.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'clothing'" dart="WordTheme.clothing" py="&quot;clothing&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randClothing } from 'randino';

randClothing({ language: 'en', count: 3 }); // ['Cardigan', 'Mitten', 'Overcoat']
randClothing({ language: 'en', output: 'detail' });
// [{ word: 'Cardigan', language: 'en', theme: 'clothing' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randClothing(language: WordLanguage.en, count: 3); // [Cardigan, Mitten, Overcoat]
```

Returns `List<String>`. For the detail form, pass `WordTheme.clothing` to `randWordDetails` — Dart has no overloads, and twenty-five more functions for it would be twenty-five too many.

:::

::: lang py

```python
from randino import rand_clothing

rand_clothing(language="en", count=3)  # ['Cardigan', 'Mitten', 'Overcoat']
rand_clothing(language="en", output="detail")
# [WordDetail(word='Cardigan', language='en', theme='clothing')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
