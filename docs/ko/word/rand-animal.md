# randAnimal

동물. 닉네임이 가장 자주 중심으로 삼는 단어들입니다.

`theme`을 <Lang js="'animal'" dart="WordTheme.animal" py="&quot;animal&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같은 옵션이고 뜻도 같습니다.

::: lang js

```javascript
import { randAnimal } from 'randino';

randAnimal({ language: 'en', count: 3 }); // ['Otter', 'Falcon', 'Lynx']
randAnimal({ language: 'en', output: 'detail' });
// [{ word: 'Otter', language: 'en', theme: 'animal' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randAnimal(language: WordLanguage.en, count: 3); // [Otter, Falcon, Lynx]
```

`List<String>`을 반환합니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.animal`을 넘기세요. Dart에는 오버로드가 없고, 그것만을 위해 함수를 24개 더 두는 것은 지나칩니다.

:::

::: lang py

```python
from randino import rand_animal

rand_animal(language="en", count=3)  # ['Otter', 'Falcon', 'Lynx']
rand_animal(language="en", output="detail")
# [WordDetail(word='Otter', language='en', theme='animal')]
```

:::

## 옵션

<WordOptions />

## 함께 보기

- [`randWord`](./rand-word) — `theme`을 열어 둔 같은 생성 함수. 각 옵션의 자세한 설명이 있습니다.
- [테마](./themes) — 나머지 13개 테마와 각 테마가 담고 있는 단어들.
