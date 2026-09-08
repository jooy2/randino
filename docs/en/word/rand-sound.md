# randSound

Sounds and voices, and the words a language has for them.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'sound'" dart="WordTheme.sound" py="&quot;sound&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randSound } from 'randino';

randSound({ language: 'en', count: 3 }); // ['Whisper', 'Chime', 'Rustle']
randSound({ language: 'en', output: 'detail' });
// [{ word: 'Whisper', language: 'en', theme: 'sound' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randSound(language: WordLanguage.en, count: 3); // [Whisper, Chime, Rustle]
```

Returns `List<String>`. For the detail form, pass `WordTheme.sound` to `randWordDetails`. Dart has no overloads, and a detail twin for each of the twenty-nine themes would be twenty-nine functions too many.

:::

::: lang py

```python
from randino import rand_sound

rand_sound(language="en", count=3)  # ['Whisper', 'Chime', 'Rustle']
rand_sound(language="en", output="detail")
# [WordDetail(word='Whisper', language='en', theme='sound')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — the other twenty-eight, and the words each one holds.
