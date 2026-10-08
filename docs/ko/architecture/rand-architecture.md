# randArchitecture

프로세서 아키텍처를 `count`개만큼 돌려줍니다. `x86_64`, `arm64`, `x86`, `armv7`처럼 다운로드 페이지가 가장 흔히 쓰는 이름 그대로입니다. 거의 모든 기기가 이 넷 중 하나를 쓰므로 기본으로는 이 넷만 나오고, [`includeRare`](#rare)를 켜면 쓰는 기기가 적은 아키텍처가 더해지지만 그때도 드물게 나옵니다. [`output: 'detail'`](#the-detail-output)을 주면 아키텍처마다 다른 곳에서 쓰는 이름도 알려 줍니다.

아키텍처 이름은 어느 언어에서나 같으므로 `randArchitecture`는 언어를 받지 않습니다.

::: lang js

```javascript
import { randArchitecture } from 'randino';

randArchitecture();
// ['x86_64']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randArchitecture();
// [x86_64]
```

:::

::: lang py

```python
from randino import rand_architecture

rand_architecture()
# ['x86_64']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <Lang js="includeRare" dart="includeRare" py="include_rare" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 쓰는 기기가 적은 아키텍처도 드물게 뽑습니다. [드문 아키텍처](#rare)를 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 아키텍처 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 아키텍처가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 아키텍처마다 `ArchitectureDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 아키텍처별 비중 {#shares}

비중은 아키텍처가 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다. 64비트 x86과 Arm이 데스크톱, 노트북, 휴대폰, 서버의 거의 전부이고, 32비트 둘은 남아 있는 오래된 기기의 몫입니다.

| 아키텍처 | 다른 표기 | 비트 | 비중 | <Lang js="includeRare" dart="includeRare" py="include_rare" code />를 켰을 때 |
| --- | --- | --: | --: | --: |
| `x86_64` | `amd64`, `x64` | 64 | 46% | 43.9% |
| `arm64` | `aarch64` | 64 | 40% | 38.2% |
| `x86` | `i386`, `ia32`, `i686` | 32 | 8% | 7.6% |
| `armv7` | `armhf`, `armv7l` | 32 | 6% | 5.7% |
| `riscv64` | — | 64 | — | 0.8% |
| `ppc64le` | `ppc64el` | 64 | — | 0.8% |
| `s390x` | — | 64 | — | 0.8% |
| `mips64` | — | 64 | — | 0.8% |
| `loongarch64` | `loong64` | 64 | — | 0.8% |
| `sparc64` | `sparcv9` | 64 | — | 0.8% |

아키텍처 이름은 다운로드 페이지가 가장 흔히 쓰는 이름을 따릅니다. 시스템이 보여 주는 이름과 늘 같지는 않습니다. 리눅스의 `uname -m`은 `arm64`를 `aarch64`로, `x86`을 `i686`으로, `armv7`을 `armv7l`로 보여 주고, Debian과 Windows에도 저마다의 이름이 있습니다. 다른 표기는 [상세 출력](#the-detail-output)에 있으므로, 시스템이 기대하는 이름으로 바꿔 쓸 수 있습니다.

## 드문 아키텍처 {#rare}

<Lang js="includeRare" dart="includeRare" py="include_rare" code />를 켜면 쓰는 기기가 적은 아키텍처 여섯 가지가 더해집니다. RISC-V, 리틀 엔디언 POWER, IBM Z, 64비트 MIPS, LoongArch, SPARC입니다. 각각 130번에 한 번꼴이라 50개짜리 샘플에는 대개 하나도 없거나 하나쯤 섞이며, 흔한 넷은 그 옆에서 같은 비율을 유지합니다.

::: lang js

```javascript
randArchitecture({ count: 4 }); // ['x86_64', 'arm64', 'x86_64', 'armv7']
randArchitecture({ includeRare: true, count: 4 }); // ['arm64', 'x86_64', 'riscv64', 'x86_64']
randArchitecture({ includeRare: true, unique: true, count: 10 });
// ['x86_64', 'arm64', 'x86', 'armv7', 'ppc64le', 's390x', 'riscv64', 'mips64', 'sparc64', 'loongarch64']
```

:::

::: lang dart

```dart
randArchitecture(count: 4); // [x86_64, arm64, x86_64, armv7]
randArchitecture(includeRare: true, count: 4); // [arm64, x86_64, riscv64, x86_64]
randArchitecture(includeRare: true, unique: true, count: 10);
// [x86_64, arm64, x86, armv7, ppc64le, s390x, riscv64, mips64, sparc64, loongarch64]
```

:::

::: lang py

```python
rand_architecture(count=4)  # ['x86_64', 'arm64', 'x86_64', 'armv7']
rand_architecture(include_rare=True, count=4)  # ['arm64', 'x86_64', 'riscv64', 'x86_64']
rand_architecture(include_rare=True, unique=True, count=10)
# ['x86_64', 'arm64', 'x86', 'armv7', 'ppc64le', 's390x', 'riscv64', 'mips64', 'sparc64', 'loongarch64']
```

:::

## 상세 출력 {#the-detail-output}

상세 출력에는 아키텍처의 다른 표기, 비트 수, 계열이 들어 있어서 Debian, Windows, Go가 기대하는 이름으로 바꿔 쓸 수 있습니다.

::: lang js

```javascript
randArchitecture({ output: 'detail' });
// [{ architecture: 'x86_64', aliases: ['amd64', 'x64'], bits: 64, family: 'x86', rare: false }]
```

:::

::: lang dart

```dart
randArchitectureDetails().first; // ArchitectureDetail(x86_64, 64)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randArchitecture`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_architecture(output="detail")
# [ArchitectureDetail(architecture='x86_64', aliases=('amd64', 'x64'), bits=64, family='x86', rare=False)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `architecture` | <Lang js="Architecture" dart="String" py="Architecture" code /> | 값 출력이 돌려주는 이름. |
| `aliases` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, …]" code /> | 다른 곳에서 쓰는 표기. Debian과 Go의 표기, Windows와 Node의 표기, 커널이나 컴파일러의 표기 순입니다. |
| `bits` | <Lang js="number" dart="int" py="int" code /> | `32` 또는 `64`. |
| `family` | <Lang js="string" dart="String" py="str" code /> | 계열: `x86`, `arm`, `riscv`, `power`, `s390`, `mips`, `loongarch`, `sparc` 중 하나. |
| `rare` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="includeRare" dart="includeRare" py="include_rare" code />를 켜야 나오는 아키텍처인지. |

## 함께 보기 {#see-also}

- [`randCpu`](../cpu/rand-cpu) — 이 아키텍처를 쓰는 프로세서.
- [`randOs`](../os/rand-os) — 이 아키텍처용으로 나온 운영체제.
