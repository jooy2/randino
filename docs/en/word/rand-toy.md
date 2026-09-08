# randToy

Toys and games, the things and the play a childhood is made of.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'toy'" dart="WordTheme.toy" py="&quot;toy&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randToy } from 'randino';

randToy({ language: 'en', count: 3 }); // ['Kite', 'Yoyo', 'Domino']
randToy({ language: 'en', output: 'detail' });
// [{ word: 'Kite', language: 'en', theme: 'toy' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randToy(language: WordLanguage.en, count: 3); // [Kite, Yoyo, Domino]
```

Returns `List<String>`. For the detail form, pass `WordTheme.toy` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-nine themes would be twenty-nine functions too many.

:::

::: lang py

```python
from randino import rand_toy

rand_toy(language="en", count=3)  # ['Kite', 'Yoyo', 'Domino']
rand_toy(language="en", output="detail")
# [WordDetail(word='Kite', language='en', theme='toy')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-eight, and the words each one holds.
