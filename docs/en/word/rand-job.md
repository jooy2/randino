# randJob

The trades and roles people hold. Never a person name, which is why there is no `Baker` or `Hunter` here.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'job'" dart="WordTheme.job" py="&quot;job&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randJob } from 'randino';

randJob({ language: 'en', count: 3 }); // ['Wizard', 'Ranger', 'Blacksmith']
randJob({ language: 'en', output: 'detail' });
// [{ word: 'Wizard', language: 'en', theme: 'job' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randJob(language: WordLanguage.en, count: 3); // [Wizard, Ranger, Blacksmith]
```

Returns `List<String>`. For the detail form, pass `WordTheme.job` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_job

rand_job(language="en", count=3)  # ['Wizard', 'Ranger', 'Blacksmith']
rand_job(language="en", output="detail")
# [WordDetail(word='Wizard', language='en', theme='job')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
