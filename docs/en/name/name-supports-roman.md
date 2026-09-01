# nameSupportsRoman

Whether asking for the romanized script produces anything different from the native one. Only English answers `false` — its names are already written in the Latin alphabet. Like the two helpers beside it, it is pure and it takes the language the same way the generators do.

::: lang js

```javascript
import { nameSupportsRoman } from 'randino';

nameSupportsRoman('ko'); // true
nameSupportsRoman('en'); // false
```

| Parameter  | Type                 | Default | Description                            |
| ---------- | -------------------- | ------- | -------------------------------------- |
| `language` | `NameLanguageOption` | `'all'` | The language, or `'all'` for every one |

Returns `boolean`.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nameSupportsRoman(NameLanguage.ko); // true
nameSupportsRoman(NameLanguage.en); // false
```

| Parameter  | Type            | Default | Description                         |
| ---------- | --------------- | ------- | ----------------------------------- |
| `language` | `NameLanguage?` | `null`  | The language, or null for every one |

Returns `bool`.

:::

::: lang py

```python
from randino import name_supports_roman

name_supports_roman("ko")  # True
name_supports_roman("en")  # False
```

| Parameter  | Type                 | Default | Description                            |
| ---------- | -------------------- | ------- | -------------------------------------- |
| `language` | `NameLanguageOption` | `"all"` | The language, or `"all"` for every one |

Returns `bool`.

:::

## See also

- [`randomName`](./random-name) — the script option this answers for.
- [`randomNameDetails`](./random-name-details) — which returns both forms at once, so nothing has to be asked.
- [Supported languages](../guide/languages) — the romanization each language uses.
