# randNickname

Generates nicknames and returns `count` of them as strings. Each one is an everyday word with something added to it — a modifier in front, a second word behind, or both — and **never a person name**. With [`output: 'detail'`](#the-detail-output) it reports the words it used instead.

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
| `language` | <Lang js="NicknameLanguageOption" dart="NicknameLanguage?" py="NicknameLanguageOption &#124; None" code /> | <Lang js="'all'" dart="null" py="None" code /> | Language of the generated nicknames. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> mixes every supported language, picking one per nickname. |
| `theme` | <Lang js="NicknameThemeOption" dart="NicknameTheme?" py="NicknameThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | What the nickname is about. See [Themes](./themes). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many nicknames to return. Clamped to `0` … `10000`. |
| `style` | <Lang js="number" dart="int" py="int" code /> | `0` | `0` uses real words, `100` invents words that only read like the language, and anything between mixes the two. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Minimum length in characters. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Maximum length in characters. |
| <Lang js="includeModifier" dart="includeModifier" py="include_modifier" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Decorate the word — `멋진사자` rather than `사자`. |
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

randNickname({ language: 'ko', output: 'detail' });
// [{
//   nickname: '오래된발견',
//   words: ['오래된', '발견'],
//   language: 'ko',
//   theme: 'concept'
// }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNicknameDetails(language: NicknameLanguage.ko);
// [NicknameDetail(오래된발견, [오래된, 발견], ko, concept)]
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname(language="ko", output="detail")
# [NicknameDetail(nickname='오래된발견', words=('오래된', '발견'),
#                 language='ko', theme='concept')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `nickname` | <Lang js="string" dart="String" py="str" code /> | The finished nickname. |
| `words` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | The words it is made of, in order. |
| `language` | `NicknameLanguage` | The language this nickname was generated in. |
| `theme` | <Lang js="NicknameTheme &#124; null" dart="NicknameTheme?" py="NicknameTheme &#124; None" code /> | Theme of the base word, or null when that word is not one the generator knows. |

Joining `words` with the language's own joiner reproduces `nickname` exactly — that is an invariant, and all three test suites assert it.

### About `theme`

The theme is **reported, not asserted**. A word drawn from a theme reports it; an invented word is looked up across every theme, because it can spell a real one by accident, and reports null when it is found nowhere.

Two coincidences follow from that and are worth expecting rather than treating as bugs. A word can be both a modifier and a noun — `무지개`, `Marble`, `自由` — and an invented word can spell a real one by accident: `나` + `비` is `나비`, so a nickname built at `style` 100 can come back with `theme` set to `animal`.

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
randNickname(language: NicknameLanguage.ko, count: 4);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발', '노을']

randNickname(language: NicknameLanguage.en, count: 4);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak', 'MathematicsShard']

randNickname(language: NicknameLanguage.ja, count: 4);
// ['小さな雨', '海の彗星', '鋭いペンギン', '柔らかい記憶']

randNickname(language: NicknameLanguage.zh, count: 4);
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
randNickname({ language: 'ko', theme: 'animal', count: 3 });
// ['깊은연어', '하얀여우갈기', '떠도는잉어']

randNickname({ language: 'en', theme: 'gem', count: 3 });
// ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

::: lang dart

```dart
randNickname(language: NicknameLanguage.ko, theme: NicknameTheme.animal, count: 3);
// ['깊은연어', '하얀여우갈기', '떠도는잉어']

randNickname(language: NicknameLanguage.en, theme: NicknameTheme.gem, count: 3);
// ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

::: lang py

```python
rand_nickname(language="ko", theme="animal", count=3)
# ['깊은연어', '하얀여우갈기', '떠도는잉어']

rand_nickname(language="en", theme="gem", count=3)
# ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

The fourteen themes, and what each one holds, are on [Themes](./themes).

### An undecorated word

::: lang js

```javascript
randNickname({ language: 'ko', count: 4, includeModifier: false });
// ['미래', '반지', '고릴라', '구름언덕']
```

:::

::: lang dart

```dart
randNickname(language: NicknameLanguage.ko, count: 4, includeModifier: false);
// ['미래', '반지', '고릴라', '구름언덕']
```

:::

::: lang py

```python
rand_nickname(language="ko", count=4, include_modifier=False)
# ['미래', '반지', '고릴라', '구름언덕']
```

:::

A trailing word is still allowed — <Lang js="includeModifier" dart="includeModifier" py="include_modifier" code /> drops the modifier shapes, not every shape but one.

### A separator between the words

::: lang js

```javascript
randNickname({ language: 'ko', wordSeparator: ' ', count: 4 });
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randNickname({ language: 'en', wordSeparator: '-', count: 4 });
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']

randNickname({ language: 'ja', wordSeparator: '・', count: 3 });
// ['硝子の・トラック', '甘い・珠玉', '美しい・ヒツジ']
```

:::

::: lang dart

```dart
randNickname(language: NicknameLanguage.ko, wordSeparator: ' ', count: 4);
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randNickname(language: NicknameLanguage.en, wordSeparator: '-', count: 4);
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']

randNickname(language: NicknameLanguage.ja, wordSeparator: '・', count: 3);
// ['硝子の・トラック', '甘い・珠玉', '美しい・ヒツジ']
```

:::

::: lang py

```python
rand_nickname(language="ko", word_separator=" ", count=4)
# ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

rand_nickname(language="en", word_separator="-", count=4)
# ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']

rand_nickname(language="ja", word_separator="・", count=3)
# ['硝子の・トラック', '甘い・珠玉', '美しい・ヒツジ']
```

:::

Its length counts toward <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code /> — pass it to [`nicknameLengthRange`](./nickname-length-range) to see what is left.

### A unique suffix

There is no option for one — [`randSuffix`](../affix/rand-suffix) attaches a random token to whatever you hand it, these nicknames included.

::: lang js

```javascript
randSuffix(randNickname({ language: 'ko', count: 3 }));
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']

randSuffix(randNickname({ language: 'ko', count: 2 }), { length: 8, separator: '-' });
// ['금빛앵무새여행-Qw9NND4j', '느린연필-uxscYCy6']
```

:::

::: lang dart

```dart
randSuffixAll(randNickname(language: NicknameLanguage.ko, count: 3));
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']

randSuffixAll(
  randNickname(language: NicknameLanguage.ko, count: 2),
  length: 8,
  separator: '-',
);
// ['금빛앵무새여행-Qw9NND4j', '느린연필-uxscYCy6']
```

:::

::: lang py

```python
rand_suffix(rand_nickname(language="ko", count=3))
# ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']

rand_suffix(rand_nickname(language="ko", count=2), length=8, separator="-")
# ['금빛앵무새여행-Qw9NND4j', '느린연필-uxscYCy6']
```

:::

Because it happens afterwards, <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole nickname rather than the part in front of a suffix.

### Invented words

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

### Highlighting the base word

::: lang js

```javascript
for (const { words, theme } of randNickname({ language: 'ko', count: 3, output: 'detail' })) {
	console.log(words.join(' + '), theme);
}
// 오래된 + 곰 animal
// 영원한 + 도마뱀 animal
// 귀여운 + 신화 + 다발 myth
```

:::

::: lang dart

```dart
for (final detail in randNicknameDetails(language: NicknameLanguage.ko, count: 3)) {
  print('${detail.words.join(' + ')} ${detail.theme?.name}');
}
// 오래된 + 곰 animal
// 영원한 + 도마뱀 animal
// 귀여운 + 신화 + 다발 myth
```

:::

::: lang py

```python
for detail in rand_nickname(language="ko", count=3, output="detail"):
    print(" + ".join(detail.words), detail.theme)
# 오래된 + 곰 animal
# 영원한 + 도마뱀 animal
# 귀여운 + 신화 + 다발 myth
```

:::

### Storing the readable part and the discriminator

A sign-up flow usually wants the readable part and the collision-breaking part in two columns, so that a later rename can keep one and replace the other. [`randSuffix`](../affix/rand-suffix) is what makes the second one, and it never has to be pulled back out of the first:

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
final detail = randNicknameDetails(language: NicknameLanguage.en).first;
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
final byTheme = <NicknameTheme?, List<String>>{};

for (final detail in randNicknameDetails(language: NicknameLanguage.en, count: 100)) {
  byTheme.putIfAbsent(detail.theme, () => <String>[]).add(detail.nickname);
}
```

:::

::: lang py

```python
from collections import defaultdict

by_theme: defaultdict[NicknameTheme | None, list[str]] = defaultdict(list)

for detail in rand_nickname(language="en", count=100, output="detail"):
    by_theme[detail.theme].append(detail.nickname)
```

:::

## See also

- [`randSuffix`](../affix/rand-suffix) — the random token, for when a nickname has to be collision-free.
- [Themes](./themes) — the fourteen slices of vocabulary a nickname is built from.
- [`nicknameLengthRange`](./nickname-length-range) — every length a language can produce.
