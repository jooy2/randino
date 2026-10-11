# randVegetable

채소입니다. 뿌리채소와 잎채소, 파와 고추, 호박과 버섯까지 부엌에서 채소로 치는 것을 담습니다.

`theme`을 <Lang js="'vegetable'" dart="WordTheme.vegetable" py="&quot;vegetable&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randVegetable } from 'randino';

randVegetable({ language: 'en', count: 3 }); // ['Carrot', 'Onion', 'Spinach']
randVegetable({ language: 'en', output: 'detail' });
// [{ word: 'Carrot', language: 'en', theme: 'vegetable' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randVegetable(language: WordLanguage.en, count: 3); // [Carrot, Onion, Spinach]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.vegetable`을 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_vegetable

rand_vegetable(language="en", count=3)  # ['Carrot', 'Onion', 'Spinach']
rand_vegetable(language="en", output="detail")
# [WordDetail(word='Carrot', language='en', theme='vegetable')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
