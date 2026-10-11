# randPlace

Places where people gather, live and pass through, short of a building: streets, squares, parks, harbours and towns. Buildings and the rooms in them are [`randBuilding`](./rand-building).

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'place'" dart="WordTheme.place" py="&quot;place&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randPlace } from 'randino';

randPlace({ language: 'en', count: 3 }); // ['Market', 'Plaza', 'Village']
randPlace({ language: 'en', output: 'detail' });
// [{ word: 'Market', language: 'en', theme: 'place' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPlace(language: WordLanguage.en, count: 3); // [Market, Plaza, Village]
```

Returns `List<String>`. For the detail form, pass `WordTheme.place` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_place

rand_place(language="en", count=3)  # ['Market', 'Plaza', 'Village']
rand_place(language="en", output="detail")
# [WordDetail(word='Market', language='en', theme='place')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
