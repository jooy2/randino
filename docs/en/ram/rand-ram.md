# randRam

Generates amounts of memory and returns `count` of them, written the way a spec sheet writes them: `16 GB`, `8 GB`, `512 MB`. Every size is one a phone, a laptop, a desktop or a workstation is really sold with, drawn by [how common it is](#sizes), so a sample is mostly 8 and 16 GB. A size is only ever written in a [unit](#units) it is a whole number of, so no result carries a decimal point, and it comes with the [kind of memory](#types) it was sold as: `DDR5` in a desktop, `LPDDR5X` in a phone.

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
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop` for a desktop or a laptop, `mobile` for a phone or a tablet. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws from both. See [how often each size comes up](#sizes). |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The earliest year a machine with the memory may have been sold in. See [kinds of memory](#types). |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The latest year a machine with the memory may have been sold in. See [kinds of memory](#types). |
| `unit` | <Lang js="RamUnitOption" dart="RamUnit?" py="RamUnitOption" code /> | <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> | `MB` or `GB`, or <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> for the largest unit each size is a whole number of. See [units](#units). |
| <Lang js="includeUnit" dart="includeUnit" py="include_unit" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the unit after the number. |
| <Lang js="minSize" dart="minSize" py="min_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The smallest size to return. See [bounds](#bounds). |
| <Lang js="maxSize" dart="maxSize" py="max_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The largest size to return. See [bounds](#bounds). |
| <Lang js="includeType" dart="includeType" py="include_type" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Write the kind of memory after the size: `16 GB DDR5`. Left out of a bare number. See [kinds of memory](#types). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many sizes to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same size twice. Returns fewer than `count` once the sizes run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `RamDetail` per size. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## How often each size comes up {#sizes}

Each platform has a pool of its own, holding every amount of memory a machine of that kind is commonly sold with: a desktop or a laptop from 512 MB to the terabyte of a workstation, a phone or a tablet from the 512 MB of an early smartphone to 24 GB. A draw picks the platform first, so <Lang js="platform: 'all'" dart="a null platform" py="platform=&quot;all&quot;" code /> is half of each, then a size in proportion to how common it is there. The shares are written by hand in the order the sizes are common in, not measured from any one survey:

| Size                            |     `desktop` | `mobile` |
| ------------------------------- | ------------: | -------: |
| 8 GB                            |         23.3% |    22.6% |
| 16 GB                           |         25.3% |     8.2% |
| 4 GB                            |          9.7% |    14.4% |
| 32 GB                           |         13.6% |        — |
| 12 GB                           |          1.9% |    16.4% |
| 6 GB                            |          1.0% |    14.4% |
| 2 GB                            |          3.9% |     8.2% |
| 3 GB                            |          1.0% |     8.2% |
| 64 GB                           |          5.8% |        — |
| 1 GB                            |          1.9% |     4.1% |
| 24 GB                           |          3.9% |     1.0% |
| 512 MB                          |          1.0% |     2.1% |
| 48 GB, 128 GB                   |     1.9% each |        — |
| 18 GB                           |          1.0% |     0.5% |
| 36 GB, 96 GB                    |     1.0% each |        — |
| 192 GB, 256 GB, 512 GB, 1024 GB | 0.9% together |        — |

The odd sizes are real too: 3 and 6 GB phones, the 18 and 36 GB of a Mac with an M3 Pro or M3 Max, and the 24 and 48 GB of a laptop with two modules of different sizes.

## Kinds of memory {#types}

Every size comes with the kind of memory it was sold as: the JEDEC standard a desktop's modules or a phone's chips are built to. The detail carries it as `type`, and <Lang js="includeType: true" dart="includeType: true" py="include_type=True" code /> writes it after the size — but not after a bare number, where <Lang js="includeUnit: false" dart="includeUnit: false" py="include_unit=False" code /> has left the unit out, since a kind of memory belongs to a size written as one. A size is drawn first and its kind second, among the kinds a machine of the platform was sold with at that size, each by its weight in the table, so a 16 GB desktop is DDR4 or DDR5 about two times in three:

| Kind      | Platform  | Years       | Sizes         | Weight |
| --------- | --------- | ----------- | ------------- | -----: |
| `DDR`     | `desktop` | 2000 – 2006 | 512 MB – 2 GB |      1 |
| `DDR2`    | `desktop` | 2004 – 2010 | 512 MB – 8 GB |      2 |
| `DDR3`    | `desktop` | 2008 – 2017 | 1 GB – 512 GB |      8 |
| `DDR4`    | `desktop` | 2014 –      | 4 GB – 1 TB   |     34 |
| `DDR5`    | `desktop` | 2021 –      | 8 GB – 1 TB   |     30 |
| `LPDDR3`  | `desktop` | 2013 – 2020 | 4 GB – 16 GB  |      2 |
| `LPDDR4X` | `desktop` | 2018 –      | 4 GB – 32 GB  |      6 |
| `LPDDR5`  | `desktop` | 2021 –      | 8 GB – 512 GB |      8 |
| `LPDDR5X` | `desktop` | 2023 –      | 8 GB – 128 GB |      9 |
| `LPDDR`   | `mobile`  | 2010 – 2011 | 512 MB        |      1 |
| `LPDDR2`  | `mobile`  | 2011 – 2015 | 512 MB – 2 GB |      3 |
| `LPDDR3`  | `mobile`  | 2013 – 2018 | 1 GB – 4 GB   |      6 |
| `LPDDR4`  | `mobile`  | 2015 – 2020 | 2 GB – 6 GB   |     10 |
| `LPDDR4X` | `mobile`  | 2017 –      | 2 GB – 12 GB  |     30 |
| `LPDDR5`  | `mobile`  | 2020 –      | 6 GB – 18 GB  |     25 |
| `LPDDR5X` | `mobile`  | 2022 –      | 8 GB – 24 GB  |     25 |

A laptop built on a phone's memory — a MacBook Air, a Snapdragon laptop — is a `desktop`, with the sizes laptops come in. The years are those machines were sold with the standard new, from the first that shipped with it to the point its successor had replaced it in all but a few, and an open end is a kind still sold. The weights are written by hand in the order the kinds are common in among the machines in use now.

<Lang js="minYear" dart="minYear" py="min_year" code /> and <Lang js="maxYear" dart="maxYear" py="max_year" code /> keep to the kinds sold in that range, both years included, and to the sizes each kind had come in by then: a desktop by the end of 2005 is DDR or DDR2 and never more than 8 GB, and one by the end of 2010 never more than 32 GB, since the 512 GB of DDR3 a workstation took came in 2013. The year of a kind and of each size is the first one a maker's own spec sheet shows — Apple's tech specs, Lenovo's PSREF, HP's QuickSpecs, a phone maker's specification page — and a size no spec sheet showed in a kind is left out of it rather than guessed at. A range no kind was sold in is answered with nothing — the first phone memory the table holds is from 2010 — and a range the wrong way round keeps <Lang js="maxYear" dart="maxYear" py="max_year" code />.

::: lang js

```javascript
randRam({ includeType: true, count: 3 }); // ['8 GB LPDDR4X', '16 GB DDR5', '32 GB DDR4']
randRam({ platform: 'mobile', includeType: true, count: 2 }); // ['12 GB LPDDR5X', '6 GB LPDDR4X']
randRam({ platform: 'desktop', maxYear: 2005, includeType: true }); // ['1 GB DDR']
randRam({ platform: 'mobile', maxYear: 2009 }); // []
```

:::

::: lang dart

```dart
randRam(includeType: true, count: 3); // [8 GB LPDDR4X, 16 GB DDR5, 32 GB DDR4]
randRam(platform: SystemPlatform.mobile, includeType: true, count: 2); // [12 GB LPDDR5X, 6 GB LPDDR4X]
randRam(platform: SystemPlatform.desktop, maxYear: 2005, includeType: true); // [1 GB DDR]
randRam(platform: SystemPlatform.mobile, maxYear: 2009); // []
```

:::

::: lang py

```python
rand_ram(include_type=True, count=3)  # ['8 GB LPDDR4X', '16 GB DDR5', '32 GB DDR4']
rand_ram(platform="mobile", include_type=True, count=2)  # ['12 GB LPDDR5X', '6 GB LPDDR4X']
rand_ram(platform="desktop", max_year=2005, include_type=True)  # ['1 GB DDR']
rand_ram(platform="mobile", max_year=2009)  # []
```

:::

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
// [{ ram: '16 GB', value: 16, unit: 'GB', bytes: 17179869184, type: 'DDR5', platform: 'desktop' }]
```

:::

::: lang dart

```dart
randRamDetails().first; // RamDetail(16 GB, 17179869184, DDR5, desktop)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randRam`.

:::

::: lang py

```python
rand_ram(output="detail")
# [RamDetail(ram='16 GB', value=16, unit='GB', bytes=17179869184, type='DDR5', platform='desktop')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `ram` | <Lang js="string" dart="String" py="str" code /> | The size, as the value form returns it. |
| `value` | <Lang js="number" dart="int" py="int" code /> | The number written: `16`. |
| `unit` | `RamUnit` | `MB` or `GB`. |
| `bytes` | <Lang js="number" dart="int" py="int" code /> | The same size in bytes, counted in powers of two: 16 GB is `17179869184`. |
| `type` | <Lang js="RamType" dart="String" py="RamType" code /> | The kind of memory, one sold at that size on that platform: `DDR5`, `LPDDR5X`. |
| `platform` | `SystemPlatform` | The kind of machine it was drawn for. |

## See also

- [`randDevice`](../device/rand-device) — a phone, a tablet or a laptop to put the memory in.
- [`randDiskType`](../disk/rand-disk-type) and [`randDiskSize`](../disk/rand-disk-size) — the storage beside it.
- [`randOs`](../os/rand-os) — the operating system it runs.
