# randMusic

음악과 그것을 만드는 방법입니다. 악기와 악보, 연주, 곡의 구성 요소를 담습니다. 음악의 갈래는 [`randGenre`](./rand-genre)에 있습니다.

`theme`을 <Lang js="'music'" dart="WordTheme.music" py="&quot;music&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randMusic } from 'randino';

randMusic({ language: 'en', count: 3 }); // ['Piano', 'Fiddle', 'Melody']
randMusic({ language: 'en', output: 'detail' });
// [{ word: 'Piano', language: 'en', theme: 'music' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMusic(language: WordLanguage.en, count: 3); // [Piano, Fiddle, Melody]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.music`을 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_music

rand_music(language="en", count=3)  # ['Piano', 'Fiddle', 'Melody']
rand_music(language="en", output="detail")
# [WordDetail(word='Piano', language='en', theme='music')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
