# nameLengthRange

The natural length range of a full name in that language, in characters of the native form. This is what [`randomName`](./random-name) falls back to when <Lang js="minLength" dart="minLength" py="min_length" code /> or <Lang js="maxLength" dart="maxLength" py="max_length" code /> is omitted. It answers a question about a language rather than generating anything, so it is pure — and leaving the language out covers every one of them at once.

::: lang js

```javascript
import { nameLengthRange } from 'randino';

nameLengthRange('ko'); // [3, 3]
nameLengthRange('ko', false); // [2, 2]
nameLengthRange('en'); // [8, 16]
nameLengthRange('en', true, true); // [12, 24]
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

nameLengthRange(language: NameLanguage.ko); // LengthRange(3, 3)
nameLengthRange(language: NameLanguage.ko, includeSurname: false); // LengthRange(2, 2)
nameLengthRange(language: NameLanguage.en); // LengthRange(8, 16)
nameLengthRange(language: NameLanguage.en, includeMiddleName: true); // LengthRange(12, 24)
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NameLanguage?` | `null` | The language, or null for every one |
| `includeSurname` | `bool` | `true` | Count the family name |
| `includeMiddleName` | `bool` | `false` | Count a middle name, where the language has one |

Returns a `LengthRange`, which compares by value — `nameLengthRange(language: NameLanguage.ko) == const LengthRange(3, 3)` is `true`.

:::

::: lang py

```python
from randino import name_length_range

name_length_range("ko")  # (3, 3)
name_length_range("ko", include_surname=False)  # (2, 2)
name_length_range("en")  # (8, 16)
name_length_range("en", include_middle_name=True)  # (12, 24)
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NameLanguageOption` | `"all"` | The language, or `"all"` for every one |
| `include_surname` | `bool` | `True` | Count the family name |
| `include_middle_name` | `bool` | `False` | Count a middle name, where the language has one |

Returns a `tuple[int, int]`. This helper and the two beside it take their arguments positionally as well as by keyword — they are short enough to read either way, unlike the generators, which are keyword-only.

:::

## It counts only the parts that are switched on

Which is the part worth knowing. Dropping the surname relaxes the range rather than making the given name stretch to fill it, and asking for a middle name a language does not have cannot widen it:

::: lang js

```javascript
nameLengthRange('ko', true, true); // [3, 3] — Korean has no middle name
```

:::

::: lang dart

```dart
nameLengthRange(language: NameLanguage.ko, includeMiddleName: true);
// LengthRange(3, 3) — Korean has no middle name
```

:::

::: lang py

```python
name_length_range("ko", include_middle_name=True)
# (3, 3) — Korean has no middle name
```

:::

## See also

- [`randomName`](./random-name) — where the length options are actually used.
- [`nameSupportsMiddleName`](./name-supports-middle-name) — whether there is a middle part to count in the first place.
- [Constants](../reference/constants) — the hard bounds every length option is clamped to.
