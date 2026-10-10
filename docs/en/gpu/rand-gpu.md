# randGpu

Generates real graphics processors and returns `count` of them, each by the name its maker gave it: `NVIDIA GeForce RTX 4090`, `AMD Radeon RX 7900 XTX`, `Intel Iris Xe Graphics`, `Qualcomm Adreno 740`. Nothing is invented: every result is a part cards or machines were sold with. [`platform`](#catalog) keeps to the graphics of desktops and laptops or to the GPUs of phones and tablets, and [`minYear` and `maxYear`](#years) to the parts out in those years.

A graphics processor is written by its own name in every language, so `randGpu` takes no `language`.

::: lang js

```javascript
import { randGpu } from 'randino';

randGpu();
// ['NVIDIA GeForce RTX 3060']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randGpu();
// [NVIDIA GeForce RTX 3060]
```

:::

::: lang py

```python
from randino import rand_gpu

rand_gpu()
# ['NVIDIA GeForce RTX 3060']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop` for desktop cards, laptop GPUs and the graphics built into a PC processor, `mobile` for the GPUs of phones and tablets. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws from both. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The earliest year a graphics processor may have come out in. See [years](#years). |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The latest year a graphics processor may have come out in. See [years](#years). |
| `vendor` | <Lang js="GpuVendorOption" dart="Set&lt;String&gt;?" py="GpuVendorOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Which makers, by the name each sells under: one, several, or every one of them. See [makers](#vendors). |
| <Lang js="includeVendor" dart="includeVendor" py="include_vendor" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the maker in front: `NVIDIA GeForce RTX 4090` rather than `GeForce RTX 4090`. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many graphics processors to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same graphics processor twice. Returns fewer than `count` once the catalog runs out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `GpuDetail` per graphics processor. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

::: lang js

```javascript
randGpu({ platform: 'desktop', count: 3 }); // ['AMD Radeon RX 6700 XT', 'NVIDIA GeForce GTX 1060', 'Intel UHD Graphics 630']
randGpu({ platform: 'mobile', count: 3 }); // ['Qualcomm Adreno 740', 'Arm Mali-G78', 'Samsung Xclipse 940']
randGpu({ includeVendor: false, count: 2 }); // ['Radeon RX 7900 XTX', 'GeForce RTX 4060 Laptop GPU']
```

:::

::: lang dart

```dart
randGpu(platform: SystemPlatform.desktop, count: 3); // [AMD Radeon RX 6700 XT, NVIDIA GeForce GTX 1060, Intel UHD Graphics 630]
randGpu(platform: SystemPlatform.mobile, count: 3); // [Qualcomm Adreno 740, Arm Mali-G78, Samsung Xclipse 940]
randGpu(includeVendor: false, count: 2); // [Radeon RX 7900 XTX, GeForce RTX 4060 Laptop GPU]
```

:::

::: lang py

```python
rand_gpu(platform="desktop", count=3)  # ['AMD Radeon RX 6700 XT', 'NVIDIA GeForce GTX 1060', 'Intel UHD Graphics 630']
rand_gpu(platform="mobile", count=3)  # ['Qualcomm Adreno 740', 'Arm Mali-G78', 'Samsung Xclipse 940']
rand_gpu(include_vendor=False, count=2)  # ['Radeon RX 7900 XTX', 'GeForce RTX 4060 Laptop GPU']
```

:::

## What it draws from {#catalog}

179 graphics processors from the GeForce 8800 GTX in 2006 to the parts out by the end of 2025, every one of them as likely as the next once `platform` and the years have narrowed them:

| Platform | Maker | Parts | Years | Lines |
| --- | --- | --: | --- | --- |
| `desktop` | NVIDIA | 71 | 2006 – 2025 | GeForce 8 and 9, GeForce GTX, GeForce RTX, GeForce MX, the Laptop GPUs |
| `desktop` | ATI | 4 | 2008 – 2009 | Radeon HD 4000 and 5000 |
| `desktop` | AMD | 42 | 2010 – 2025 | Radeon HD, R9, RX, RX Vega, and the Radeon graphics built into Ryzen |
| `desktop` | Intel | 21 | 2011 – 2025 | HD, UHD, Iris and Arc |
| `mobile` | Qualcomm | 25 | 2013 – 2025 | Adreno |
| `mobile` | Arm | 13 | 2016 – 2024 | Mali and Immortalis |
| `mobile` | Samsung | 3 | 2022 – 2025 | Xclipse |

A Radeon from before the end of 2010 is written as ATI, because that is the name it was sold under; AMD retired the ATI name with the HD 6000 series. A laptop GPU is written the way NVIDIA writes it, `Laptop GPU` and all, so it is never mistaken for the desktop card of the same number. Apple's GPUs are left out: they carry no name of their own, and a Mac reports its chip's, which [`randCpu`](../cpu/rand-cpu) already writes.

The names are the products' own, and they belong to their owners. randino is not affiliated with any of them.

## Makers {#vendors}

`vendor` keeps to the makers named, written as the [catalog](#catalog) writes them: `NVIDIA`, `ATI`, `AMD`, `Intel`, `Qualcomm`, `Arm` and `Samsung`, the order <Lang js="GPU_VENDORS" dart="gpuVendors" py="GPU_VENDORS" code /> lists them in. A name the catalog does not hold is ignored, and a list of nothing but such names draws every maker. It narrows alongside `platform` and the years, so a maker with no part there is answered with nothing: NVIDIA has no phone GPU here.

::: lang js

```javascript
randGpu({ vendor: 'NVIDIA', count: 2 }); // ['NVIDIA GeForce RTX 4070', 'NVIDIA GeForce GTX 1650']
randGpu({ vendor: ['AMD', 'ATI'], maxYear: 2010 }); // ['ATI Radeon HD 4870']
randGpu({ vendor: 'NVIDIA', platform: 'mobile' }); // []
```

:::

::: lang dart

```dart
randGpu(vendor: {'NVIDIA'}, count: 2); // [NVIDIA GeForce RTX 4070, NVIDIA GeForce GTX 1650]
randGpu(vendor: {'AMD', 'ATI'}, maxYear: 2010); // [ATI Radeon HD 4870]
randGpu(vendor: {'NVIDIA'}, platform: SystemPlatform.mobile); // []
```

The makers are strings rather than an enum, because they are names: `{'NVIDIA'}`, matched exactly.

:::

::: lang py

```python
rand_gpu(vendor="NVIDIA", count=2)  # ['NVIDIA GeForce RTX 4070', 'NVIDIA GeForce GTX 1650']
rand_gpu(vendor=("AMD", "ATI"), max_year=2010)  # ['ATI Radeon HD 4870']
rand_gpu(vendor="NVIDIA", platform="mobile")  # []
```

:::

## Years {#years}

The year of a graphics processor is the year the first cards or machines with it went on sale. <Lang js="minYear" dart="minYear" py="min_year" code /> and <Lang js="maxYear" dart="maxYear" py="max_year" code /> keep to the parts out in that range, both years included. A range nothing came out in is answered with nothing, and a range the wrong way round keeps <Lang js="maxYear" dart="maxYear" py="max_year" code />.

::: lang js

```javascript
randGpu({ platform: 'desktop', maxYear: 2010, count: 3 });
// ['ATI Radeon HD 4870', 'NVIDIA GeForce 8800 GT', 'NVIDIA GeForce GTX 480']

randGpu({ minYear: 2024, count: 2 }); // ['NVIDIA GeForce RTX 5070', 'Qualcomm Adreno 830']
```

:::

::: lang dart

```dart
randGpu(platform: SystemPlatform.desktop, maxYear: 2010, count: 3);
// [ATI Radeon HD 4870, NVIDIA GeForce 8800 GT, NVIDIA GeForce GTX 480]

randGpu(minYear: 2024, count: 2); // [NVIDIA GeForce RTX 5070, Qualcomm Adreno 830]
```

:::

::: lang py

```python
rand_gpu(platform="desktop", max_year=2010, count=3)
# ['ATI Radeon HD 4870', 'NVIDIA GeForce 8800 GT', 'NVIDIA GeForce GTX 480']

rand_gpu(min_year=2024, count=2)  # ['NVIDIA GeForce RTX 5070', 'Qualcomm Adreno 830']
```

:::

## The detail output {#the-detail-output}

The detail carries the maker and the model apart, so a result can be stored in two columns while the whole name is shown.

::: lang js

```javascript
randGpu({ output: 'detail' });
// [{ gpu: 'Intel Arc A770', vendor: 'Intel', model: 'Arc A770', platform: 'desktop', year: 2022 }]
```

:::

::: lang dart

```dart
randGpuDetails().first; // GpuDetail(Intel Arc A770, desktop, 2022)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randGpu`.

:::

::: lang py

```python
rand_gpu(output="detail")
# [GpuDetail(gpu='Intel Arc A770', vendor='Intel', model='Arc A770', platform='desktop', year=2022)]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `gpu` | <Lang js="string" dart="String" py="str" code /> | The graphics processor, as the value form returns it. |
| `vendor` | <Lang js="GpuVendor" dart="String" py="GpuVendor" code /> | Who sells it under their name: `NVIDIA`, `AMD`, `Arm`. |
| `model` | <Lang js="string" dart="String" py="str" code /> | The graphics processor's own name: `GeForce RTX 4090`. |
| `platform` | `SystemPlatform` | `desktop` or `mobile`. |
| `year` | <Lang js="number" dart="int" py="int" code /> | The year the first cards or machines with it went on sale. |

## See also

- [`randCpu`](../cpu/rand-cpu) — the processor beside it.
- [`randDevice`](../device/rand-device) — a phone, a tablet or a laptop the graphics could be in.
