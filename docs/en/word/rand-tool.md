# randTool

What a hand works with, from a chisel to a plough.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'tool'" dart="WordTheme.tool" py="&quot;tool&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randTool } from 'randino';

randTool({ language: 'en', count: 3 }); // ['Chisel', 'Mallet', 'Trowel']
randTool({ language: 'en', output: 'detail' });
// [{ word: 'Chisel', language: 'en', theme: 'tool' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randTool(language: WordLanguage.en, count: 3); // [Chisel, Mallet, Trowel]
```

Returns `List<String>`. For the detail form, pass `WordTheme.tool` to `randWordDetails` — Dart has no overloads, and twenty-four more functions for it would be twenty-four too many.

:::

::: lang py

```python
from randino import rand_tool

rand_tool(language="en", count=3)  # ['Chisel', 'Mallet', 'Trowel']
rand_tool(language="en", output="detail")
# [WordDetail(word='Chisel', language='en', theme='tool')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
