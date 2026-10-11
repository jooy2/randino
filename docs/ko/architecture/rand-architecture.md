# randArchitecture

프로세서 아키텍처를 `count`개만큼 돌려줍니다. `x86_64`, `arm64`, `x86`, `armv7`처럼 다운로드 페이지가 가장 흔히 쓰는 이름 그대로입니다. 거의 모든 기기가 이 넷 중 하나를 쓰므로 기본으로는 이 넷만 나오고, [`includeRare`](#rare)를 켜면 쓰는 기기가 적은 아키텍처가 더해지지만 그때도 드물게 나옵니다. [`platform`](#platforms)으로 데스크톱이나 휴대폰의 아키텍처만 고를 수 있고, [`naming`](#naming)을 주면 Debian, Go, 커널이 쓰는 이름으로 씁니다. [`output: 'detail'`](#the-detail-output)을 주면 아키텍처마다 다른 곳에서 쓰는 이름도 모두 알려 줍니다.

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
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop`은 데스크톱, 노트북, 서버, `mobile`은 휴대폰과 태블릿입니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 둘 다에서 뽑습니다. [플랫폼](#platforms)을 보세요. |
| <Lang js="includeRare" dart="includeRare" py="include_rare" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 쓰는 기기가 적은 아키텍처도 드물게 뽑습니다. [드문 아키텍처](#rare)를 보세요. |
| `naming` | <Lang js="ArchitectureNaming" dart="ArchitectureNaming" py="ArchitectureNaming" code /> | <Lang js="'common'" dart="ArchitectureNaming.common" py="&quot;common&quot;" code /> | 어느 쪽 이름으로 쓸지: 흔한 이름, Debian, Go, 커널. [이름 표기](#naming)를 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 아키텍처 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 아키텍처가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 아키텍처마다 `ArchitectureDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 아키텍처별 비중 {#shares}

비중은 아키텍처가 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다. 비중은 플랫폼마다 다릅니다. 데스크톱과 노트북은 대부분 64비트 x86이고 그 뒤를 Apple과 Qualcomm의 Arm 노트북이 잇습니다. 휴대폰과 태블릿은 거의 다 64비트 Arm입니다. 32비트 둘은 남아 있는 오래된 기기의 몫입니다.

| 아키텍처 | 비트 | `desktop` | `mobile` | 데스크톱, <Lang js="includeRare" dart="includeRare" py="include_rare" code /> 켬 |
| --- | --: | --: | --: | --: |
| `x86_64` | 64 | 80% | — | 76.3% |
| `arm64` | 64 | 14% | 84% | 13.4% |
| `x86` | 32 | 5% | 2% | 4.8% |
| `armv7` | 32 | 1% | 14% | 1.0% |
| `riscv64` | 64 | — | — | 0.8% |
| `ppc64le` | 64 | — | — | 0.8% |
| `s390x` | 64 | — | — | 0.8% |
| `mips64` | 64 | — | — | 0.8% |
| `loongarch64` | 64 | — | — | 0.8% |
| `sparc64` | 64 | — | — | 0.8% |

## 플랫폼 {#platforms}

먼저 플랫폼을 고르므로 <Lang js="platform: 'all'" dart="platform을 null로" py="platform=&quot;all&quot;" code /> 두면 데스크톱과 휴대폰이 반씩 나오고, 그다음 그 플랫폼의 비중대로 아키텍처를 뽑습니다. `platform`을 주면 그 플랫폼만 씁니다. 여기서 휴대폰은 `x86_64`도, 드문 아키텍처도 아닙니다.

::: lang js

```javascript
randArchitecture({ platform: 'mobile', count: 3 }); // ['arm64', 'arm64', 'armv7']
randArchitecture({ platform: 'desktop', count: 3 }); // ['x86_64', 'x86_64', 'arm64']
randArchitecture({ platform: 'mobile', includeRare: true, unique: true, count: 10 });
// ['arm64', 'armv7', 'x86']
```

:::

::: lang dart

```dart
randArchitecture(platform: SystemPlatform.mobile, count: 3); // [arm64, arm64, armv7]
randArchitecture(platform: SystemPlatform.desktop, count: 3); // [x86_64, x86_64, arm64]
randArchitecture(platform: SystemPlatform.mobile, includeRare: true, unique: true, count: 10);
// [arm64, armv7, x86]
```

:::

::: lang py

```python
rand_architecture(platform="mobile", count=3)  # ['arm64', 'arm64', 'armv7']
rand_architecture(platform="desktop", count=3)  # ['x86_64', 'x86_64', 'arm64']
rand_architecture(platform="mobile", include_rare=True, unique=True, count=10)
# ['arm64', 'armv7', 'x86']
```

:::

## 이름 표기 {#naming}

아키텍처 이름은 다운로드 페이지가 가장 흔히 쓰는 이름을 따릅니다. 시스템이나 도구가 쓰는 이름과 늘 같지는 않습니다. Debian은 `x86_64` 패키지를 `amd64`로, Go는 `x86`을 `386`으로 쓰고, 리눅스의 `uname -m`은 `arm64`를 `aarch64`로 보여 줍니다. `naming`을 주면 그쪽 이름으로 씁니다.

| `common`      | `debian`   | `go`       | `kernel`      | 다른 표기 |
| ------------- | ---------- | ---------- | ------------- | --------- |
| `x86_64`      | `amd64`    | `amd64`    | `x86_64`      | `x64`     |
| `arm64`       | `arm64`    | `arm64`    | `aarch64`     | —         |
| `x86`         | `i386`     | `386`      | `i686`        | `ia32`    |
| `armv7`       | `armhf`    | `arm`      | `armv7l`      | —         |
| `riscv64`     | `riscv64`  | `riscv64`  | `riscv64`     | —         |
| `ppc64le`     | `ppc64el`  | `ppc64le`  | `ppc64le`     | —         |
| `s390x`       | `s390x`    | `s390x`    | `s390x`       | —         |
| `mips64`      | `mips64el` | `mips64le` | `mips64`      | —         |
| `loongarch64` | `loong64`  | `loong64`  | `loongarch64` | —         |
| `sparc64`     | `sparc64`  | `sparc64`  | `sparc64`     | `sparcv9` |

`mips64`는 Debian과 Go에서 리틀 엔디언 이름으로 씁니다. Debian의 유일한 64비트 MIPS 포트와, 이 아키텍처를 쓰는 기기 대부분인 Loongson 기기가 리틀 엔디언이기 때문입니다. 어떤 표기를 고르든 상세 출력의 `code`는 흔한 이름이고, `aliases`에는 흔한 이름을 포함해 나머지 이름이 모두 들어 있습니다.

::: lang js

```javascript
randArchitecture({ naming: 'debian', count: 3 }); // ['amd64', 'arm64', 'armhf']
randArchitecture({ naming: 'go', count: 3 }); // ['amd64', '386', 'arm64']
randArchitecture({ naming: 'kernel', platform: 'mobile', count: 2 }); // ['aarch64', 'armv7l']
```

:::

::: lang dart

```dart
randArchitecture(naming: ArchitectureNaming.debian, count: 3); // [amd64, arm64, armhf]
randArchitecture(naming: ArchitectureNaming.go, count: 3); // [amd64, 386, arm64]
randArchitecture(naming: ArchitectureNaming.kernel, platform: SystemPlatform.mobile, count: 2); // [aarch64, armv7l]
```

:::

::: lang py

```python
rand_architecture(naming="debian", count=3)  # ['amd64', 'arm64', 'armhf']
rand_architecture(naming="go", count=3)  # ['amd64', '386', 'arm64']
rand_architecture(naming="kernel", platform="mobile", count=2)  # ['aarch64', 'armv7l']
```

:::

## 드문 아키텍처 {#rare}

<Lang js="includeRare" dart="includeRare" py="include_rare" code />를 켜면 쓰는 기기가 적은 아키텍처 여섯 가지가 더해집니다. RISC-V, 리틀 엔디언 POWER, IBM Z, 64비트 MIPS, LoongArch, SPARC입니다. 워크스테이션과 서버는 휴대폰이 아니므로 이 여섯은 데스크톱에서만 나옵니다. 데스크톱에서 각각 130번에 한 번꼴이라 50개짜리 샘플에는 대개 하나도 없거나 하나쯤 섞이며, 흔한 넷은 그 옆에서 같은 비율을 유지합니다.

::: lang js

```javascript
randArchitecture({ count: 4 }); // ['x86_64', 'arm64', 'arm64', 'armv7']
randArchitecture({ platform: 'desktop', includeRare: true, count: 4 }); // ['x86_64', 'x86_64', 'riscv64', 'arm64']
randArchitecture({ includeRare: true, unique: true, count: 10 });
// ['x86_64', 'arm64', 'x86', 'armv7', 'ppc64le', 's390x', 'riscv64', 'mips64', 'sparc64', 'loongarch64']
```

:::

::: lang dart

```dart
randArchitecture(count: 4); // [x86_64, arm64, arm64, armv7]
randArchitecture(platform: SystemPlatform.desktop, includeRare: true, count: 4); // [x86_64, x86_64, riscv64, arm64]
randArchitecture(includeRare: true, unique: true, count: 10);
// [x86_64, arm64, x86, armv7, ppc64le, s390x, riscv64, mips64, sparc64, loongarch64]
```

:::

::: lang py

```python
rand_architecture(count=4)  # ['x86_64', 'arm64', 'arm64', 'armv7']
rand_architecture(platform="desktop", include_rare=True, count=4)  # ['x86_64', 'x86_64', 'riscv64', 'arm64']
rand_architecture(include_rare=True, unique=True, count=10)
# ['x86_64', 'arm64', 'x86', 'armv7', 'ppc64le', 's390x', 'riscv64', 'mips64', 'sparc64', 'loongarch64']
```

:::

## 상세 출력 {#the-detail-output}

상세 출력에는 아키텍처가 쓰이는 모든 이름, 비트 수, 계열, 뽑을 때 고른 플랫폼이 들어 있습니다. 흔한 이름으로 저장해 두고 Debian, Windows, Go가 기대하는 이름으로 바꿔 쓸 수 있습니다.

::: lang js

```javascript
randArchitecture({ output: 'detail' });
// [{ architecture: 'x86_64', code: 'x86_64', aliases: ['amd64', 'x64'], bits: 64,
//    family: 'x86', rare: false, platform: 'desktop' }]

randArchitecture({ naming: 'debian', output: 'detail' });
// [{ architecture: 'amd64', code: 'x86_64', aliases: ['x86_64', 'x64'], bits: 64,
//    family: 'x86', rare: false, platform: 'desktop' }]
```

:::

::: lang dart

```dart
randArchitectureDetails().first; // ArchitectureDetail(x86_64, x86_64, 64, desktop)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randArchitecture`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_architecture(output="detail")
# [ArchitectureDetail(architecture='x86_64', code='x86_64', aliases=('amd64', 'x64'), bits=64,
#                     family='x86', rare=False, platform='desktop')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `architecture` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 이름. 고른 표기를 따릅니다. |
| `code` | <Lang js="Architecture" dart="String" py="Architecture" code /> | 표기와 상관없는 흔한 이름: `x86_64`. |
| `aliases` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, …]" code /> | 나머지 이름 전부. 쓴 이름이 흔한 이름이 아니면 흔한 이름이 맨 앞에 오고, 그 뒤로 Debian과 Go, Windows와 Node, 커널이나 컴파일러의 표기 순입니다. |
| `bits` | <Lang js="number" dart="int" py="int" code /> | `32` 또는 `64`. |
| `family` | <Lang js="string" dart="String" py="str" code /> | 계열: `x86`, `arm`, `riscv`, `power`, `s390`, `mips`, `loongarch`, `sparc` 중 하나. |
| `rare` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="includeRare" dart="includeRare" py="include_rare" code />를 켜야 나오는 아키텍처인지. |
| `platform` | `SystemPlatform` | 뽑을 때 고른 기기 종류. |

## 함께 보기 {#see-also}

- [`randCpu`](../cpu/rand-cpu) — 이 아키텍처를 쓰는 프로세서.
- [`randOs`](../os/rand-os) — 이 아키텍처용으로 나온 운영체제.
