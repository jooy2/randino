# randNicknameDetails

닉네임을 생성하면서 각 닉네임을 이루는 조각들을 함께 알려 줍니다. 순서대로의 단어들, 언어, 테마입니다. 기준 단어를 강조하거나, 테마별로 묶거나, 만들어진 닉네임 옆에 그 구성 단어를 함께 저장할 때 유용합니다.

::: lang js

```javascript
import { randNicknameDetails } from 'randino';

randNicknameDetails({ language: 'ko' });
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
from randino import rand_nickname_details

rand_nickname_details(language="ko")
# [NicknameDetail(nickname='오래된발견', words=('오래된', '발견'),
#                 language='ko', theme='concept')]
```

:::

## 옵션

[`randNickname`](./rand-nickname)과 완전히 같은 옵션을 받습니다. 반환 타입만 다릅니다.

## 반환값

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `nickname` | <Lang js="string" dart="String" py="str" code /> | 완성된 닉네임. |
| `words` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | 순서대로의 구성 단어들. |
| `language` | `NicknameLanguage` | 이 닉네임이 생성된 언어. |
| `theme` | <Lang js="NicknameTheme &#124; null" dart="NicknameTheme?" py="NicknameTheme &#124; None" code /> | 기준 단어의 테마. 생성기가 모르는 단어면 null입니다. |

`words`를 그 언어의 연결 방식으로 이어 붙이면 정확히 `nickname`이 됩니다. 이는 불변 조건이며 세 테스트 스위트 모두 이를 검증합니다.

### `theme`에 대하여 {#about-theme}

테마는 **보고되는 값이지 요구되는 값이 아닙니다.** 테마에서 뽑은 단어는 그 테마를 보고하고, 직접 넘긴 <Lang js="baseWord" dart="baseWord" py="base_word" code />는 14개 테마 전체에서 찾아 해당 테마를 보고하며, 만들어낸 단어는 어디에도 없으므로 null을 보고합니다.

여기서 두 가지 우연이 따라오는데, 버그가 아니라 예상해야 할 동작입니다. 하나는 같은 단어가 수식어이면서 명사일 수 있다는 것입니다(`무지개`, `Marble`, `自由`). 다른 하나는 만들어낸 단어가 우연히 실제 단어를 이룰 수 있다는 것입니다. `나` + `비`는 `나비`이므로 `style: 100`으로 만든 닉네임이 `theme`을 `animal`로 보고할 수 있습니다.

## 예제

### 기준 단어 강조하기

::: lang js

```javascript
for (const { words, theme } of randNicknameDetails({ language: 'ko', count: 3 })) {
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
for detail in rand_nickname_details(language="ko", count=3):
    print(" + ".join(detail.words), detail.theme)
# 오래된 + 곰 animal
# 영원한 + 도마뱀 animal
# 귀여운 + 신화 + 다발 myth
```

:::

### 읽는 부분과 구분자를 따로 저장하기 {#storing-the-readable-part-and-the-discriminator}

가입 흐름에서는 보통 읽는 부분과 충돌을 막는 부분을 두 컬럼으로 나누어 둡니다. 나중에 이름을 바꿀 때 한쪽만 유지하고 다른 쪽을 갈아 끼울 수 있기 때문입니다. 두 번째 값을 만드는 것이 [`randSuffix`](../affix/rand-suffix)이며, 첫 번째 값에서 다시 잘라낼 일이 없습니다.

::: lang js

```javascript
const [detail] = randNicknameDetails({ language: 'en' });
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
detail = rand_nickname_details(language="en")[0]
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

for (const detail of randNicknameDetails({ language: 'en', count: 100 })) {
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

for detail in rand_nickname_details(language="en", count=100):
    by_theme[detail.theme].append(detail.nickname)
```

:::

## 함께 보기

- [`randNickname`](./rand-nickname) — 전체 옵션 표와, 같은 닉네임을 문자열로만 받는 방법.
- [테마](./themes) — 각 테마가 담고 있는 것.
