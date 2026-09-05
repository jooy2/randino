# randMyth

Creatures and figures out of myth and folklore.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'myth'" dart="WordTheme.myth" py="&quot;myth&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randMyth } from 'randino';

randMyth({ language: 'en', count: 3 }); // ['Dragon', 'Phoenix', 'Griffin']
randMyth({ language: 'en', output: 'detail' });
// [{ word: 'Dragon', language: 'en', theme: 'myth' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMyth(language: WordLanguage.en, count: 3); // [Dragon, Phoenix, Griffin]
```

Returns `List<String>`. For the detail form, pass `WordTheme.myth` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-five themes would be twenty-five functions too many.

:::

::: lang py

```python
from randino import rand_myth

rand_myth(language="en", count=3)  # ['Dragon', 'Phoenix', 'Griffin']
rand_myth(language="en", output="detail")
# [WordDetail(word='Dragon', language='en', theme='myth')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
