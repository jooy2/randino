# randFurniture

Furniture and the furnishings of a home.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'furniture'" dart="WordTheme.furniture" py="&quot;furniture&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randFurniture } from 'randino';

randFurniture({ language: 'en', count: 3 }); // ['Hammock', 'Cradle', 'Wardrobe']
randFurniture({ language: 'en', output: 'detail' });
// [{ word: 'Hammock', language: 'en', theme: 'furniture' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFurniture(language: WordLanguage.en, count: 3); // [Hammock, Cradle, Wardrobe]
```

Returns `List<String>`. For the detail form, pass `WordTheme.furniture` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-nine themes would be twenty-nine functions too many.

:::

::: lang py

```python
from randino import rand_furniture

rand_furniture(language="en", count=3)  # ['Hammock', 'Cradle', 'Wardrobe']
rand_furniture(language="en", output="detail")
# [WordDetail(word='Hammock', language='en', theme='furniture')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-eight, and the words each one holds.
