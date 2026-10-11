# randGenre

음악의 갈래입니다. 테크노와 그런지, 케이팝 같은 장르와 세부 장르, 그리고 교향곡이나 야상곡처럼 작곡가가 쓰는 곡의 형식을 담습니다.

`theme`을 <Lang js="'genre'" dart="WordTheme.genre" py="&quot;genre&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randGenre } from 'randino';

randGenre({ language: 'en', count: 3 }); // ['Jazz', 'Techno', 'Symphony']
randGenre({ language: 'en', output: 'detail' });
// [{ word: 'Jazz', language: 'en', theme: 'genre' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randGenre(language: WordLanguage.en, count: 3); // [Jazz, Techno, Symphony]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.genre`를 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_genre

rand_genre(language="en", count=3)  # ['Jazz', 'Techno', 'Symphony']
rand_genre(language="en", output="detail")
# [WordDetail(word='Jazz', language='en', theme='genre')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
