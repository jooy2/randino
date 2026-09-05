# nameLengthRange

The natural length range of a full name in that language, in characters of the native form. This is what [`randName`](./rand-name) falls back to when <Lang js="minLength" dart="minLength" py="min_length" code /> or <Lang js="maxLength" dart="maxLength" py="max_length" code /> is omitted. It answers a question about a language rather than generating anything, so it is pure, and leaving the language out covers every one of them at once.

::: lang js

```javascript
import { nameLengthRange } from 'randino';

nameLengthRange('ko'); // [2, 3]
nameLengthRange('ko', false); // [1, 2]
nameLengthRange('en'); // [7, 21]
nameLengthRange('en', true, true); // [11, 32]
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NameLanguageOption` | `'all'` | The language, or `'all'` for every one |
| `includeSurname` | `boolean` | `true` | Count the family name |
| `includeMiddleName` | `boolean` | `false` | Count a middle name, where the language has one |

Returns `[min, max]`.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nameLengthRange(language: NameLanguage.ko); // LengthRange(2, 3)
nameLengthRange(language: NameLanguage.ko, includeSurname: false); // LengthRange(1, 2)
nameLengthRange(language: NameLanguage.en); // LengthRange(7, 21)
nameLengthRange(language: NameLanguage.en, includeMiddleName: true); // LengthRange(11, 32)
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NameLanguage?` | `null` | The language, or null for every one |
| `includeSurname` | `bool` | `true` | Count the family name |
| `includeMiddleName` | `bool` | `false` | Count a middle name, where the language has one |

Returns a `LengthRange`, which compares by value, so `nameLengthRange(language: NameLanguage.ko) == const LengthRange(2, 3)` is `true`.

:::

::: lang py

```python
from randino import name_length_range

name_length_range("ko")  # (2, 3)
name_length_range("ko", include_surname=False)  # (1, 2)
name_length_range("en")  # (7, 21)
name_length_range("en", include_middle_name=True)  # (11, 32)
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NameLanguageOption` | `"all"` | The language, or `"all"` for every one |
| `include_surname` | `bool` | `True` | Count the family name |
| `include_middle_name` | `bool` | `False` | Count a middle name, where the language has one |

Returns a `tuple[int, int]`. This helper and the two beside it take their arguments positionally as well as by keyword, since they are short enough to read either way, unlike the generators, which are keyword-only.

:::

## Counting only the parts that are switched on {#it-counts-only-the-parts-that-are-switched-on}

Dropping the surname lowers the range rather than making the given name stretch to fill it, and asking for a middle name a language does not have cannot widen it:

::: lang js

```javascript
nameLengthRange('ko', true, true); // [2, 3] — Korean has no middle name
```

:::

::: lang dart

```dart
nameLengthRange(language: NameLanguage.ko, includeMiddleName: true);
// LengthRange(2, 3) — Korean has no middle name
```

:::

::: lang py

```python
name_length_range("ko", include_middle_name=True)
# (2, 3) — Korean has no middle name
```

:::

## See also

- [`randName`](./rand-name) — where the length options are actually used.
- [`nameSupportsMiddleName`](./name-supports-middle-name) — whether there is a middle part to count in the first place.
- [Constants](../reference/constants) — the hard bounds every length option is clamped to.
