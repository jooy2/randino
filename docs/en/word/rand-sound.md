# randSound

Sounds and voices, and the words a language has for them.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'sound'" dart="WordTheme.sound" py="&quot;sound&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randSound } from 'randino';

randSound({ language: 'en', count: 3 }); // ['Whisper', 'Hum', 'Rustle']
randSound({ language: 'en', output: 'detail' });
// [{ word: 'Whisper', language: 'en', theme: 'sound' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randSound(language: WordLanguage.en, count: 3); // [Whisper, Hum, Rustle]
```

Returns `List<String>`. For the detail form, pass `WordTheme.sound` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_sound

rand_sound(language="en", count=3)  # ['Whisper', 'Hum', 'Rustle']
rand_sound(language="en", output="detail")
# [WordDetail(word='Whisper', language='en', theme='sound')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
