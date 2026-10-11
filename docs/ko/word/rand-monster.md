# randMonster

신화와 민담, 판타지 속 생명체입니다. 용과 요정, 유령과 언데드, 신과 거인, 외계인까지 동물도 사람도 아닌 존재를 모두 담습니다.

`theme`을 <Lang js="'monster'" dart="WordTheme.monster" py="&quot;monster&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randMonster } from 'randino';

randMonster({ language: 'en', count: 3 }); // ['Dragon', 'Vampire', 'Golem']
randMonster({ language: 'en', output: 'detail' });
// [{ word: 'Dragon', language: 'en', theme: 'monster' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMonster(language: WordLanguage.en, count: 3); // [Dragon, Vampire, Golem]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.monster`를 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_monster

rand_monster(language="en", count=3)  # ['Dragon', 'Vampire', 'Golem']
rand_monster(language="en", output="detail")
# [WordDetail(word='Dragon', language='en', theme='monster')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
