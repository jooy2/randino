# randPerson

People by age, kinship and character, never by trade and never by name.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'person'" dart="WordTheme.person" py="&quot;person&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randPerson } from 'randino';

randPerson({ language: 'en', count: 3 }); // ['Toddler', 'Neighbor', 'Stranger']
randPerson({ language: 'en', output: 'detail' });
// [{ word: 'Toddler', language: 'en', theme: 'person' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPerson(language: WordLanguage.en, count: 3); // [Toddler, Neighbor, Stranger]
```

Returns `List<String>`. For the detail form, pass `WordTheme.person` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-nine themes would be twenty-nine functions too many.

:::

::: lang py

```python
from randino import rand_person

rand_person(language="en", count=3)  # ['Toddler', 'Neighbor', 'Stranger']
rand_person(language="en", output="detail")
# [WordDetail(word='Toddler', language='en', theme='person')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-eight, and the words each one holds.
