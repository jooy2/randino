# randAnimal

Animals — the creatures a nickname is most often built around.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'animal'" dart="WordTheme.animal" py="&quot;animal&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randAnimal } from 'randino';

randAnimal({ language: 'en', count: 3 }); // ['Otter', 'Falcon', 'Lynx']
randAnimal({ language: 'en', output: 'detail' });
// [{ word: 'Otter', language: 'en', theme: 'animal' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randAnimal(language: WordLanguage.en, count: 3); // [Otter, Falcon, Lynx]
```

Returns `List<String>`. For the detail form, pass `WordTheme.animal` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_animal

rand_animal(language="en", count=3)  # ['Otter', 'Falcon', 'Lynx']
rand_animal(language="en", output="detail")
# [WordDetail(word='Otter', language='en', theme='animal')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
