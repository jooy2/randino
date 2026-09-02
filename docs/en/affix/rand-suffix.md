# randSuffix

Appends a random token to a string, or to every string in an array — `멋진사자` becomes `멋진사자_nVtRC`. It is what turns a nickname that is merely unlikely to collide into one that cannot, and it takes any string rather than only this library's output.

::: lang js

```javascript
import { randNickname, randSuffix } from 'randino';

randSuffix('멋진사자'); // '멋진사자_nVtRC'
randSuffix('MistyOwl', { length: 8, separator: '-' }); // 'MistyOwl-k3Rm9dQx'

randSuffix(randNickname({ language: 'ko', count: 2 }));
// ['달력_U7aNZ', '조용한바구니_RUKAP']
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| string[]` | — | What to append to. The first argument, not an option |
| `length` | `number` | `5` | Characters in the token. Clamped to `1` … `32` |
| `separator` | `string` | `'_'` | Placed between the value and the token. An empty string joins them directly |
| `charset` | `string` | _built-in_ | Characters the token is drawn from |

Returns a `string` for a `string`, and a `string[]` for a `string[]`.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randSuffix('멋진사자'); // '멋진사자_nVtRC'
randSuffix('MistyOwl', length: 8, separator: '-'); // 'MistyOwl-k3Rm9dQx'

randSuffixAll(randNickname(language: WordLanguage.ko, count: 2));
// ['달력_U7aNZ', '조용한바구니_RUKAP']
```

| Parameter   | Type      | Default | Description                                    |
| ----------- | --------- | ------- | ---------------------------------------------- |
| `value`     | `String`  | —       | What to append to. Positional                  |
| `length`    | `int`     | `5`     | Characters in the token. Clamped to `1` … `32` |
| `separator` | `String`  | `'_'`   | Placed between the value and the token         |
| `charset`   | `String?` | `null`  | Characters the token is drawn from             |

Returns a `String`. **`randSuffixAll` is the list form** — `List<String>` in, `List<String>` out, with the same named parameters. Dart has neither overloads nor union types, so the two shapes are two functions rather than one taking either.

:::

::: lang py

```python
from randino import rand_nickname, rand_suffix

rand_suffix("멋진사자")  # '멋진사자_nVtRC'
rand_suffix("MistyOwl", length=8, separator="-")  # 'MistyOwl-k3Rm9dQx'

rand_suffix(rand_nickname(language="ko", count=2))
# ['달력_U7aNZ', '조용한바구니_RUKAP']
```

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `str \| list[str]` | — | What to append to. Positional; the rest are keyword-only |
| `length` | `int` | `5` | Characters in the token. Clamped to `1` … `32` |
| `separator` | `str` | `"_"` | Placed between the value and the token |
| `charset` | `str` | `""` | Characters the token is drawn from; empty means the default |

Returns a `str` for a `str`, and a `list[str]` for a `list[str]` — carried by `@overload`, so a type checker knows which one it got.

:::

## A fresh token for every value

Not one token for the batch. That is the whole reason a list is worth passing: a hundred nicknames come back with a hundred different tokens, so none of them collide with each other either.

::: lang js

```javascript
randSuffix(['Owl', 'Owl', 'Owl']);
// ['Owl_nVtRC', 'Owl_AVcCV', 'Owl_gDe2C']
```

:::

::: lang dart

```dart
randSuffixAll(const ['Owl', 'Owl', 'Owl']);
// ['Owl_nVtRC', 'Owl_AVcCV', 'Owl_gDe2C']
```

:::

::: lang py

```python
rand_suffix(["Owl", "Owl", "Owl"])
# ['Owl_nVtRC', 'Owl_AVcCV', 'Owl_gDe2C']
```

:::

## The default charset leaves out the characters that misread

No `0` or `O`, no `1`, `l` or `I`. A suffix is something somebody reads off one screen and types into another, and those five are where that goes wrong. Narrowing it further is a matter of passing a shorter alphabet:

::: lang js

```javascript
randSuffix('MistyOwl', { charset: '0123456789' }); // 'MistyOwl_40218'
randSuffix('MistyOwl', { charset: AFFIX_CHARSET.replace(/[A-Z]/g, '') }); // 'MistyOwl_kq3mv'
```

:::

::: lang dart

```dart
randSuffix('MistyOwl', charset: '0123456789'); // 'MistyOwl_40218'
randSuffix('MistyOwl', charset: affixCharset.replaceAll(RegExp('[A-Z]'), '')); // 'MistyOwl_kq3mv'
```

:::

::: lang py

```python
rand_suffix("MistyOwl", charset="0123456789")  # 'MistyOwl_40218'
rand_suffix("MistyOwl", charset="".join(c for c in AFFIX_CHARSET if not c.isupper()))
# 'MistyOwl_kq3mv'
```

:::

## Why this is not a nickname option

It used to be, as <Lang js="uniqueSuffix" dart="uniqueSuffix" py="unique_suffix" code /> and three options beside it. Attaching a token to a string is not a thing about nicknames, though — it is a thing about strings. As its own function it works on a name, on an order number, on anything you already have, and the nickname generator's length options went back to describing the whole nickname rather than the part before the suffix.

## See also

- [`randPrefix`](./rand-prefix) — the same token, in front instead of behind.
- [`randNickname`](../nickname/rand-nickname) — what this is most often attached to.
- [Constants](../reference/constants) — the default charset, and the length bound.
