# randModifier

문자열 하나, 또는 배열 안의 모든 문자열 앞에 무작위 수식어를 붙입니다. `사자`는 `멋진사자`가 되고 `Owl`은 `MistyOwl`이 됩니다. 이 라이브러리가 만든 값뿐 아니라 어떤 문자열에도 쓸 수 있고, 값을 주지 않으면 수식어 자체를 돌려줍니다.

`randNickname`의 `includeModifier`가 이 함수가 되었습니다. [`randSuffix`](./rand-suffix)와 같은 이유로 닉네임 옵션이 아니게 되었습니다. 문자열을 장식하는 일은 닉네임에 관한 것이 아니라 문자열에 관한 것이기 때문입니다.

::: lang js

```javascript
import { randAnimal, randModifier } from 'randino';

randModifier('사자'); // '멋진사자'
randModifier('Owl', { separator: ' ' }); // 'Misty Owl'
randModifier(); // '멋진'

randModifier(randAnimal({ language: 'ko', count: 2 }));
// ['오래된곰', '영원한도마뱀']
```

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `string \| string[]` | — | 장식할 대상. 옵션이 아니라 첫 번째 인자. 생략하면 수식어만 |
| `language` | `WordLanguageOption` | _문자 체계_ | 수식어를 뽑을 언어 |
| `style` | `number` | `0` | `0`은 실제 수식어를 뽑고, `100`은 그 언어처럼 읽히기만 하는 수식어를 만들어냅니다 |
| `separator` | `string` | _언어_ | 수식어와 값 사이에 들어감 |

`string`에는 `string`을, `string[]`에는 `string[]`을 반환합니다.

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randModifier(value: '사자'); // '멋진사자'
randModifier(value: 'Owl', separator: ' '); // 'Misty Owl'
randModifier(); // '멋진'

randModifierAll(randAnimal(language: WordLanguage.ko, count: 2));
// [오래된곰, 영원한도마뱀]
```

| 파라미터    | 타입            | 기본값      | 설명                                       |
| ----------- | --------------- | ----------- | ------------------------------------------ |
| `value`     | `String?`       | `null`      | 장식할 대상. 생략하면 수식어만             |
| `language`  | `WordLanguage?` | _문자 체계_ | 수식어를 뽑을 언어                         |
| `style`     | `int`           | `0`         | `0`은 실제 수식어, `100`은 만들어낸 수식어 |
| `separator` | `String?`       | _언어_      | 수식어와 값 사이에 들어감                  |

`String`을 반환합니다. **리스트 형태는 `randModifierAll`입니다.** `randSuffix`에 대한 `randSuffixAll`과 같습니다.

:::

::: lang py

```python
from randino import rand_animal, rand_modifier

rand_modifier("사자")  # '멋진사자'
rand_modifier("Owl", separator=" ")  # 'Misty Owl'
rand_modifier()  # '멋진'

rand_modifier(rand_animal(language="ko", count=2))
# ['오래된곰', '영원한도마뱀']
```

| 인자 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `str \| list[str] \| None` | `None` | 장식할 대상. 위치 인자이며 나머지는 키워드 전용 |
| `language` | `WordLanguageOption \| None` | _문자 체계_ | 수식어를 뽑을 언어 |
| `style` | `int` | `0` | `0`은 실제 수식어, `100`은 만들어낸 수식어 |
| `separator` | `str \| None` | _언어_ | 수식어와 값 사이에 들어감 |

`str`에는 `str`을, `list[str]`에는 `list[str]`을 반환하며 `@overload`가 이를 전달합니다.

:::

## 값의 문자 체계가 언어를 정합니다 {#the-script-of-the-value-picks-the-language}

`language`를 생략하면 값 자체의 문자 체계를 보고 언어를 정합니다. 그래서 `'고양이'`에 영어 수식어가 붙지 않고 `'Cat'`에 한국어 수식어가 붙지 않습니다. 언어를 직접 넘기면 그쪽이 이깁니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />을 넘기면 값이 어떤 문자로 쓰였든 모든 언어를 섞습니다.

::: lang js

```javascript
randModifier('고양이'); // '하얀고양이' — 문자 체계를 따라 한국어
randModifier('Cat'); // 'FlyingCat'
randModifier('고양이', { language: 'en' }); // 'Misty고양이'
```

:::

::: lang dart

```dart
randModifier(value: '고양이'); // '하얀고양이' — 문자 체계를 따라 한국어
randModifier(value: 'Cat'); // 'FlyingCat'
randModifier(value: '고양이', language: WordLanguage.en); // 'Misty고양이'
```

:::

::: lang py

```python
rand_modifier("고양이")  # '하얀고양이' — 문자 체계를 따라 한국어
rand_modifier("Cat")  # 'FlyingCat'
rand_modifier("고양이", language="en")  # 'Misty고양이'
```

:::

값이 없으면 읽을 문자 체계도 없으므로, 언어를 지정하지 않는 한 모든 언어가 대상이 됩니다.

## 값마다 새로 뽑은 수식어 {#a-fresh-modifier-for-every-value}

한 번 뽑아 전체에 쓰지 않습니다. [`randSuffix`](./rand-suffix)가 값마다 토큰을 뽑는 것과 같습니다. 배열을 넘길 이유가 바로 이것입니다.

::: lang js

```javascript
randModifier(['사자', '사자', '사자']);
// ['멋진사자', '조용한사자', '푸른사자']
```

:::

::: lang dart

```dart
randModifierAll(const ['사자', '사자', '사자']);
// [멋진사자, 조용한사자, 푸른사자]
```

:::

::: lang py

```python
rand_modifier(["사자", "사자", "사자"])
# ['멋진사자', '조용한사자', '푸른사자']
```

:::

## 구분자와 만들어낸 수식어 {#the-separator-and-invented-modifiers}

`separator`의 기본값은 그 언어가 단어를 잇는 방식, 즉 붙여 쓰는 것입니다. `style`은 모든 생성 함수가 가진 그 다이얼입니다. `0`은 언어가 실제로 쓰는 수식어를 뽑고, `100`은 그 언어처럼 읽히기만 하는 수식어를 만들어냅니다.

::: lang js

```javascript
randModifier('사자', { separator: '-' }); // '멋진-사자'
randModifier({ language: 'ko', style: 100 }); // '다순'
```

:::

::: lang dart

```dart
randModifier(value: '사자', separator: '-'); // '멋진-사자'
randModifier(language: WordLanguage.ko, style: 100); // '다순'
```

:::

::: lang py

```python
rand_modifier("사자", separator="-")  # '멋진-사자'
rand_modifier(language="ko", style=100)  # '다순'
```

:::

## 수식어와 명사는 닉네임이 쓰는 그 단어 풀입니다 {#the-same-pools-a-nickname-uses}

단어 앞에 수식어를 붙이는 것은 `randNickname`이 대부분의 경우에 하는 일과 같습니다. <Lang js="randModifier(randAnimal())" dart="randModifier(value: randAnimal().first)" py="rand_modifier(rand_animal())" code />와 `randNickname({ theme: 'animal' })`은 같은 곳에서 단어를 꺼냅니다. 닉네임 생성기가 그 위에 더하는 것은 형태와 길이 맞추기입니다. 뒤에 붙는 단어, 결과 전체가 들어가야 하는 범위, 그리고 두 단어가 경계에서 같은 글자를 반복할 때의 재추첨입니다.

## 함께 보기

- [`randWord`](../word/rand-word) — 이 함수가 주로 앞에 붙는 단어들.
- [`randSuffix`](./rand-suffix) — 단어 대신 무작위 토큰.
- [`randNickname`](../nickname/rand-nickname) — 같은 단어 풀을 장식이 아니라 조합으로 쓰는 쪽.
- [지원 언어](../guide/languages#words-and-nicknames) — 왜 9개가 아니라 4개인지.
