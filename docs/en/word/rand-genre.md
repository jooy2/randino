# randGenre

Kinds of music: genres and their sub-genres, from techno and grunge to K-pop, and the kinds of piece a composer writes, from the symphony to the nocturne.

[`randWord`](./rand-word) with `theme` fixed to <Lang js="'genre'" dart="WordTheme.genre" py="&quot;genre&quot;" code />; every other option is the same one, and means the same thing.

::: lang js

```javascript
import { randGenre } from 'randino';

randGenre({ language: 'en', count: 3 }); // ['Jazz', 'Techno', 'Symphony']
randGenre({ language: 'en', output: 'detail' });
// [{ word: 'Jazz', language: 'en', theme: 'genre' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randGenre(language: WordLanguage.en, count: 3); // [Jazz, Techno, Symphony]
```

Returns `List<String>`. For the detail form, pass `WordTheme.genre` to `randWordDetails`. Dart has no overloads, and a detail twin beside every themed function would be one function too many for each theme.

:::

::: lang py

```python
from randino import rand_genre

rand_genre(language="en", count=3)  # ['Jazz', 'Techno', 'Symphony']
rand_genre(language="en", output="detail")
# [WordDetail(word='Jazz', language='en', theme='genre')]
```

:::

## Options

<WordOptions />

## See also

- [`randWord`](./rand-word) — the same generator with `theme` open, and what each option does in full.
- [Themes](./themes) — every other theme, and the words each one holds.
