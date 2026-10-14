# seededRandom

`random` 옵션에 넘기는, 시드를 받는 난수원입니다. 시드가 같으면 나오는 수도 같으므로, 이 난수원으로 한 호출은 실행할 때마다 같은 결과를 냅니다. 스냅샷 테스트나 데모용 데이터베이스에 쓰기 좋습니다. 시드는 문자열로 읽으므로 `42`와 `'42'`는 같은 시드입니다.

::: lang js

```javascript
import { randName, randSentence, seededRandom } from 'randino';

randName({ language: 'en', count: 3, random: seededRandom(42) });
// ['Stephanie Lee', 'Abigale Edwards', 'Wayne Bradshaw'] — 언제나 같습니다

// 난수원 하나를 여러 호출에 넘길 수 있습니다. 이때는 호출들이 차례로 이어서 뽑습니다.
const random = seededRandom('fixtures');

randName({ count: 5, random });
randSentence({ sentences: 3, random });
```

| 파라미터 | 타입               | 설명                |
| -------- | ------------------ | ------------------- |
| `seed`   | `number \| string` | 수를 만들어 낼 시드 |

`() => number`를 반환합니다. 부를 때마다 `[0, 1)` 범위의 다음 수를 돌려주는 함수입니다.

:::

::: lang dart

Dart의 `Random`은 원래 시드를 받으므로 Dart 패키지에는 이 함수가 따로 없습니다.

```dart
import 'dart:math';

randName(language: NameLanguage.en, count: 3, random: Random(42));
```

:::

::: lang py

Python의 `random.Random`은 원래 시드를 받으므로 Python 패키지에는 이 함수가 따로 없습니다.

```python
from random import Random

rand_name(language="en", count=3, random=Random(42).random)
```

:::

## 뽑는 방식 {#how-it-draws}

JavaScript 표준 라이브러리에는 시드를 받는 생성기가 없습니다. `Math.random`은 시드를 받지 않습니다. `seededRandom`은 [sfc32](https://pracrand.sourceforge.net/RNG_engines.txt)입니다. 상태가 128비트인 작은 생성기로, PractRand 검정을 통과합니다. 시드 문자열은 FNV-1a와 MurmurHash3의 마무리 함수를 거쳐 상태를 정하므로, 한 글자만 다른 시드도 서로 멀리 떨어진 곳에서 시작합니다. 수 하나는 32비트 출력 두 개로 만들어서, `Math.random`의 수와 같은 53비트 정밀도를 갖습니다.

**암호학적으로 안전하지 않습니다.** 출력 몇 개를 본 사람은 나머지를 알아낼 수 있습니다. 아무도 예측하면 안 되는 토큰에는 [난수원 고르기](../guide/getting-started#choosing-the-source)에 나온 것처럼 안전한 난수원을 넘기십시오.

## 시드는 같은 버전 안에서 재현됩니다 {#within-one-version}

`seededRandom`이 내놓는 수는 바뀌지 않습니다. 시드로 만든 고정 데이터가 모두 이 수로 만들어지므로 테스트가 값을 고정해 두었습니다. 다만 생성기가 이 수로 만드는 결과는 패키지 버전에 따라 바뀔 수 있습니다. 단어 풀이 늘어나고, 단어 하나가 추가되면 그 뒤의 모든 추첨이 밀립니다. 고정 데이터가 업그레이드를 넘어 살아남아야 한다면 패키지 버전을 고정하십시오.

## 함께 보기

- [난수원 고르기](../guide/getting-started#choosing-the-source) — 시드를 준 난수원과 안전한 난수원을 각각 언제 쓰는지.
