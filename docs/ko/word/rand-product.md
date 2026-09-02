# randProduct

사서 쓰는 물건. 어휘 중 공산품 쪽입니다.

`theme`을 <Lang js="'product'" dart="WordTheme.product" py="&quot;product&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같은 옵션이고 뜻도 같습니다.

::: lang js

```javascript
import { randProduct } from 'randino';

randProduct({ language: 'ko', count: 3 }); // ['노트북', '키보드', '이어폰']
randProduct({ language: 'en', output: 'detail' });
// [{ word: 'Laptop', language: 'en', theme: 'product' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randProduct(language: WordLanguage.ko, count: 3); // [노트북, 키보드, 이어폰]
randProduct(language: WordLanguage.en, count: 3); // [Laptop, Keyboard, Earbuds]
```

`List<String>`을 반환합니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.product`을 넘기세요. Dart에는 오버로드가 없고, 그것만을 위해 함수를 14개 더 두는 것은 지나칩니다.

:::

::: lang py

```python
from randino import rand_product

rand_product(language="ko", count=3)  # ['노트북', '키보드', '이어폰']
rand_product(language="en", output="detail")
# [WordDetail(word='Laptop', language='en', theme='product')]
```

:::

## 옵션

<WordOptions />

## 함께 보기

- [`randWord`](./rand-word) — `theme`을 열어 둔 같은 생성 함수. 각 옵션의 자세한 설명이 있습니다.
- [테마](./themes) — 나머지 13개 테마와 각 테마가 담고 있는 단어들.
