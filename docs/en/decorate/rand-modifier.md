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
| `realism` | `RandRealism` | `'real'` | `real` draws a modifier the language uses, `invented` builds one that only reads like it |
| `kind` | `ModifierKind \| 'all'` | `'all'` | `adjective` says what the value is like, `action` what it is doing |
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

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `String?` | `null` | What to decorate. Omit it for the modifier alone |
| `language` | `WordLanguage?` | _script_ | Language the modifier is drawn from |
| `realism` | `RandRealism` | `RandRealism.real` | `real` draws a real modifier, `invented` builds one |
| `kind` | `ModifierKind?` | `null` | `adjective` says what the value is like, `action` what it is doing |
| `separator` | `String?` | _language_ | Placed between the modifier and the value |

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
| `realism` | `RandRealism` | `"real"` | `real` draws a real modifier, `invented` builds one |
| `kind` | `ModifierKind \| Literal["all"]` | `"all"` | `adjective` says what the value is like, `action` what it is doing |
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

## The modifier agrees with the value

In a language whose modifiers change shape beside the noun, `randModifier` looks the value up in that language's pools. A word it finds carries a gender, so the modifier comes back in the form that goes with it. A word from no pool is read by its ending instead, the way the language itself reads an unfamiliar one — Spanish takes `-a`, `-ión` and `-dad` as feminine, Russian `-а` and `-о`, and German the four suffixes that are predictable — so a made-up word gets a modifier that agrees with it too.

A noun with no singular at all — `ножницы`, `gafas`, `Jeans` — is tagged plural for the same reason, so the modifier beside it is plural too.

::: lang js

```javascript
randModifier('luna', { language: 'es' }); // 'luna dorada'
randModifier('gato', { language: 'es' }); // 'gato dorado'
randModifier('gafas', { language: 'es' }); // 'gafas doradas'
randModifier('Katze', { language: 'de' }); // 'blaue Katze'
randModifier('Zzyzx', { language: 'es' }); // 'Zzyzx dorado' — not a word it knows
```

:::

::: lang dart

```dart
randModifier(value: 'luna', language: WordLanguage.es); // 'luna dorada'
randModifier(value: 'gato', language: WordLanguage.es); // 'gato dorado'
randModifier(value: 'gafas', language: WordLanguage.es); // 'gafas doradas'
randModifier(value: 'Katze', language: WordLanguage.de); // 'blaue Katze'
randModifier(value: 'Zzyzx', language: WordLanguage.es); // 'Zzyzx dorado'
```

:::

::: lang py

```python
rand_modifier("luna", language="es")  # 'luna dorada'
rand_modifier("gato", language="es")  # 'gato dorado'
rand_modifier("gafas", language="es")  # 'gafas doradas'
rand_modifier("Katze", language="de")  # 'blaue Katze'
rand_modifier("Zzyzx", language="es")  # 'Zzyzx dorado' — not a word it knows
```

:::

The five languages whose modifiers do not change shape — `ko`, `en`, `ja`, `zh` and `vi` — are unaffected: there is nothing to agree with, so any value gets any modifier.

## `kind` picks what the modifier says

A modifier either says what the value **is like** or what it **is doing**, and they are two pools rather than one. `kind` picks between them; left out, both are in play, which is what it did before there was an option.

::: lang js

```javascript
randModifier({ language: 'en', kind: 'adjective' }); // 'Coral'
randModifier({ language: 'en', kind: 'action' }); // 'Bobbing'

randModifier('Owl', { language: 'en', kind: 'action' }); // 'CountingOwl'
randModifier('사자', { language: 'ko', kind: 'action' }); // '숨기는사자'
```

:::

::: lang dart

```dart
randModifier(language: WordLanguage.en, kind: ModifierKind.adjective); // 'Coral'
randModifier(language: WordLanguage.en, kind: ModifierKind.action); // 'Bobbing'

randModifier(value: 'Owl', language: WordLanguage.en, kind: ModifierKind.action);
// 'CountingOwl'
randModifier(value: '사자', language: WordLanguage.ko, kind: ModifierKind.action);
// '숨기는사자'
```

:::

::: lang py

```python
rand_modifier(language="en", kind="adjective")  # 'Coral'
rand_modifier(language="en", kind="action")  # 'Bobbing'

rand_modifier("Owl", language="en", kind="action")  # 'CountingOwl'
rand_modifier("사자", language="ko", kind="action")  # '숨기는사자'
```

:::

The two are kept apart because they are different grammar, not different flavours: a language may need a particle between an action and its noun where an adjective needs none, which is why Chinese writes `奔跑的狮子` and `快乐狮子`. `randNickname`'s [`slots`](../nickname/rand-nickname#picking-the-shape) is the same distinction, made where a whole shape is being picked.

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

`separator` defaults to the way the language itself joins words, which is to run them together. `realism` is the same option every generator has: `real` draws a modifier the language actually uses, `invented` builds one that only reads like it.

::: lang js

```javascript
randModifier('Owl', { separator: '-' }); // 'Pointed-Owl'
randModifier({ language: 'en', realism: 'invented' }); // 'Snikith'
```

:::

::: lang dart

```dart
randModifier(value: 'Owl', separator: '-'); // 'Pointed-Owl'
randModifier(language: WordLanguage.en, realism: RandRealism.invented); // 'Snikith'
```

:::

::: lang py

```python
rand_modifier("Owl", separator="-")  # 'Pointed-Owl'
rand_modifier(language="en", realism="invented")  # 'Snikith'
```

:::

## The modifier and the noun are the same pools a nickname uses

A modifier in front of a word is exactly what `randNickname` does most of the time, so <Lang js="randModifier(randAnimal())" dart="randModifier(value: randAnimal().first)" py="rand_modifier(rand_animal())" code /> and `randNickname({ theme: 'animal' })` reach into the same place. What the nickname generator adds on top is the shapes and the length fitting: a trailing word, a range the whole thing has to land inside, and a re-draw when two words stutter across their boundary.

## See also

- [`randWord`](../word/rand-word) — the words this is usually put in front of.
- [`randSuffix`](./rand-suffix) — a random token instead of a word.
- [`randNickname`](../nickname/rand-nickname) — the same pools, composed rather than decorated.
- [Supported languages](../guide/languages#words-and-nicknames) — where the modifier goes in each language, and when it changes shape.
