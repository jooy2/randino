# randTool

What a hand works with, from a chisel to a plough.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'tool'" dart="WordTheme.tool" py="&quot;tool&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randTool } from 'randino';

randTool({ language: 'en', count: 3 }); // ['Chisel', 'Hammer', 'Trowel']
randTool({ language: 'en', output: 'detail' });
// [{ word: 'Chisel', language: 'en', theme: 'tool' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randTool(language: WordLanguage.en, count: 3); // [Chisel, Hammer, Trowel]
```

Returns `List<String>`. For the detail form, pass `WordTheme.tool` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_tool

rand_tool(language="en", count=3)  # ['Chisel', 'Hammer', 'Trowel']
rand_tool(language="en", output="detail")
# [WordDetail(word='Chisel', language='en', theme='tool')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
