# randJob

직업과 역할. 사람 이름은 쓰지 않으므로 `Baker`나 `Hunter` 같은 단어는 없습니다.

`theme`을 <Lang js="'job'" dart="WordTheme.job" py="&quot;job&quot;" code />로 고정한 [`randWord`](./rand-word)입니다. 나머지 옵션은 모두 같은 옵션이고 뜻도 같습니다.

::: lang js

```javascript
import { randJob } from 'randino';

randJob({ language: 'ko', count: 3 }); // ['기사', '마법사', '대장장이']
randJob({ language: 'en', output: 'detail' });
// [{ word: 'Wizard', language: 'en', theme: 'job' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randJob(language: WordLanguage.ko, count: 3); // [기사, 마법사, 대장장이]
randJob(language: WordLanguage.en, count: 3); // [Wizard, Ranger, Blacksmith]
```

`List<String>`을 반환합니다. 상세 출력이 필요하면 `randWordDetails`에 `WordTheme.job`을 넘기세요. Dart에는 오버로드가 없고, 그것만을 위해 함수를 14개 더 두는 것은 지나칩니다.

:::

::: lang py

```python
from randino import rand_job

rand_job(language="ko", count=3)  # ['기사', '마법사', '대장장이']
rand_job(language="en", output="detail")
# [WordDetail(word='Wizard', language='en', theme='job')]
```

:::

## 옵션

<WordOptions />

## 함께 보기

- [`randWord`](./rand-word) — `theme`을 열어 둔 같은 생성 함수. 각 옵션의 자세한 설명이 있습니다.
- [테마](./themes) — 나머지 13개 테마와 각 테마가 담고 있는 단어들.
