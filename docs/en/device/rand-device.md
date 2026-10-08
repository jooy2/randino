# randDevice

Generates real phones, tablets and laptops and returns `count` of them, each by the name its maker gave it: `Apple iPhone 15 Pro`, `Samsung Galaxy Tab S9`, `Lenovo ThinkPad X1 Carbon Gen 11`. Nothing is invented: every result is a model that came out, written with the generation or the year its line is told apart by. [`type`](#catalog) keeps to one kind of device, and [`minYear` and `maxYear`](#years) to the models released in those years.

A desktop PC is left out on purpose. It is mostly built from parts, so it has no model name of its own to write.

::: lang js

```javascript
import { randDevice } from 'randino';

randDevice();
// ['Samsung Galaxy S24 Ultra']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randDevice();
// [Samsung Galaxy S24 Ultra]
```

:::

::: lang py

```python
from randino import rand_device

rand_device()
# ['Samsung Galaxy S24 Ultra']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | <Lang js="DeviceTypeOption" dart="Set&lt;DeviceType&gt;?" py="DeviceTypeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `phone`, `tablet` or `laptop`, or several of them. See [what it draws from](#catalog). |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The earliest year a device may have been released in. See [years](#years). |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The latest year a device may have been released in. See [years](#years). |
| <Lang js="includeVendor" dart="includeVendor" py="include_vendor" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the maker in front of the model. See [makers and models](#vendor). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many devices to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same device twice. Returns fewer than `count` once the catalog runs out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `DeviceDetail` per device. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

::: lang js

```javascript
randDevice({ type: 'laptop', count: 2 });
// ['Lenovo ThinkPad T14 Gen 3', 'Apple MacBook Air (M2, 2022)']

randDevice({ type: ['phone', 'tablet'], count: 3 });
// ['Google Pixel 8', 'Apple iPad (10th generation)', 'Sony Xperia 1 V']
```

:::

::: lang dart

```dart
randDevice(type: {DeviceType.laptop}, count: 2);
// [Lenovo ThinkPad T14 Gen 3, Apple MacBook Air (M2, 2022)]

randDevice(type: {DeviceType.phone, DeviceType.tablet}, count: 3);
// [Google Pixel 8, Apple iPad (10th generation), Sony Xperia 1 V]
```

A null or empty `type` draws every kind, the way a null enum is every one of them everywhere else in the package.

:::

::: lang py

```python
rand_device(type="laptop", count=2)
# ['Lenovo ThinkPad T14 Gen 3', 'Apple MacBook Air (M2, 2022)']

rand_device(type=("phone", "tablet"), count=3)
# ['Google Pixel 8', 'Apple iPad (10th generation)', 'Sony Xperia 1 V']
```

:::

## What it draws from {#catalog}

459 models from the first iPhone in 2007 to the devices released by the end of 2025, every one of them as likely as the next once `type` and the years have narrowed them:

| Type | Models | Years | Makers |
| --- | --: | --- | --- |
| `phone` | 260 | 2007 – 2025 | Apple, Samsung, Google, Xiaomi, OnePlus, Sony, LG, Huawei, Motorola, Nothing, Nokia, HTC, BlackBerry |
| `tablet` | 99 | 2010 – 2025 | Apple, Samsung, Microsoft, Google, Amazon, Lenovo, Xiaomi, Huawei |
| `laptop` | 100 | 2008 – 2025 | Apple, Microsoft, Dell, Lenovo, HP, ASUS, Samsung, Razer, Google, LG |

A model is written the way its maker writes it. Apple's iPads and Macs carry the identifier Apple gives them, generation and all — `iPad (10th generation)`, `iPad Pro 13-inch (M4)`, `MacBook Air (M2, 2022)` — a ThinkPad its `Gen`, an EliteBook its `G`, and a laptop line that keeps one name across years the year it is told apart by: `ROG Zephyrus G14 (2023)`, `Blade 15 (2020)`. A detachable two-in-one such as the Surface Pro is a tablet, and the Surface Laptop a laptop.

The year is the year the device was first released. A phone launched in one market a few weeks before the rest is dated by that first market, so a Xiaomi or OnePlus flagship launched in China in December is that December's year.

The names are the products' own, and they belong to their owners. randino is not affiliated with any of them.

## Makers and models {#vendor}

The maker goes in front of the model by default, so a result reads the way a spec sheet or an inventory writes it. A model whose name already opens on its maker's — `Xiaomi 14`, `OnePlus 12`, `Nothing Phone (2)` — is never written with the maker twice. <Lang js="includeVendor: false" dart="includeVendor: false" py="include_vendor=False" code /> writes the model alone.

::: lang js

```javascript
randDevice({ type: 'phone', count: 3 }); // ['Apple iPhone 13', 'Xiaomi 14', 'Google Pixel 7a']
randDevice({ type: 'phone', includeVendor: false, count: 3 }); // ['iPhone 13', 'Xiaomi 14', 'Pixel 7a']
```

:::

::: lang dart

```dart
randDevice(type: {DeviceType.phone}, count: 3); // [Apple iPhone 13, Xiaomi 14, Google Pixel 7a]
randDevice(type: {DeviceType.phone}, includeVendor: false, count: 3); // [iPhone 13, Xiaomi 14, Pixel 7a]
```

:::

::: lang py

```python
rand_device(type="phone", count=3)  # ['Apple iPhone 13', 'Xiaomi 14', 'Google Pixel 7a']
rand_device(type="phone", include_vendor=False, count=3)  # ['iPhone 13', 'Xiaomi 14', 'Pixel 7a']
```

:::

## Years {#years}

<Lang js="minYear" dart="minYear" py="min_year" code /> and <Lang js="maxYear" dart="maxYear" py="max_year" code /> keep to the devices released in that range, both years included, so <Lang js="maxYear: 2012" dart="maxYear: 2012" py="max_year=2012" code /> is what was on sale by the end of 2012. A range nothing was released in is answered with nothing rather than with a device from outside it, and a range the wrong way round keeps <Lang js="maxYear" dart="maxYear" py="max_year" code />.

::: lang js

```javascript
randDevice({ type: 'phone', maxYear: 2012, count: 3 });
// ['Apple iPhone 4', 'Samsung Galaxy S III', 'HTC Dream']

randDevice({ type: 'laptop', minYear: 2024, count: 2 });
// ['Apple MacBook Air (13-inch, M4, 2025)', 'Lenovo ThinkPad T14 Gen 5']
```

:::

::: lang dart

```dart
randDevice(type: {DeviceType.phone}, maxYear: 2012, count: 3);
// [Apple iPhone 4, Samsung Galaxy S III, HTC Dream]

randDevice(type: {DeviceType.laptop}, minYear: 2024, count: 2);
// [Apple MacBook Air (13-inch, M4, 2025), Lenovo ThinkPad T14 Gen 5]
```

:::

::: lang py

```python
rand_device(type="phone", max_year=2012, count=3)
# ['Apple iPhone 4', 'Samsung Galaxy S III', 'HTC Dream']

rand_device(type="laptop", min_year=2024, count=2)
# ['Apple MacBook Air (13-inch, M4, 2025)', 'Lenovo ThinkPad T14 Gen 5']
```

:::

The same years on [`randOs`](../os/rand-os#years) draw the systems that were out alongside them, so a sample machine can be put together from one year.

## The detail output {#the-detail-output}

The detail carries the maker and the model apart, so a result can be stored in two columns while the whole name is shown.

::: lang js

```javascript
randDevice({ output: 'detail' });
// [{ device: 'Google Pixel 8', vendor: 'Google', model: 'Pixel 8', type: 'phone', year: 2023 }]
```

:::

::: lang dart

```dart
randDeviceDetails().first; // DeviceDetail(Google Pixel 8, phone, 2023)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randDevice`.

:::

::: lang py

```python
rand_device(output="detail")
# [DeviceDetail(device='Google Pixel 8', vendor='Google', model='Pixel 8', type='phone', year=2023)]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `device` | <Lang js="string" dart="String" py="str" code /> | The device, as the value form returns it. |
| `vendor` | <Lang js="string" dart="String" py="str" code /> | Who makes it: `Apple`, `Samsung`, `Lenovo`. |
| `model` | <Lang js="string" dart="String" py="str" code /> | The model's own name: `Galaxy S24 Ultra`. |
| `type` | `DeviceType` | `phone`, `tablet` or `laptop`. |
| `year` | <Lang js="number" dart="int" py="int" code /> | The year the device was released. |

## See also

- [`randOs`](../os/rand-os) — an operating system to run on it, from the same years.
