# randFruit

Fruit, the way a kitchen counts it: from apples and berries to melons and mangoes.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'fruit'" dart="WordTheme.fruit" py="&quot;fruit&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randFruit } from 'randino';

randFruit({ language: 'en', count: 3 }); // ['Apple', 'Peach', 'Watermelon']
randFruit({ language: 'en', output: 'detail' });
// [{ word: 'Apple', language: 'en', theme: 'fruit' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFruit(language: WordLanguage.en, count: 3); // [Apple, Peach, Watermelon]
```

Returns `List<String>`. For the detail form, pass `WordTheme.fruit` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_fruit

rand_fruit(language="en", count=3)  # ['Apple', 'Peach', 'Watermelon']
rand_fruit(language="en", output="detail")
# [WordDetail(word='Apple', language='en', theme='fruit')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
