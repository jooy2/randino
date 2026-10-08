# randDiskSize

저장 장치 용량을 `count`개만큼 돌려줍니다. `512 GB`, `1 TB`, `4 TB`처럼 제품 상자나 사양표가 쓰는 방식 그대로 씁니다. 용량은 모두 드라이브나 휴대폰 저장 공간으로 실제로 팔리는 크기이며, [흔한 정도](#sizes)에 따라 뽑으므로 결과는 대부분 256 GB, 512 GB, 1 TB입니다. 용량은 정수로 떨어지는 [단위](#units)로만 쓰므로 결과에 소수점이 붙지 않습니다.

용량에는 언어가 없으므로 `randDiskSize`는 언어를 받지 않습니다.

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

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `unit` | <Lang js="DiskUnitOption" dart="DiskUnit?" py="DiskUnitOption" code /> | <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> | `MB`, `GB`, `TB`, 또는 용량마다 정수로 떨어지는 가장 큰 단위를 고르는 <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code />. [단위](#units)를 보세요. |
| <Lang js="includeUnit" dart="includeUnit" py="include_unit" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 숫자 뒤에 단위를 씁니다. |
| <Lang js="minSize" dart="minSize" py="min_size" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 돌려줄 가장 작은 용량. [범위](#bounds)를 보세요. |
| <Lang js="maxSize" dart="maxSize" py="max_size" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 돌려줄 가장 큰 용량. [범위](#bounds)를 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 용량 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 용량이 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 용량마다 `DiskSizeDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 용량별 비중 {#sizes}

초기 휴대폰의 16 GB부터 24 TB 하드 디스크까지, 드라이브와 휴대폰 저장 공간에 흔히 쓰이는 용량을 모두 담았고 흔한 정도에 비례해 뽑습니다. 비중은 용량이 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다.

| 용량                                     |        비중 |
| ---------------------------------------- | ----------: |
| 512 GB, 1 TB                             |    각 15.8% |
| 256 GB                                   |       14.1% |
| 2 TB                                     |        8.8% |
| 128 GB, 500 GB                           |     각 7.0% |
| 4 TB                                     |        5.3% |
| 64 GB                                    |        3.5% |
| 240 GB, 250 GB, 480 GB, 8 TB             |     각 2.6% |
| 32 GB, 120 GB, 3 TB, 6 TB                |     각 1.8% |
| 16 GB, 10 TB, 12 TB                      |     각 0.9% |
| 14 TB, 16 TB, 18 TB, 20 TB, 22 TB, 24 TB | 합쳐서 2.3% |

플래시와 하드 디스크가 팔리는 용량을 모두 넣었습니다. 플래시는 128, 256, 512 GB, 그 옆의 하드 디스크는 250, 500 GB이고, 초기 SATA SSD의 120, 240, 480 GB도 들어 있습니다. 기기에 어떤 종류의 드라이브가 들어 있는지는 [`randDiskType`](./rand-disk-type)이 정합니다.

## 단위 {#units}

드라이브는 10의 거듭제곱으로 팔리므로 여기서 1 TB는 1000 GB입니다. 제품 상자와 사양표가 세는 방식이며, 운영체제는 같은 드라이브를 조금 작게 보여 줍니다. <Lang js="'auto'" dart="unit을 null로" py="&quot;auto&quot;" code /> 두면 용량마다 정수로 떨어지는 가장 큰 단위로 씁니다. 2 TB는 `2 TB`로, 512 GB는 `512 GB`로 씁니다. 단위를 정하면 그 단위로 정수가 되는 용량만 고릅니다. 그래서 `TB`는 500 GB 드라이브를 `0.5 TB`로 쓰지 않고 아예 빼며, `GB`는 모든 용량을 써서 2 TB를 `2000 GB`로 적습니다.

<Lang js="includeUnit: false" dart="includeUnit: false" py="include_unit=False" code />를 주면 숫자만 씁니다. 단위가 없으면 `2`와 `512`가 같은 단위인지 알 수 없으므로, 단위 없이 쓸 때는 다른 단위를 정하지 않는 한 모두 GB로 씁니다.

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

## 범위 {#bounds}

<Lang js="minSize" dart="minSize" py="min_size" code />와 <Lang js="maxSize" dart="maxSize" py="max_size" code />는 그 사이의 용량만 고르고, 양 끝도 범위에 들어갑니다. 정한 단위로 읽고, 단위를 정하지 않았으면 GB로 읽습니다. 그래서 <Lang js="minSize: 1000" dart="minSize: 1000" py="min_size=1000" code />는 1 TB 이상이고, <Lang js="unit: 'TB', minSize: 8" dart="unit: DiskUnit.tb, minSize: 8" py="unit=&quot;TB&quot;, min_size=8" code />는 8 TB 이상입니다.

범위 안에 실제 용량이 없으면 아무도 팔지 않는 크기를 만들어 내지 않고 빈 결과를 돌려주며, 범위의 앞뒤가 바뀌면 <Lang js="maxSize" dart="maxSize" py="max_size" code />를 남깁니다.

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

## 상세 출력 {#the-detail-output}

상세 출력에는 숫자와 단위가 따로 들어 있고 같은 용량을 바이트로도 담고 있어서, 어떤 단위로 썼든 비교하고 정렬할 수 있습니다.

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

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randDiskSize`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_disk_size(output="detail")
# [DiskSizeDetail(size='1 TB', value=1, unit='TB', bytes=1000000000000)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `size` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `value` | <Lang js="number" dart="int" py="int" code /> | 쓴 숫자: `1`. |
| `unit` | `DiskUnit` | `MB`, `GB`, `TB` 중 하나. |
| `bytes` | <Lang js="number" dart="int" py="int" code /> | 같은 용량을 10의 거듭제곱으로 센 바이트 수. 1 TB는 `1000000000000`입니다. |

## 함께 보기 {#see-also}

- [`randDiskType`](./rand-disk-type) — 그 용량이 속한 드라이브의 종류.
- [`randRam`](../ram/rand-ram) — 2의 거듭제곱으로 세는 메모리 용량.
