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

<WordOptions theme />

The same table is on each of the fourteen pages below, drawn from one component rather than written out fifteen times. Everything but `language` and `theme` is an option every generator in the package takes, and means the same thing on each of them.

Dart has no `output`; [the detail output](#the-detail-output) is `randWordDetails` there.

## One function per theme

A theme is not only an option — each of the fourteen is a function of its own, which is `randWord` with the theme already chosen. Each has a page of its own; the words each theme holds are on [Themes](./themes).

[`randAnimal`](./rand-animal) · [`randObject`](./rand-object) · [`randNature`](./rand-nature) · [`randPlant`](./rand-plant) · [`randGem`](./rand-gem) · [`randConcept`](./rand-concept) · [`randMyth`](./rand-myth) · [`randJob`](./rand-job) · [`randMusic`](./rand-music) · [`randPlace`](./rand-place) · [`randFood`](./rand-food) · [`randSport`](./rand-sport) · [`randVehicle`](./rand-vehicle) · [`randProduct`](./rand-product)

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

They take every option `randWord` does except `theme`, which they answer.

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
- [`randModifier`](../decorate/rand-modifier) — a modifier in front of a word you already have.
