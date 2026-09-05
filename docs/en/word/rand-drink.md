# randDrink

Something to drink, hot, cold or fermented.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'drink'" dart="WordTheme.drink" py="&quot;drink&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randDrink } from 'randino';

randDrink({ language: 'en', count: 3 }); // ['Cider', 'Cordial', 'Lemonade']
randDrink({ language: 'en', output: 'detail' });
// [{ word: 'Cider', language: 'en', theme: 'drink' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randDrink(language: WordLanguage.en, count: 3); // [Cider, Cordial, Lemonade]
```

Returns `List<String>`. For the detail form, pass `WordTheme.drink` to `randWordDetails` — Dart has no overloads, and twenty-five more functions for it would be twenty-five too many.

:::

::: lang py

```python
from randino import rand_drink

rand_drink(language="en", count=3)  # ['Cider', 'Cordial', 'Lemonade']
rand_drink(language="en", output="detail")
# [WordDetail(word='Cider', language='en', theme='drink')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
