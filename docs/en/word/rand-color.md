# randColor

Colours, from the plain ones to the ones with a history.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'color'" dart="WordTheme.color" py="&quot;color&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randColor } from 'randino';

randColor({ language: 'en', count: 3 }); // ['Crimson', 'Teal', 'Ocher']
randColor({ language: 'en', output: 'detail' });
// [{ word: 'Crimson', language: 'en', theme: 'color' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randColor(language: WordLanguage.en, count: 3); // [Crimson, Teal, Ocher]
```

Returns `List<String>`. For the detail form, pass `WordTheme.color` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-five themes would be twenty-five functions too many.

:::

::: lang py

```python
from randino import rand_color

rand_color(language="en", count=3)  # ['Crimson', 'Teal', 'Ocher']
rand_color(language="en", output="detail")
# [WordDetail(word='Crimson', language='en', theme='color')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
