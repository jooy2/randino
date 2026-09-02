# randVehicle

Things that carry you.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'vehicle'" dart="WordTheme.vehicle" py="&quot;vehicle&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randVehicle } from 'randino';

randVehicle({ language: 'ko', count: 3 }); // ['자전거', '기차', '열기구']
randVehicle({ language: 'en', output: 'detail' });
// [{ word: 'Bicycle', language: 'en', theme: 'vehicle' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randVehicle(language: WordLanguage.ko, count: 3); // [자전거, 기차, 열기구]
randVehicle(language: WordLanguage.en, count: 3); // [Bicycle, Boat, Airship]
```

Returns `List<String>`. For the detail form, pass `WordTheme.vehicle` to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_vehicle

rand_vehicle(language="ko", count=3)  # ['자전거', '기차', '열기구']
rand_vehicle(language="en", output="detail")
# [WordDetail(word='Bicycle', language='en', theme='vehicle')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other thirteen, and the words each one holds.
