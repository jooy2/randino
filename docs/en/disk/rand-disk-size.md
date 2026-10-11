# randDiskSize

Generates drive capacities and returns `count` of them, written the way a box or a spec sheet writes them: `512 GB`, `1 TB`, `4 TB`. Every size is one its [kind of storage](#sizes) is really sold in, so an eMMC chip is never 8 TB, and is drawn by how common it is: a sample is mostly 128 GB to 1 TB. A size is only ever written in a [unit](#units) it is a whole number of, so no result carries a decimal point.

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
| `type` | <Lang js="DiskTypeOption" dart="Set&lt;DiskType&gt;?" py="DiskTypeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | The kinds of storage the sizes are for: `hdd`, `ssd`, `sshd`, `emmc`, `ufs`, one or several. See [kinds and sizes](#sizes). |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop` for a desktop or a laptop, `mobile` for a phone or a tablet. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws from both. See [kinds and sizes](#sizes). |
| `unit` | <Lang js="DiskUnitOption" dart="DiskUnit?" py="DiskUnitOption" code /> | <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> | `MB`, `GB` or `TB`, or <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> for the largest unit each size is a whole number of. See [units](#units). |
| <Lang js="includeUnit" dart="includeUnit" py="include_unit" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the unit after the number. |
| <Lang js="minSize" dart="minSize" py="min_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The smallest size to return. See [bounds](#bounds). |
| <Lang js="maxSize" dart="maxSize" py="max_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The largest size to return. See [bounds](#bounds). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many sizes to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same size twice. Returns fewer than `count` once the sizes run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `DiskSizeDetail` per size. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## Kinds and sizes {#sizes}

Each kind of storage is sold in sizes of its own, so each has a pool of its own: a hard disk is the only kind past 8 TB, an eMMC chip stops at 128 GB, and the 120, 240 and 480 GB of the first SATA SSDs are an SSD's alone. A draw picks the platform first, so <Lang js="platform: 'all'" dart="a null platform" py="platform=&quot;all&quot;" code /> is half of each, then a kind by how common it is there — the shares [`randDiskType`](./rand-disk-type#kinds) draws by — and then a size of that kind by how common it is. The shares are written by hand in the order the sizes are common in, not measured from any one survey:

| Kind   | Platform            | Sizes          | Most often                             |
| ------ | ------------------- | -------------- | -------------------------------------- |
| `ssd`  | `desktop`           | 32 GB – 8 TB   | 512 GB and 1 TB, 22% each; 256 GB, 18% |
| `hdd`  | `desktop`           | 120 GB – 24 TB | 1 TB, 26%; 2 TB, 17%; 500 GB, 14%      |
| `sshd` | `desktop`           | 250 GB – 4 TB  | 1 TB, 43%; 500 GB and 2 TB, 22% each   |
| `emmc` | `desktop`, `mobile` | 16 GB – 128 GB | 32 GB and 64 GB, 33% each              |
| `ufs`  | `mobile`            | 32 GB – 1 TB   | 256 GB, 37%; 128 GB, 30%               |

`type` keeps to the kinds named, and `platform` to the kinds a desktop or a phone uses. They narrow together, so a kind the platform does not use is answered with nothing: there is no hard disk in a phone here. The detail reports which kind and which platform a size was drawn for.

::: lang js

```javascript
randDiskSize({ type: 'emmc', count: 3 }); // ['64 GB', '32 GB', '128 GB']
randDiskSize({ type: ['ssd', 'hdd'], unit: 'TB', minSize: 8 }); // ['16 TB']
randDiskSize({ platform: 'mobile', count: 2 }); // ['256 GB', '128 GB']
randDiskSize({ type: 'hdd', platform: 'mobile' }); // []
```

:::

::: lang dart

```dart
randDiskSize(type: {DiskType.emmc}, count: 3); // [64 GB, 32 GB, 128 GB]
randDiskSize(type: {DiskType.ssd, DiskType.hdd}, unit: DiskUnit.tb, minSize: 8); // [16 TB]
randDiskSize(platform: SystemPlatform.mobile, count: 2); // [256 GB, 128 GB]
randDiskSize(type: {DiskType.hdd}, platform: SystemPlatform.mobile); // []
```

:::

::: lang py

```python
rand_disk_size(type="emmc", count=3)  # ['64 GB', '32 GB', '128 GB']
rand_disk_size(type=("ssd", "hdd"), unit="TB", min_size=8)  # ['16 TB']
rand_disk_size(platform="mobile", count=2)  # ['256 GB', '128 GB']
rand_disk_size(type="hdd", platform="mobile")  # []
```

:::

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
// [{ size: '1 TB', value: 1, unit: 'TB', bytes: 1000000000000, type: 'ssd', platform: 'desktop' }]
```

:::

::: lang dart

```dart
randDiskSizeDetails().first; // DiskSizeDetail(1 TB, 1000000000000, ssd, desktop)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randDiskSize`.

:::

::: lang py

```python
rand_disk_size(output="detail")
# [DiskSizeDetail(size='1 TB', value=1, unit='TB', bytes=1000000000000, type='ssd', platform='desktop')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `size` | <Lang js="string" dart="String" py="str" code /> | The size, as the value form returns it. |
| `value` | <Lang js="number" dart="int" py="int" code /> | The number written: `1`. |
| `unit` | `DiskUnit` | `MB`, `GB` or `TB`. |
| `bytes` | <Lang js="number" dart="int" py="int" code /> | The same size in bytes, counted in powers of ten: 1 TB is `1000000000000`. |
| `type` | `DiskType` | The kind of storage it is a size of: `ssd`, `emmc`. |
| `platform` | `SystemPlatform` | The kind of machine it was drawn for. |

## See also

- [`randDiskType`](./rand-disk-type) — the kind of drive the size belongs to.
- [`randRam`](../ram/rand-ram) — the memory, counted the other way, in powers of two.
