# randPlanet

Planets by name: the eight, the dwarf planets, the best-known named minor planets and the exoplanets the IAU has named. Never a catalogue designation such as `Kepler-452b`, and never a name the IAU took from a person.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'planet'" dart="WordTheme.planet" py="&quot;planet&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randPlanet } from 'randino';

randPlanet({ language: 'en', count: 3 }); // ['Mars', 'Jupiter', 'Sedna']
randPlanet({ language: 'en', output: 'detail' });
// [{ word: 'Mars', language: 'en', theme: 'planet' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPlanet(language: WordLanguage.en, count: 3); // [Mars, Jupiter, Sedna]
```

Returns `List<String>`. For the detail form, pass `WordTheme.planet` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_planet

rand_planet(language="en", count=3)  # ['Mars', 'Jupiter', 'Sedna']
rand_planet(language="en", output="detail")
# [WordDetail(word='Mars', language='en', theme='planet')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
