# randConcept

Ideas out of the humanities and the social world.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'concept'" dart="WordTheme.concept" py="&quot;concept&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randConcept } from 'randino';

randConcept({ language: 'en', count: 3 }); // ['Freedom', 'Peace', 'Truth']
randConcept({ language: 'en', output: 'detail' });
// [{ word: 'Freedom', language: 'en', theme: 'concept' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randConcept(language: WordLanguage.en, count: 3); // [Freedom, Peace, Truth]
```

Returns `List<String>`. For the detail form, pass `WordTheme.concept` to `randWordDetails` — Dart has no overloads, and twenty-five more functions for it would be twenty-five too many.

:::

::: lang py

```python
from randino import rand_concept

rand_concept(language="en", count=3)  # ['Freedom', 'Peace', 'Truth']
rand_concept(language="en", output="detail")
# [WordDetail(word='Freedom', language='en', theme='concept')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
