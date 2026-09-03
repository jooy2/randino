# randWord

Generates everyday words and returns `count` of them as strings. Animals, things, nature, ideas — twenty-five [themes](./themes), in eight languages, and **never a person name**. With [`output: 'detail'`](#the-detail-output) it reports the language and theme behind each word.

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

The same table is on each of the twenty-five pages below, drawn from one component rather than written out twenty-six times. Everything but `language` and `theme` is an option every generator in the package takes, and means the same thing on each of them.

Dart has no `output`; [the detail output](#the-detail-output) is `randWordDetails` there.

## One function per theme

A theme is not only an option — each of the twenty-five is a function of its own, which is `randWord` with the theme already chosen. Each has a page of its own; the words each theme holds are on [Themes](./themes).

[`randAnimal`](./rand-animal) · [`randObject`](./rand-object) · [`randNature`](./rand-nature) · [`randPlant`](./rand-plant) · [`randGem`](./rand-gem) · [`randConcept`](./rand-concept) · [`randMyth`](./rand-myth) · [`randJob`](./rand-job) · [`randMusic`](./rand-music) · [`randPlace`](./rand-place) · [`randFood`](./rand-food) · [`randSport`](./rand-sport) · [`randVehicle`](./rand-vehicle) · [`randProduct`](./rand-product)

::: lang js

```javascript
import { randAnimal, randFood, randGem } from 'randino';

randAnimal({ language: 'en', count: 3 }); // ['Otter', 'Falcon', 'Lynx']
randFood({ language: 'en', count: 2 }); // ['Dumpling', 'Cocoa']
randGem({ language: 'en', count: 2, unique: true }); // ['Obsidian', 'Bronze']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randAnimal(language: WordLanguage.en, count: 3); // [Otter, Falcon, Lynx]
randFood(language: WordLanguage.en, count: 2); // [Dumpling, Cocoa]
randGem(language: WordLanguage.en, count: 2, unique: true); // [Obsidian, Bronze]
```

The themed functions return `List<String>` only. For the detail form, pass the theme to `randWordDetails` — Dart has no overloads, and twenty-four more functions for it would be twenty-four too many.

:::

::: lang py

```python
from randino import rand_animal, rand_food, rand_gem

rand_animal(language="en", count=3)  # ['Otter', 'Falcon', 'Lynx']
rand_food(language="en", count=2)  # ['Dumpling', 'Cocoa']
rand_gem(language="en", count=2, unique=True)  # ['Obsidian', 'Bronze']
```

:::

They take every option `randWord` does except `theme`, which they answer.

## Length

Left out, <Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> fall back to what the pools actually hold — that is what [`wordLengthRange`](./word-length-range) reports. A range the pool cannot satisfy is answered with the closest word it has rather than a truncated one.

::: lang js

```javascript
randWord({ language: 'en', theme: 'animal', maxLength: 4, count: 4 });
// ['Cat', 'Ant', 'Frog', 'Carp']

randWord({ language: 'en', minLength: 9, count: 3 });
// ['Saxophone', 'Spaghetti', 'Spaceship']
```

:::

::: lang dart

```dart
randWord(language: WordLanguage.en, theme: WordTheme.animal, maxLength: 4, count: 4);
// [Cat, Ant, Frog, Carp]

randWord(language: WordLanguage.en, minLength: 9, count: 3);
// [Saxophone, Spaghetti, Spaceship]
```

:::

::: lang py

```python
rand_word(language="en", theme="animal", max_length=4, count=4)
# ['Cat', 'Ant', 'Frog', 'Carp']

rand_word(language="en", min_length=9, count=3)
# ['Saxophone', 'Spaghetti', 'Spaceship']
```

:::

## Invented words

`realism` has three levels: `real` draws from the pools, `invented` builds words that only read like the language, and `mixed` decides per word.

::: lang js

```javascript
randWord({ language: 'en', realism: 'invented', count: 4 });
// ['Sterath', 'Lisleen', 'Kaezan', 'Mibaeth']

randWord({ language: 'en', realism: 'mixed', count: 4 });
// ['Blorin', 'Meadow', 'Tavren', 'Compass']
```

:::

::: lang dart

```dart
randWord(language: WordLanguage.en, realism: RandRealism.invented, count: 4);
// [Sterath, Lisleen, Kaezan, Mibaeth]
```

:::

::: lang py

```python
rand_word(language="en", realism="invented", count=4)
# ['Sterath', 'Lisleen', 'Kaezan', 'Mibaeth']
```

:::

An invented word can spell a real one by accident — the syllable templates do come out as `Snake` now and then — and the theme is then reported rather than hidden.

## The detail output {#the-detail-output}

::: lang js

```javascript
randWord({ language: 'en', theme: 'plant', output: 'detail' });
// [{ word: 'Cedar', language: 'en', theme: 'plant' }]
```

:::

::: lang dart

```dart
randWordDetails(language: WordLanguage.en, theme: WordTheme.plant).first;
// WordDetail(Cedar, en, plant)
```

Dart has neither overloads nor union types, so the detail form is its own function.

:::

::: lang py

```python
rand_word(language="en", theme="plant", output="detail")
# [WordDetail(word='Cedar', language='en', theme='plant')]
```

:::

`theme` is null for an invented word that matches nothing in the pools.

## See also

- [Themes](./themes) — the twenty-five of them, and the function each one has.
- [`wordLengthRange`](./word-length-range) — what a language's pools can produce.
- [`randNickname`](../nickname/rand-nickname) — the same words, put together.
- [`randModifier`](../decorate/rand-modifier) — a modifier in front of a word you already have.
