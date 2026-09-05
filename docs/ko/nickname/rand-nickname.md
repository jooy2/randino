# randNickname

닉네임을 생성해서 `count`개의 문자열로 돌려줍니다. 각 닉네임은 일상 단어에 무언가를 덧붙인 것으로, 앞에 형용사나 동작을 나타내는 말이 붙거나 뒤에 단어가 하나 더 붙거나 둘 사이에 소유격이 들어갑니다. **사람 이름은 쓰지 않습니다.** [`output: 'detail'`](#the-detail-output)을 주면 어떤 단어를 썼는지 함께 알려 줍니다.

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
| `slots` | <Lang js="WordSlotOption" dart="Set&lt;WordSlot&gt;?" py="WordSlotOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 명사 옆에 무엇을 두는 형태를 받을지. [형태 고르기](#picking-the-shape)를 참고하세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 반환할 닉네임의 개수. `0` … `10000` 범위로 제한됩니다. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | `real`은 실제 단어를, `invented`는 그 언어처럼 읽히기만 하는 단어를 만들어 씁니다. `mixed`는 단어마다 판단합니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 최소 글자 수. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 최대 글자 수. |
| <Lang js="wordSeparator" dart="wordSeparator" py="word_separator" code /> | <Lang js="string" dart="String?" py="str &#124; None" code /> | _언어별_ | 단어 사이에 넣습니다. 길이 범위에 포함됩니다. 기본값은 붙여 쓰는 것입니다. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 첫 글자가 이 글자인 닉네임만 반환합니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 닉네임을 두 번 반환하지 않습니다. 조합이 바닥나면 `count`보다 적게 반환할 수 있습니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 닉네임마다 하나의 `NicknameDetail`. Dart에는 이 파라미터가 없습니다. [상세 출력](#the-detail-output)을 참고하세요. |

## 상세 출력 {#the-detail-output}

`output: 'detail'`은 문자열 대신 각 닉네임을 이루는 요소를 알려 줍니다. 사용한 단어를 순서대로, 언어, 테마입니다. 기준 단어를 강조하거나 테마별로 묶을 때 씁니다.

::: lang dart

Dart에는 인자에 따라 반환 타입이 달라지는 함수를 만들 방법이 없어서, 이 기능은 **별도 함수** `randNicknameDetails`로 되어 있습니다. `randNickname`과 같은 파라미터를 받습니다.

:::

::: lang js

```javascript
import { randNickname } from 'randino';

randNickname({ language: 'en', output: 'detail' });
// [{
//   nickname: 'MistyOwl',
//   words: ['Misty', 'Owl'],
//   slots: ['adjective', 'noun'],
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
randNicknameDetails(language: WordLanguage.en).first.slots;
// [WordSlot.adjective, WordSlot.noun]
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname(language="en", output="detail")
# [NicknameDetail(nickname='MistyOwl', words=('Misty', 'Owl'),
#                 slots=('adjective', 'noun'), language='en', theme='animal')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `nickname` | <Lang js="string" dart="String" py="str" code /> | 완성된 닉네임. |
| `words` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | 사용한 단어를 순서대로. 단어만 담습니다. |
| `slots` | <Lang js="WordSlot[]" dart="List&lt;WordSlot&gt;" py="tuple[WordSlot, ...]" code /> | 각 단어가 형태 안에서 하는 역할. `words`와 인덱스가 맞습니다. |
| `language` | `WordLanguage` | 이 닉네임이 생성된 언어. |
| `theme` | <Lang js="WordTheme &#124; null" dart="WordTheme?" py="WordTheme &#124; None" code /> | 기준 단어의 테마. 생성기가 모르는 단어면 null입니다. |

`slots`는 `words`와 인덱스가 맞습니다. 2번 단어가 하는 역할이 `slots[2]`입니다. 어떤 형태든 `noun`은 정확히 하나이고, 나머지가 그 형태가 명사 옆에 둔 것입니다.

`words`에는 단어만 들어갑니다. 두 단어 사이에 조사가 필요한 형태라면 그 조사는 `nickname`에만 있으므로, `사자의눈물`의 `words`는 `['사자', '눈물']`이고 이어 붙여도 원래 닉네임이 나오지 않습니다. 완성된 문자열은 `nickname`에서, 무엇으로 만들어졌는지는 `words`에서 읽으면 됩니다.

### `theme`이 보고하는 값 {#about-theme}

`theme`은 결과를 설명하는 값이지 요청을 되돌려 주는 값이 아닙니다. 테마에서 뽑은 단어는 그 테마를 보고합니다. 만들어낸 단어는 우연히 실제 단어와 같아질 수 있으므로 25개 테마 전체에서 찾아본 뒤, 어디에도 없으면 null을 보고합니다.

여기서 두 가지 우연이 따라옵니다. 버그가 아니라 예상해야 할 동작입니다. 하나는 같은 단어가 수식어이면서 명사일 수 있다는 것입니다(`Marble`이 그렇습니다). 다른 하나는 만들어낸 단어가 우연히 실제 단어를 이룰 수 있다는 것입니다. 음절 템플릿이 이따금 `Snake`를 만들어내므로, `realism: 'invented'`로 만든 닉네임이 `theme`을 `animal`로 보고하기도 합니다.

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

25개 테마와 각 테마가 담고 있는 것은 [테마](../word/themes)에 있습니다.

### 형태 고르기 {#picking-the-shape}

`slots`는 명사 옆에 무엇이 올 수 있는지를 지정하고, 그중 아무것도 쓰지 않는 형태는 빠집니다. 적어 둔 슬롯 중 하나라도 쓰면 통과하므로, 둘을 함께 적으면 둘 중 아무거나 나옵니다. 아래의 `['adjective', 'action']`이 그 예입니다.

::: lang js

```javascript
randNickname({ language: 'en', slots: 'action', count: 3 });
// ['CountingHarmonics', 'HaulingBurrito', 'FloatingSelkie']

randNickname({ language: 'en', slots: 'part', count: 3 });
// ['CardTrack', 'DreamyBlackthornBreeze', 'ThrowingParachuteHorn']

randNickname({ language: 'en', slots: ['adjective', 'action'], count: 3 });
// ['JadeOdyssey', 'DownyBreeze', 'MidnightFinchLair']

randNickname({ language: 'en', slots: 'none', count: 3 });
// ['Captain', 'Bronze', 'Clown']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.en, slots: {WordSlot.action}, count: 3);
// ['CountingHarmonics', 'HaulingBurrito', 'FloatingSelkie']

randNickname(language: WordLanguage.en, slots: {WordSlot.part}, count: 3);
// ['CardTrack', 'DreamyBlackthornBreeze', 'ThrowingParachuteHorn']

randNickname(
  language: WordLanguage.en,
  slots: {WordSlot.adjective, WordSlot.action},
  count: 3,
);
// ['JadeOdyssey', 'DownyBreeze', 'MidnightFinchLair']

// 빈 집합이 다른 두 패키지의 `'none'`에 해당합니다.
randNickname(language: WordLanguage.en, slots: {}, count: 3);
// ['Captain', 'Bronze', 'Clown']
```

:::

::: lang py

```python
rand_nickname(language="en", slots="action", count=3)
# ['CountingHarmonics', 'HaulingBurrito', 'FloatingSelkie']

rand_nickname(language="en", slots="part", count=3)
# ['CardTrack', 'DreamyBlackthornBreeze', 'ThrowingParachuteHorn']

rand_nickname(language="en", slots=("adjective", "action"), count=3)
# ['JadeOdyssey', 'DownyBreeze', 'MidnightFinchLair']

rand_nickname(language="en", slots="none", count=3)
# ['Captain', 'Bronze', 'Clown']
```

:::

형태는 언어마다 다르므로 모든 요청에 답할 수 있는 것은 아닙니다. 스페인어와 이탈리아어와 독일어와 러시아어에는 명사를 뒤에 붙이는 형태가 없습니다. `cola de gato`처럼 전치사가 필요하지 조사로 이어지지 않기 때문입니다. 이 언어들에 `part`를 요구하면 그 언어가 가진 형태 전체에서 뽑습니다. 형태 하나를 담기에 너무 좁은 길이 범위가 오류 대신 가장 가까운 결과로 답하는 것과 같습니다.

::: lang js

```javascript
randNickname({ language: 'de', slots: 'part', count: 3 });
// ['klingender Obstler', 'freier Geysir', 'wilder Drache']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.de, slots: {WordSlot.part}, count: 3);
// ['klingender Obstler', 'freier Geysir', 'wilder Drache']
```

:::

::: lang py

```python
rand_nickname(language="de", slots="part", count=3)
# ['klingender Obstler', 'freier Geysir', 'wilder Drache']
```

:::

언어를 지정하지 않으면 답할 수 있는 언어가 그러지 못하는 언어보다 먼저 뽑힙니다. 모든 언어를 대상으로 뒤따르는 명사를 요구하면 그 형태를 선언한 다섯 언어에서 뽑힙니다.

### 단어 사이의 구분자

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

구분자의 길이도 <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code />에 포함됩니다. [`nicknameLengthRange`](./nickname-length-range)에 넘겨 보면 남은 범위를 확인할 수 있습니다.

### 고유 접미사 {#a-unique-suffix}

이를 위한 옵션은 없습니다. [`randSuffix`](../decorate/rand-suffix)가 넘겨받은 문자열에 무작위 토큰을 붙이며, 여기서 만든 닉네임도 그대로 넘길 수 있습니다.

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

토큰은 그 뒤에 붙기 때문에, <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code />는 접미사 앞부분이 아니라 닉네임 전체를 가리킵니다.

### 만들어낸 단어

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

### 기준 단어 강조하기

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

### 읽는 부분과 구분자를 따로 저장하기 {#storing-the-readable-part-and-the-discriminator}

가입 흐름에서는 보통 읽는 부분과 충돌을 막는 부분을 두 컬럼으로 나누어 둡니다. 나중에 이름을 바꿀 때 한쪽만 두고 다른 쪽을 갈아 끼울 수 있기 때문입니다. 두 번째 값은 [`randSuffix`](../decorate/rand-suffix)가 만들고, 첫 번째 값에서 다시 잘라낼 일은 없습니다.

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

- [`randSuffix`](../decorate/rand-suffix) — 닉네임이 겹치면 안 될 때 붙이는 무작위 토큰.
- [테마](../word/themes) — 닉네임을 만드는 25개 어휘 묶음.
- [`nicknameLengthRange`](./nickname-length-range) — 각 언어가 만들 수 있는 모든 길이.
