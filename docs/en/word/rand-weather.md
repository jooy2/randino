# randWeather

What the sky is doing, from a breeze to a blizzard.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'weather'" dart="WordTheme.weather" py="&quot;weather&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randWeather } from 'randino';

randWeather({ language: 'en', count: 3 }); // ['Drizzle', 'Rainbow', 'Hoarfrost']
randWeather({ language: 'en', output: 'detail' });
// [{ word: 'Drizzle', language: 'en', theme: 'weather' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randWeather(language: WordLanguage.en, count: 3); // [Drizzle, Rainbow, Hoarfrost]
```

Returns `List<String>`. For the detail form, pass `WordTheme.weather` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-five themes would be twenty-five functions too many.

:::

::: lang py

```python
from randino import rand_weather

rand_weather(language="en", count=3)  # ['Drizzle', 'Rainbow', 'Hoarfrost']
rand_weather(language="en", output="detail")
# [WordDetail(word='Drizzle', language='en', theme='weather')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-four, and the words each one holds.
