# randPrefix

Prepends a random token to a string, or to every string in an array. It mirrors [`randSuffix`](./rand-suffix), for the places where the distinguishing part belongs in front: a shard, a tenant, a key that sorts by nothing in particular.

::: lang js

```javascript
import { randNickname, randPrefix } from 'randino';

randPrefix('MistyOwl'); // 'nVtRC_MistyOwl'
randPrefix('order-4021', { length: 4, separator: '-' }); // 'k3Rm-order-4021'

randPrefix(randNickname({ language: 'en', count: 2 }));
// ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| string[]` | — | What to prepend to. The first argument, not an option. Omit it for the bare token |
| `length` | `number` | `5` | Characters in the token. Clamped to `1` … `32` |
| `separator` | `string` | `'_'` | Placed between the token and the value |
| `charset` | `string` | _built-in_ | Characters the token is drawn from |

Returns a `string` for a `string`, and a `string[]` for a `string[]`.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPrefix(value: 'MistyOwl'); // 'nVtRC_MistyOwl'
randPrefix(value: 'order-4021', length: 4, separator: '-'); // 'k3Rm-order-4021'

randPrefixAll(randNickname(language: WordLanguage.en, count: 2));
// ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
```

| Parameter   | Type      | Default | Description                                    |
| ----------- | --------- | ------- | ---------------------------------------------- |
| `value`     | `String?` | `null`  | What to prepend to. Omit it for the bare token |
| `length`    | `int`     | `5`     | Characters in the token. Clamped to `1` … `32` |
| `separator` | `String`  | `'_'`   | Placed between the token and the value         |
| `charset`   | `String?` | `null`  | Characters the token is drawn from             |

Returns a `String`. **`randPrefixAll` is the list form**, for the same reason `randSuffixAll` is.

:::

::: lang py

```python
from randino import rand_nickname, rand_prefix

rand_prefix("MistyOwl")  # 'nVtRC_MistyOwl'
rand_prefix("order-4021", length=4, separator="-")  # 'k3Rm-order-4021'

rand_prefix(rand_nickname(language="en", count=2))
# ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
```

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `str \| list[str] \| None` | `None` | What to prepend to. Positional; the rest are keyword-only. Omit it for the bare token |
| `length` | `int` | `5` | Characters in the token. Clamped to `1` … `32` |
| `separator` | `str` | `"_"` | Placed between the token and the value |
| `charset` | `str` | `""` | Characters the token is drawn from; empty means the default |

Returns a `str` for a `str`, and a `list[str]` for a `list[str]`.

:::

## Everything else is `randSuffix`

The token, the defaults, the clamping and the fresh-token-per-value rule are the same. The two share their implementation and differ by which side the token lands on. That includes the value being optional: `randPrefix()` hands back the same bare token `randSuffix()` does. What [`randSuffix`](./rand-suffix) says about the charset applies here unchanged.

## See also

- [`randSuffix`](./rand-suffix) — the same token, behind instead of in front.
- [`randModifier`](./rand-modifier) — the third decorator, which attaches a word rather than a token.
- [Constants](../reference/constants) — the default charset, and the length bound.
