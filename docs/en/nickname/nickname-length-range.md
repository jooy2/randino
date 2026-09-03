# nicknameLengthRange

Every nickname length the language can produce, in characters. This is what [`randNickname`](./rand-nickname) falls back to when <Lang js="minLength" dart="minLength" py="min_length" code /> or <Lang js="maxLength" dart="maxLength" py="max_length" code /> is omitted.

::: lang js

```javascript
import { nicknameLengthRange } from 'randino';

nicknameLengthRange('ko'); // [1, 12]
nicknameLengthRange('en'); // [3, 30]
nicknameLengthRange('zh'); // [2, 5]
nicknameLengthRange('ko', '-'); // [1, 14]
```

| Parameter       | Type                 | Default | Description                                   |
| --------------- | -------------------- | ------- | --------------------------------------------- |
| `language`      | `WordLanguageOption` | `'all'` | The language, or `'all'` for every one        |
| `wordSeparator` | `string`             | —       | Count what a separator adds between the words |

Returns `[min, max]`.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nicknameLengthRange(language: WordLanguage.ko); // LengthRange(1, 12)
nicknameLengthRange(language: WordLanguage.en); // LengthRange(3, 30)
nicknameLengthRange(language: WordLanguage.zh); // LengthRange(2, 5)
nicknameLengthRange(language: WordLanguage.ko, wordSeparator: '-'); // LengthRange(1, 14)
```

| Parameter       | Type            | Default | Description                                   |
| --------------- | --------------- | ------- | --------------------------------------------- |
| `language`      | `WordLanguage?` | `null`  | The language, or null for every one           |
| `wordSeparator` | `String?`       | `null`  | Count what a separator adds between the words |

Returns a `LengthRange`, which compares by value.

:::

::: lang py

```python
from randino import nickname_length_range

nickname_length_range("ko")  # (1, 12)
nickname_length_range("en")  # (3, 30)
nickname_length_range("zh")  # (2, 5)
nickname_length_range("ko", "-")  # (1, 14)
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `WordLanguageOption` | `"all"` | The language, or `"all"` for every one |
| `word_separator` | `str \| None` | `None` | Count what a separator adds between the words |

Returns a `tuple[int, int]`.

:::

## The range is wide on purpose

The lower end is a bare noun and the upper end a modifier, a noun and a trailing word together, so the default range spans **every shape** — and it is the shape weights, not the range, that decide what output usually looks like. Narrowing the range is how you take a shape away:

::: lang js

```javascript
nicknameLengthRange('en'); // [3, 30] — every shape
randNickname({ language: 'en', maxLength: 8, count: 3 });
// ['CoolPoem', 'MaidClaw', 'RustyBus'] — no room for three words
```

:::

::: lang dart

```dart
nicknameLengthRange(language: WordLanguage.en); // LengthRange(3, 30) — every shape
randNickname(language: WordLanguage.en, maxLength: 8, count: 3);
// ['CoolPoem', 'MaidClaw', 'RustyBus'] — no room for three words
```

:::

::: lang py

```python
nickname_length_range("en")  # (3, 30) — every shape
rand_nickname(language="en", max_length=8, count=3)
# ['CoolPoem', 'MaidClaw', 'RustyBus'] — no room for three words
```

:::

## Two things that widen or narrow it

**A separator is part of the nickname.** Its length counts toward <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code />, so passing one to this function is how you find out what is left:

::: lang js

```javascript
nicknameLengthRange('ko'); // [1, 12]
nicknameLengthRange('ko', '-'); // [1, 14] — two separators in the longest shape
nicknameLengthRange('en', ' '); // [3, 32]
```

:::

::: lang dart

```dart
nicknameLengthRange(language: WordLanguage.ko); // LengthRange(1, 12)
nicknameLengthRange(language: WordLanguage.ko, wordSeparator: '-'); // LengthRange(1, 14)
nicknameLengthRange(language: WordLanguage.en, wordSeparator: ' '); // LengthRange(3, 32)
```

:::

::: lang py

```python
nickname_length_range("ko")  # (1, 12)
nickname_length_range("ko", word_separator="-")  # (1, 14) — two separators in the longest shape
nickname_length_range("en", word_separator=" ")  # (3, 32)
```

:::

**A random suffix is outside the range entirely.** [`randSuffix`](../decorate/rand-suffix) attaches its token after the nickname is finished, so <Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole nickname and nothing is excluded from them.

## See also

- [`randNickname`](./rand-nickname) — where the length options are used.
- [Constants](../reference/constants) — the hard bounds every length option is clamped to.
