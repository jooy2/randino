# randMyth

마법과 신화를 이루는 것들입니다. 주문과 저주, 예언, 유물, 물약, 신화 속 세계를 담습니다. 생명체는 [`randMonster`](./rand-monster)에 있습니다.

`theme`을 <Lang js="'myth'" dart="WordTheme.myth" py="&quot;myth&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randMyth } from 'randino';

randMyth({ language: 'en', count: 3 }); // ['Curse', 'Amulet', 'Elixir']
randMyth({ language: 'en', output: 'detail' });
// [{ word: 'Curse', language: 'en', theme: 'myth' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMyth(language: WordLanguage.en, count: 3); // [Curse, Amulet, Elixir]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.myth`를 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_myth

rand_myth(language="en", count=3)  # ['Curse', 'Amulet', 'Elixir']
rand_myth(language="en", output="detail")
# [WordDetail(word='Curse', language='en', theme='myth')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
