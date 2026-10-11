# randMyth

Magic and what myth is made of: spells, curses, prophecies, relics, potions and the realms of myth. The creatures are [`randMonster`](./rand-monster).

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'myth'" dart="WordTheme.myth" py="&quot;myth&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randMyth } from 'randino';

randMyth({ language: 'en', count: 3 }); // ['Curse', 'Amulet', 'Elixir']
randMyth({ language: 'en', output: 'detail' });
// [{ word: 'Curse', language: 'en', theme: 'myth' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMyth(language: WordLanguage.en, count: 3); // [Curse, Amulet, Elixir]
```

Returns `List<String>`. For the detail form, pass `WordTheme.myth` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_myth

rand_myth(language="en", count=3)  # ['Curse', 'Amulet', 'Elixir']
rand_myth(language="en", output="detail")
# [WordDetail(word='Curse', language='en', theme='myth')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
