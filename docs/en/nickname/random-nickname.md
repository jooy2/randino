# randomNickname

Generates nicknames and returns `count` of them as strings. Each one is an everyday word with something added to it — a modifier in front, a second word behind, or both — and **never a person name**.

::: lang js

```javascript
import { randomNickname } from 'randino';

randomNickname();
// ['MistyOwl']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randomNickname();
// ['MistyOwl']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="NicknameLanguageOption" dart="NicknameLanguage?" code /> | <Lang js="'all'" dart="null" code /> | Language of the generated nicknames. <Lang js="'all'" dart="null" code /> mixes every supported language, picking one per nickname. |
| `theme` | <Lang js="NicknameThemeOption" dart="NicknameTheme?" code /> | <Lang js="'all'" dart="null" code /> | What the nickname is about. See [Themes](./themes). |
| `count` | <Lang js="number" dart="int" code /> | `1` | How many nicknames to return. Clamped to `0` … `10000`. |
| `style` | <Lang js="number" dart="int" code /> | `0` | `0` uses real words, `100` invents words that only read like the language, and anything between mixes the two. |
| `minLength` | <Lang js="number" dart="int?" code /> | _language_ | Minimum length in characters, the unique suffix **not** counted. |
| `maxLength` | <Lang js="number" dart="int?" code /> | _language_ | Maximum length in characters, the unique suffix **not** counted. |
| `includeModifier` | <Lang js="boolean" dart="bool" code /> | `true` | Decorate the word — `멋진사자` rather than `사자`. |
| `wordSeparator` | <Lang js="string" dart="String?" code /> | _language_ | Placed between the words. Counts toward the length range. Defaults to running them together. |
| `baseWord` | <Lang js="string" dart="String?" code /> | — | Build every nickname around this word, varying only the decoration. |
| `uniqueSuffix` | <Lang js="boolean" dart="bool" code /> | `false` | Append a random token so no two people end up with the same nickname. |
| `uniqueSuffixLength` | <Lang js="number" dart="int" code /> | `5` | Characters in the token. Clamped to `1` … `32`. |
| `uniqueSuffixSeparator` | <Lang js="string" dart="String" code /> | `'_'` | Placed between the nickname and the token. An empty string joins them directly. |
| `uniqueSuffixCharset` | <Lang js="string" dart="String?" code /> | _built-in_ | Characters the token is drawn from. Defaults to alphanumerics without the pairs that misread (`0O`, `1lI`). |
| `startsWith` | <Lang js="string" dart="String?" code /> | — | Keep only nicknames whose first character is this one. |
| `unique` | <Lang js="boolean" dart="bool" code /> | `false` | Never return the same nickname twice. May return fewer than `count` once the pools run out of combinations. |

## Examples

### One language at a time

::: lang js

```javascript
randomNickname({ language: 'ko', count: 4 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발', '노을']

randomNickname({ language: 'en', count: 4 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak', 'MathematicsShard']

randomNickname({ language: 'ja', count: 4 });
// ['小さな雨', '海の彗星', '鋭いペンギン', '柔らかい記憶']

randomNickname({ language: 'zh', count: 4 });
// ['勇敢余烬', '快乐薄雾', '节日', '安静小狗']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, count: 4);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발', '노을']

randomNickname(language: NicknameLanguage.en, count: 4);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak', 'MathematicsShard']

randomNickname(language: NicknameLanguage.ja, count: 4);
// ['小さな雨', '海の彗星', '鋭いペンギン', '柔らかい記憶']

randomNickname(language: NicknameLanguage.zh, count: 4);
// ['勇敢余烬', '快乐薄雾', '节日', '安静小狗']
```

:::

### A theme

::: lang js

```javascript
randomNickname({ language: 'ko', theme: 'animal', count: 3 });
// ['깊은연어', '하얀여우갈기', '떠도는잉어']

randomNickname({ language: 'en', theme: 'gem', count: 3 });
// ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, theme: NicknameTheme.animal, count: 3);
// ['깊은연어', '하얀여우갈기', '떠도는잉어']

randomNickname(language: NicknameLanguage.en, theme: NicknameTheme.gem, count: 3);
// ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

The fourteen themes, and what each one holds, are on [Themes](./themes).

### An undecorated word

::: lang js

```javascript
randomNickname({ language: 'ko', count: 4, includeModifier: false });
// ['미래', '반지', '고릴라', '구름언덕']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, count: 4, includeModifier: false);
// ['미래', '반지', '고릴라', '구름언덕']
```

:::

A trailing word is still allowed — `includeModifier` drops the modifier shapes, not every shape but one.

### A separator between the words

::: lang js

```javascript
randomNickname({ language: 'ko', wordSeparator: ' ', count: 4 });
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randomNickname({ language: 'en', wordSeparator: '-', count: 4 });
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']

randomNickname({ language: 'ja', wordSeparator: '・', count: 3 });
// ['硝子の・トラック', '甘い・珠玉', '美しい・ヒツジ']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, wordSeparator: ' ', count: 4);
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randomNickname(language: NicknameLanguage.en, wordSeparator: '-', count: 4);
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']

randomNickname(language: NicknameLanguage.ja, wordSeparator: '・', count: 3);
// ['硝子の・トラック', '甘い・珠玉', '美しい・ヒツジ']
```

:::

Its length counts toward `minLength` / `maxLength` — pass it to [`nicknameLengthRange`](./nickname-length-range) to see what is left.

### A unique suffix

::: lang js

```javascript
randomNickname({ language: 'ko', count: 3, uniqueSuffix: true });
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']

randomNickname({
	language: 'ko',
	count: 2,
	uniqueSuffix: true,
	uniqueSuffixLength: 8,
	uniqueSuffixSeparator: '-'
});
// ['금빛앵무새여행-Qw9NND4j', '느린연필-uxscYCy6']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, count: 3, uniqueSuffix: true);
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']

randomNickname(
  language: NicknameLanguage.ko,
  count: 2,
  uniqueSuffix: true,
  uniqueSuffixLength: 8,
  uniqueSuffixSeparator: '-',
);
// ['금빛앵무새여행-Qw9NND4j', '느린연필-uxscYCy6']
```

:::

The suffix is appended **after** `minLength` / `maxLength` have been satisfied, so those options describe the readable part and the suffix never eats into it.

### A word of your own

::: lang js

```javascript
randomNickname({ baseWord: '고양이', count: 5 });
// ['하얀고양이', '고양이바람', '떠도는고양이', '귀여운고양이뿔', '검은고양이손길']

randomNickname({ baseWord: 'Cat', count: 4 });
// ['FlyingCat', 'DancingCatScale', 'MistyCatTail', 'WildCatScale']
```

:::

::: lang dart

```dart
randomNickname(baseWord: '고양이', count: 5);
// ['하얀고양이', '고양이바람', '떠도는고양이', '귀여운고양이뿔', '검은고양이손길']

randomNickname(baseWord: 'Cat', count: 4);
// ['FlyingCat', 'DancingCatScale', 'MistyCatTail', 'WildCatScale']
```

:::

Something is always added, or the answer would be the word you passed in. Leave the language out and the **script of the word picks it**, which keeps `'고양이'` from being decorated in English.

### Invented words

::: lang js

```javascript
randomNickname({ language: 'ko', style: 100, count: 3 });
// ['토한조해한', '가파모토히', '리누채무애저차부']

randomNickname({ language: 'en', style: 100, count: 3 });
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, style: 100, count: 3);
// ['토한조해한', '가파모토히', '리누채무애저차부']

randomNickname(language: NicknameLanguage.en, style: 100, count: 3);
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

## See also

- [`randomNicknameDetails`](./random-nickname-details) — the same nicknames with the words, the suffix and the theme reported separately.
- [Themes](./themes) — the fourteen slices of vocabulary a nickname is built from.
- [`nicknameLengthRange`](./nickname-length-range) — every length a language can produce.
