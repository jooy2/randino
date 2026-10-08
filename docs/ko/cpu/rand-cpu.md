# randCpu

실제로 나온 프로세서를 `count`개만큼 돌려줍니다. `Intel Core i7-13700K`, `AMD Ryzen 7 7800X3D`, `Apple M3 Pro`, `Qualcomm Snapdragon 8 Gen 3`처럼 제조사가 붙인 이름 그대로 씁니다. 지어낸 값은 없습니다. 결과는 모두 실제 기기에 들어간 부품입니다. [`platform`](#catalog)으로 데스크톱·노트북 프로세서나 휴대폰·태블릿 칩만 고를 수 있고, [`minYear`와 `maxYear`](#years)로 그 기간에 나온 부품만 고를 수 있습니다.

프로세서 이름은 어느 언어에서나 제 이름으로 쓰므로 `randCpu`는 `language`를 받지 않습니다.

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

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop`은 데스크톱과 노트북 프로세서, `mobile`은 휴대폰과 태블릿 칩입니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 둘 다에서 뽑습니다. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 프로세서가 나온 가장 이른 해. [연도](#years)를 보세요. |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 프로세서가 나온 가장 늦은 해. [연도](#years)를 보세요. |
| <Lang js="includeVendor" dart="includeVendor" py="include_vendor" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 프로세서 앞에 제조사를 씁니다. `Core i7-13700K` 대신 `Intel Core i7-13700K`로 씁니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 프로세서 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 카탈로그가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 프로세서마다 `CpuDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

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

## 뽑는 범위 {#catalog}

2000년의 Pentium 4부터 2025년 말까지 나온 부품까지 프로세서 248개가 들어 있습니다. `platform`과 연도로 범위를 좁힌 뒤에는 남은 프로세서가 모두 같은 확률로 나옵니다.

| 플랫폼 | 제조사 | 개수 | 연도 | 제품군 |
| --- | --- | --: | --- | --- |
| `desktop` | Intel | 82 | 2000 – 2025 | Pentium, Core 2, Core i3~i9, Core Ultra, Celeron, Atom |
| `desktop` | AMD | 53 | 2003 – 2025 | Athlon 64, Phenom II, FX, A 시리즈, Ryzen, Ryzen Threadripper, Ryzen AI |
| `desktop` | Apple | 16 | 2020 – 2025 | M1~M5와 각각의 Pro, Max, Ultra |
| `desktop` | Qualcomm | 4 | 2022 – 2025 | Snapdragon 8cx, Snapdragon X |
| `mobile` | Apple | 25 | 2010 – 2025 | A4~A19 Pro, iPad용 X·Z 칩 포함 |
| `mobile` | Qualcomm | 32 | 2013 – 2025 | Snapdragon 600~8 Elite Gen 5 |
| `mobile` | Samsung | 12 | 2016 – 2025 | Exynos |
| `mobile` | MediaTek | 13 | 2018 – 2025 | Helio, Dimensity |
| `mobile` | Google | 5 | 2021 – 2025 | Tensor~Tensor G5 |
| `mobile` | HiSilicon | 6 | 2017 – 2024 | Kirin |

제품군마다 판매된 변형을 모두 넣지 않고, 사양표에 가장 자주 나오는 모델을 골라 담았습니다. 데스크톱은 배수 제한이 풀린 모델, 노트북은 주력 모델, 휴대폰 칩은 플래그십과 보급형입니다. 노트북 프로세서는 노트북이 데스크톱 운영체제를 쓰는 것과 같은 이유로 `desktop`에 넣었습니다.

이름은 각 제품의 것이고, 그 권리는 소유자에게 있습니다. randino는 이들 중 어느 곳과도 관계가 없습니다.

## 연도 {#years}

프로세서의 연도는 그 프로세서를 단 기기가 처음 팔리기 시작한 해입니다. 12월에 발표되고 이듬해 기기에 실린 휴대폰 칩은 이듬해로, 데스크톱 부품은 매장에 나온 해로 셉니다. <Lang js="minYear" dart="minYear" py="min_year" code />와 <Lang js="maxYear" dart="maxYear" py="max_year" code />는 그 범위에 나온 프로세서만 고르고, 두 해 모두 범위에 들어갑니다. 범위 안에 나온 프로세서가 없으면 빈 결과를 돌려주며, 범위의 앞뒤가 바뀌면 <Lang js="maxYear" dart="maxYear" py="max_year" code />를 남깁니다.

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

## 상세 출력 {#the-detail-output}

상세 출력에는 제조사와 모델이 따로 들어 있어서, 두 열로 저장하고 전체 이름으로 보여 줄 수 있습니다.

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

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randCpu`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_cpu(output="detail")
# [CpuDetail(cpu='Apple M3 Pro', vendor='Apple', model='M3 Pro', platform='desktop', year=2023)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `cpu` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `vendor` | <Lang js="string" dart="String" py="str" code /> | 제조사: `Intel`, `AMD`, `Apple`. |
| `model` | <Lang js="string" dart="String" py="str" code /> | 프로세서 이름: `Ryzen 7 7800X3D`. |
| `platform` | `SystemPlatform` | `desktop` 또는 `mobile`. |
| `year` | <Lang js="number" dart="int" py="int" code /> | 그 프로세서를 단 기기가 처음 팔리기 시작한 해. |

## 함께 보기 {#see-also}

- [`randDevice`](../device/rand-device) — 이 프로세서가 들어갈 만한 휴대폰, 태블릿, 노트북.
- [`randRam`](../ram/rand-ram) — 함께 들어가는 메모리.
