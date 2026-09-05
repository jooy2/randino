# randFinance

돈, 그리고 돈으로 하는 일을 가리키는 말입니다.

`theme`을 <Lang js="'finance'" dart="WordTheme.finance" py="&quot;finance&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randFinance } from 'randino';

randFinance({ language: 'en', count: 3 }); // ['Ledger', 'Yield', 'Escrow']
randFinance({ language: 'en', output: 'detail' });
// [{ word: 'Ledger', language: 'en', theme: 'finance' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFinance(language: WordLanguage.en, count: 3); // [Ledger, Yield, Escrow]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.finance`를 넘기세요. Dart에는 오버로드가 없어서, 이것만을 위해 함수를 스물다섯 개 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_finance

rand_finance(language="en", count=3)  # ['Ledger', 'Yield', 'Escrow']
rand_finance(language="en", output="detail")
# [WordDetail(word='Ledger', language='en', theme='finance')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 스물네 개와 각 테마가 담은 단어들.
