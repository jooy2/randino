# 닉네임

닉네임은 게임이나 웹사이트에서 쓸 법한 핸들입니다. MistyOwl, CraneVoyage, RustyBoot 같은 것들이죠. randino는 일상 단어에 무언가를 덧붙여 닉네임을 만듭니다. 앞에 수식어를 붙이거나, 뒤에 단어를 하나 더 붙이거나, 둘 다 하는 식입니다.

::: lang js

```javascript
import { randNickname } from 'randino';

randNickname({ language: 'en', count: 3 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNickname(language: WordLanguage.en, count: 3);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

**사람 이름은 절대 쓰지 않습니다.** 이름과 닉네임을 하나가 아닌 두 생성기로 나눈 이유가 바로 이 규칙입니다. 누군가의 이름으로 만든 핸들은 그 사람의 실명처럼 읽히지만, `Owl`과 `Misty`로 만든 핸들은 핸들로 읽힙니다. 영어 단어 풀은 영어 사람 이름 풀과 겹치지 않는지 자동으로 검사하며, 그래서 `job` 테마에 `Knight`, `Baker`, `Hunter`가 없고 `plant` 테마에 `Rose`나 `Ivy`가 없습니다.

한국어와 일본어는 이 검사를 적용할 수 없습니다. 하늘, 별, 森은 이름으로도 쓰이는 일상 명사이기 때문입니다. 그래도 `아름다운하늘`은 누구의 이름도 아닙니다.

## 제공되는 기능

| 함수 | 반환값 |
| --- | --- |
| [`randNickname`](./rand-nickname) | 닉네임 문자열, 또는 [닉네임마다 상세 정보](./rand-nickname#the-detail-output) |
| [`nicknameLengthRange`](./nickname-length-range) | 해당 언어가 만들 수 있는 모든 길이 |

명사는 14개 [테마](../word/themes)에서 오고, 모든 닉네임은 그중 한 테마의 단어를 중심으로 만들어집니다.

## 옵션의 동작 방식

### 길이는 단어가 아니라 형태를 고릅니다

닉네임에는 네 가지 형태가 있습니다. 명사 하나, 수식어와 명사, 명사와 뒤따르는 단어, 그리고 셋 다입니다. <Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 **먼저 형태를 고릅니다**. 범위 안에 들어올 수 없는 형태를 걸러낸 다음, 뒤에 오는 자리들이 각자의 최소 길이를 확보하고 남은 공간을 앞자리에 배분합니다.

좁은 범위에서 단어를 잘라내는 대신 수식어를 빼는 것도, 넓은 범위에서 세 단어짜리 형태가 등장하는 것도 이 때문입니다.

::: lang js

```javascript
randNickname({ language: 'en', count: 4, minLength: 4, maxLength: 9 });
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.en, count: 4, minLength: 4, maxLength: 9);
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

::: lang py

```python
rand_nickname(language="en", count=4, min_length=4, max_length=9)
# ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

기본 범위는 **의도적으로 넓습니다.** 모든 형태를 포함하도록 잡혀 있고, 결과물의 일반적인 모습은 범위가 아니라 형태별 가중치가 결정합니다. 그 범위를 알려 주는 것이 `nicknameLengthRange`입니다.

### `wordSeparator`는 언어 고유의 연결 방식을 대체합니다

생략하면 각 언어가 단어를 표기하는 방식대로 이어 붙입니다. 한국어, 일본어, 중국어는 붙여 쓰고 영어는 CamelCase로 읽힙니다. 값을 넘기면 두 단어짜리든 세 단어짜리든 모든 형태가 그 구분자를 씁니다.

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

이것은 장식이 아닙니다. **구분자의 길이도 닉네임 길이에 포함되므로**, 구분자를 넣으면 단어가 길어진 것과 똑같이 범위가 좁아집니다. `nicknameLengthRange`에 넘겨 보면 남은 범위를 확인할 수 있습니다.

### 고유 접미사는 여기 옵션이 아닙니다 {#a-unique-suffix-is-not-an-option-here}

예전에는 옵션 네 개였습니다. 문자열에 무작위 토큰을 붙이는 일은 닉네임이 아니라 문자열에 대한 이야기여서, 지금은 [`randSuffix`](../decorate/rand-suffix)가 맡습니다. 이 닉네임에도, 이름에도, 주문 번호에도 쓸 수 있습니다.

::: lang js

```javascript
randSuffix(randNickname({ language: 'en', count: 3 }));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']
```

:::

::: lang dart

```dart
randSuffixAll(randNickname(language: WordLanguage.en, count: 3));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']
```

:::

::: lang py

```python
rand_suffix(rand_nickname(language="en", count=3))
# ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5', 'RovingLakeShard_QqMVH']
```

:::

토큰이 나중에 붙기 때문에, <Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 닉네임 전체를 가리키며 빼고 셀 것이 없습니다.

### `style`은 단어를 뽑는 대신 만들어냅니다

`0`에서는 모든 단어가 실제 단어입니다. `100`에 가까워지면 해당 언어의 음절로 단어를 조립하며, 사전에 있는 단어가 아니라 지어낸 핸들처럼 읽힙니다.

::: lang js

```javascript
randNickname({ language: 'en', style: 100, count: 3 });
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

::: lang dart

```dart
randNickname(language: WordLanguage.en, style: 100, count: 3);
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

::: lang py

```python
rand_nickname(language="en", style=100, count=3)
# ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

:::

### `unique`, 그리고 대개는 접미사가 더 나은 이유 {#unique-and-why-a-suffix-is-usually-better}

한국어와 영어는 각각 900만 가지가 넘는 단어 조합을 가지므로 중복은 어느 쪽이든 드뭅니다. `unique`는 한 번의 호출 안에서 중복을 없애고, 조합이 바닥나면 더 적은 개수를 돌려줍니다. [`randSuffix`](../decorate/rand-suffix)는 호출과 프로세스와 사용자를 가로질러 충돌을 불가능하게 만드는데, 가입 폼에 실제로 필요한 보장은 이쪽입니다.
