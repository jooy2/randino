# wordLengthRange

Reports the shortest and longest word a language's pools hold, in characters. This is what [`randWord`](./rand-word) falls back to when <Lang js="minLength" dart="minLength" py="min_length" code /> or <Lang js="maxLength" dart="maxLength" py="max_length" code /> is left out.

::: lang js

```javascript
import { wordLengthRange } from 'randino';

wordLengthRange('ko'); // [1, 4]
wordLengthRange('en'); // [3, 11]
wordLengthRange(); // [1, 12] — every language at once
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

wordLengthRange(language: WordLanguage.ko); // LengthRange(1, 4)
wordLengthRange(language: WordLanguage.en); // LengthRange(3, 11)
wordLengthRange(); // LengthRange(1, 12) — every language at once
```

:::

::: lang py

```python
from randino import word_length_range

word_length_range("ko")  # (1, 4)
word_length_range("en")  # (3, 11)
word_length_range()  # (1, 12) — every language at once
```

:::

## Arguments

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | The language to report on, or every one of them. |
| `theme` | <Lang js="WordThemeOption" dart="WordTheme?" py="WordThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | The theme to report on, or every one of them. |

Both are positional in JavaScript and Python and named in Dart, the way the other language helpers are.

## Narrowing the theme narrows the range

A theme is a pool of its own, so its range always sits inside the language's.

::: lang js

```javascript
wordLengthRange('en'); // [3, 11]
wordLengthRange('en', 'weather'); // [4, 10]
wordLengthRange('zh'); // [2, 3] — every Chinese noun is two or three characters
```

:::

::: lang dart

```dart
wordLengthRange(language: WordLanguage.en); // LengthRange(3, 11)
wordLengthRange(language: WordLanguage.en, theme: WordTheme.weather); // LengthRange(4, 10)
wordLengthRange(language: WordLanguage.zh); // LengthRange(2, 3)
```

:::

::: lang py

```python
word_length_range("en")  # (3, 11)
word_length_range("en", "weather")  # (4, 10)
word_length_range("zh")  # (2, 3)
```

:::

Asking for a range the pool cannot satisfy is not an error: the generator answers with the closest word it holds rather than truncating one.

## See also

- [`randWord`](./rand-word) — where the range is used.
- [`nicknameLengthRange`](../nickname/nickname-length-range) — the same question for a whole nickname.
