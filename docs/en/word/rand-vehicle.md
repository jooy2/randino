# randVehicle

Things that carry you.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'vehicle'" dart="WordTheme.vehicle" py="&quot;vehicle&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randVehicle } from 'randino';

randVehicle({ language: 'en', count: 3 }); // ['Bicycle', 'Boat', 'Airship']
randVehicle({ language: 'en', output: 'detail' });
// [{ word: 'Bicycle', language: 'en', theme: 'vehicle' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randVehicle(language: WordLanguage.en, count: 3); // [Bicycle, Boat, Airship]
```

Returns `List<String>`. For the detail form, pass `WordTheme.vehicle` to `randWordDetails` — Dart has no overloads, and twenty-five more functions for it would be twenty-five too many.

:::

::: lang py

```python
from randino import rand_vehicle

rand_vehicle(language="en", count=3)  # ['Bicycle', 'Boat', 'Airship']
rand_vehicle(language="en", output="detail")
# [WordDetail(word='Bicycle', language='en', theme='vehicle')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
