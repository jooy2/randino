# randModifier

Puts a random modifier in front of a string, or of every string in an array — `Owl` becomes `MistyOwl`. It takes any string rather than only this library's output, and with none at all it hands back the modifier itself.

This is what `randNickname`'s `includeModifier` used to be. It stopped being a nickname option for the same reason [`randSuffix`](./rand-suffix) did: decorating a string is a thing about strings, not about nicknames.

::: lang js

```javascript
import { randAnimal, randModifier } from 'randino';

randModifier('Owl'); // 'MistyOwl'
randModifier('Owl', { separator: ' ' }); // 'Misty Owl'
randModifier(); // 'Misty'

randModifier(randAnimal({ language: 'en', count: 2 }));
// ['TwinklingLynx', 'OnyxCrane']
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| string[]` | — | What to decorate. The first argument, not an option. Omit it for the modifier alone |
| `language` | `WordLanguageOption` | _script_ | Language the modifier is drawn from |
| `style` | `number` | `0` | `0` draws a real modifier, `100` invents one that only reads like the language |
| `separator` | `string` | _language_ | Placed between the modifier and the value |

Returns a `string` for a `string`, and a `string[]` for a `string[]`.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randModifier(value: 'Owl'); // 'MistyOwl'
randModifier(value: 'Owl', separator: ' '); // 'Misty Owl'
randModifier(); // 'Misty'

randModifierAll(randAnimal(language: WordLanguage.en, count: 2));
// [TwinklingLynx, OnyxCrane]
```

| Parameter   | Type            | Default    | Description                                      |
| ----------- | --------------- | ---------- | ------------------------------------------------ |
| `value`     | `String?`       | `null`     | What to decorate. Omit it for the modifier alone |
| `language`  | `WordLanguage?` | _script_   | Language the modifier is drawn from              |
| `style`     | `int`           | `0`        | `0` draws a real modifier, `100` invents one     |
| `separator` | `String?`       | _language_ | Placed between the modifier and the value        |

Returns a `String`. **`randModifierAll` is the list form**, the way `randSuffixAll` is for `randSuffix`.

:::

::: lang py

```python
from randino import rand_animal, rand_modifier

rand_modifier("Owl")  # 'MistyOwl'
rand_modifier("Owl", separator=" ")  # 'Misty Owl'
rand_modifier()  # 'Misty'

rand_modifier(rand_animal(language="en", count=2))
# ['TwinklingLynx', 'OnyxCrane']
```

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `str \| list[str] \| None` | `None` | What to decorate. Positional; the rest are keyword-only |
| `language` | `WordLanguageOption \| None` | _script_ | Language the modifier is drawn from |
| `style` | `int` | `0` | `0` draws a real modifier, `100` invents one |
| `separator` | `str \| None` | _language_ | Placed between the modifier and the value |

Returns a `str` for a `str`, and a `list[str]` for a `list[str]` — carried by `@overload`.

:::

## The script of the value picks the language

Left out, `language` is read off the value itself, so `'고양이'` is never handed an English modifier and `'Cat'` is never handed a Korean one. Pass one explicitly and it wins; pass <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> and every language is in play regardless of what the value is written in.

::: lang js

```javascript
randModifier('고양이'); // '하얀고양이' — Korean, from the script
randModifier('Cat'); // 'FlyingCat'
randModifier('고양이', { language: 'en' }); // 'Misty고양이'
```

:::

::: lang dart

```dart
randModifier(value: '고양이'); // '하얀고양이' — Korean, from the script
randModifier(value: 'Cat'); // 'FlyingCat'
randModifier(value: '고양이', language: WordLanguage.en); // 'Misty고양이'
```

:::

::: lang py

```python
rand_modifier("고양이")  # '하얀고양이' — Korean, from the script
rand_modifier("Cat")  # 'FlyingCat'
rand_modifier("고양이", language="en")  # 'Misty고양이'
```

:::

With no value there is no script to read, so every language is in play unless you name one.

## A fresh modifier for every value

Not one for the batch, the same way [`randSuffix`](./rand-suffix) draws a token per value. That is the whole reason an array is worth passing.

::: lang js

```javascript
randModifier(['Owl', 'Owl', 'Owl']);
// ['SunnyOwl', 'WoolenOwl', 'TealOwl']
```

:::

::: lang dart

```dart
randModifierAll(const ['Owl', 'Owl', 'Owl']);
// [SunnyOwl, WoolenOwl, TealOwl]
```

:::

::: lang py

```python
rand_modifier(["Owl", "Owl", "Owl"])
# ['SunnyOwl', 'WoolenOwl', 'TealOwl']
```

:::

## The separator, and invented modifiers

`separator` defaults to the way the language itself joins words, which is to run them together. `style` is the same dial every generator has: `0` draws a modifier the language actually uses, `100` invents one that only reads like it.

::: lang js

```javascript
randModifier('Owl', { separator: '-' }); // 'Pointed-Owl'
randModifier({ language: 'en', style: 100 }); // 'Snikith'
```

:::

::: lang dart

```dart
randModifier(value: 'Owl', separator: '-'); // 'Pointed-Owl'
randModifier(language: WordLanguage.en, style: 100); // 'Snikith'
```

:::

::: lang py

```python
rand_modifier("Owl", separator="-")  # 'Pointed-Owl'
rand_modifier(language="en", style=100)  # 'Snikith'
```

:::

## The modifier and the noun are the same pools a nickname uses

A modifier in front of a word is exactly what `randNickname` does most of the time, so <Lang js="randModifier(randAnimal())" dart="randModifier(value: randAnimal().first)" py="rand_modifier(rand_animal())" code /> and `randNickname({ theme: 'animal' })` reach into the same place. What the nickname generator adds on top is the shapes and the length fitting: a trailing word, a range the whole thing has to land inside, and a re-draw when two words stutter across their boundary.

## See also

- [`randWord`](../word/rand-word) — the words this is usually put in front of.
- [`randSuffix`](./rand-suffix) — a random token instead of a word.
- [`randNickname`](../nickname/rand-nickname) — the same pools, composed rather than decorated.
- [Supported languages](../guide/languages#words-and-nicknames) — why there are four of them and not nine.
