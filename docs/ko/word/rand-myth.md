# randMyth

신화와 설화 속의 존재들입니다.

`theme`을 <Lang js="'myth'" dart="WordTheme.myth" py="&quot;myth&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randMyth } from 'randino';

randMyth({ language: 'en', count: 3 }); // ['Dragon', 'Phoenix', 'Griffin']
randMyth({ language: 'en', output: 'detail' });
// [{ word: 'Dragon', language: 'en', theme: 'myth' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMyth(language: WordLanguage.en, count: 3); // [Dragon, Phoenix, Griffin]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.myth`를 넘기세요. Dart에는 오버로드가 없어서, 이것만을 위해 함수를 스물다섯 개 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_myth

rand_myth(language="en", count=3)  # ['Dragon', 'Phoenix', 'Griffin']
rand_myth(language="en", output="detail")
# [WordDetail(word='Dragon', language='en', theme='myth')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 스물네 개와 각 테마가 담은 단어들.
