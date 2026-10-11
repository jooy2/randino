# randIngredient

요리의 재료입니다. 채소와 과일을 뺀 고기, 곡물, 유제품, 양념, 소스, 향신료와 허브를 담습니다.

`theme`을 <Lang js="'ingredient'" dart="WordTheme.ingredient" py="&quot;ingredient&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randIngredient } from 'randino';

randIngredient({ language: 'en', count: 3 }); // ['Flour', 'Butter', 'Cinnamon']
randIngredient({ language: 'en', output: 'detail' });
// [{ word: 'Flour', language: 'en', theme: 'ingredient' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randIngredient(language: WordLanguage.en, count: 3); // [Flour, Butter, Cinnamon]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.ingredient`를 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_ingredient

rand_ingredient(language="en", count=3)  # ['Flour', 'Butter', 'Cinnamon']
rand_ingredient(language="en", output="detail")
# [WordDetail(word='Flour', language='en', theme='ingredient')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
