# randBuilding

건물과 그 안의 공간입니다. 집과 학교, 가게와 사무실, 종교 시설과 관공서, 그리고 매물의 종류를 나타내는 부동산 용어를 담습니다.

`theme`을 <Lang js="'building'" dart="WordTheme.building" py="&quot;building&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randBuilding } from 'randino';

randBuilding({ language: 'en', count: 3 }); // ['House', 'Library', 'Bakery']
randBuilding({ language: 'en', output: 'detail' });
// [{ word: 'House', language: 'en', theme: 'building' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randBuilding(language: WordLanguage.en, count: 3); // [House, Library, Bakery]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.building`을 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_building

rand_building(language="en", count=3)  # ['House', 'Library', 'Bakery']
rand_building(language="en", output="detail")
# [WordDetail(word='House', language='en', theme='building')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
