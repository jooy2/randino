# randWord

일상 단어를 만들어 `count`개만큼 문자열로 돌려줍니다. 동물, 사물, 자연, 개념 등 14개의 [테마](./themes)를 4개 언어로 제공하며, **사람 이름은 절대 쓰지 않습니다.** [`output: 'detail'`](#the-detail-output)을 주면 각 단어의 언어와 테마까지 알려 줍니다.

[`randNickname`](../nickname/rand-nickname)이 조합해서 쓰는 바로 그 단어 풀입니다. 여기서는 아무것도 덧붙이지 않은 어휘 그 자체를 얻습니다.

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

## 옵션

모든 옵션은 선택 사항이며, 기본값은 위의 인자 없는 호출이 사용하는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 생성할 단어의 언어. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 단어마다 언어를 하나씩 골라 모든 언어를 섞습니다. |
| `theme` | <Lang js="WordThemeOption" dart="WordTheme?" py="WordThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 단어의 주제. [테마](./themes)를 참고하세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 단어 개수. `0` … `10000`으로 제한됩니다. |
| `style` | <Lang js="number" dart="int" py="int" code /> | `0` | `0`은 실제 단어를 뽑고, `100`은 그 언어처럼 읽히기만 하는 단어를 만들어내며, 그 사이 값은 둘을 섞습니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _단어 풀_ | 최소 글자 수. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _단어 풀_ | 최대 글자 수. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 이 글자로 시작하는 단어만 남깁니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 단어를 두 번 돌려주지 않습니다. 풀이 바닥나면 `count`보다 적게 돌아올 수 있습니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 단어마다 `WordDetail`. Dart에는 이 옵션이 없습니다. [상세 출력](#the-detail-output)을 참고하세요. |

`language`와 `theme`을 뺀 나머지는 이 패키지의 모든 생성 함수가 공통으로 받는 옵션이며, 어느 함수에서든 같은 뜻입니다.

## 테마마다 함수가 하나씩

테마는 옵션이기만 한 것이 아닙니다. 14개 각각이 그 자체로 함수이며, 테마를 미리 정해 둔 `randWord`입니다.

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

테마 함수는 `List<String>`만 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 테마를 넘기세요. Dart에는 오버로드가 없고, 그것만을 위해 함수를 14개 더 두는 것은 지나칩니다.

:::

::: lang py

```python
from randino import rand_animal, rand_food, rand_gem

rand_animal(language="ko", count=3)  # ['여우', '고래', '수달']
rand_food(language="en", count=2)  # ['Dumpling', 'Cocoa']
rand_gem(language="ko", count=2, unique=True)  # ['흑요석', '청동']
```

:::

`theme`을 뺀 `randWord`의 모든 옵션을 그대로 받습니다. 전체 목록은 [테마](./themes)에 있습니다.

## 길이

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />를 생략하면 단어 풀이 실제로 담고 있는 범위를 따릅니다. 그 값을 알려 주는 것이 [`wordLengthRange`](./word-length-range)입니다. 풀이 만족시킬 수 없는 범위를 요청하면 단어를 자르는 대신 가장 가까운 단어로 답합니다.

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

## 만들어낸 단어

`style`은 스위치가 아니라 다이얼입니다. `0`은 풀에서 뽑고, `100`은 그 언어처럼 읽히기만 하는 단어를 만들어내며, 그 사이 값은 단어마다 판단합니다.

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

만들어낸 단어가 우연히 실제 단어를 이룰 수 있습니다. `나` + `비`는 `나비`가 되고, 그럴 때는 테마를 숨기지 않고 그대로 보고합니다.

## 상세 출력 {#the-detail-output}

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

Dart에는 오버로드도 유니온 타입도 없으므로 상세 출력은 별도 함수입니다.

:::

::: lang py

```python
rand_word(language="ko", theme="plant", output="detail")
# [WordDetail(word='민들레', language='ko', theme='plant')]
```

:::

풀의 어떤 단어와도 맞지 않는 만들어낸 단어라면 `theme`은 null입니다.

## 함께 보기

- [테마](./themes) — 14개 테마와 각각의 함수.
- [`wordLengthRange`](./word-length-range) — 언어의 단어 풀이 담고 있는 길이 범위.
- [`randNickname`](../nickname/rand-nickname) — 같은 단어를 조합하는 쪽.
- [`randModifier`](../decorate/rand-modifier) — 이미 가진 단어 앞에 수식어를 붙이는 함수.
