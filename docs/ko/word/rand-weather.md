# randWeather

하늘이 하고 있는 일입니다. 산들바람부터 눈보라까지 담습니다.

`theme`을 <Lang js="'weather'" dart="WordTheme.weather" py="&quot;weather&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같고, 뜻하는 바도 같습니다.

::: lang js

```javascript
import { randWeather } from 'randino';

randWeather({ language: 'en', count: 3 }); // ['Drizzle', 'Rainbow', 'Hoarfrost']
randWeather({ language: 'en', output: 'detail' });
// [{ word: 'Drizzle', language: 'en', theme: 'weather' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randWeather(language: WordLanguage.en, count: 3); // [Drizzle, Rainbow, Hoarfrost]
```

`List<String>`을 돌려줍니다. 상세 형태가 필요하면 `randWordDetails`에 `WordTheme.weather`을 넘기십시오. Dart에는 오버로드가 없고, 이것만을 위해 함수를 스물네 개 더 두는 것은 스물네 개가 많습니다.

:::

::: lang py

```python
from randino import rand_weather

rand_weather(language="en", count=3)  # ['Drizzle', 'Rainbow', 'Hoarfrost']
rand_weather(language="en", output="detail")
# [WordDetail(word='Drizzle', language='en', theme='weather')]
```

:::

## 옵션 {#options}

<WordOptions />

## 함께 보기 {#see-also}

- [`randWord`](./rand-word) — `theme`이 열려 있는 같은 생성 함수, 그리고 각 옵션의 전체 설명.
- [테마](./themes) — 나머지 스물네 개와 각 테마가 담은 단어들.
