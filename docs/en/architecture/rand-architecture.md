# randArchitecture

Generates processor architectures and returns `count` of them, by the name a download page most often lists them under: `x86_64`, `arm64`, `x86`, `armv7`. Nearly every machine runs one of these four, so they are all a draw returns until [`includeRare`](#rare) adds the architectures few machines run, and those come up rarely even then. With [`output: 'detail'`](#the-detail-output) it reports the other names each one goes by.

An architecture is written the same in every language, so `randArchitecture` takes none.

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

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| <Lang js="includeRare" dart="includeRare" py="include_rare" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Draw the architectures few machines run as well, rarely. See [rare architectures](#rare). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many architectures to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same architecture twice. Returns fewer than `count` once they run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or an `ArchitectureDetail` per architecture. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## How often each one comes up {#shares}

The shares are written by hand in the order the architectures are common in, not measured from any one survey: 64-bit x86 and Arm are nearly every desktop, laptop, phone and server, and the 32-bit two what is left of the older machines.

| Architecture | Also written | Bits | Share | With <Lang js="includeRare" dart="includeRare" py="include_rare" code /> |
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

Each architecture is written by the name a download page most often lists it under. That is not always what a system reports: Linux's `uname -m` prints `aarch64` for `arm64`, `i686` for `x86` and `armv7l` for `armv7`, and Debian and Windows have names of their own. The other names are in the [detail](#the-detail-output), so a result can be turned into whichever one a system expects.

## Rare architectures {#rare}

<Lang js="includeRare" dart="includeRare" py="include_rare" code /> adds six architectures few machines run: RISC-V, POWER in its little-endian form, IBM Z, 64-bit MIPS, LoongArch and SPARC. Each is a draw in about a hundred and thirty, so a sample of fifty usually has none or one of them, and the four common ones keep their proportions beside them.

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

## The detail output {#the-detail-output}

The detail carries the other names an architecture goes by, its width and the line it belongs to, so a result can be written the way Debian, Windows or Go expects it.

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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randArchitecture`.

:::

::: lang py

```python
rand_architecture(output="detail")
# [ArchitectureDetail(architecture='x86_64', aliases=('amd64', 'x64'), bits=64, family='x86', rare=False)]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `architecture` | <Lang js="Architecture" dart="String" py="Architecture" code /> | The architecture, as the value form returns it. |
| `aliases` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, …]" code /> | The other names it goes by: Debian's and Go's first, then Windows' and Node's, then the kernel's or the compiler's. |
| `bits` | <Lang js="number" dart="int" py="int" code /> | `32` or `64`. |
| `family` | <Lang js="string" dart="String" py="str" code /> | The line it belongs to: `x86`, `arm`, `riscv`, `power`, `s390`, `mips`, `loongarch` or `sparc`. |
| `rare` | <Lang js="boolean" dart="bool" py="bool" code /> | Whether it is one of the architectures <Lang js="includeRare" dart="includeRare" py="include_rare" code /> adds. |

## See also

- [`randCpu`](../cpu/rand-cpu) — a processor that runs it.
- [`randOs`](../os/rand-os) — an operating system built for it.
