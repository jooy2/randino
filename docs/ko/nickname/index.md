# 닉네임

닉네임은 게임이나 웹사이트에서 쓸 법한 핸들입니다. 멋진사자, MistyOwl, 고양이꼬리 같은 것들이죠. randino는 일상 단어에 무언가를 덧붙여 닉네임을 만듭니다. 앞에 수식어를 붙이거나, 뒤에 단어를 하나 더 붙이거나, 둘 다 하는 식입니다.

::: lang js

```javascript
import { randomNickname } from 'randino';

randomNickname({ language: 'ko', count: 3 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randomNickname(language: NicknameLanguage.ko, count: 3);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']
```

:::

**사람 이름은 절대 쓰지 않습니다.** 이름과 닉네임을 하나가 아닌 두 생성기로 나눈 이유가 바로 이 규칙입니다. 누군가의 이름으로 만든 핸들은 그 사람의 실명처럼 읽히지만, 사자와 멋진으로 만든 핸들은 핸들로 읽힙니다. 영어 단어 풀은 영어 사람 이름 풀과 겹치지 않는지 자동으로 검사하며, 그래서 `job` 테마에 `Knight`, `Baker`, `Hunter`가 없고 `plant` 테마에 `Rose`나 `Ivy`가 없습니다.

한국어와 일본어는 이 검사를 적용할 수 없습니다. 하늘, 별, 森은 이름으로도 쓰이는 일상 명사이기 때문입니다. 그래도 `아름다운하늘`은 누구의 이름도 아닙니다.

## 제공되는 기능

| 함수                    | 반환값                             |
| ----------------------- | ---------------------------------- |
| `randomNickname`        | 닉네임 문자열                      |
| `randomNicknameDetails` | 사용된 단어, 접미사, 언어, 테마    |
| `nicknameLengthRange`   | 해당 언어가 만들 수 있는 모든 길이 |

## 옵션의 동작 방식

### 길이는 단어가 아니라 형태를 고릅니다

닉네임에는 네 가지 형태가 있습니다. 명사 하나, 수식어와 명사, 명사와 뒤따르는 단어, 그리고 셋 다입니다. `minLength`와 `maxLength`는 **먼저 형태를 고릅니다**. 범위 안에 들어올 수 없는 형태를 걸러낸 다음, 뒤에 오는 자리들이 각자의 최소 길이를 확보하고 남은 공간을 앞자리에 배분합니다.

좁은 범위에서 단어를 잘라내는 대신 수식어를 빼는 것도, 넓은 범위에서 세 단어짜리 형태가 등장하는 것도 이 때문입니다.

::: lang js

```javascript
randomNickname({ language: 'ko', count: 4, minLength: 4, maxLength: 6 });
// ['엉뚱한진리춤', '엉뚱한가위별', '해바라기', '별빛안개열매']

randomNickname({ language: 'en', count: 4, minLength: 4, maxLength: 9 });
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, count: 4, minLength: 4, maxLength: 6);
// ['엉뚱한진리춤', '엉뚱한가위별', '해바라기', '별빛안개열매']

randomNickname(language: NicknameLanguage.en, count: 4, minLength: 4, maxLength: 9);
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

:::

기본 범위는 **의도적으로 넓습니다.** 모든 형태를 포함하도록 잡혀 있고, 결과물의 일반적인 모습은 범위가 아니라 형태별 가중치가 결정합니다. 그 범위를 알려 주는 것이 `nicknameLengthRange`입니다.

### `wordSeparator`는 언어 고유의 연결 방식을 대체합니다

생략하면 각 언어가 단어를 표기하는 방식대로 이어 붙입니다. 한국어, 일본어, 중국어는 붙여 쓰고 영어는 CamelCase로 읽힙니다. 값을 넘기면 두 단어짜리든 세 단어짜리든 모든 형태가 그 구분자를 씁니다.

::: lang js

```javascript
randomNickname({ language: 'ko', wordSeparator: ' ', count: 4 });
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randomNickname({ language: 'en', wordSeparator: '-', count: 4 });
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, wordSeparator: ' ', count: 4);
// ['역사 발톱', '하늘빛 상상', '차가운 기억', '불빛 돛']

randomNickname(language: NicknameLanguage.en, wordSeparator: '-', count: 4);
// ['Headphone', 'Soft-Bat', 'Genial-Moose-Cove', 'Dreamy-Umbrella-Halo']
```

:::

이것은 장식이 아닙니다. **구분자의 길이도 닉네임 길이에 포함되므로**, 구분자를 넣으면 단어가 길어진 것과 똑같이 범위가 좁아집니다. `nicknameLengthRange`에 넘겨 보면 남은 범위를 확인할 수 있습니다.

### 고유 접미사는 길이 범위 밖에 있습니다

`minLength`와 `maxLength`는 읽는 부분만을 가리킵니다. 접미사는 그 조건을 만족한 뒤에 덧붙으므로 범위를 잠식하지 않습니다. 그리고 이 접미사야말로 닉네임 충돌을 "드물게"가 아니라 "불가능하게" 만드는 장치입니다.

::: lang js

```javascript
randomNickname({ language: 'ko', count: 3, uniqueSuffix: true });
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']
```

:::

::: lang dart

```dart
randomNickname(language: NicknameLanguage.ko, count: 3, uniqueSuffix: true);
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']
```

:::

접미사 구분자는 `wordSeparator`와 별개입니다. 둘을 같은 문자로 지정하면 접미사가 구분되어 보이지 않게 됩니다.

### `baseWord`는 단어를 고정하고 장식만 바꿉니다

무언가는 항상 덧붙습니다. 그러지 않으면 넘긴 단어가 그대로 돌아올 테니까요. 언어를 생략하면 **단어의 문자 체계가 언어를 결정합니다.** `'고양이'`에 영어 수식어가 붙지 않는 것이 이 때문입니다.

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

언어의 자연스러운 길이 범위보다 긴 기준 단어를 넘기면, 단어가 잘리는 대신 범위가 넓어집니다.

### `style`은 단어를 뽑는 대신 만들어냅니다

`0`에서는 모든 단어가 실제 단어입니다. `100`에 가까워지면 해당 언어의 음절로 단어를 조립하며, 사전에 있는 단어가 아니라 지어낸 핸들처럼 읽힙니다.

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

### `unique`, 그리고 대개는 접미사가 더 나은 이유

한국어와 영어는 각각 900만 가지가 넘는 단어 조합을 가지므로 중복은 어느 쪽이든 드뭅니다. `unique`는 한 번의 호출 안에서 중복을 없애고, 조합이 바닥나면 더 적은 개수를 돌려줍니다. `uniqueSuffix`는 호출과 프로세스와 사용자를 가로질러 충돌을 불가능하게 만드는데, 가입 폼에 실제로 필요한 보장은 이쪽입니다.
