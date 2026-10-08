# randDiskType

기기의 저장 장치 종류를 `count`개만큼 돌려줍니다. `SSD`, `HDD`, `UFS`처럼 사양표가 쓰는 표기 그대로입니다. 종류마다 그 플랫폼에서 [흔한 정도](#kinds)에 따라 뽑으므로 데스크톱은 대부분 SSD, 휴대폰은 대부분 UFS가 나옵니다. [`output: 'detail'`](#the-detail-output)을 주면 표기마다 코드와 전체 이름도 알려 줍니다.

표기는 어느 언어에서나 같으므로 `randDiskType`은 언어를 받지 않습니다.

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

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop`은 노트북을 포함한 PC, `mobile`은 휴대폰과 태블릿입니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 둘 다에서 뽑습니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 표기 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 표기를 두 번 돌려주지 않습니다. 표기가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 결과마다 `DiskTypeDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 종류 {#kinds}

저장 장치 다섯 가지와, 각 종류가 그것을 쓰는 플랫폼에서 나오는 비중입니다. 비중은 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다.

| 코드   | 표기 | 이름                     | `desktop` | `mobile` |
| ------ | ---- | ------------------------ | --------: | -------: |
| `ssd`  | SSD  | Solid State Drive        |       62% |        — |
| `hdd`  | HDD  | Hard Disk Drive          |       33% |        — |
| `sshd` | SSHD | Solid State Hybrid Drive |        3% |        — |
| `emmc` | eMMC | Embedded MultiMediaCard  |        2% |      30% |
| `ufs`  | UFS  | Universal Flash Storage  |         — |      70% |

SSD는 사양표의 저장 장치 항목처럼 SATA와 NVMe를 가리지 않습니다. eMMC는 기판에 붙은 플래시로, 오래된 휴대폰과 저가 태블릿이 쓰고 저가 노트북에도 들어가므로 두 플랫폼 모두에서 나옵니다. <Lang js="platform: 'all'" dart="platform을 null로" py="platform=&quot;all&quot;" code /> 두면 플랫폼을 먼저 고르므로 데스크톱과 모바일의 저장 장치가 거의 반반으로 나옵니다.

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

## 상세 출력 {#the-detail-output}

상세 출력에는 표기 옆에 코드가 함께 들어 있어서, `ssd`로 저장하고 `SSD`로 보여 줄 수 있습니다. 표기가 가리키는 전체 이름도 들어 있습니다.

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

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randDiskType`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_disk_type(output="detail")
# [DiskTypeDetail(disk_type='SSD', code='ssd', name='Solid State Drive', platform='desktop')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| <Lang js="diskType" dart="diskType" py="disk_type" code /> | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 표기. |
| `code` | `DiskType` | `hdd`, `ssd`, `sshd`, `emmc`, `ufs` 중 하나. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 표기의 전체 이름: `Solid State Drive`. |
| `platform` | `SystemPlatform` | 뽑을 때 기준이 된 기기 종류. |

## 함께 보기 {#see-also}

- [`randDevice`](../device/rand-device) — 이 저장 장치가 들어갈 휴대폰, 태블릿, 노트북.
- [`randRam`](../ram/rand-ram) — 함께 들어가는 메모리.
