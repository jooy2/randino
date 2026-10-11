# randFood

Prepared food: dishes, soups, noodles, bread, desserts and snacks — what is eaten as it is served. What it is cooked from is [`randIngredient`](./rand-ingredient), and vegetables and fruit have [their](./rand-vegetable) [own](./rand-fruit).

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'food'" dart="WordTheme.food" py="&quot;food&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randFood } from 'randino';

randFood({ language: 'en', count: 3 }); // ['Pizza', 'Noodle', 'Dumpling']
randFood({ language: 'en', output: 'detail' });
// [{ word: 'Pizza', language: 'en', theme: 'food' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFood(language: WordLanguage.en, count: 3); // [Pizza, Noodle, Dumpling]
```

Returns `List<String>`. For the detail form, pass `WordTheme.food` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_food

rand_food(language="en", count=3)  # ['Pizza', 'Noodle', 'Dumpling']
rand_food(language="en", output="detail")
# [WordDetail(word='Pizza', language='en', theme='food')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
