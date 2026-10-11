# randBuilding

Buildings and the rooms in them: homes, schools, shops and offices, the places of worship and of public business, and the words for a kind of property.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'building'" dart="WordTheme.building" py="&quot;building&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randBuilding } from 'randino';

randBuilding({ language: 'en', count: 3 }); // ['House', 'Library', 'Bakery']
randBuilding({ language: 'en', output: 'detail' });
// [{ word: 'House', language: 'en', theme: 'building' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randBuilding(language: WordLanguage.en, count: 3); // [House, Library, Bakery]
```

Returns `List<String>`. For the detail form, pass `WordTheme.building` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_building

rand_building(language="en", count=3)  # ['House', 'Library', 'Bakery']
rand_building(language="en", output="detail")
# [WordDetail(word='House', language='en', theme='building')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
