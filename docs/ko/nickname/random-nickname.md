# randomNickname

닉네임을 생성해서 `count`개의 문자열로 돌려줍니다. 각 닉네임은 일상 단어에 무언가를 덧붙인 것이고 — 앞에 수식어, 뒤에 단어 하나, 또는 둘 다 — **사람 이름은 절대 쓰지 않습니다**.

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

::: lang py

```python
from randino import random_nickname

random_nickname()
# ['MistyOwl']
```

:::

## 옵션

모든 옵션은 선택 사항이며, 위의 인자 없는 호출이 사용하는 값이 곧 기본값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="NicknameLanguageOption" dart="NicknameLanguage?" py="NicknameLanguageOption &#124; None" code /> | <Lang js="'all'" dart="null" py="None" code /> | 생성할 닉네임의 언어. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 지원하는 모든 언어를 섞어서 닉네임마다 하나씩 고릅니다. |
| `theme` | <Lang js="NicknameThemeOption" dart="NicknameTheme?" py="NicknameThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 닉네임의 주제. [테마](./themes)를 참고하세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 반환할 닉네임의 개수. `0` … `10000` 범위로 제한됩니다. |
| `style` | <Lang js="number" dart="int" py="int" code /> | `0` | `0`은 실제 단어를, `100`은 그 언어처럼 읽히기만 하는 단어를 만들어 씁니다. 중간값은 둘을 섞습니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 최소 글자 수. 고유 접미사는 **세지 않습니다**. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 최대 글자 수. 고유 접미사는 **세지 않습니다**. |
| <Lang js="includeModifier" dart="includeModifier" py="include_modifier" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 단어를 꾸밉니다. `사자`가 아니라 `멋진사자`. |
| <Lang js="wordSeparator" dart="wordSeparator" py="word_separator" code /> | <Lang js="string" dart="String?" py="str &#124; None" code /> | _언어별_ | 단어 사이에 넣습니다. 길이 범위에 포함됩니다. 기본값은 붙여 쓰는 것입니다. |
| <Lang js="baseWord" dart="baseWord" py="base_word" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 모든 닉네임을 이 단어를 중심으로 만들고 장식만 바꿉니다. |
| <Lang js="uniqueSuffix" dart="uniqueSuffix" py="unique_suffix" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 무작위 토큰을 붙여서 두 사람이 같은 닉네임을 갖지 않게 합니다. |
| <Lang js="uniqueSuffixLength" dart="uniqueSuffixLength" py="unique_suffix_length" code /> | <Lang js="number" dart="int" py="int" code /> | `5` | 토큰의 글자 수. `1` … `32` 범위로 제한됩니다. |
| <Lang js="uniqueSuffixSeparator" dart="uniqueSuffixSeparator" py="unique_suffix_separator" code /> | <Lang js="string" dart="String" py="str" code /> | <Lang js="'_'" dart="'_'" py="&quot;_&quot;" code /> | 닉네임과 토큰 사이에 넣습니다. 빈 문자열이면 바로 이어 붙입니다. |
| <Lang js="uniqueSuffixCharset" dart="uniqueSuffixCharset" py="unique_suffix_charset" code /> | <Lang js="string" dart="String?" py="str" code /> | _내장값_ | 토큰을 뽑을 문자 집합. 기본값은 헷갈리는 쌍(`0O`, `1lI`)을 뺀 영숫자입니다. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 첫 글자가 이 글자인 닉네임만 반환합니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 닉네임을 두 번 반환하지 않습니다. 조합이 바닥나면 `count`보다 적게 반환할 수 있습니다. |

::: lang py

기본값이 `"all"`이 아니라 `None`인 옵션은 `language` 하나뿐이고, 둘은 같은 요청이 아닙니다. 생략하면 `base_word`가 쓰인 언어를 따라가므로 `"고양이"`에 영어 수식어가 붙는 일이 없고, `"all"`을 직접 넘기면 base word와 무관하게 모든 언어를 섞습니다.

:::

## 예제

### 한 언어씩

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

::: lang py

```python
random_nickname(language="ko", count=4)
# ['오래된곰', '영원한도마뱀', '귀여운신화다발', '노을']

random_nickname(language="en", count=4)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak', 'MathematicsShard']

random_nickname(language="ja", count=4)
# ['小さな雨', '海の彗星', '鋭いペンギン', '柔らかい記憶']

random_nickname(language="zh", count=4)
# ['勇敢余烬', '快乐薄雾', '节日', '安静小狗']
```

:::

### 테마

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

::: lang py

```python
random_nickname(language="ko", theme="animal", count=3)
# ['깊은연어', '하얀여우갈기', '떠도는잉어']

random_nickname(language="en", theme="gem", count=3)
# ['PolarObsidian', 'AmberGeode', 'QuietMalachite']
```

:::

14개 테마와 각 테마가 담고 있는 것은 [테마](./themes)에 있습니다.

### 꾸미지 않은 단어

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

::: lang py

```python
random_nickname(language="ko", count=4, include_modifier=False)
# ['미래', '반지', '고릴라', '구름언덕']
```

:::

뒤따르는 단어는 여전히 허용됩니다. <Lang js="includeModifier" dart="includeModifier" py="include_modifier" code />는 수식어가 들어가는 형태만 제외할 뿐, 하나만 남기는 옵션이 아닙니다.

### 단어 사이의 구분자

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

::: lang py

```python
random_nickname(language="ko", word_separator=" ", count=4)
# ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

random_nickname(language="en", word_separator="-", count=4)
# ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']

random_nickname(language="ja", word_separator="・", count=3)
# ['硝子の・トラック', '甘い・珠玉', '美しい・ヒツジ']
```

:::

구분자의 길이도 <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code />에 포함됩니다. [`nicknameLengthRange`](./nickname-length-range)에 넘겨 보면 남은 범위를 확인할 수 있습니다.

### 고유 접미사

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

::: lang py

```python
random_nickname(language="ko", count=3, unique_suffix=True)
# ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']

random_nickname(
    language="ko",
    count=2,
    unique_suffix=True,
    unique_suffix_length=8,
    unique_suffix_separator="-",
)
# ['금빛앵무새여행-Qw9NND4j', '느린연필-uxscYCy6']
```

:::

접미사는 <Lang js="minLength" dart="minLength" py="min_length" code /> / <Lang js="maxLength" dart="maxLength" py="max_length" code />를 만족한 **뒤에** 덧붙습니다. 그래서 이 옵션들은 읽는 부분만을 가리키고, 접미사가 그 범위를 잠식하지 않습니다.

### 직접 지정한 단어

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

::: lang py

```python
random_nickname(base_word="고양이", count=5)
# ['하얀고양이', '고양이바람', '떠도는고양이', '귀여운고양이뿔', '검은고양이손길']

random_nickname(base_word="Cat", count=4)
# ['FlyingCat', 'DancingCatScale', 'MistyCatTail', 'WildCatScale']
```

:::

무언가는 항상 덧붙습니다. 그러지 않으면 넘긴 단어가 그대로 돌아올 테니까요. 언어를 생략하면 **단어의 문자 체계가 언어를 결정합니다.** `'고양이'`에 영어 수식어가 붙지 않는 것이 이 때문입니다.

### 만들어낸 단어

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

::: lang py

```python
random_nickname(language="ko", style=100, count=3)
# ['토한조해한', '가파모토히', '리누채무애저차부']

random_nickname(language="en", style=100, count=3)
# ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

## 함께 보기

- [`randomNicknameDetails`](./random-nickname-details) — 같은 닉네임을 단어, 접미사, 테마로 나누어 받기.
- [테마](./themes) — 닉네임을 만드는 14개 어휘 묶음.
- [`nicknameLengthRange`](./nickname-length-range) — 각 언어가 만들 수 있는 모든 길이.
