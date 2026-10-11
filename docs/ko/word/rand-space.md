# randSpace

하늘 너머의 것입니다. 달부터 은하까지 담습니다. 행성의 이름은 [`randPlanet`](./rand-planet)에 있습니다.

`theme`을 <Lang js="'space'" dart="WordTheme.space" py="&quot;space&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randSpace } from 'randino';

randSpace({ language: 'en', count: 3 }); // ['Galaxy', 'Comet', 'Nebula']
randSpace({ language: 'en', output: 'detail' });
// [{ word: 'Galaxy', language: 'en', theme: 'space' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randSpace(language: WordLanguage.en, count: 3); // [Galaxy, Comet, Nebula]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.space`를 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_space

rand_space(language="en", count=3)  # ['Galaxy', 'Comet', 'Nebula']
rand_space(language="en", output="detail")
# [WordDetail(word='Galaxy', language='en', theme='space')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
