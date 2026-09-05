# randTech

The vocabulary of computers and the networks between them.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'tech'" dart="WordTheme.tech" py="&quot;tech&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randTech } from 'randino';

randTech({ language: 'en', count: 3 }); // ['Server', 'Cache', 'Subnet']
randTech({ language: 'en', output: 'detail' });
// [{ word: 'Server', language: 'en', theme: 'tech' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randTech(language: WordLanguage.en, count: 3); // [Server, Cache, Subnet]
```

Returns `List<String>`. For the detail form, pass `WordTheme.tech` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-five themes would be twenty-five functions too many.

:::

::: lang py

```python
from randino import rand_tech

rand_tech(language="en", count=3)  # ['Server', 'Cache', 'Subnet']
rand_tech(language="en", output="detail")
# [WordDetail(word='Server', language='en', theme='tech')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
