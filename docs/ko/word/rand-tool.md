# randTool

손으로 다루는 연장입니다. 끌부터 쟁기까지 담습니다.

`theme`을 <Lang js="'tool'" dart="WordTheme.tool" py="&quot;tool&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randTool } from 'randino';

randTool({ language: 'en', count: 3 }); // ['Chisel', 'Mallet', 'Trowel']
randTool({ language: 'en', output: 'detail' });
// [{ word: 'Chisel', language: 'en', theme: 'tool' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randTool(language: WordLanguage.en, count: 3); // [Chisel, Mallet, Trowel]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.tool`을 넘기세요. Dart에는 오버로드가 없어서, 이것만을 위해 함수를 스물다섯 개 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_tool

rand_tool(language="en", count=3)  # ['Chisel', 'Mallet', 'Trowel']
rand_tool(language="en", output="detail")
# [WordDetail(word='Chisel', language='en', theme='tool')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 스물네 개와 각 테마가 담은 단어들.
