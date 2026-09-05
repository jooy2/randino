# randProduct

Things you buy, the manufactured end of the vocabulary.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'product'" dart="WordTheme.product" py="&quot;product&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randProduct } from 'randino';

randProduct({ language: 'en', count: 3 }); // ['Laptop', 'Keyboard', 'Earbuds']
randProduct({ language: 'en', output: 'detail' });
// [{ word: 'Laptop', language: 'en', theme: 'product' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randProduct(language: WordLanguage.en, count: 3); // [Laptop, Keyboard, Earbuds]
```

Returns `List<String>`. For the detail form, pass `WordTheme.product` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-five themes would be twenty-five functions too many.

:::

::: lang py

```python
from randino import rand_product

rand_product(language="en", count=3)  # ['Laptop', 'Keyboard', 'Earbuds']
rand_product(language="en", output="detail")
# [WordDetail(word='Laptop', language='en', theme='product')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
