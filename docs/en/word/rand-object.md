# randObject

Everyday things: what is on a desk, in a bag, around a house.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'object'" dart="WordTheme.object" py="&quot;object&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randObject } from 'randino';

randObject({ language: 'ko', count: 3 }); // ['물병', '연필', '우산']
randObject({ language: 'en', output: 'detail' });
// [{ word: 'Bottle', language: 'en', theme: 'object' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randObject(language: WordLanguage.ko, count: 3); // [물병, 연필, 우산]
randObject(language: WordLanguage.en, count: 3); // [Bottle, Pencil, Umbrella]
```

Returns `List<String>`. For the detail form, pass `WordTheme.object` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_object

rand_object(language="ko", count=3)  # ['물병', '연필', '우산']
rand_object(language="en", output="detail")
# [WordDetail(word='Bottle', language='en', theme='object')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
