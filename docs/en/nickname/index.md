# Nicknames

A nickname is the handle someone would pick for a game or a website — MistyOwl, CraneVoyage, RustyBoot. randino builds one out of an everyday word with something added to it: a word for what it is like in front, one for what it is doing, a second word behind, or a possessive between the two.

::: lang js

```javascript
import { randNickname } from 'randino';

randNickname({ language: 'en', count: 3 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNickname(language: WordLanguage.en, count: 3);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

**Person names are never used.** That rule is the whole reason nicknames and names are two generators rather than one: a handle built out of somebody's name reads as that person's identity, and a handle built out of `Owl` and `Misty` reads as a handle. The English pools are checked against the English person-name pools automatically, which is why `job` has no `Knight`, `Baker` or `Hunter` and `plant` no `Rose` or `Ivy`.

Korean and Japanese cannot be held to that check — 하늘, 별 and 森 are everyday nouns that happen to also be names — but `아름다운하늘` is still nobody's name.

## What is in the box

| Function | Returns |
| --- | --- |
| [`randNickname`](./rand-nickname) | The nicknames as strings, or [a detail per nickname](./rand-nickname#the-detail-output) |
| [`nicknameLengthRange`](./nickname-length-range) | Every length a language can produce |

The nouns come from seventeen [themes](../word/themes), and every nickname is built around a word from one of them.

## How the options behave

### Length picks the shape, not the words

Each language declares its own shapes — a bare noun, a word for what the noun is like in front of it, one for what it is doing, a trailing word behind it, a possessive between the two, or a combination — and <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code /> choose **between the shapes first**. The shapes that cannot land inside the range are dropped, then each slot is given the room left after the slots behind it have reserved their minimum.

That is why a narrow range drops the modifier instead of truncating a word, and why a long range brings the three-word shapes in.

The shapes belong to the language rather than to the generator, because grammar differs: Chinese needs 的 between a verb and its noun (`奔跑的狮子`) where Korean needs nothing (`달리는사자`), and English has no possessive shape at all, since `of` is a word rather than a particle that attaches to the word in front of it.

::: lang js

```javascript
randNickname({ language: 'en', count: 4, minLength: 4, maxLength: 9 });
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.en, count: 4, minLength: 4, maxLength: 9);
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

::: lang py

```python
rand_nickname(language="en", count=4, min_length=4, max_length=9)
# ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

The default range is **wide on purpose**: it spans every shape, and the shape weights — not the range — decide what output usually looks like. `nicknameLengthRange` is what reports it.

### `wordSeparator` replaces the language's own joiner

Left out, each language joins its words the way it writes them: Korean, Japanese and Chinese run them together, and English reads as CamelCase. Pass one and every shape uses it, the two-word ones and the three-word ones alike.

::: lang js

```javascript
randNickname({ language: 'en', wordSeparator: ' ', count: 4 });
// ['Soldier', 'Hollow Petal', 'Syrupy Mica Tale', 'Spinning Cathedral']

randNickname({ language: 'en', wordSeparator: '-', count: 4 });
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.en, wordSeparator: ' ', count: 4);
// ['Soldier', 'Hollow Petal', 'Syrupy Mica Tale', 'Spinning Cathedral']

randNickname(language: WordLanguage.en, wordSeparator: '-', count: 4);
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']
```

:::

::: lang py

```python
rand_nickname(language="en", word_separator=" ", count=4)
# ['Soldier', 'Hollow Petal', 'Syrupy Mica Tale', 'Spinning Cathedral']

rand_nickname(language="en", word_separator="-", count=4)
# ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']
```

:::

It is not cosmetic: **its length is part of the nickname's**, so a separator narrows the range the same way a longer word does. Pass it to `nicknameLengthRange` to see what is left.

### A unique suffix is not an option here

It used to be four of them. Attaching a random token to a string is a thing about strings rather than about nicknames, so it is [`randSuffix`](../decorate/rand-suffix) now — which takes these nicknames, or a name, or an order number.

::: lang js

```javascript
randSuffix(randNickname({ language: 'en', count: 3 }));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']
```

:::

::: lang dart

```dart
randSuffixAll(randNickname(language: WordLanguage.en, count: 3));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']
```

:::

::: lang py

```python
rand_suffix(rand_nickname(language="en", count=3))
# ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']
```

:::

Because the token is attached afterwards, <Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole nickname and have nothing to exclude.

### `realism` invents words rather than drawing them

At `real` every word is a real one. At `invented` the words are built from the language's own syllables, which reads as a made-up handle rather than a dictionary word.

::: lang js

```javascript
randNickname({ language: 'en', realism: 'invented', count: 3 });
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.en, realism: RandRealism.invented, count: 3);
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

::: lang py

```python
rand_nickname(language="en", realism="invented", count=3)
# ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

`realism` also decides **which themes** <Lang js="theme: 'all'" dart="a null theme" py="theme=&quot;all&quot;" code /> spans. Three of the seventeen — `color`, `finance` and `tech` — make an awkward nickname: a word in front of a colour or a loan reads as a joke rather than a handle (`BraveInvoice`, `멋진대출`, `奔跑的服务器`). At `real` they are left out; at `mixed` and `invented` they are in. Naming one of them is always honoured, whatever the realism is — asking for `finance` and getting something else would be the option not working.

::: lang js

```javascript
randNickname({ theme: 'finance', count: 2 }); // ['QuietLedger', 'RisingYield']
```

:::

::: lang dart

```dart
randNickname(theme: WordTheme.finance, count: 2); // [QuietLedger, RisingYield]
```

:::

::: lang py

```python
rand_nickname(theme="finance", count=2)  # ['QuietLedger', 'RisingYield']
```

:::

### `unique`, and why a suffix is usually the better answer

Korean and English have over nine million word combinations each, so duplicates are rare either way. `unique` rules them out inside one call and returns fewer nicknames once the pools run out; [`randSuffix`](../decorate/rand-suffix) makes collisions impossible across calls, across processes and across users, which is the guarantee a sign-up form actually needs.
