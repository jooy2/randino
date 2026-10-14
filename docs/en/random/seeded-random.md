# seededRandom

A seeded source for the `random` option. The same seed gives the same numbers, so a call made with it comes out the same every run, which is what a snapshot test or a demo database wants. The seed is read as its text, so `42` and `'42'` are one seed.

::: lang js

```javascript
import { randName, randSentence, seededRandom } from 'randino';

randName({ language: 'en', count: 3, random: seededRandom(42) });
// ['Stephanie Lee', 'Abigale Edwards', 'Wayne Bradshaw'] — every time

// One source can be handed to several calls; they then draw one after another.
const random = seededRandom('fixtures');

randName({ count: 5, random });
randSentence({ sentences: 3, random });
```

| Parameter | Type               | Description                      |
| --------- | ------------------ | -------------------------------- |
| `seed`    | `number \| string` | What the numbers are drawn from. |

Returns `() => number`, a function that hands out the next number in `[0, 1)` each time it is called.

:::

::: lang dart

Dart's own `Random` already takes a seed, so the Dart package has no function of its own for it.

```dart
import 'dart:math';

randName(language: NameLanguage.en, count: 3, random: Random(42));
```

:::

::: lang py

Python's own `random.Random` already takes a seed, so the Python package has no function of its own for it.

```python
from random import Random

rand_name(language="en", count=3, random=Random(42).random)
```

:::

## How it draws {#how-it-draws}

The JavaScript standard library has no seeded generator: `Math.random` takes no seed. `seededRandom` is [sfc32](https://pracrand.sourceforge.net/RNG_engines.txt), a small generator with 128 bits of state that passes the PractRand test suite. The seed's text sets the state through FNV-1a and the MurmurHash3 finalizer, so seeds one character apart start far apart. Each number is made of two 32-bit outputs, which gives it the 53 bits of precision a `Math.random` number has.

It is **not cryptographically secure**. Anyone who sees a few of its numbers can work out the rest. For a token nobody may predict, pass a secure source instead, as [Choosing the source](../guide/getting-started#choosing-the-source) shows.

## A seed repeats within one version {#within-one-version}

The numbers `seededRandom` hands out never change: the test suite pins them, because every fixture built on a seed is made of them. What the generators make out of those numbers can change between versions of the package. The pools grow, and a word added to one of them moves every draw after it, so pin the package's version if a fixture has to survive an upgrade.

## See also

- [Choosing the source](../guide/getting-started#choosing-the-source) — when to pass a seeded source, and when a secure one.
