# randProduct

Things you buy, the manufactured end of the vocabulary. Make-up and skin and hair care are [`randBeauty`](./rand-beauty).

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

Returns `List<String>`. For the detail form, pass `WordTheme.product` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

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
- [Themes](./themes) — every other theme, and the words each one holds.
