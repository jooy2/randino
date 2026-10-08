# randDiskType

Generates the kind of storage a machine has and returns `count` of them, written the way a spec sheet labels it: `SSD`, `HDD`, `UFS`. Each kind comes up by [how common it is](#kinds) on the platform it is drawn for, so a desktop is mostly an SSD and a phone mostly UFS. With [`output: 'detail'`](#the-detail-output) it reports the code and the name behind each label.

A label is the same in every language, so `randDiskType` takes none.

::: lang js

```javascript
import { randDiskType } from 'randino';

randDiskType();
// ['SSD']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randDiskType();
// [SSD]
```

:::

::: lang py

```python
from randino import rand_disk_type

rand_disk_type()
# ['SSD']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop` for a PC, a laptop included, `mobile` for a phone or a tablet. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws from both. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many labels to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same label twice. Returns fewer than `count` once the labels run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `DiskTypeDetail` per result. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## The kinds {#kinds}

Five kinds of storage, each with the share it comes up at on the platform that uses it. The shares are written by hand in the order the kinds are common in, not measured from any one survey:

| Code   | Label | Name                     | `desktop` | `mobile` |
| ------ | ----- | ------------------------ | --------: | -------: |
| `ssd`  | SSD   | Solid State Drive        |       62% |        — |
| `hdd`  | HDD   | Hard Disk Drive          |       33% |        — |
| `sshd` | SSHD  | Solid State Hybrid Drive |        3% |        — |
| `emmc` | eMMC  | Embedded MultiMediaCard  |        2% |      30% |
| `ufs`  | UFS   | Universal Flash Storage  |         — |      70% |

An SSD covers flash behind SATA and behind NVMe alike, the way a spec sheet's storage line does. eMMC is soldered flash: it is what older phones and cheap tablets store to, and what a low-cost laptop is built with, so both platforms draw it. With <Lang js="platform: 'all'" dart="a null platform" py="platform=&quot;all&quot;" code /> the platform is picked first, so desktop and mobile storage come up about evenly.

::: lang js

```javascript
randDiskType({ platform: 'desktop', count: 3 }); // ['SSD', 'HDD', 'SSD']
randDiskType({ platform: 'mobile', count: 3 }); // ['UFS', 'eMMC', 'UFS']
randDiskType({ unique: true, count: 10 }); // ['SSD', 'UFS', 'HDD', 'eMMC', 'SSHD']
```

:::

::: lang dart

```dart
randDiskType(platform: SystemPlatform.desktop, count: 3); // [SSD, HDD, SSD]
randDiskType(platform: SystemPlatform.mobile, count: 3); // [UFS, eMMC, UFS]
randDiskType(unique: true, count: 10); // [SSD, UFS, HDD, eMMC, SSHD]
```

:::

::: lang py

```python
rand_disk_type(platform="desktop", count=3)  # ['SSD', 'HDD', 'SSD']
rand_disk_type(platform="mobile", count=3)  # ['UFS', 'eMMC', 'UFS']
rand_disk_type(unique=True, count=10)  # ['SSD', 'UFS', 'HDD', 'eMMC', 'SSHD']
```

:::

## The detail output {#the-detail-output}

The detail carries the code beside the label, so you can store `ssd` and show `SSD`, and the name the label stands for.

::: lang js

```javascript
randDiskType({ output: 'detail' });
// [{ diskType: 'SSD', code: 'ssd', name: 'Solid State Drive', platform: 'desktop' }]
```

:::

::: lang dart

```dart
randDiskTypeDetails().first; // DiskTypeDetail(SSD, desktop)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randDiskType`.

:::

::: lang py

```python
rand_disk_type(output="detail")
# [DiskTypeDetail(disk_type='SSD', code='ssd', name='Solid State Drive', platform='desktop')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| <Lang js="diskType" dart="diskType" py="disk_type" code /> | <Lang js="string" dart="String" py="str" code /> | The label, as the value form returns it. |
| `code` | `DiskType` | `hdd`, `ssd`, `sshd`, `emmc` or `ufs`. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The label written out: `Solid State Drive`. |
| `platform` | `SystemPlatform` | The kind of machine it was drawn for. |

## See also

- [`randDevice`](../device/rand-device) — a phone, a tablet or a laptop to put the storage in.
- [`randRam`](../ram/rand-ram) — the memory beside it.
