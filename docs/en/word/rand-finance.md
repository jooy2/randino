# randFinance

Money, and the words for what is done with it.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'finance'" dart="WordTheme.finance" py="&quot;finance&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randFinance } from 'randino';

randFinance({ language: 'en', count: 3 }); // ['Ledger', 'Yield', 'Escrow']
randFinance({ language: 'en', output: 'detail' });
// [{ word: 'Ledger', language: 'en', theme: 'finance' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFinance(language: WordLanguage.en, count: 3); // [Ledger, Yield, Escrow]
```

Returns `List<String>`. For the detail form, pass `WordTheme.finance` to `randWordDetails` — Dart has no overloads, and seventeen more functions for it would be seventeen too many.

:::

::: lang py

```python
from randino import rand_finance

rand_finance(language="en", count=3)  # ['Ledger', 'Yield', 'Escrow']
rand_finance(language="en", output="detail")
# [WordDetail(word='Ledger', language='en', theme='finance')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other sixteen, and the words each one holds.
