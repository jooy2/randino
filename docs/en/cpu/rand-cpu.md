# randCpu

Generates real processors and returns `count` of them, each by the name its maker gave it: `Intel Core i7-13700K`, `AMD Ryzen 7 7800X3D`, `Apple M3 Pro`, `Qualcomm Snapdragon 8 Gen 3`. Nothing is invented: every result is a part machines were sold with. [`platform`](#catalog) keeps to desktop and laptop processors or to the chips of phones and tablets, and [`minYear` and `maxYear`](#years) to the parts out in those years.

A processor is written by its own name in every language, so `randCpu` takes no `language`.

::: lang js

```javascript
import { randCpu } from 'randino';

randCpu();
// ['Intel Core i7-13700K']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randCpu();
// [Intel Core i7-13700K]
```

:::

::: lang py

```python
from randino import rand_cpu

rand_cpu()
# ['Intel Core i7-13700K']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop` for desktop and laptop processors, `mobile` for the chips of phones and tablets. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws from both. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The earliest year a processor may have come out in. See [years](#years). |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The latest year a processor may have come out in. See [years](#years). |
| <Lang js="includeVendor" dart="includeVendor" py="include_vendor" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the maker in front of the processor: `Intel Core i7-13700K` rather than `Core i7-13700K`. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many processors to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same processor twice. Returns fewer than `count` once the catalog runs out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `CpuDetail` per processor. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

::: lang js

```javascript
randCpu({ platform: 'desktop', count: 3 }); // ['AMD Ryzen 5 5600X', 'Intel Core i5-1135G7', 'Apple M2']
randCpu({ platform: 'mobile', count: 3 }); // ['Qualcomm Snapdragon 8 Gen 3', 'Apple A17 Pro', 'MediaTek Dimensity 9300']
randCpu({ includeVendor: false, count: 2 }); // ['Ryzen 7 7800X3D', 'Snapdragon 865']
```

:::

::: lang dart

```dart
randCpu(platform: SystemPlatform.desktop, count: 3); // [AMD Ryzen 5 5600X, Intel Core i5-1135G7, Apple M2]
randCpu(platform: SystemPlatform.mobile, count: 3); // [Qualcomm Snapdragon 8 Gen 3, Apple A17 Pro, MediaTek Dimensity 9300]
randCpu(includeVendor: false, count: 2); // [Ryzen 7 7800X3D, Snapdragon 865]
```

:::

::: lang py

```python
rand_cpu(platform="desktop", count=3)  # ['AMD Ryzen 5 5600X', 'Intel Core i5-1135G7', 'Apple M2']
rand_cpu(platform="mobile", count=3)  # ['Qualcomm Snapdragon 8 Gen 3', 'Apple A17 Pro', 'MediaTek Dimensity 9300']
rand_cpu(include_vendor=False, count=2)  # ['Ryzen 7 7800X3D', 'Snapdragon 865']
```

:::

## What it draws from {#catalog}

248 processors from the Pentium 4 in 2000 to the parts out by the end of 2025, every one of them as likely as the next once `platform` and the years have narrowed them:

| Platform | Maker | Parts | Years | Lines |
| --- | --- | --: | --- | --- |
| `desktop` | Intel | 82 | 2000 – 2025 | Pentium, Core 2, Core i3 to i9, Core Ultra, Celeron, Atom |
| `desktop` | AMD | 53 | 2003 – 2025 | Athlon 64, Phenom II, FX, A-Series, Ryzen, Ryzen Threadripper, Ryzen AI |
| `desktop` | Apple | 16 | 2020 – 2025 | M1 to M5, with their Pro, Max and Ultra |
| `desktop` | Qualcomm | 4 | 2022 – 2025 | Snapdragon 8cx and Snapdragon X |
| `mobile` | Apple | 25 | 2010 – 2025 | A4 to A19 Pro, the X and Z chips of the iPad included |
| `mobile` | Qualcomm | 32 | 2013 – 2025 | Snapdragon 600 to 8 Elite Gen 5 |
| `mobile` | Samsung | 12 | 2016 – 2025 | Exynos |
| `mobile` | MediaTek | 13 | 2018 – 2025 | Helio and Dimensity |
| `mobile` | Google | 5 | 2021 – 2025 | Tensor to Tensor G5 |
| `mobile` | HiSilicon | 6 | 2017 – 2024 | Kirin |

Each line is represented by the models a spec sheet most often names — the unlocked desktop part, the mainstream laptop part, the flagship and the mid-range chip of a phone line — rather than by every variant its maker sold. A laptop processor counts as `desktop`, the way a laptop runs a desktop operating system.

The names are the products' own, and they belong to their owners. randino is not affiliated with any of them.

## Years {#years}

The year of a processor is the year the first machines with it went on sale. A phone chip announced in one December and shipped in the next is the next year's, and a desktop part the year it reached the shelves. <Lang js="minYear" dart="minYear" py="min_year" code /> and <Lang js="maxYear" dart="maxYear" py="max_year" code /> keep to the processors out in that range, both years included. A range nothing came out in is answered with nothing, and a range the wrong way round keeps <Lang js="maxYear" dart="maxYear" py="max_year" code />.

::: lang js

```javascript
randCpu({ platform: 'desktop', maxYear: 2012, count: 3 });
// ['Intel Core i7-2600K', 'AMD Phenom II X4 940', 'Intel Core 2 Quad Q6600']

randCpu({ platform: 'mobile', minYear: 2024, count: 2 });
// ['Apple A18 Pro', 'Qualcomm Snapdragon 8 Elite']
```

:::

::: lang dart

```dart
randCpu(platform: SystemPlatform.desktop, maxYear: 2012, count: 3);
// [Intel Core i7-2600K, AMD Phenom II X4 940, Intel Core 2 Quad Q6600]

randCpu(platform: SystemPlatform.mobile, minYear: 2024, count: 2);
// [Apple A18 Pro, Qualcomm Snapdragon 8 Elite]
```

:::

::: lang py

```python
rand_cpu(platform="desktop", max_year=2012, count=3)
# ['Intel Core i7-2600K', 'AMD Phenom II X4 940', 'Intel Core 2 Quad Q6600']

rand_cpu(platform="mobile", min_year=2024, count=2)
# ['Apple A18 Pro', 'Qualcomm Snapdragon 8 Elite']
```

:::

## The detail output {#the-detail-output}

The detail carries the maker and the model apart, so a result can be stored in two columns while the whole name is shown.

::: lang js

```javascript
randCpu({ output: 'detail' });
// [{ cpu: 'Apple M3 Pro', vendor: 'Apple', model: 'M3 Pro', platform: 'desktop', year: 2023 }]
```

:::

::: lang dart

```dart
randCpuDetails().first; // CpuDetail(Apple M3 Pro, desktop, 2023)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randCpu`.

:::

::: lang py

```python
rand_cpu(output="detail")
# [CpuDetail(cpu='Apple M3 Pro', vendor='Apple', model='M3 Pro', platform='desktop', year=2023)]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `cpu` | <Lang js="string" dart="String" py="str" code /> | The processor, as the value form returns it. |
| `vendor` | <Lang js="string" dart="String" py="str" code /> | Who makes it: `Intel`, `AMD`, `Apple`. |
| `model` | <Lang js="string" dart="String" py="str" code /> | The processor's own name: `Ryzen 7 7800X3D`. |
| `platform` | `SystemPlatform` | `desktop` or `mobile`. |
| `year` | <Lang js="number" dart="int" py="int" code /> | The year the first machines with it went on sale. |

## See also

- [`randDevice`](../device/rand-device) — a phone, a tablet or a laptop the processor could be in.
- [`randGpu`](../gpu/rand-gpu) — the graphics beside it.
- [`randArchitecture`](../architecture/rand-architecture) — the architecture it runs.
- [`randRam`](../ram/rand-ram) — the memory beside it.
