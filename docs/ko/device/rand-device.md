# randDevice

실제로 나온 휴대폰, 태블릿, 노트북을 `count`개만큼 돌려줍니다. `Apple iPhone 15 Pro`, `Samsung Galaxy Tab S9`, `Lenovo ThinkPad X1 Carbon Gen 11`처럼 제조사가 붙인 이름 그대로 씁니다. 지어낸 값은 없습니다. 결과는 모두 실제로 나온 모델이며, 같은 이름의 제품을 세대나 연도로 구분하는 경우에는 그 표기까지 씁니다. [`type`](#catalog)으로 기기 종류를, [`minYear`와 `maxYear`](#years)로 출시 연도를 고를 수 있습니다.

데스크톱 PC는 일부러 뺐습니다. 대개 부품을 골라 조립하므로 따로 붙은 모델 이름이 없기 때문입니다.

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

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `type` | <Lang js="DeviceTypeOption" dart="Set&lt;DeviceType&gt;?" py="DeviceTypeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `phone`, `tablet`, `laptop` 중 하나, 또는 여럿. [뽑는 범위](#catalog)를 보세요. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 기기가 출시된 가장 이른 해. [연도](#years)를 보세요. |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 기기가 출시된 가장 늦은 해. [연도](#years)를 보세요. |
| <Lang js="includeVendor" dart="includeVendor" py="include_vendor" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 모델 앞에 제조사를 씁니다. [제조사와 모델](#vendor)을 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 기기 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 카탈로그가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 기기마다 `DeviceDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

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

`type`이 null이거나 비어 있으면 모든 종류에서 뽑습니다. 패키지의 다른 곳에서도 null인 enum은 "전부"를 뜻합니다.

:::

::: lang py

```python
rand_device(type="laptop", count=2)
# ['Lenovo ThinkPad T14 Gen 3', 'Apple MacBook Air (M2, 2022)']

rand_device(type=("phone", "tablet"), count=3)
# ['Google Pixel 8', 'Apple iPad (10th generation)', 'Sony Xperia 1 V']
```

:::

## 뽑는 범위 {#catalog}

2007년의 첫 iPhone부터 2025년 말까지 나온 기기까지 모델 459개가 들어 있습니다. `type`과 연도로 범위를 좁힌 뒤에는 남은 모델이 모두 같은 확률로 나옵니다.

| 종류 | 모델 수 | 연도 | 제조사 |
| --- | --: | --- | --- |
| `phone` | 260 | 2007 – 2025 | Apple, Samsung, Google, Xiaomi, OnePlus, Sony, LG, Huawei, Motorola, Nothing, Nokia, HTC, BlackBerry |
| `tablet` | 99 | 2010 – 2025 | Apple, Samsung, Microsoft, Google, Amazon, Lenovo, Xiaomi, Huawei |
| `laptop` | 100 | 2008 – 2025 | Apple, Microsoft, Dell, Lenovo, HP, ASUS, Samsung, Razer, Google, LG |

모델 이름은 제조사가 쓰는 표기를 따릅니다. 애플의 iPad와 Mac은 애플이 붙인 식별 이름을 세대까지 그대로 쓰고(`iPad (10th generation)`, `iPad Pro 13-inch (M4)`, `MacBook Air (M2, 2022)`), ThinkPad는 `Gen`을, EliteBook은 `G`를 붙입니다. 여러 해 같은 이름을 쓰는 노트북은 구분하는 연도를 붙입니다(`ROG Zephyrus G14 (2023)`, `Blade 15 (2020)`). Surface Pro 같은 분리형 2-in-1은 태블릿으로, Surface Laptop은 노트북으로 분류합니다.

연도는 그 기기가 처음 출시된 해입니다. 한 시장에서 몇 주 먼저 나온 휴대폰은 그 첫 시장을 기준으로 하므로, 12월에 중국에서 먼저 나온 Xiaomi나 OnePlus 플래그십은 그해로 셉니다.

이름은 각 제품의 것이고, 그 권리는 소유자에게 있습니다. randino는 이들 중 어느 곳과도 관계가 없습니다.

## 제조사와 모델 {#vendor}

기본값은 모델 앞에 제조사를 붙이는 것이라, 사양표나 자산 목록이 적는 방식으로 읽힙니다. `Xiaomi 14`, `OnePlus 12`, `Nothing Phone (2)`처럼 모델 이름이 이미 제조사 이름으로 시작하면 제조사를 두 번 쓰지 않습니다. <Lang js="includeVendor: false" dart="includeVendor: false" py="include_vendor=False" code />를 주면 모델 이름만 씁니다.

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

## 연도 {#years}

<Lang js="minYear" dart="minYear" py="min_year" code />와 <Lang js="maxYear" dart="maxYear" py="max_year" code />는 그 범위에 출시된 기기만 고르고, 두 해 모두 범위에 들어갑니다. 그래서 <Lang js="maxYear: 2012" dart="maxYear: 2012" py="max_year=2012" code />는 2012년 말까지 팔리던 기기입니다. 범위 안에 출시된 기기가 없으면 범위 밖의 기기로 채우지 않고 빈 결과를 돌려주며, 범위의 앞뒤가 바뀌면 <Lang js="maxYear" dart="maxYear" py="max_year" code />를 남깁니다.

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

[`randOs`](../os/rand-os#years)에 같은 연도를 주면 그 무렵에 나와 있던 운영체제를 뽑으므로, 한 해를 기준으로 샘플 기기 한 대를 꾸밀 수 있습니다.

## 상세 출력 {#the-detail-output}

상세 출력에는 제조사와 모델이 따로 들어 있어서, 두 열로 저장하고 전체 이름으로 보여 줄 수 있습니다.

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

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randDevice`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_device(output="detail")
# [DeviceDetail(device='Google Pixel 8', vendor='Google', model='Pixel 8', type='phone', year=2023)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `device` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `vendor` | <Lang js="string" dart="String" py="str" code /> | 제조사: `Apple`, `Samsung`, `Lenovo`. |
| `model` | <Lang js="string" dart="String" py="str" code /> | 모델 이름: `Galaxy S24 Ultra`. |
| `type` | `DeviceType` | `phone`, `tablet`, `laptop` 중 하나. |
| `year` | <Lang js="number" dart="int" py="int" code /> | 기기가 출시된 해. |

## 함께 보기 {#see-also}

- [`randOs`](../os/rand-os) — 같은 연도에 나와 있던, 그 기기에서 돌릴 운영체제.
