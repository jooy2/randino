# randRam

메모리 용량을 `count`개만큼 돌려줍니다. `16 GB`, `8 GB`, `512 MB`처럼 사양표가 쓰는 방식 그대로 씁니다. 용량은 모두 휴대폰, 노트북, 데스크톱, 워크스테이션에 실제로 들어가는 크기이며, [흔한 정도](#sizes)에 따라 뽑으므로 결과는 대부분 8 GB와 16 GB입니다. 용량은 정수로 떨어지는 [단위](#units)로만 쓰므로 결과에 소수점이 붙지 않습니다.

용량에는 언어가 없으므로 `randRam`은 언어를 받지 않습니다.

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

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `unit` | <Lang js="RamUnitOption" dart="RamUnit?" py="RamUnitOption" code /> | <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> | `MB`나 `GB`, 또는 용량마다 정수로 떨어지는 가장 큰 단위를 고르는 <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code />. [단위](#units)를 보세요. |
| <Lang js="includeUnit" dart="includeUnit" py="include_unit" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 숫자 뒤에 단위를 씁니다. |
| <Lang js="minSize" dart="minSize" py="min_size" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 돌려줄 가장 작은 용량. [범위](#bounds)를 보세요. |
| <Lang js="maxSize" dart="maxSize" py="max_size" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 돌려줄 가장 큰 용량. [범위](#bounds)를 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 용량 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 용량이 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 용량마다 `RamDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 용량별 비중 {#sizes}

초기 스마트폰의 512 MB부터 워크스테이션의 1 TB까지, 기기에 흔히 들어가는 메모리 용량을 모두 담았고 흔한 정도에 비례해 뽑습니다. 비중은 용량이 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다.

| 용량                            |        비중 |
| ------------------------------- | ----------: |
| 8 GB                            |       20.2% |
| 16 GB                           |       18.5% |
| 4 GB, 32 GB                     |    각 10.1% |
| 12 GB                           |        8.4% |
| 6 GB                            |        6.7% |
| 2 GB, 64 GB                     |     각 4.2% |
| 3 GB, 24 GB                     |     각 3.4% |
| 1 GB                            |        2.5% |
| 512 MB, 48 GB, 128 GB           |     각 1.7% |
| 18 GB, 36 GB, 96 GB             |     각 0.8% |
| 192 GB, 256 GB, 512 GB, 1024 GB | 합쳐서 0.8% |

애매해 보이는 용량도 실제로 있는 값입니다. 3 GB와 6 GB는 휴대폰, 18 GB와 36 GB는 M3 Pro와 M3 Max를 단 Mac, 24 GB와 48 GB는 크기가 다른 모듈 두 개를 꽂은 노트북의 용량입니다.

## 단위 {#units}

메모리는 2의 거듭제곱으로 세므로 여기서 1 GB는 1024 MB입니다. 운영체제가 보여 주는 방식과 같습니다. <Lang js="'auto'" dart="unit을 null로" py="&quot;auto&quot;" code /> 두면 용량마다 정수로 떨어지는 가장 큰 단위로 씁니다. 16 GB는 `16 GB`로, 512 MB는 `512 MB`로 씁니다. 단위를 정하면 그 단위로 정수가 되는 용량만 고릅니다. 그래서 `GB`는 512 MB를 `0.5 GB`로 쓰지 않고 아예 빼며, `MB`는 모든 용량을 써서 16 GB를 `16384 MB`로 적습니다.

<Lang js="includeUnit: false" dart="includeUnit: false" py="include_unit=False" code />를 주면 숫자만 씁니다. 단위가 없으면 `512`와 `16`이 같은 단위인지 알 수 없으므로, 단위 없이 쓸 때는 `MB`를 정하지 않는 한 모두 GB로 씁니다.

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

## 범위 {#bounds}

<Lang js="minSize" dart="minSize" py="min_size" code />와 <Lang js="maxSize" dart="maxSize" py="max_size" code />는 그 사이의 용량만 고르고, 양 끝도 범위에 들어갑니다. 정한 단위로 읽고, 단위를 정하지 않았으면 GB로 읽습니다. 그래서 <Lang js="minSize: 16" dart="minSize: 16" py="min_size=16" code />는 16 GB 이상이고, <Lang js="unit: 'MB', maxSize: 4096" dart="unit: RamUnit.mb, maxSize: 4096" py="unit=&quot;MB&quot;, max_size=4096" code />는 4096 MB 이하입니다.

범위 안에 실제 용량이 없으면 아무도 팔지 않는 크기를 만들어 내지 않고 빈 결과를 돌려줍니다. 범위의 앞뒤가 바뀌면 <Lang js="maxSize" dart="maxSize" py="max_size" code />를 남깁니다. 호출하는 쪽이 대개 지키려는 한계가 그 값이기 때문입니다.

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

## 상세 출력 {#the-detail-output}

상세 출력에는 숫자와 단위가 따로 들어 있고 같은 용량을 바이트로도 담고 있어서, 어떤 단위로 썼든 비교하고 정렬할 수 있습니다.

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

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randRam`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_ram(output="detail")
# [RamDetail(ram='16 GB', value=16, unit='GB', bytes=17179869184)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `ram` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `value` | <Lang js="number" dart="int" py="int" code /> | 쓴 숫자: `16`. |
| `unit` | `RamUnit` | `MB` 또는 `GB`. |
| `bytes` | <Lang js="number" dart="int" py="int" code /> | 같은 용량을 2의 거듭제곱으로 센 바이트 수. 16 GB는 `17179869184`입니다. |

## 함께 보기 {#see-also}

- [`randDevice`](../device/rand-device) — 이 메모리가 들어갈 휴대폰, 태블릿, 노트북.
- [`randOs`](../os/rand-os) — 그 기기에서 돌아가는 운영체제.
