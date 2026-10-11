# randArchitecture

Generates processor architectures and returns `count` of them, by the name a download page most often lists them under: `x86_64`, `arm64`, `x86`, `armv7`. Nearly every machine runs one of these four, so they are all a draw returns until [`includeRare`](#rare) adds the architectures few machines run, and those come up rarely even then. [`platform`](#platforms) keeps to the architectures of desktops or of phones, [`naming`](#naming) writes Debian's, Go's or the kernel's names instead, and [`output: 'detail'`](#the-detail-output) reports every other name each one goes by.

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
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop` for a desktop, a laptop or a server, `mobile` for a phone or a tablet. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws from both. See [platforms](#platforms). |
| <Lang js="includeRare" dart="includeRare" py="include_rare" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Draw the architectures few machines run as well, rarely. See [rare architectures](#rare). |
| `naming` | <Lang js="ArchitectureNaming" dart="ArchitectureNaming" py="ArchitectureNaming" code /> | <Lang js="'common'" dart="ArchitectureNaming.common" py="&quot;common&quot;" code /> | Whose names to write: the common ones, Debian's, Go's or the kernel's. See [names](#naming). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many architectures to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same architecture twice. Returns fewer than `count` once they run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or an `ArchitectureDetail` per architecture. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## How often each one comes up {#shares}

The shares are written by hand in the order the architectures are common in, not measured from any one survey. They differ by platform: a desktop or a laptop is mostly 64-bit x86, with Apple's and Qualcomm's Arm laptops after it, and a phone or a tablet is nearly always 64-bit Arm. The 32-bit two are what is left of the older machines.

| Architecture | Bits | `desktop` | `mobile` | Desktop, with <Lang js="includeRare" dart="includeRare" py="include_rare" code /> |
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

## Platforms {#platforms}

A draw picks the platform first, so <Lang js="platform: 'all'" dart="a null platform" py="platform=&quot;all&quot;" code /> is half desktops and half phones, and then an architecture by its share on that platform. `platform` keeps to one of the two. A phone is never `x86_64` here, and never one of the rare architectures.

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

## Names {#naming}

Each architecture is written by the name a download page most often lists it under. That is not always what a system or a toolchain writes: Debian packages `x86_64` as `amd64`, Go builds `x86` as `386`, and Linux's `uname -m` prints `aarch64` for `arm64`. `naming` writes one of those instead:

| `common`      | `debian`   | `go`       | `kernel`      | Also written |
| ------------- | ---------- | ---------- | ------------- | ------------ |
| `x86_64`      | `amd64`    | `amd64`    | `x86_64`      | `x64`        |
| `arm64`       | `arm64`    | `arm64`    | `aarch64`     | —            |
| `x86`         | `i386`     | `386`      | `i686`        | `ia32`       |
| `armv7`       | `armhf`    | `arm`      | `armv7l`      | —            |
| `riscv64`     | `riscv64`  | `riscv64`  | `riscv64`     | —            |
| `ppc64le`     | `ppc64el`  | `ppc64le`  | `ppc64le`     | —            |
| `s390x`       | `s390x`    | `s390x`    | `s390x`       | —            |
| `mips64`      | `mips64el` | `mips64le` | `mips64`      | —            |
| `loongarch64` | `loong64`  | `loong64`  | `loongarch64` | —            |
| `sparc64`     | `sparc64`  | `sparc64`  | `sparc64`     | `sparcv9`    |

`mips64` is written little-endian for Debian and Go, the way Debian's only 64-bit MIPS port and the Loongson machines most of them are run. Whatever the naming, the detail's `code` is the common name, and its `aliases` every other name the architecture goes by, the common one among them.

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

## Rare architectures {#rare}

<Lang js="includeRare" dart="includeRare" py="include_rare" code /> adds six architectures few machines run: RISC-V, POWER in its little-endian form, IBM Z, 64-bit MIPS, LoongArch and SPARC. They are a desktop's alone — a workstation or a server is not a phone — and each is a desktop draw in about a hundred and thirty, so a sample of fifty usually has none or one of them, and the four common ones keep their proportions beside them.

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

## The detail output {#the-detail-output}

The detail carries every name an architecture goes by, its width, the line it belongs to and the platform it was drawn for, so a result can be stored by its common name and written the way Debian, Windows or Go expects it.

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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randArchitecture`.

:::

::: lang py

```python
rand_architecture(output="detail")
# [ArchitectureDetail(architecture='x86_64', code='x86_64', aliases=('amd64', 'x64'), bits=64,
#                     family='x86', rare=False, platform='desktop')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `architecture` | <Lang js="string" dart="String" py="str" code /> | The architecture, as the value form returns it, in the naming asked for. |
| `code` | <Lang js="Architecture" dart="String" py="Architecture" code /> | The architecture by its common name, whatever the naming: `x86_64`. |
| `aliases` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, …]" code /> | Every other name it goes by, the common one first when it is not the one written, then Debian's and Go's, Windows' and Node's, and the kernel's or the compiler's. |
| `bits` | <Lang js="number" dart="int" py="int" code /> | `32` or `64`. |
| `family` | <Lang js="string" dart="String" py="str" code /> | The line it belongs to: `x86`, `arm`, `riscv`, `power`, `s390`, `mips`, `loongarch` or `sparc`. |
| `rare` | <Lang js="boolean" dart="bool" py="bool" code /> | Whether it is one of the architectures <Lang js="includeRare" dart="includeRare" py="include_rare" code /> adds. |
| `platform` | `SystemPlatform` | The kind of machine it was drawn for. |

## See also

- [`randCpu`](../cpu/rand-cpu) — a processor that runs it.
- [`randOs`](../os/rand-os) — an operating system built for it.
