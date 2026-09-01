# Name helpers

Three functions that answer a question about a language rather than generating anything. All of them are pure, and all of them take the language the same way the generators do — leave it out and the answer covers every language at once.

## nameLengthRange

The natural length range of a full name in that language, in characters of the native form. This is what [`randomName`](./random-name) falls back to when <Lang js="minLength" dart="minLength" py="min_length" code /> or <Lang js="maxLength" dart="maxLength" py="max_length" code /> is omitted.

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

Returns a `tuple[int, int]`. The three helpers take their arguments positionally as well as by keyword — they are short enough to read either way, unlike the generators, which are keyword-only.

:::

The range **covers only the parts that are switched on**, which is the part worth knowing. Dropping the surname relaxes the range rather than making the given name stretch to fill it, and asking for a middle name a language does not have cannot widen it:

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

## nameSupportsMiddleName

Whether the language uses a middle name at all. Korean, Japanese and Chinese names have no middle part, so <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code /> is ignored for them.

::: lang js

```javascript
nameSupportsMiddleName('en'); // true
nameSupportsMiddleName('ko'); // false
nameSupportsMiddleName(); // true — the mixed draw includes languages that have one
```

:::

::: lang dart

```dart
nameSupportsMiddleName(NameLanguage.en); // true
nameSupportsMiddleName(NameLanguage.ko); // false
nameSupportsMiddleName(); // true — the mixed draw includes languages that have one
```

:::

::: lang py

```python
name_supports_middle_name("en")  # True
name_supports_middle_name("ko")  # False
name_supports_middle_name()  # True — the mixed draw includes languages that have one
```

:::

Use it to hide a checkbox rather than to offer one that does nothing.

## nameSupportsRoman

Whether asking for the romanized script produces anything different from the native one. Only English answers `false` — its names are already written in the Latin alphabet.

::: lang js

```javascript
nameSupportsRoman('ko'); // true
nameSupportsRoman('en'); // false
```

:::

::: lang dart

```dart
nameSupportsRoman(NameLanguage.ko); // true
nameSupportsRoman(NameLanguage.en); // false
```

:::

::: lang py

```python
name_supports_roman("ko")  # True
name_supports_roman("en")  # False
```

:::

## See also

- [`randomName`](./random-name) — where the length and middle-name options are actually used.
- [Constants](../reference/constants) — the hard bounds every length option is clamped to.
