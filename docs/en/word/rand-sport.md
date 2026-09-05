# randSport

Sports and the things people play.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'sport'" dart="WordTheme.sport" py="&quot;sport&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randSport } from 'randino';

randSport({ language: 'en', count: 3 }); // ['Soccer', 'Baseball', 'Archery']
randSport({ language: 'en', output: 'detail' });
// [{ word: 'Soccer', language: 'en', theme: 'sport' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randSport(language: WordLanguage.en, count: 3); // [Soccer, Baseball, Archery]
```

Returns `List<String>`. For the detail form, pass `WordTheme.sport` to `randWordDetails` — Dart has no overloads, and twenty-five more functions for it would be twenty-five too many.

:::

::: lang py

```python
from randino import rand_sport

rand_sport(language="en", count=3)  # ['Soccer', 'Baseball', 'Archery']
rand_sport(language="en", output="detail")
# [WordDetail(word='Soccer', language='en', theme='sport')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
