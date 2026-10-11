# randPlanet

행성의 이름입니다. 태양계 행성 여덟 개와 왜행성, 널리 알려진 이름 있는 소행성, 국제천문연맹(IAU)이 이름을 붙인 외계행성을 담습니다. `Kepler-452b` 같은 목록 번호와 사람 이름에서 따온 이름은 쓰지 않습니다.

태양계 행성 여덟 개와 명왕성은 천문학자만 아는 수십 개 이름 사이의 몇 개뿐이라, 개수만큼보다 자주 뽑습니다. 영어에서는 절반가량이고, 외계행성을 적게 담은 언어에서는 더 많습니다. 이 아홉 개만 원하면 `vocabulary: 'basic'`을 쓰면 됩니다.

`theme`을 <Lang js="'planet'" dart="WordTheme.planet" py="&quot;planet&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randPlanet } from 'randino';

randPlanet({ language: 'en', count: 3 }); // ['Mars', 'Jupiter', 'Sedna']
randPlanet({ language: 'en', output: 'detail' });
// [{ word: 'Mars', language: 'en', theme: 'planet' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPlanet(language: WordLanguage.en, count: 3); // [Mars, Jupiter, Sedna]
```

`List<String>`을 돌려줍니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.planet`을 넘기세요. Dart에는 오버로드가 없어서, 테마마다 상세 출력용 함수를 하나씩 더 두는 것은 과합니다.

:::

::: lang py

```python
from randino import rand_planet

rand_planet(language="en", count=3)  # ['Mars', 'Jupiter', 'Sedna']
rand_planet(language="en", output="detail")
# [WordDetail(word='Mars', language='en', theme='planet')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 테마와 각 테마가 담은 단어들.
