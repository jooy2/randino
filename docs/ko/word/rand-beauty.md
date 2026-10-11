# randBeauty

화장품과 미용입니다. 색조와 기초 화장품, 향수, 머리와 손톱 관리, 그리고 거기에 쓰는 도구와 시술을 담습니다.

`theme`을 <Lang js="'beauty'" dart="WordTheme.beauty" py="&quot;beauty&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randBeauty } from 'randino';

randBeauty({ language: 'en', count: 3 }); // ['Lipstick', 'Lotion', 'Perfume']
randBeauty({ language: 'en', output: 'detail' });
// [{ word: 'Lipstick', language: 'en', theme: 'beauty' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randBeauty(language: WordLanguage.en, count: 3); // [Lipstick, Lotion, Perfume]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.beauty`를 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_beauty

rand_beauty(language="en", count=3)  # ['Lipstick', 'Lotion', 'Perfume']
rand_beauty(language="en", output="detail")
# [WordDetail(word='Lipstick', language='en', theme='beauty')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
