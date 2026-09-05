# randGem

Stones and metals, precious and ordinary alike.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'gem'" dart="WordTheme.gem" py="&quot;gem&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randGem } from 'randino';

randGem({ language: 'en', count: 3 }); // ['Gold', 'Quartz', 'Obsidian']
randGem({ language: 'en', output: 'detail' });
// [{ word: 'Gold', language: 'en', theme: 'gem' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randGem(language: WordLanguage.en, count: 3); // [Gold, Quartz, Obsidian]
```

Returns `List<String>`. For the detail form, pass `WordTheme.gem` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-five themes would be twenty-five functions too many.

:::

::: lang py

```python
from randino import rand_gem

rand_gem(language="en", count=3)  # ['Gold', 'Quartz', 'Obsidian']
rand_gem(language="en", output="detail")
# [WordDetail(word='Gold', language='en', theme='gem')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
