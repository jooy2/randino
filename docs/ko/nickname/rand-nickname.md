# randNickname

닉네임을 생성해서 `count`개의 문자열로 돌려줍니다. 각 닉네임은 일상 단어에 무언가를 덧붙인 것이고 — 앞에 수식어, 뒤에 단어 하나, 또는 둘 다 — **사람 이름은 절대 쓰지 않습니다**. [`output: 'detail'`](#the-detail-output)을 주면 대신 어떤 단어를 썼는지 알려 줍니다.

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

## 옵션

모든 옵션은 선택 사항이며, 위의 인자 없는 호출이 사용하는 값이 곧 기본값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption &#124; None" code /> | <Lang js="'all'" dart="null" py="None" code /> | 생성할 닉네임의 언어. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 지원하는 모든 언어를 섞어서 닉네임마다 하나씩 고릅니다. |
| `theme` | <Lang js="WordThemeOption" dart="WordTheme?" py="WordThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 닉네임의 주제. [테마](../word/themes)를 참고하세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 반환할 닉네임의 개수. `0` … `10000` 범위로 제한됩니다. |
| `style` | <Lang js="number" dart="int" py="int" code /> | `0` | `0`은 실제 단어를, `100`은 그 언어처럼 읽히기만 하는 단어를 만들어 씁니다. 중간값은 둘을 섞습니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 최소 글자 수. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 최대 글자 수. |
| <Lang js="wordSeparator" dart="wordSeparator" py="word_separator" code /> | <Lang js="string" dart="String?" py="str &#124; None" code /> | _언어별_ | 단어 사이에 넣습니다. 길이 범위에 포함됩니다. 기본값은 붙여 쓰는 것입니다. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 첫 글자가 이 글자인 닉네임만 반환합니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 닉네임을 두 번 반환하지 않습니다. 조합이 바닥나면 `count`보다 적게 반환할 수 있습니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 닉네임마다 하나의 `NicknameDetail`. Dart에는 이 파라미터가 없습니다. [상세 출력](#the-detail-output)을 참고하세요. |

## 상세 출력 {#the-detail-output}

`output: 'detail'`은 문자열을 돌려주는 대신 각 닉네임을 이루는 조각들을 알려 줍니다. 순서대로의 단어들, 언어, 테마입니다. 기준 단어를 강조하거나 테마별로 묶을 때 유용합니다.

::: lang dart

Dart에는 인자에 따라 반환 타입이 달라지는 함수를 만들 방법이 없어서, 이 기능은 **별도 함수** `randNicknameDetails`로 되어 있습니다. `randNickname`과 같은 파라미터를 받습니다.

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

randNicknameDetails(language: WordLanguage.ko);
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

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `nickname` | <Lang js="string" dart="String" py="str" code /> | 완성된 닉네임. |
| `words` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | 순서대로의 구성 단어들. |
| `language` | `WordLanguage` | 이 닉네임이 생성된 언어. |
| `theme` | <Lang js="WordTheme &#124; null" dart="WordTheme?" py="WordTheme &#124; None" code /> | 기준 단어의 테마. 생성기가 모르는 단어면 null입니다. |

`words`를 그 언어의 연결 방식으로 이어 붙이면 정확히 `nickname`이 됩니다. 이는 불변 조건이며 세 테스트 스위트 모두 이를 검증합니다.

### `theme`에 대하여 {#about-theme}

테마는 **보고되는 값이지 요구되는 값이 아닙니다.** 테마에서 뽑은 단어는 그 테마를 보고하고, 만들어낸 단어는 우연히 실제 단어와 같아질 수 있으므로 14개 테마 전체에서 찾아본 뒤 어디에도 없으면 null을 보고합니다.

여기서 두 가지 우연이 따라오는데, 버그가 아니라 예상해야 할 동작입니다. 하나는 같은 단어가 수식어이면서 명사일 수 있다는 것입니다(`무지개`, `Marble`, `自由`). 다른 하나는 만들어낸 단어가 우연히 실제 단어를 이룰 수 있다는 것입니다. `나` + `비`는 `나비`이므로 `style: 100`으로 만든 닉네임이 `theme`을 `animal`로 보고할 수 있습니다.

## 예제

### 한 언어씩

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

### 테마

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
randNickname(language: WordLanguage.ko, theme: WordTheme.animal, count: 3);
// ['깊은연어', '하얀여우갈기', '떠도는잉어']

randNickname(language: WordLanguage.en, theme: WordTheme.gem, count: 3);
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

14개 테마와 각 테마가 담고 있는 것은 [테마](../word/themes)에 있습니다.

### 단어 사이의 구분자

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
randNickname(language: WordLanguage.ko, wordSeparator: ' ', count: 4);
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randNickname(language: WordLanguage.en, wordSeparator: '-', count: 4);
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']

randNickname(language: WordLanguage.ja, wordSeparator: '・', count: 3);
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

구분자의 길이도 <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code />에 포함됩니다. [`nicknameLengthRange`](./nickname-length-range)에 넘겨 보면 남은 범위를 확인할 수 있습니다.

### 고유 접미사 {#a-unique-suffix}

이를 위한 옵션은 없습니다. [`randSuffix`](../decorate/rand-suffix)가 넘겨받은 무엇에든 무작위 토큰을 붙이며, 여기서 만든 닉네임도 그 대상입니다.

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
randSuffixAll(randNickname(language: WordLanguage.ko, count: 3));
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']

randSuffixAll(
  randNickname(language: WordLanguage.ko, count: 2),
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

토큰은 그 뒤에 붙기 때문에, <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code />는 접미사 앞부분이 아니라 닉네임 전체를 가리킵니다.

### 만들어낸 단어

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
randNickname(language: WordLanguage.ko, style: 100, count: 3);
// ['토한조해한', '가파모토히', '리누채무애저차부']

randNickname(language: WordLanguage.en, style: 100, count: 3);
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

### 기준 단어 강조하기

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
for (final detail in randNicknameDetails(language: WordLanguage.ko, count: 3)) {
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

### 읽는 부분과 구분자를 따로 저장하기 {#storing-the-readable-part-and-the-discriminator}

가입 흐름에서는 보통 읽는 부분과 충돌을 막는 부분을 두 컬럼으로 나누어 둡니다. 나중에 이름을 바꿀 때 한쪽만 유지하고 다른 쪽을 갈아 끼울 수 있기 때문입니다. 두 번째 값을 만드는 것이 [`randSuffix`](../decorate/rand-suffix)이며, 첫 번째 값에서 다시 잘라낼 일이 없습니다.

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

### 테마별로 묶기

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

## 함께 보기

- [`randSuffix`](../decorate/rand-suffix) — 닉네임이 절대 겹치지 않아야 할 때 붙이는 무작위 토큰.
- [테마](../word/themes) — 닉네임을 만드는 14개 어휘 묶음.
- [`nicknameLengthRange`](./nickname-length-range) — 각 언어가 만들 수 있는 모든 길이.
