# randNature

자연과 자연 현상. 하늘, 날씨, 물, 땅입니다.

`theme`을 <Lang js="'nature'" dart="WordTheme.nature" py="&quot;nature&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같은 옵션이고 뜻도 같습니다.

::: lang js

```javascript
import { randNature } from 'randino';

randNature({ language: 'en', count: 3 }); // ['Sky', 'Sunset', 'Breeze']
randNature({ language: 'en', output: 'detail' });
// [{ word: 'Sky', language: 'en', theme: 'nature' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNature(language: WordLanguage.en, count: 3); // [Sky, Sunset, Breeze]
```

`List<String>`을 반환합니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.nature`을 넘기세요. Dart에는 오버로드가 없고, 그것만을 위해 함수를 17개 더 두는 것은 지나칩니다.

:::

::: lang py

```python
from randino import rand_nature

rand_nature(language="en", count=3)  # ['Sky', 'Sunset', 'Breeze']
rand_nature(language="en", output="detail")
# [WordDetail(word='Sky', language='en', theme='nature')]
```

:::

## 옵션

<WordOptions />

## 함께 보기

- [`randWord`](./rand-word) — `theme`을 열어 둔 같은 생성 함수. 각 옵션의 자세한 설명이 있습니다.
- [테마](./themes) — 나머지 13개 테마와 각 테마가 담고 있는 단어들.
