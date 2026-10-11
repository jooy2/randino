# randIngredient

What food is made from, short of a vegetable or a fruit: meat, grain, dairy, seasonings, sauces, spices and herbs.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'ingredient'" dart="WordTheme.ingredient" py="&quot;ingredient&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randIngredient } from 'randino';

randIngredient({ language: 'en', count: 3 }); // ['Flour', 'Butter', 'Cinnamon']
randIngredient({ language: 'en', output: 'detail' });
// [{ word: 'Flour', language: 'en', theme: 'ingredient' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randIngredient(language: WordLanguage.en, count: 3); // [Flour, Butter, Cinnamon]
```

Returns `List<String>`. For the detail form, pass `WordTheme.ingredient` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_ingredient

rand_ingredient(language="en", count=3)  # ['Flour', 'Butter', 'Cinnamon']
rand_ingredient(language="en", output="detail")
# [WordDetail(word='Flour', language='en', theme='ingredient')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
