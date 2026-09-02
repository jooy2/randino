# randWord

Generates everyday words and returns `count` of them as strings. Animals, things, nature, ideas — fourteen [themes](./themes), in four languages, and **never a person name**. With [`output: 'detail'`](#the-detail-output) it reports the language and theme behind each word.

These are the pools [`randNickname`](../nickname/rand-nickname) is built from. This is the same vocabulary with nothing added to it.

::: lang js

```javascript
import { randWord } from 'randino';

randWord();
// ['Lantern']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randWord();
// [Lantern]
```

:::

::: lang py

```python
from randino import rand_word

rand_word()
# ['Lantern']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Language of the generated words. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> mixes every supported language, picking one per word. |
| `theme` | <Lang js="WordThemeOption" dart="WordTheme?" py="WordThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | What the words are about. See [Themes](./themes). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many words to return. Clamped to `0` … `10000`. |
| `style` | <Lang js="number" dart="int" py="int" code /> | `0` | `0` draws real words, `100` invents words that only read like the language, and anything between mixes the two. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _pools_ | Minimum length in characters. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _pools_ | Maximum length in characters. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | Keep only words whose first character is this one. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same word twice. May return fewer than `count` once a pool runs out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `WordDetail` per word. Dart has no such parameter — see [the detail output](#the-detail-output). |

Everything but `language` and `theme` is an option every generator in the package takes, and means the same thing on each of them.

## One function per theme

A theme is not only an option — each of the fourteen is a function of its own, which is `randWord` with the theme already chosen.

::: lang js

```javascript
import { randAnimal, randFood, randGem } from 'randino';

randAnimal({ language: 'ko', count: 3 }); // ['여우', '고래', '수달']
randFood({ language: 'en', count: 2 }); // ['Dumpling', 'Cocoa']
randGem({ language: 'ko', count: 2, unique: true }); // ['흑요석', '청동']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randAnimal(language: WordLanguage.ko, count: 3); // [여우, 고래, 수달]
randFood(language: WordLanguage.en, count: 2); // [Dumpling, Cocoa]
randGem(language: WordLanguage.ko, count: 2, unique: true); // [흑요석, 청동]
```

The themed functions return `List<String>` only. For the detail form, pass the theme to `randWordDetails` — Dart has no overloads, and fourteen more functions for it would be fourteen too many.

:::

::: lang py

```python
from randino import rand_animal, rand_food, rand_gem

rand_animal(language="ko", count=3)  # ['여우', '고래', '수달']
rand_food(language="en", count=2)  # ['Dumpling', 'Cocoa']
rand_gem(language="ko", count=2, unique=True)  # ['흑요석', '청동']
```

:::

They take every option `randWord` does except `theme`, which they answer. The full list is in [Themes](./themes).

## Length

Left out, <Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> fall back to what the pools actually hold — that is what [`wordLengthRange`](./word-length-range) reports. A range the pool cannot satisfy is answered with the closest word it has rather than a truncated one.

::: lang js

```javascript
randWord({ language: 'ko', theme: 'animal', maxLength: 2, count: 4 });
// ['곰', '수달', '여우', '학']

randWord({ language: 'en', minLength: 9, count: 3 });
// ['Saxophone', 'Spaghetti', 'Spaceship']
```

:::

::: lang dart

```dart
randWord(language: WordLanguage.ko, theme: WordTheme.animal, maxLength: 2, count: 4);
// [곰, 수달, 여우, 학]

randWord(language: WordLanguage.en, minLength: 9, count: 3);
// [Saxophone, Spaghetti, Spaceship]
```

:::

::: lang py

```python
rand_word(language="ko", theme="animal", max_length=2, count=4)
# ['곰', '수달', '여우', '학']

rand_word(language="en", min_length=9, count=3)
# ['Saxophone', 'Spaghetti', 'Spaceship']
```

:::

## Invented words

`style` is a dial rather than a switch: `0` draws from the pools, `100` invents words that only read like the language, and anything between decides per word.

::: lang js

```javascript
randWord({ language: 'ko', style: 100, count: 4 });
// ['다순', '머차', '멜포', '재거']

randWord({ language: 'en', style: 50, count: 4 });
// ['Blorin', 'Meadow', 'Tavren', 'Compass']
```

:::

::: lang dart

```dart
randWord(language: WordLanguage.ko, style: 100, count: 4);
// [다순, 머차, 멜포, 재거]
```

:::

::: lang py

```python
rand_word(language="ko", style=100, count=4)
# ['다순', '머차', '멜포', '재거']
```

:::

An invented word can spell a real one by accident — `나` + `비` is `나비` — and the theme is then reported rather than hidden.

## The detail output {#the-detail-output}

::: lang js

```javascript
randWord({ language: 'ko', theme: 'plant', output: 'detail' });
// [{ word: '민들레', language: 'ko', theme: 'plant' }]
```

:::

::: lang dart

```dart
randWordDetails(language: WordLanguage.ko, theme: WordTheme.plant).first;
// WordDetail(민들레, ko, plant)
```

Dart has neither overloads nor union types, so the detail form is its own function.

:::

::: lang py

```python
rand_word(language="ko", theme="plant", output="detail")
# [WordDetail(word='민들레', language='ko', theme='plant')]
```

:::

`theme` is null for an invented word that matches nothing in the pools.

## See also

- [Themes](./themes) — the fourteen of them, and the function each one has.
- [`wordLengthRange`](./word-length-range) — what a language's pools can produce.
- [`randNickname`](../nickname/rand-nickname) — the same words, put together.
