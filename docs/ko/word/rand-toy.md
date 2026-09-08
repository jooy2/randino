# randToy

장난감과 놀이. 어린 시절을 채우는 물건과 놀이입니다.

`theme`을 <Lang js="'toy'" dart="WordTheme.toy" py="&quot;toy&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randToy } from 'randino';

randToy({ language: 'en', count: 3 }); // ['Kite', 'Yoyo', 'Domino']
randToy({ language: 'en', output: 'detail' });
// [{ word: 'Kite', language: 'en', theme: 'toy' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randToy(language: WordLanguage.en, count: 3); // [Kite, Yoyo, Domino]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.toy`를 넘기세요. Dart에는 오버로드가 없어서, 이것만을 위해 함수를 스물아홉 개 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_toy

rand_toy(language="en", count=3)  # ['Kite', 'Yoyo', 'Domino']
rand_toy(language="en", output="detail")
# [WordDetail(word='Kite', language='en', theme='toy')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 스물여덟 개와 각 테마가 담은 단어들.
