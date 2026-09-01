# nicknameLengthRange

Every nickname length the language can produce, in characters. This is what [`randomNickname`](./random-nickname) falls back to when `minLength` or `maxLength` is omitted.

::: lang js

```javascript
import { nicknameLengthRange } from 'randino';

nicknameLengthRange('ko'); // [1, 12]
nicknameLengthRange('ko', false); // [1, 8]
nicknameLengthRange('en'); // [3, 30]
nicknameLengthRange('zh'); // [2, 5]
nicknameLengthRange('ko', true, '-'); // [1, 14]
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NicknameLanguageOption` | `'all'` | The language, or `'all'` for every one |
| `includeModifier` | `boolean` | `true` | Count the modifier shapes |
| `wordSeparator` | `string` | — | Count what a separator adds between the words |

Returns `[min, max]`.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nicknameLengthRange(language: NicknameLanguage.ko); // LengthRange(1, 12)
nicknameLengthRange(language: NicknameLanguage.ko, includeModifier: false); // LengthRange(1, 8)
nicknameLengthRange(language: NicknameLanguage.en); // LengthRange(3, 30)
nicknameLengthRange(language: NicknameLanguage.zh); // LengthRange(2, 5)
nicknameLengthRange(language: NicknameLanguage.ko, wordSeparator: '-'); // LengthRange(1, 14)
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NicknameLanguage?` | `null` | The language, or null for every one |
| `includeModifier` | `bool` | `true` | Count the modifier shapes |
| `wordSeparator` | `String?` | `null` | Count what a separator adds between the words |

Returns a `LengthRange`, which compares by value.

:::

## The range is wide on purpose

The lower end is a bare noun and the upper end a modifier, a noun and a trailing word together, so the default range spans **every shape** — and it is the shape weights, not the range, that decide what output usually looks like. Narrowing the range is how you take a shape away:

::: lang js

```javascript
nicknameLengthRange('ko'); // [1, 12] — every shape
randomNickname({ language: 'ko', maxLength: 3, count: 3 });
// ['노을', '파란곰', '수달'] — no room for three words
```

:::

::: lang dart

```dart
nicknameLengthRange(language: NicknameLanguage.ko); // LengthRange(1, 12) — every shape
randomNickname(language: NicknameLanguage.ko, maxLength: 3, count: 3);
// ['노을', '파란곰', '수달'] — no room for three words
```

:::

## Two things that widen or narrow it

**A separator is part of the nickname.** Its length counts toward `minLength` / `maxLength`, so passing one to this function is how you find out what is left:

::: lang js

```javascript
nicknameLengthRange('ko'); // [1, 12]
nicknameLengthRange('ko', true, '-'); // [1, 14] — two separators in the longest shape
nicknameLengthRange('en', true, ' '); // [3, 32]
```

:::

::: lang dart

```dart
nicknameLengthRange(language: NicknameLanguage.ko); // LengthRange(1, 12)
nicknameLengthRange(language: NicknameLanguage.ko, wordSeparator: '-'); // LengthRange(1, 14)
nicknameLengthRange(language: NicknameLanguage.en, wordSeparator: ' '); // LengthRange(3, 32)
```

:::

**A `baseWord` longer than the range widens it** rather than being truncated. That is not reported here — this function describes the language's own pools — but it is what `randomNickname` does with the word you gave it.

**The unique suffix is outside the range entirely.** `minLength` and `maxLength` describe the readable part; the suffix is appended after they have been satisfied.

## See also

- [`randomNickname`](./random-nickname) — where `minLength` and `maxLength` are used.
- [Constants](../reference/constants) — the hard bounds every length option is clamped to.
