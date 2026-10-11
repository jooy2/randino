# randRam

메모리 용량을 `count`개만큼 돌려줍니다. `16 GB`, `8 GB`, `512 MB`처럼 사양표가 쓰는 방식 그대로 씁니다. 용량은 모두 휴대폰, 노트북, 데스크톱, 워크스테이션에 실제로 들어가는 크기이며, [흔한 정도](#sizes)에 따라 뽑으므로 결과는 대부분 8 GB와 16 GB입니다. 용량은 정수로 떨어지는 [단위](#units)로만 쓰므로 결과에 소수점이 붙지 않습니다. 용량마다 그 크기로 팔린 [메모리 종류](#types)도 함께 정해집니다. 데스크톱이면 `DDR5`, 휴대폰이면 `LPDDR5X` 같은 식입니다.

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
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop`은 데스크톱과 노트북, `mobile`은 휴대폰과 태블릿입니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 둘 다에서 뽑습니다. [용량별 비중](#sizes)을 보세요. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 그 메모리를 단 기기가 팔린 가장 이른 해. [메모리 종류](#types)를 보세요. |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 그 메모리를 단 기기가 팔린 가장 늦은 해. [메모리 종류](#types)를 보세요. |
| `unit` | <Lang js="RamUnitOption" dart="RamUnit?" py="RamUnitOption" code /> | <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code /> | `MB`나 `GB`, 또는 용량마다 정수로 떨어지는 가장 큰 단위를 고르는 <Lang js="'auto'" dart="null" py="&quot;auto&quot;" code />. [단위](#units)를 보세요. |
| <Lang js="includeUnit" dart="includeUnit" py="include_unit" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 숫자 뒤에 단위를 씁니다. |
| <Lang js="minSize" dart="minSize" py="min_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 돌려줄 가장 작은 용량. [범위](#bounds)를 보세요. |
| <Lang js="maxSize" dart="maxSize" py="max_size" code /> | <Lang js="number" dart="num?" py="float &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 돌려줄 가장 큰 용량. [범위](#bounds)를 보세요. |
| <Lang js="includeType" dart="includeType" py="include_type" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 용량 뒤에 메모리 종류를 씁니다: `16 GB DDR5`. 단위 없이 숫자만 쓸 때는 쓰지 않습니다. [메모리 종류](#types)를 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 용량 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 용량이 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 용량마다 `RamDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 용량별 비중 {#sizes}

플랫폼마다 용량 목록이 따로 있고, 그 종류의 기기에 흔히 들어가는 메모리 용량을 모두 담았습니다. 데스크톱과 노트북은 512 MB부터 워크스테이션의 1 TB까지, 휴대폰과 태블릿은 초기 스마트폰의 512 MB부터 24 GB까지입니다. 먼저 플랫폼을 고르므로 <Lang js="platform: 'all'" dart="platform을 null로" py="platform=&quot;all&quot;" code /> 두면 반씩 나오고, 그다음 그 플랫폼에서 흔한 정도에 비례해 용량을 뽑습니다. 비중은 용량이 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다.

| 용량                            |   `desktop` | `mobile` |
| ------------------------------- | ----------: | -------: |
| 8 GB                            |       23.3% |    22.6% |
| 16 GB                           |       25.3% |     8.2% |
| 4 GB                            |        9.7% |    14.4% |
| 32 GB                           |       13.6% |        — |
| 12 GB                           |        1.9% |    16.4% |
| 6 GB                            |        1.0% |    14.4% |
| 2 GB                            |        3.9% |     8.2% |
| 3 GB                            |        1.0% |     8.2% |
| 64 GB                           |        5.8% |        — |
| 1 GB                            |        1.9% |     4.1% |
| 24 GB                           |        3.9% |     1.0% |
| 512 MB                          |        1.0% |     2.1% |
| 48 GB, 128 GB                   |     각 1.9% |        — |
| 18 GB                           |        1.0% |     0.5% |
| 36 GB, 96 GB                    |     각 1.0% |        — |
| 192 GB, 256 GB, 512 GB, 1024 GB | 합쳐서 0.9% |        — |

애매해 보이는 용량도 실제로 있는 값입니다. 3 GB와 6 GB는 휴대폰, 18 GB와 36 GB는 M3 Pro와 M3 Max를 단 Mac, 24 GB와 48 GB는 크기가 다른 모듈 두 개를 꽂은 노트북의 용량입니다.

## 메모리 종류 {#types}

용량마다 그 크기로 팔린 메모리 종류가 함께 정해집니다. 데스크톱의 모듈이나 휴대폰의 칩이 따르는 JEDEC 규격입니다. 상세 출력의 `type`에 들어 있고, <Lang js="includeType: true" dart="includeType: true" py="include_type=True" code />를 주면 용량 뒤에 씁니다. 다만 <Lang js="includeUnit: false" dart="includeUnit: false" py="include_unit=False" code />로 단위를 뺀 숫자 뒤에는 쓰지 않습니다. 메모리 종류는 단위까지 갖춘 용량에 붙는 값이기 때문입니다. 용량을 먼저 뽑고, 그 플랫폼에서 그 용량으로 팔린 종류 가운데 표의 가중치대로 종류를 뽑습니다. 그래서 16 GB 데스크톱은 셋 중 둘 정도가 DDR4나 DDR5입니다.

| 종류      | 플랫폼    | 연도        | 용량          | 가중치 |
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

휴대폰용 메모리를 쓰는 노트북(MacBook Air, Snapdragon 노트북 등)은 `desktop`으로 세고, 노트북에 들어가는 용량을 씁니다. 연도는 그 규격을 단 새 기기가 팔린 기간입니다. 그 규격을 처음 단 기기부터 다음 규격이 거의 다 대신할 때까지이며, 끝이 비어 있으면 아직 팔리는 규격입니다. 가중치는 지금 쓰이는 기기에서 흔한 순서대로 직접 정한 값입니다.

<Lang js="minYear" dart="minYear" py="min_year" code />와 <Lang js="maxYear" dart="maxYear" py="max_year" code />는 그 범위에 팔린 종류만 고르고, 두 해 모두 범위에 들어갑니다. 용량도 그때까지 그 종류로 나온 것만 남으므로, 2005년까지의 데스크톱은 DDR이나 DDR2이고 8 GB를 넘지 않으며, 2010년까지의 데스크톱은 32 GB를 넘지 않습니다. 워크스테이션의 512 GB DDR3는 2013년에 나왔기 때문입니다. 종류와 용량마다의 연도는 제조사가 직접 낸 사양서(Apple 기술 사양, Lenovo PSREF, HP QuickSpecs, 휴대폰 제조사의 사양 페이지)에서 확인된 가장 이른 해이고, 어떤 사양서에서도 확인되지 않은 용량은 짐작으로 넣지 않고 그 종류에서 뺐습니다. 범위 안에 팔린 종류가 없으면 빈 결과를 돌려주고(표에서 가장 이른 휴대폰 메모리는 2010년 것입니다), 범위의 앞뒤가 바뀌면 <Lang js="maxYear" dart="maxYear" py="max_year" code />를 남깁니다.

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

<Lang js="minSize" dart="minSize" py="min_size" code />와 <Lang js="maxSize" dart="maxSize" py="max_size" code />는 그 사이의 용량만 고르고, 양 끝도 범위에 들어갑니다. 정한 단위로 읽고, 단위를 정하지 않았으면 GB로 읽습니다. 그래서 <Lang js="minSize: 16" dart="minSize: 16" py="min_size=16" code />는 16 GB 이상이고, <Lang js="unit: 'MB', maxSize: 4096" dart="unit: RamUnit.mb, maxSize: 4096" py="unit=&quot;MB&quot;, max_size=4096" code />는 4096 MB 이하입니다. 경계가 정수일 필요는 없어서, <Lang js="maxSize: 0.5" dart="maxSize: 0.5" py="max_size=0.5" code />는 512 MB 이하입니다.

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
// [{ ram: '16 GB', value: 16, unit: 'GB', bytes: 17179869184, type: 'DDR5', platform: 'desktop' }]
```

:::

::: lang dart

```dart
randRamDetails().first; // RamDetail(16 GB, 17179869184, DDR5, desktop)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randRam`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_ram(output="detail")
# [RamDetail(ram='16 GB', value=16, unit='GB', bytes=17179869184, type='DDR5', platform='desktop')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `ram` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `value` | <Lang js="number" dart="int" py="int" code /> | 쓴 숫자: `16`. |
| `unit` | `RamUnit` | `MB` 또는 `GB`. |
| `bytes` | <Lang js="number" dart="int" py="int" code /> | 같은 용량을 2의 거듭제곱으로 센 바이트 수. 16 GB는 `17179869184`입니다. |
| `type` | <Lang js="RamType" dart="String" py="RamType" code /> | 그 플랫폼에서 그 용량으로 팔린 메모리 종류: `DDR5`, `LPDDR5X`. |
| `platform` | `SystemPlatform` | 뽑을 때 고른 기기 종류. |

## 함께 보기 {#see-also}

- [`randDevice`](../device/rand-device) — 이 메모리가 들어갈 휴대폰, 태블릿, 노트북.
- [`randDiskType`](../disk/rand-disk-type)과 [`randDiskSize`](../disk/rand-disk-size) — 함께 들어가는 저장 장치.
- [`randOs`](../os/rand-os) — 그 기기에서 돌아가는 운영체제.
