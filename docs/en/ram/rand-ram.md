# randRam

Generates amounts of memory and returns `count` of them, written the way a spec sheet writes them: `16 GB`, `8 GB`, `512 MB`. Every size is one a phone, a laptop, a desktop or a workstation is really sold with, drawn by [how common it is](#sizes), so a sample is mostly 8 and 16 GB. A size is only ever written in a [unit](#units) it is a whole number of, so no result carries a decimal point.

A size has no language, so `randRam` takes none.

::: lang js

```javascript
import { randRam } from 'randino';

randRam();
// ['16 GB']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randRam();
// [16 GB]
```

:::

::: lang py

```python
from randino import rand_ram

rand_ram()
# ['16 GB']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `unit` | <Lang js="RamUnitOption" dart="RamUnit?" py="RamUnitOption" code /> | <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> | `MB` or `GB`, or <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> for the largest unit each size is a whole number of. See [units](#units). |
| <Lang js="includeUnit" dart="includeUnit" py="include_unit" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the unit after the number. |
| <Lang js="minSize" dart="minSize" py="min_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The smallest size to return. See [bounds](#bounds). |
| <Lang js="maxSize" dart="maxSize" py="max_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The largest size to return. See [bounds](#bounds). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many sizes to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same size twice. Returns fewer than `count` once the sizes run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `RamDetail` per size. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## How often each size comes up {#sizes}

The pool holds every amount of memory a machine is commonly sold with, from the 512 MB of an early smartphone to the terabyte of a workstation, and each one comes up in proportion to how common it is. The shares are written by hand in the order the sizes are common in, not measured from any one survey:

| Size                            |         Share |
| ------------------------------- | ------------: |
| 8 GB                            |         20.2% |
| 16 GB                           |         18.5% |
| 4 GB, 32 GB                     |    10.1% each |
| 12 GB                           |          8.4% |
| 6 GB                            |          6.7% |
| 2 GB, 64 GB                     |     4.2% each |
| 3 GB, 24 GB                     |     3.4% each |
| 1 GB                            |          2.5% |
| 512 MB, 48 GB, 128 GB           |     1.7% each |
| 18 GB, 36 GB, 96 GB             |     0.8% each |
| 192 GB, 256 GB, 512 GB, 1024 GB | 0.8% together |

The odd sizes are real too: 3 and 6 GB phones, the 18 and 36 GB of a Mac with an M3 Pro or M3 Max, and the 24 and 48 GB of a laptop with two modules of different sizes.

## Units {#units}

Memory counts in powers of two, so a gigabyte here is 1024 megabytes, the way an operating system reports it. Left to <Lang js="'auto'" dart="a null unit" py="&quot;auto&quot;" code />, each size is written in the largest unit it is a whole number of: `16 GB`, but `512 MB`. A unit you name keeps to the sizes that are a whole number of it, so `GB` leaves 512 MB out rather than writing `0.5 GB`, and `MB` writes every size, 16 GB as `16384 MB`.

<Lang js="includeUnit: false" dart="includeUnit: false" py="include_unit=False" code /> writes the number alone. Without a unit beside it a bare `512` and a bare `16` could not be told apart, so a size written bare is in gigabytes unless you name `MB`.

::: lang js

```javascript
randRam({ count: 3 }); // ['8 GB', '16 GB', '4 GB']
randRam({ unit: 'MB', count: 2 }); // ['8192 MB', '16384 MB']
randRam({ includeUnit: false, count: 3 }); // ['16', '8', '32']
```

:::

::: lang dart

```dart
randRam(count: 3); // [8 GB, 16 GB, 4 GB]
randRam(unit: RamUnit.mb, count: 2); // [8192 MB, 16384 MB]
randRam(includeUnit: false, count: 3); // [16, 8, 32]
```

:::

::: lang py

```python
rand_ram(count=3)  # ['8 GB', '16 GB', '4 GB']
rand_ram(unit="MB", count=2)  # ['8192 MB', '16384 MB']
rand_ram(include_unit=False, count=3)  # ['16', '8', '32']
```

:::

## Bounds {#bounds}

<Lang js="minSize" dart="minSize" py="min_size" code /> and <Lang js="maxSize" dart="maxSize" py="max_size" code /> keep to the sizes between them, both ends included. They are read in the unit you name, and in gigabytes when the unit is left to fit, so <Lang js="minSize: 16" dart="minSize: 16" py="min_size=16" code /> is 16 GB and up while <Lang js="unit: 'MB', maxSize: 4096" dart="unit: RamUnit.mb, maxSize: 4096" py="unit=&quot;MB&quot;, max_size=4096" code /> is 4096 MB and down. A bound need not be whole: <Lang js="maxSize: 0.5" dart="maxSize: 0.5" py="max_size=0.5" code /> is 512 MB and down.

A range no real size is inside is answered with nothing rather than with a size nobody sells, and a range the wrong way round keeps <Lang js="maxSize" dart="maxSize" py="max_size" code />, the bound a caller is usually holding to.

::: lang js

```javascript
randRam({ minSize: 16, maxSize: 64, count: 3 }); // ['32 GB', '16 GB', '64 GB']
randRam({ unit: 'MB', maxSize: 4096, count: 2 }); // ['2048 MB', '4096 MB']
randRam({ minSize: 5, maxSize: 5 }); // []
```

:::

::: lang dart

```dart
randRam(minSize: 16, maxSize: 64, count: 3); // [32 GB, 16 GB, 64 GB]
randRam(unit: RamUnit.mb, maxSize: 4096, count: 2); // [2048 MB, 4096 MB]
randRam(minSize: 5, maxSize: 5); // []
```

:::

::: lang py

```python
rand_ram(min_size=16, max_size=64, count=3)  # ['32 GB', '16 GB', '64 GB']
rand_ram(unit="MB", max_size=4096, count=2)  # ['2048 MB', '4096 MB']
rand_ram(min_size=5, max_size=5)  # []
```

:::

## The detail output {#the-detail-output}

The detail carries the number and the unit apart, and the same size in bytes, so a result can be compared and sorted whatever unit it was written in.

::: lang js

```javascript
randRam({ output: 'detail' });
// [{ ram: '16 GB', value: 16, unit: 'GB', bytes: 17179869184 }]
```

:::

::: lang dart

```dart
randRamDetails().first; // RamDetail(16 GB, 17179869184)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randRam`.

:::

::: lang py

```python
rand_ram(output="detail")
# [RamDetail(ram='16 GB', value=16, unit='GB', bytes=17179869184)]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `ram` | <Lang js="string" dart="String" py="str" code /> | The size, as the value form returns it. |
| `value` | <Lang js="number" dart="int" py="int" code /> | The number written: `16`. |
| `unit` | `RamUnit` | `MB` or `GB`. |
| `bytes` | <Lang js="number" dart="int" py="int" code /> | The same size in bytes, counted in powers of two: 16 GB is `17179869184`. |

## See also

- [`randDevice`](../device/rand-device) — a phone, a tablet or a laptop to put the memory in.
- [`randDiskType`](../disk/rand-disk-type) and [`randDiskSize`](../disk/rand-disk-size) — the storage beside it.
- [`randOs`](../os/rand-os) — the operating system it runs.
