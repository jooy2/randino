# randBeauty

Make-up, skin care, fragrance, hair and nail care, and the tools and treatments that go with them.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'beauty'" dart="WordTheme.beauty" py="&quot;beauty&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randBeauty } from 'randino';

randBeauty({ language: 'en', count: 3 }); // ['Lipstick', 'Lotion', 'Perfume']
randBeauty({ language: 'en', output: 'detail' });
// [{ word: 'Lipstick', language: 'en', theme: 'beauty' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randBeauty(language: WordLanguage.en, count: 3); // [Lipstick, Lotion, Perfume]
```

Returns `List<String>`. For the detail form, pass `WordTheme.beauty` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_beauty

rand_beauty(language="en", count=3)  # ['Lipstick', 'Lotion', 'Perfume']
rand_beauty(language="en", output="detail")
# [WordDetail(word='Lipstick', language='en', theme='beauty')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
