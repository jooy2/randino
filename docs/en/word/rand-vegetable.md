# randVegetable

Vegetables, the way a kitchen counts them: roots, greens, onions, peppers, squash and mushrooms.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'vegetable'" dart="WordTheme.vegetable" py="&quot;vegetable&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randVegetable } from 'randino';

randVegetable({ language: 'en', count: 3 }); // ['Carrot', 'Onion', 'Spinach']
randVegetable({ language: 'en', output: 'detail' });
// [{ word: 'Carrot', language: 'en', theme: 'vegetable' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randVegetable(language: WordLanguage.en, count: 3); // [Carrot, Onion, Spinach]
```

Returns `List<String>`. For the detail form, pass `WordTheme.vegetable` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_vegetable

rand_vegetable(language="en", count=3)  # ['Carrot', 'Onion', 'Spinach']
rand_vegetable(language="en", output="detail")
# [WordDetail(word='Carrot', language='en', theme='vegetable')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
