# randWord

일상 단어를 만들어 `count`개만큼 문자열로 돌려줍니다. 동물, 사물, 자연, 개념 등 25개의 [테마](./themes)를 6개 언어로 제공하며, **사람 이름은 절대 쓰지 않습니다.** [`output: 'detail'`](#the-detail-output)을 주면 각 단어의 언어와 테마까지 알려 줍니다.

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

<WordOptions theme />

같은 표가 아래 25개 페이지에도 들어 있으며, 26번 따로 쓰는 대신 하나의 컴포넌트에서 그려집니다. `language`와 `theme`을 뺀 나머지는 이 패키지의 모든 생성 함수가 공통으로 받는 옵션이며, 어느 함수에서든 같은 뜻입니다.

Dart에는 `output`이 없습니다. 거기서는 [상세 출력](#the-detail-output)이 `randWordDetails`입니다.

## 테마마다 함수가 하나씩

테마는 옵션이기만 한 것이 아닙니다. 25개 각각이 그 자체로 함수이며, 테마를 미리 정해 둔 `randWord`입니다. 각각 문서 페이지가 하나씩 있고, 각 테마가 담고 있는 단어는 [테마](./themes)에 있습니다.

[`randAnimal`](./rand-animal) · [`randObject`](./rand-object) · [`randNature`](./rand-nature) · [`randPlant`](./rand-plant) · [`randGem`](./rand-gem) · [`randConcept`](./rand-concept) · [`randMyth`](./rand-myth) · [`randJob`](./rand-job) · [`randMusic`](./rand-music) · [`randPlace`](./rand-place) · [`randFood`](./rand-food) · [`randSport`](./rand-sport) · [`randVehicle`](./rand-vehicle) · [`randProduct`](./rand-product)

::: lang js

```javascript
import { randAnimal, randFood, randGem } from 'randino';

randAnimal({ language: 'en', count: 3 }); // ['Otter', 'Falcon', 'Lynx']
randFood({ language: 'en', count: 2 }); // ['Dumpling', 'Cocoa']
randGem({ language: 'en', count: 2, unique: true }); // ['Obsidian', 'Bronze']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randAnimal(language: WordLanguage.en, count: 3); // [Otter, Falcon, Lynx]
randFood(language: WordLanguage.en, count: 2); // [Dumpling, Cocoa]
randGem(language: WordLanguage.en, count: 2, unique: true); // [Obsidian, Bronze]
```

테마 함수는 `List<String>`만 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 테마를 넘기세요. Dart에는 오버로드가 없고, 그것만을 위해 함수를 24개 더 두는 것은 지나칩니다.

:::

::: lang py

```python
from randino import rand_animal, rand_food, rand_gem

rand_animal(language="en", count=3)  # ['Otter', 'Falcon', 'Lynx']
rand_food(language="en", count=2)  # ['Dumpling', 'Cocoa']
rand_gem(language="en", count=2, unique=True)  # ['Obsidian', 'Bronze']
```

:::

`theme`을 뺀 `randWord`의 모든 옵션을 그대로 받습니다.

## 길이

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />를 생략하면 단어 풀이 실제로 담고 있는 범위를 따릅니다. 그 값을 알려 주는 것이 [`wordLengthRange`](./word-length-range)입니다. 풀이 만족시킬 수 없는 범위를 요청하면 단어를 자르는 대신 가장 가까운 단어로 답합니다.

::: lang js

```javascript
randWord({ language: 'en', theme: 'animal', maxLength: 4, count: 4 });
// ['Cat', 'Ant', 'Frog', 'Carp']

randWord({ language: 'en', minLength: 9, count: 3 });
// ['Saxophone', 'Spaghetti', 'Spaceship']
```

:::

::: lang dart

```dart
randWord(language: WordLanguage.en, theme: WordTheme.animal, maxLength: 4, count: 4);
// [Cat, Ant, Frog, Carp]

randWord(language: WordLanguage.en, minLength: 9, count: 3);
// [Saxophone, Spaghetti, Spaceship]
```

:::

::: lang py

```python
rand_word(language="en", theme="animal", max_length=4, count=4)
# ['Cat', 'Ant', 'Frog', 'Carp']

rand_word(language="en", min_length=9, count=3)
# ['Saxophone', 'Spaghetti', 'Spaceship']
```

:::

## 만들어낸 단어

`realism`은 세 단계입니다. `real`은 풀에서 뽑고, `invented`는 그 언어처럼 읽히기만 하는 단어를 만들어내며, `mixed`는 단어마다 판단합니다.

::: lang js

```javascript
randWord({ language: 'en', realism: 'invented', count: 4 });
// ['Sterath', 'Lisleen', 'Kaezan', 'Mibaeth']

randWord({ language: 'en', realism: 'mixed', count: 4 });
// ['Blorin', 'Meadow', 'Tavren', 'Compass']
```

:::

::: lang dart

```dart
randWord(language: WordLanguage.en, realism: RandRealism.invented, count: 4);
// [Sterath, Lisleen, Kaezan, Mibaeth]
```

:::

::: lang py

```python
rand_word(language="en", realism="invented", count=4)
# ['Sterath', 'Lisleen', 'Kaezan', 'Mibaeth']
```

:::

만들어낸 단어가 우연히 실제 단어를 이룰 수 있습니다. 음절 템플릿이 `Snake`를 만들어내는 일도 있고, 그럴 때는 테마를 숨기지 않고 그대로 보고합니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randWord({ language: 'en', theme: 'plant', output: 'detail' });
// [{ word: 'Cedar', language: 'en', theme: 'plant' }]
```

:::

::: lang dart

```dart
randWordDetails(language: WordLanguage.en, theme: WordTheme.plant).first;
// WordDetail(Cedar, en, plant)
```

Dart에는 오버로드도 유니온 타입도 없으므로 상세 출력은 별도 함수입니다.

:::

::: lang py

```python
rand_word(language="en", theme="plant", output="detail")
# [WordDetail(word='Cedar', language='en', theme='plant')]
```

:::

풀의 어떤 단어와도 맞지 않는 만들어낸 단어라면 `theme`은 null입니다.

## 함께 보기

- [테마](./themes) — 25개 테마와 각각의 함수.
- [`wordLengthRange`](./word-length-range) — 언어의 단어 풀이 담고 있는 길이 범위.
- [`randNickname`](../nickname/rand-nickname) — 같은 단어를 조합하는 쪽.
- [`randModifier`](../decorate/rand-modifier) — 이미 가진 단어 앞에 수식어를 붙이는 함수.
