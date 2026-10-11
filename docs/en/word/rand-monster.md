# randMonster

Creatures of myth, folklore and fantasy: dragons and fairies, ghosts and the undead, gods, giants and aliens — every being that is no animal and no person.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'monster'" dart="WordTheme.monster" py="&quot;monster&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randMonster } from 'randino';

randMonster({ language: 'en', count: 3 }); // ['Dragon', 'Vampire', 'Golem']
randMonster({ language: 'en', output: 'detail' });
// [{ word: 'Dragon', language: 'en', theme: 'monster' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMonster(language: WordLanguage.en, count: 3); // [Dragon, Vampire, Golem]
```

Returns `List<String>`. For the detail form, pass `WordTheme.monster` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_monster

rand_monster(language="en", count=3)  # ['Dragon', 'Vampire', 'Golem']
rand_monster(language="en", output="detail")
# [WordDetail(word='Dragon', language='en', theme='monster')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
