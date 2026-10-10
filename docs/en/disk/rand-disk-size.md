# randDiskSize

Generates drive capacities and returns `count` of them, written the way a box or a spec sheet writes them: `512 GB`, `1 TB`, `4 TB`. Every size is one a drive or a phone's storage is really sold with, drawn by [how common it is](#sizes), so a sample is mostly 256 GB, 512 GB and 1 TB. A size is only ever written in a [unit](#units) it is a whole number of, so no result carries a decimal point.

A size has no language, so `randDiskSize` takes none.

::: lang js

```javascript
import { randDiskSize } from 'randino';

randDiskSize();
// ['512 GB']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randDiskSize();
// [512 GB]
```

:::

::: lang py

```python
from randino import rand_disk_size

rand_disk_size()
# ['512 GB']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `unit` | <Lang js="DiskUnitOption" dart="DiskUnit?" py="DiskUnitOption" code /> | <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> | `MB`, `GB` or `TB`, or <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> for the largest unit each size is a whole number of. See [units](#units). |
| <Lang js="includeUnit" dart="includeUnit" py="include_unit" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the unit after the number. |
| <Lang js="minSize" dart="minSize" py="min_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The smallest size to return. See [bounds](#bounds). |
| <Lang js="maxSize" dart="maxSize" py="max_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The largest size to return. See [bounds](#bounds). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many sizes to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same size twice. Returns fewer than `count` once the sizes run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `DiskSizeDetail` per size. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## How often each size comes up {#sizes}

The pool holds every capacity a drive or a phone's storage is commonly sold with, from the 16 GB of an early phone to a 24 TB hard disk, and each one comes up in proportion to how common it is. The shares are written by hand in the order the sizes are common in, not measured from any one survey:

| Size                                     |         Share |
| ---------------------------------------- | ------------: |
| 512 GB, 1 TB                             |    15.8% each |
| 256 GB                                   |         14.1% |
| 2 TB                                     |          8.8% |
| 128 GB, 500 GB                           |     7.0% each |
| 4 TB                                     |          5.3% |
| 64 GB                                    |          3.5% |
| 240 GB, 250 GB, 480 GB, 8 TB             |     2.6% each |
| 32 GB, 120 GB, 3 TB, 6 TB                |     1.8% each |
| 16 GB, 10 TB, 12 TB                      |     0.9% each |
| 14 TB, 16 TB, 18 TB, 20 TB, 22 TB, 24 TB | 2.3% together |

The sizes a flash drive and a hard disk are each sold in are both there: 128, 256 and 512 GB for flash, 250 and 500 GB for the hard disks beside it, and the 120, 240 and 480 GB of the first SATA SSDs. Which kind of drive a machine has is [`randDiskType`](./rand-disk-type)'s to say.

## Units {#units}

A drive is sold in powers of ten, so a terabyte here is 1000 gigabytes, the way the box and the spec sheet count it — an operating system reports the same drive as a little less. Left to <Lang js="'auto'" dart="a null unit" py="&quot;auto&quot;" code />, each size is written in the largest unit it is a whole number of: `2 TB`, but `512 GB`. A unit you name keeps to the sizes that are a whole number of it, so `TB` leaves a 500 GB drive out rather than writing `0.5 TB`, and `GB` writes every size, 2 TB as `2000 GB`.

<Lang js="includeUnit: false" dart="includeUnit: false" py="include_unit=False" code /> writes the number alone. Without a unit beside it a bare `2` and a bare `512` could not be told apart, so a size written bare is in gigabytes unless you name another unit.

::: lang js

```javascript
randDiskSize({ count: 3 }); // ['1 TB', '256 GB', '2 TB']
randDiskSize({ unit: 'GB', count: 2 }); // ['1000 GB', '512 GB']
randDiskSize({ unit: 'TB', count: 2 }); // ['4 TB', '1 TB']
randDiskSize({ includeUnit: false, count: 3 }); // ['512', '2000', '256']
```

:::

::: lang dart

```dart
randDiskSize(count: 3); // [1 TB, 256 GB, 2 TB]
randDiskSize(unit: DiskUnit.gb, count: 2); // [1000 GB, 512 GB]
randDiskSize(unit: DiskUnit.tb, count: 2); // [4 TB, 1 TB]
randDiskSize(includeUnit: false, count: 3); // [512, 2000, 256]
```

:::

::: lang py

```python
rand_disk_size(count=3)  # ['1 TB', '256 GB', '2 TB']
rand_disk_size(unit="GB", count=2)  # ['1000 GB', '512 GB']
rand_disk_size(unit="TB", count=2)  # ['4 TB', '1 TB']
rand_disk_size(include_unit=False, count=3)  # ['512', '2000', '256']
```

:::

## Bounds {#bounds}

<Lang js="minSize" dart="minSize" py="min_size" code /> and <Lang js="maxSize" dart="maxSize" py="max_size" code /> keep to the sizes between them, both ends included. They are read in the unit you name, and in gigabytes when the unit is left to fit, so <Lang js="minSize: 1000" dart="minSize: 1000" py="min_size=1000" code /> is 1 TB and up while <Lang js="unit: 'TB', minSize: 8" dart="unit: DiskUnit.tb, minSize: 8" py="unit=&quot;TB&quot;, min_size=8" code /> is 8 TB and up. A bound need not be whole: <Lang js="unit: 'TB', minSize: 1.5" dart="unit: DiskUnit.tb, minSize: 1.5" py="unit=&quot;TB&quot;, min_size=1.5" code /> is 2 TB and up.

A range no real size is inside is answered with nothing rather than with a size nobody sells, and a range the wrong way round keeps <Lang js="maxSize" dart="maxSize" py="max_size" code />.

::: lang js

```javascript
randDiskSize({ minSize: 256, maxSize: 1000, count: 3 }); // ['512 GB', '1 TB', '256 GB']
randDiskSize({ unit: 'TB', minSize: 8, count: 2 }); // ['12 TB', '8 TB']
randDiskSize({ minSize: 600, maxSize: 900 }); // []
```

:::

::: lang dart

```dart
randDiskSize(minSize: 256, maxSize: 1000, count: 3); // [512 GB, 1 TB, 256 GB]
randDiskSize(unit: DiskUnit.tb, minSize: 8, count: 2); // [12 TB, 8 TB]
randDiskSize(minSize: 600, maxSize: 900); // []
```

:::

::: lang py

```python
rand_disk_size(min_size=256, max_size=1000, count=3)  # ['512 GB', '1 TB', '256 GB']
rand_disk_size(unit="TB", min_size=8, count=2)  # ['12 TB', '8 TB']
rand_disk_size(min_size=600, max_size=900)  # []
```

:::

## The detail output {#the-detail-output}

The detail carries the number and the unit apart, and the same size in bytes, so a result can be compared and sorted whatever unit it was written in.

::: lang js

```javascript
randDiskSize({ output: 'detail' });
// [{ size: '1 TB', value: 1, unit: 'TB', bytes: 1000000000000 }]
```

:::

::: lang dart

```dart
randDiskSizeDetails().first; // DiskSizeDetail(1 TB, 1000000000000)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randDiskSize`.

:::

::: lang py

```python
rand_disk_size(output="detail")
# [DiskSizeDetail(size='1 TB', value=1, unit='TB', bytes=1000000000000)]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `size` | <Lang js="string" dart="String" py="str" code /> | The size, as the value form returns it. |
| `value` | <Lang js="number" dart="int" py="int" code /> | The number written: `1`. |
| `unit` | `DiskUnit` | `MB`, `GB` or `TB`. |
| `bytes` | <Lang js="number" dart="int" py="int" code /> | The same size in bytes, counted in powers of ten: 1 TB is `1000000000000`. |

## See also

- [`randDiskType`](./rand-disk-type) — the kind of drive the size belongs to.
- [`randRam`](../ram/rand-ram) — the memory, counted the other way, in powers of two.
