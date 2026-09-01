# Nicknames

A nickname is the handle someone would pick for a game or a website — 멋진사자, MistyOwl, 고양이꼬리. randino builds one out of an everyday word with something added to it: a modifier in front, a second word behind, or both.

::: lang js

```javascript
import { randNickname } from 'randino';

randNickname({ language: 'ko', count: 3 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNickname(language: NicknameLanguage.ko, count: 3);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname(language="ko", count=3)
# ['오래된곰', '영원한도마뱀', '귀여운신화다발']
```

:::

**Person names are never used.** That rule is the whole reason nicknames and names are two generators rather than one: a handle built out of somebody's name reads as that person's identity, and a handle built out of 사자 and 멋진 reads as a handle. The English pools are checked against the English person-name pools automatically, which is why `job` has no `Knight`, `Baker` or `Hunter` and `plant` no `Rose` or `Ivy`.

Korean and Japanese cannot be held to that check — 하늘, 별 and 森 are everyday nouns that happen to also be names — but `아름다운하늘` is still nobody's name.

## What is in the box

| Function | Returns |
| --- | --- |
| [`randNickname`](./rand-nickname) | The nicknames as strings |
| [`randNicknameDetails`](./rand-nickname-details) | The words, the suffix, the language and the theme behind each |
| [`nicknameLengthRange`](./nickname-length-range) | Every length a language can produce |

The nouns come from fourteen [themes](./themes), and every nickname is built around a word from one of them.

## How the options behave

### Length picks the shape, not the words

A nickname has four possible shapes — a bare noun, a modifier and a noun, a noun and a trailing word, or all three — and <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code /> choose **between the shapes first**. The shapes that cannot land inside the range are dropped, then each slot is given the room left after the slots behind it have reserved their minimum.

That is why a narrow range drops the modifier instead of truncating a word, and why a long range brings the three-word shapes in.

::: lang js

```javascript
randNickname({ language: 'ko', count: 4, minLength: 4, maxLength: 6 });
// ['엉뚱한진리춤', '엉뚱한가위별', '해바라기', '별빛안개열매']

randNickname({ language: 'en', count: 4, minLength: 4, maxLength: 9 });
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

::: lang dart

```dart
randNickname(language: NicknameLanguage.ko, count: 4, minLength: 4, maxLength: 6);
// ['엉뚱한진리춤', '엉뚱한가위별', '해바라기', '별빛안개열매']

randNickname(language: NicknameLanguage.en, count: 4, minLength: 4, maxLength: 9);
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

::: lang py

```python
rand_nickname(language="ko", count=4, min_length=4, max_length=6)
# ['엉뚱한진리춤', '엉뚱한가위별', '해바라기', '별빛안개열매']

rand_nickname(language="en", count=4, min_length=4, max_length=9)
# ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

The default range is **wide on purpose**: it spans every shape, and the shape weights — not the range — decide what output usually looks like. `nicknameLengthRange` is what reports it.

### `wordSeparator` replaces the language's own joiner

Left out, each language joins its words the way it writes them: Korean, Japanese and Chinese run them together, and English reads as CamelCase. Pass one and every shape uses it, the two-word ones and the three-word ones alike.

::: lang js

```javascript
randNickname({ language: 'ko', wordSeparator: ' ', count: 4 });
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randNickname({ language: 'en', wordSeparator: '-', count: 4 });
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']
```

:::

::: lang dart

```dart
randNickname(language: NicknameLanguage.ko, wordSeparator: ' ', count: 4);
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randNickname(language: NicknameLanguage.en, wordSeparator: '-', count: 4);
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']
```

:::

::: lang py

```python
rand_nickname(language="ko", word_separator=" ", count=4)
# ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

rand_nickname(language="en", word_separator="-", count=4)
# ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']
```

:::

It is not cosmetic: **its length is part of the nickname's**, so a separator narrows the range the same way a longer word does. Pass it to `nicknameLengthRange` to see what is left.

### The unique suffix sits outside the length range

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the readable part. The suffix is appended after they have been satisfied, so it never eats into them — and it is what makes a nickname collision-free rather than merely unlikely.

::: lang js

```javascript
randNickname({ language: 'ko', count: 3, uniqueSuffix: true });
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']
```

:::

::: lang dart

```dart
randNickname(language: NicknameLanguage.ko, count: 3, uniqueSuffix: true);
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']
```

:::

::: lang py

```python
rand_nickname(language="ko", count=3, unique_suffix=True)
# ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']
```

:::

Its separator is independent of <Lang js="wordSeparator" dart="wordSeparator" py="word_separator" code />; give both the same character and the suffix stops standing out.

### `baseWord` pins the word and varies the decoration

Something is always added to it, or the answer would be the word you passed in. When you leave the language out, the **script of the word picks it**, which keeps `'고양이'` from being decorated in English.

::: lang js

```javascript
randNickname({ baseWord: '고양이', count: 5 });
// ['하얀고양이', '고양이바람', '떠도는고양이', '귀여운고양이뿔', '검은고양이손길']

randNickname({ baseWord: 'Cat', count: 4 });
// ['FlyingCat', 'DancingCatScale', 'MistyCatTail', 'WildCatScale']
```

:::

::: lang dart

```dart
randNickname(baseWord: '고양이', count: 5);
// ['하얀고양이', '고양이바람', '떠도는고양이', '귀여운고양이뿔', '검은고양이손길']

randNickname(baseWord: 'Cat', count: 4);
// ['FlyingCat', 'DancingCatScale', 'MistyCatTail', 'WildCatScale']
```

:::

::: lang py

```python
rand_nickname(base_word="고양이", count=5)
# ['하얀고양이', '고양이바람', '떠도는고양이', '귀여운고양이뿔', '검은고양이손길']

rand_nickname(base_word="Cat", count=4)
# ['FlyingCat', 'DancingCatScale', 'MistyCatTail', 'WildCatScale']
```

:::

A base word longer than the language's natural range widens the range rather than being truncated.

### `style` invents words rather than drawing them

At `0` every word is a real one. Toward `100` the words are built from the language's own syllables, which reads as a made-up handle rather than a dictionary word.

::: lang js

```javascript
randNickname({ language: 'ko', style: 100, count: 3 });
// ['토한조해한', '가파모토히', '리누채무애저차부']

randNickname({ language: 'en', style: 100, count: 3 });
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

::: lang dart

```dart
randNickname(language: NicknameLanguage.ko, style: 100, count: 3);
// ['토한조해한', '가파모토히', '리누채무애저차부']

randNickname(language: NicknameLanguage.en, style: 100, count: 3);
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

::: lang py

```python
rand_nickname(language="ko", style=100, count=3)
# ['토한조해한', '가파모토히', '리누채무애저차부']

rand_nickname(language="en", style=100, count=3)
# ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

### `unique`, and why the suffix is usually the better answer

Korean and English have over nine million word combinations each, so duplicates are rare either way. `unique` rules them out inside one call and returns fewer nicknames once the pools run out; <Lang js="uniqueSuffix" dart="uniqueSuffix" py="unique_suffix" code /> makes collisions impossible across calls, across processes and across users, which is the guarantee a sign-up form actually needs.
