# randNickname

Generates nicknames and returns `count` of them as strings. Each one is an everyday word with something added to it — a word for what it is like in front, one for what it is doing, a second word behind, a possessive between the two — and **never a person name**. With [`output: 'detail'`](#the-detail-output) it reports the words it used instead.

::: lang js

```javascript
import { randNickname } from 'randino';

randNickname();
// ['MistyOwl']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNickname();
// ['MistyOwl']
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname()
# ['MistyOwl']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption &#124; None" code /> | <Lang js="'all'" dart="null" py="None" code /> | Language of the generated nicknames. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> mixes every supported language, picking one per nickname. |
| `theme` | <Lang js="WordThemeOption" dart="WordTheme?" py="WordThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | What the nickname is about. See [Themes](../word/themes). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many nicknames to return. Clamped to `0` … `10000`. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | `real` uses real words, `invented` builds words that only read like the language, and `mixed` decides per word. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Minimum length in characters. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Maximum length in characters. |
| <Lang js="wordSeparator" dart="wordSeparator" py="word_separator" code /> | <Lang js="string" dart="String?" py="str &#124; None" code /> | _language_ | Placed between the words. Counts toward the length range. Defaults to running them together. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | Keep only nicknames whose first character is this one. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same nickname twice. May return fewer than `count` once the pools run out of combinations. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `NicknameDetail` per nickname. Dart has no such parameter — see [the detail output](#the-detail-output). |

## The detail output

`output: 'detail'` reports the pieces each nickname was built from — the words in order, the language and the theme — instead of returning a string. Useful for highlighting the base word, or for grouping by theme.

::: lang dart

Dart spells this as a **second function**, `randNicknameDetails`, because it has no way to make one function's return type depend on an argument. It takes the same parameters as `randNickname`.

:::

::: lang js

```javascript
import { randNickname } from 'randino';

randNickname({ language: 'en', output: 'detail' });
// [{
//   nickname: 'MistyOwl',
//   words: ['Misty', 'Owl'],
//   language: 'en',
//   theme: 'animal'
// }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNicknameDetails(language: WordLanguage.en);
// [NicknameDetail(MistyOwl, [Misty, Owl], en, animal)]
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname(language="en", output="detail")
# [NicknameDetail(nickname='MistyOwl', words=('Misty', 'Owl'),
#                 language='en', theme='animal')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `nickname` | <Lang js="string" dart="String" py="str" code /> | The finished nickname. |
| `words` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | The words it is made of, in order — the words only. |
| `language` | `WordLanguage` | The language this nickname was generated in. |
| `theme` | <Lang js="WordTheme &#124; null" dart="WordTheme?" py="WordTheme &#124; None" code /> | Theme of the base word, or null when that word is not one the generator knows. |

`words` holds the words and nothing else. A shape that needs a particle between two of them carries it in `nickname` alone, so `사자의눈물` reports `['사자', '눈물']` and joining the two back together does not reproduce it. Read `nickname` for the finished string, and `words` for what it was built from.

### About `theme`

The theme is **reported, not asserted**. A word drawn from a theme reports it; an invented word is looked up across every theme, because it can spell a real one by accident, and reports null when it is found nowhere.

Two coincidences follow from that and are worth expecting rather than treating as bugs. A word can be both a modifier and a noun — `Marble` is one — and an invented word can spell a real one by accident: the syllable templates spell `Snake` now and then, so a nickname built at `realism: 'invented'` can come back with `theme` set to `animal`.

## Examples

### One language at a time

::: lang js

```javascript
randNickname({ language: 'ko', count: 4 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발', '노을']

randNickname({ language: 'en', count: 4 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak', 'MathematicsShard']

randNickname({ language: 'ja', count: 4 });
// ['小さな雨', '海の彗星', '鋭いペンギン', '柔らかい記憶']

randNickname({ language: 'zh', count: 4 });
// ['勇敢余烬', '快乐薄雾', '节日', '安静小狗']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.ko, count: 4);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발', '노을']

randNickname(language: WordLanguage.en, count: 4);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak', 'MathematicsShard']

randNickname(language: WordLanguage.ja, count: 4);
// ['小さな雨', '海の彗星', '鋭いペンギン', '柔らかい記憶']

randNickname(language: WordLanguage.zh, count: 4);
// ['勇敢余烬', '快乐薄雾', '节日', '安静小狗']
```

:::

::: lang py

```python
rand_nickname(language="ko", count=4)
# ['오래된곰', '영원한도마뱀', '귀여운신화다발', '노을']

rand_nickname(language="en", count=4)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak', 'MathematicsShard']

rand_nickname(language="ja", count=4)
# ['小さな雨', '海の彗星', '鋭いペンギン', '柔らかい記憶']

rand_nickname(language="zh", count=4)
# ['勇敢余烬', '快乐薄雾', '节日', '安静小狗']
```

:::

### A theme

::: lang js

```javascript
randNickname({ language: 'en', theme: 'animal', count: 3 });
// ['FloatingFalcon', 'ChewyOtter', 'PlacidMantis']

randNickname({ language: 'en', theme: 'gem', count: 3 });
// ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.en, theme: WordTheme.animal, count: 3);
// ['FloatingFalcon', 'ChewyOtter', 'PlacidMantis']

randNickname(language: WordLanguage.en, theme: WordTheme.gem, count: 3);
// ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

::: lang py

```python
rand_nickname(language="en", theme="animal", count=3)
# ['FloatingFalcon', 'ChewyOtter', 'PlacidMantis']

rand_nickname(language="en", theme="gem", count=3)
# ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

The seventeen themes, and what each one holds, are on [Themes](../word/themes).

### A separator between the words

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

Its length counts toward <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code /> — pass it to [`nicknameLengthRange`](./nickname-length-range) to see what is left.

### A unique suffix

There is no option for one — [`randSuffix`](../decorate/rand-suffix) attaches a random token to whatever you hand it, these nicknames included.

::: lang js

```javascript
randSuffix(randNickname({ language: 'en', count: 3 }));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']

randSuffix(randNickname({ language: 'en', count: 2 }), { length: 8, separator: '-' });
// ['GenialFern-9xq9SgJf', 'BoldBicycle-PGc4keqM']
```

:::

::: lang dart

```dart
randSuffixAll(randNickname(language: WordLanguage.en, count: 3));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']

randSuffixAll(
  randNickname(language: WordLanguage.en, count: 2),
  length: 8,
  separator: '-',
);
// ['GenialFern-9xq9SgJf', 'BoldBicycle-PGc4keqM']
```

:::

::: lang py

```python
rand_suffix(rand_nickname(language="en", count=3))
# ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']

rand_suffix(rand_nickname(language="en", count=2), length=8, separator="-")
# ['GenialFern-9xq9SgJf', 'BoldBicycle-PGc4keqM']
```

:::

Because it happens afterwards, <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole nickname rather than the part in front of a suffix.

### Invented words

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

### Highlighting the base word

::: lang js

```javascript
for (const { words, theme } of randNickname({ language: 'en', count: 3, output: 'detail' })) {
	console.log(words.join(' + '), theme);
}
// Grumpy + Zither music
// Fierce + Printer product
// Endless + Obsidian + Wing gem
```

:::

::: lang dart

```dart
for (final detail in randNicknameDetails(language: WordLanguage.en, count: 3)) {
  print('${detail.words.join(' + ')} ${detail.theme?.name}');
}
// Grumpy + Zither music
// Fierce + Printer product
// Endless + Obsidian + Wing gem
```

:::

::: lang py

```python
for detail in rand_nickname(language="en", count=3, output="detail"):
    print(" + ".join(detail.words), detail.theme)
# Grumpy + Zither music
# Fierce + Printer product
# Endless + Obsidian + Wing gem
```

:::

### Storing the readable part and the discriminator

A sign-up flow usually wants the readable part and the collision-breaking part in two columns, so that a later rename can keep one and replace the other. [`randSuffix`](../decorate/rand-suffix) is what makes the second one, and it never has to be pulled back out of the first:

::: lang js

```javascript
const [detail] = randNickname({ language: 'en', output: 'detail' });
const discriminator = randSuffix('', { separator: '' });

await users.insert({
	handle: `${detail.nickname}_${discriminator}`,
	display: detail.nickname,
	discriminator
});
```

:::

::: lang dart

```dart
final detail = randNicknameDetails(language: WordLanguage.en).first;
final discriminator = randSuffix('', separator: '');

await users.insert(
  handle: '${detail.nickname}_$discriminator',
  display: detail.nickname,
  discriminator: discriminator,
);
```

:::

::: lang py

```python
detail = rand_nickname(language="en", output="detail")[0]
discriminator = rand_suffix("", separator="")

await users.insert(
    handle=f"{detail.nickname}_{discriminator}",
    display=detail.nickname,
    discriminator=discriminator,
)
```

:::

### Grouping by theme

::: lang js

```javascript
const byTheme = {};

for (const detail of randNickname({ language: 'en', count: 100, output: 'detail' })) {
	(byTheme[detail.theme] ??= []).push(detail.nickname);
}
```

:::

::: lang dart

```dart
final byTheme = <WordTheme?, List<String>>{};

for (final detail in randNicknameDetails(language: WordLanguage.en, count: 100)) {
  byTheme.putIfAbsent(detail.theme, () => <String>[]).add(detail.nickname);
}
```

:::

::: lang py

```python
from collections import defaultdict

by_theme: defaultdict[WordTheme | None, list[str]] = defaultdict(list)

for detail in rand_nickname(language="en", count=100, output="detail"):
    by_theme[detail.theme].append(detail.nickname)
```

:::

## See also

- [`randSuffix`](../decorate/rand-suffix) — the random token, for when a nickname has to be collision-free.
- [Themes](../word/themes) — the seventeen slices of vocabulary a nickname is built from.
- [`nicknameLengthRange`](./nickname-length-range) — every length a language can produce.
