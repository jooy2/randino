# nameSupportsMiddleName

Whether the language uses a middle name at all. Korean, Japanese and Chinese names have no middle part, so <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code /> is ignored for them. Like the two helpers beside it, it is pure and it takes the language the same way the generators do.

::: lang js

```javascript
import { nameSupportsMiddleName } from 'randino';

nameSupportsMiddleName('en'); // true
nameSupportsMiddleName('ko'); // false
nameSupportsMiddleName(); // true — the mixed draw includes languages that have one
```

| Parameter  | Type                 | Default | Description                            |
| ---------- | -------------------- | ------- | -------------------------------------- |
| `language` | `NameLanguageOption` | `'all'` | The language, or `'all'` for every one |

Returns `boolean`.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nameSupportsMiddleName(NameLanguage.en); // true
nameSupportsMiddleName(NameLanguage.ko); // false
nameSupportsMiddleName(); // true — the mixed draw includes languages that have one
```

| Parameter  | Type            | Default | Description                         |
| ---------- | --------------- | ------- | ----------------------------------- |
| `language` | `NameLanguage?` | `null`  | The language, or null for every one |

Returns `bool`.

:::

::: lang py

```python
from randino import name_supports_middle_name

name_supports_middle_name("en")  # True
name_supports_middle_name("ko")  # False
name_supports_middle_name()  # True — the mixed draw includes languages that have one
```

| Parameter  | Type                 | Default | Description                            |
| ---------- | -------------------- | ------- | -------------------------------------- |
| `language` | `NameLanguageOption` | `"all"` | The language, or `"all"` for every one |

Returns `bool`.

:::

Use it to hide a checkbox rather than to offer one that does nothing.

## See also

- [`randName`](./rand-name) — the middle-name option this answers for.
- [`nameLengthRange`](./name-length-range) — which counts a middle name only where the language has one.
- [Supported languages](../guide/languages) — the table that says which do.
