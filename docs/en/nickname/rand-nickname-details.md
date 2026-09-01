# randNicknameDetails

Generates nicknames and reports the pieces each one was built from — the words in order, the unique suffix on its own, the language and the theme. Useful for highlighting the base word, grouping by theme, or storing the suffix in a column of its own.

::: lang js

```javascript
import { randNicknameDetails } from 'randino';

randNicknameDetails({ language: 'ko', uniqueSuffix: true });
// [{
//   nickname: '오래된발견_zVShs',
//   words: ['오래된', '발견'],
//   suffix: '_zVShs',
//   language: 'ko',
//   theme: 'concept'
// }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNicknameDetails(language: NicknameLanguage.ko, uniqueSuffix: true);
// [NicknameDetail(오래된발견_zVShs, [오래된, 발견], ko, concept)]
```

:::

::: lang py

```python
from randino import rand_nickname_details

rand_nickname_details(language="ko", unique_suffix=True)
# [NicknameDetail(nickname='오래된발견_zVShs', words=('오래된', '발견'),
#                 suffix='_zVShs', language='ko', theme='concept')]
```

:::

## Options

Exactly the same options as [`randNickname`](./rand-nickname). Only the return type differs.

## What you get back

| Field | Type | Description |
| --- | --- | --- |
| `nickname` | <Lang js="string" dart="String" py="str" code /> | The finished nickname, unique suffix included. |
| `words` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | The words it is made of, in order, without the suffix. |
| `suffix` | <Lang js="string" dart="String" py="str" code /> | The suffix, separator included. Empty when no suffix was asked for. |
| `language` | `NicknameLanguage` | The language this nickname was generated in. |
| `theme` | <Lang js="NicknameTheme &#124; null" dart="NicknameTheme?" py="NicknameTheme &#124; None" code /> | Theme of the base word, or null when that word is not one the generator knows. |

Joining `words` with the language's own joiner and appending `suffix` reproduces `nickname` exactly — that is an invariant, and both test suites assert it.

### About `theme`

The theme is **reported, not asserted**. A word drawn from a theme reports it; a <Lang js="baseWord" dart="baseWord" py="base_word" code /> of your own is looked up across every theme and reports the one that holds it; and an invented word is found nowhere and reports null.

Two coincidences follow from that and are worth expecting rather than treating as bugs. A word can be both a modifier and a noun — `무지개`, `Marble`, `自由` — and an invented word can spell a real one by accident: `나` + `비` is `나비`, so a nickname built at `style` 100 can come back with `theme` set to `animal`.

## Examples

### Highlighting the base word

::: lang js

```javascript
for (const { words, theme } of randNicknameDetails({ language: 'ko', count: 3 })) {
	console.log(words.join(' + '), theme);
}
// 오래된 + 곰 animal
// 영원한 + 도마뱀 animal
// 귀여운 + 신화 + 다발 myth
```

:::

::: lang dart

```dart
for (final detail in randNicknameDetails(language: NicknameLanguage.ko, count: 3)) {
  print('${detail.words.join(' + ')} ${detail.theme?.name}');
}
// 오래된 + 곰 animal
// 영원한 + 도마뱀 animal
// 귀여운 + 신화 + 다발 myth
```

:::

::: lang py

```python
for detail in rand_nickname_details(language="ko", count=3):
    print(" + ".join(detail.words), detail.theme)
# 오래된 + 곰 animal
# 영원한 + 도마뱀 animal
# 귀여운 + 신화 + 다발 myth
```

:::

### Storing the suffix separately

A sign-up flow usually wants the readable part and the collision-breaking part in two columns, so that a later rename can keep one and replace the other:

::: lang js

```javascript
const [detail] = randNicknameDetails({ language: 'en', uniqueSuffix: true });

await users.insert({
	handle: detail.nickname,
	display: detail.nickname.slice(0, -detail.suffix.length),
	discriminator: detail.suffix
});
```

:::

::: lang dart

```dart
final detail = randNicknameDetails(
  language: NicknameLanguage.en,
  uniqueSuffix: true,
).first;

await users.insert(
  handle: detail.nickname,
  display: detail.nickname.substring(0, detail.nickname.length - detail.suffix.length),
  discriminator: detail.suffix,
);
```

:::

::: lang py

```python
detail = rand_nickname_details(language="en", unique_suffix=True)[0]

await users.insert(
    handle=detail.nickname,
    display=detail.nickname[: -len(detail.suffix)],
    discriminator=detail.suffix,
)
```

:::

### Grouping by theme

::: lang js

```javascript
const byTheme = {};

for (const detail of randNicknameDetails({ language: 'en', count: 100 })) {
	(byTheme[detail.theme] ??= []).push(detail.nickname);
}
```

:::

::: lang dart

```dart
final byTheme = <NicknameTheme?, List<String>>{};

for (final detail in randNicknameDetails(language: NicknameLanguage.en, count: 100)) {
  byTheme.putIfAbsent(detail.theme, () => <String>[]).add(detail.nickname);
}
```

:::

::: lang py

```python
from collections import defaultdict

by_theme: defaultdict[NicknameTheme | None, list[str]] = defaultdict(list)

for detail in rand_nickname_details(language="en", count=100):
    by_theme[detail.theme].append(detail.nickname)
```

:::

## See also

- [`randNickname`](./rand-nickname) — the full option table, and the same nicknames as plain strings.
- [Themes](./themes) — what each theme holds.
