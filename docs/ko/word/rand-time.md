# randTime

무언가가 일어나는 때입니다. 순간부터 계절까지 담습니다.

`theme`을 <Lang js="'time'" dart="WordTheme.time" py="&quot;time&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randTime } from 'randino';

randTime({ language: 'en', count: 3 }); // ['Twilight', 'Solstice', 'Eternity']
randTime({ language: 'en', output: 'detail' });
// [{ word: 'Twilight', language: 'en', theme: 'time' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randTime(language: WordLanguage.en, count: 3); // [Twilight, Solstice, Eternity]
```

`List<String>`을 돌려줍니다. 상세 형태가 필요하면 `randWordDetails`에 `WordTheme.time`을 넘기십시오. Dart에는 오버로드가 없고, 이것만을 위해 함수를 스물네 개 더 두는 것은 스물네 개가 많습니다.

:::

::: lang py

```python
from randino import rand_time

rand_time(language="en", count=3)  # ['Twilight', 'Solstice', 'Eternity']
rand_time(language="en", output="detail")
# [WordDetail(word='Twilight', language='en', theme='time')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 스물네 개와 각 테마가 담은 단어들.
