# randGpu

실제로 나온 그래픽 프로세서를 `count`개만큼 돌려줍니다. `NVIDIA GeForce RTX 4090`, `AMD Radeon RX 7900 XTX`, `Intel Iris Xe Graphics`, `Qualcomm Adreno 740`처럼 제조사가 붙인 이름 그대로 씁니다. 지어낸 값은 없습니다. 결과는 모두 실제 그래픽 카드나 기기에 들어간 부품입니다. [`platform`](#catalog)으로 데스크톱·노트북 그래픽이나 휴대폰·태블릿 GPU만 고를 수 있고, [`minYear`와 `maxYear`](#years)로 그 기간에 나온 부품만 고를 수 있습니다.

그래픽 프로세서 이름은 어느 언어에서나 제 이름으로 쓰므로 `randGpu`는 `language`를 받지 않습니다.

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

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop`은 데스크톱 그래픽 카드, 노트북 GPU, PC 프로세서 내장 그래픽이고, `mobile`은 휴대폰과 태블릿의 GPU입니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 둘 다에서 뽑습니다. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 그래픽 프로세서가 나온 가장 이른 해. [연도](#years)를 보세요. |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 그래픽 프로세서가 나온 가장 늦은 해. [연도](#years)를 보세요. |
| `vendor` | <Lang js="GpuVendorOption" dart="Set&lt;String&gt;?" py="GpuVendorOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 제조사. 파는 이름 그대로 하나, 여러 개, 또는 전부를 줄 수 있습니다. [제조사](#vendors)를 보세요. |
| <Lang js="includeVendor" dart="includeVendor" py="include_vendor" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 앞에 제조사를 씁니다. `GeForce RTX 4090` 대신 `NVIDIA GeForce RTX 4090`으로 씁니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 그래픽 프로세서 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 카탈로그가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 그래픽 프로세서마다 `GpuDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

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

## 뽑는 범위 {#catalog}

2006년의 GeForce 8800 GTX부터 2025년 말까지 나온 부품까지 그래픽 프로세서 179개가 들어 있습니다. `platform`과 연도로 범위를 좁힌 뒤에는 남은 부품이 모두 같은 확률로 나옵니다.

| 플랫폼 | 제조사 | 개수 | 연도 | 제품군 |
| --- | --- | --: | --- | --- |
| `desktop` | NVIDIA | 71 | 2006 – 2025 | GeForce 8·9, GeForce GTX, GeForce RTX, GeForce MX, 노트북용 Laptop GPU |
| `desktop` | ATI | 4 | 2008 – 2009 | Radeon HD 4000·5000 |
| `desktop` | AMD | 42 | 2010 – 2025 | Radeon HD, R9, RX, RX Vega, Ryzen 내장 Radeon 그래픽 |
| `desktop` | Intel | 21 | 2011 – 2025 | HD, UHD, Iris, Arc |
| `mobile` | Qualcomm | 25 | 2013 – 2025 | Adreno |
| `mobile` | Arm | 13 | 2016 – 2024 | Mali, Immortalis |
| `mobile` | Samsung | 3 | 2022 – 2025 | Xclipse |

2010년 말 이전의 Radeon은 당시 팔리던 이름대로 ATI로 씁니다. AMD는 HD 6000 시리즈부터 ATI라는 이름을 쓰지 않았습니다. 노트북 GPU는 NVIDIA가 쓰는 대로 `Laptop GPU`까지 붙여서, 번호가 같은 데스크톱 카드와 헷갈리지 않게 합니다. 애플 GPU는 뺐습니다. 따로 붙은 이름이 없고, Mac은 칩 이름을 보여 주는데 그 이름은 [`randCpu`](../cpu/rand-cpu)가 이미 씁니다.

이름은 각 제품의 것이고, 그 권리는 소유자에게 있습니다. randino는 이들 중 어느 곳과도 관계가 없습니다.

## 제조사 {#vendors}

`vendor`는 [뽑는 범위](#catalog)에 적힌 이름 그대로 고른 제조사만 남깁니다. `NVIDIA`, `ATI`, `AMD`, `Intel`, `Qualcomm`, `Arm`, `Samsung`이며, <Lang js="GPU_VENDORS" dart="gpuVendors" py="GPU_VENDORS" code />도 이 순서입니다. 카탈로그에 없는 이름은 무시하고, 그런 이름만 주면 모든 제조사에서 뽑습니다. `platform`, 연도와 함께 범위를 좁히므로 그 안에 부품이 없는 제조사는 빈 결과를 돌려줍니다. 예를 들어 NVIDIA의 휴대폰 GPU는 들어 있지 않습니다.

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

제조사는 이름이므로 열거형이 아니라 문자열로 받으며, 정확히 같은 이름만 맞습니다.

:::

::: lang py

```python
rand_gpu(vendor="NVIDIA", count=2)  # ['NVIDIA GeForce RTX 4070', 'NVIDIA GeForce GTX 1650']
rand_gpu(vendor=("AMD", "ATI"), max_year=2010)  # ['ATI Radeon HD 4870']
rand_gpu(vendor="NVIDIA", platform="mobile")  # []
```

:::

## 연도 {#years}

그래픽 프로세서의 연도는 그것을 단 그래픽 카드나 기기가 처음 팔리기 시작한 해입니다. <Lang js="minYear" dart="minYear" py="min_year" code />와 <Lang js="maxYear" dart="maxYear" py="max_year" code />는 그 범위에 나온 부품만 고르고, 두 해 모두 범위에 들어갑니다. 범위 안에 나온 부품이 없으면 빈 결과를 돌려주며, 범위의 앞뒤가 바뀌면 <Lang js="maxYear" dart="maxYear" py="max_year" code />를 남깁니다.

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

## 상세 출력 {#the-detail-output}

상세 출력에는 제조사와 모델이 따로 들어 있어서, 두 열로 저장하고 전체 이름으로 보여 줄 수 있습니다.

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

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randGpu`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_gpu(output="detail")
# [GpuDetail(gpu='Intel Arc A770', vendor='Intel', model='Arc A770', platform='desktop', year=2022)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `gpu` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `vendor` | <Lang js="GpuVendor" dart="String" py="GpuVendor" code /> | 자기 이름으로 파는 회사: `NVIDIA`, `AMD`, `Arm`. |
| `model` | <Lang js="string" dart="String" py="str" code /> | 그래픽 프로세서 이름: `GeForce RTX 4090`. |
| `platform` | `SystemPlatform` | `desktop` 또는 `mobile`. |
| `year` | <Lang js="number" dart="int" py="int" code /> | 그것을 단 그래픽 카드나 기기가 처음 팔리기 시작한 해. |

## 함께 보기 {#see-also}

- [`randCpu`](../cpu/rand-cpu) — 함께 들어가는 프로세서.
- [`randDevice`](../device/rand-device) — 이 그래픽이 들어갈 만한 휴대폰, 태블릿, 노트북.
