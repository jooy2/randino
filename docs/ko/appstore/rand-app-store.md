# randAppStore

실제 앱 스토어를 `count`개만큼 돌려줍니다. `Google Play Store`, `Apple App Store`, `Samsung Galaxy Store`, `Steam`처럼 스토어가 알려진 이름 그대로 쓰고, 회사 이름과 함께 부르는 스토어는 앞에 회사 이름을 붙입니다. 흔한 스토어일수록 자주 나옵니다. [`platform`](#catalog)으로 휴대폰·태블릿 스토어나 데스크톱·노트북 스토어만 고를 수 있으며, Google Play는 데스크톱에서 나오지 않습니다.

스토어 이름은 어느 언어에서나 제 이름으로 쓰므로 `randAppStore`는 `language`를 받지 않습니다.

::: lang js

```javascript
import { randAppStore } from 'randino';

randAppStore();
// ['Google Play Store']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randAppStore();
// [Google Play Store]
```

:::

::: lang py

```python
from randino import rand_app_store

rand_app_store()
# ['Google Play Store']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `mobile`은 휴대폰과 태블릿 스토어, `desktop`은 데스크톱과 노트북 스토어입니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 둘을 같은 비율로 뽑습니다. |
| <Lang js="includeCompany" dart="includeCompany" py="include_company" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 회사 이름과 함께 부르는 스토어는 앞에 회사 이름을 씁니다. `App Store` 대신 `Apple App Store`로 씁니다. 이름에 회사가 들어가지 않는 스토어는 어느 쪽이든 같습니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 스토어 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 카탈로그가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 스토어마다 `AppStoreDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

::: lang js

```javascript
randAppStore({ platform: 'mobile', count: 3 }); // ['Google Play Store', 'Apple App Store', 'Huawei AppGallery']
randAppStore({ platform: 'desktop', count: 3 }); // ['Steam', 'Microsoft Store', 'Mac App Store']
randAppStore({ includeCompany: false, count: 2 }); // ['App Store', 'Galaxy Store']
```

:::

::: lang dart

```dart
randAppStore(platform: SystemPlatform.mobile, count: 3); // [Google Play Store, Apple App Store, Huawei AppGallery]
randAppStore(platform: SystemPlatform.desktop, count: 3); // [Steam, Microsoft Store, Mac App Store]
randAppStore(includeCompany: false, count: 2); // [App Store, Galaxy Store]
```

:::

::: lang py

```python
rand_app_store(platform="mobile", count=3)  # ['Google Play Store', 'Apple App Store', 'Huawei AppGallery']
rand_app_store(platform="desktop", count=3)  # ['Steam', 'Microsoft Store', 'Mac App Store']
rand_app_store(include_company=False, count=2)  # ['App Store', 'Galaxy Store']
```

:::

## 뽑는 범위 {#catalog}

지금도 운영 중인 스토어 18개가 들어 있습니다. 플랫폼을 먼저 고르므로 `platform`을 생략하면 결과의 절반씩이 각 플랫폼이고, 아래 비중도 절반이 됩니다. 비중은 스토어가 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다.

휴대폰과 태블릿. 운영체제와 제조사의 스토어가 먼저이고, 따로 설치하는 독립 스토어가 뒤에 있습니다.

| 스토어                 | 자체 이름         | 회사      | 비중 |
| ---------------------- | ----------------- | --------- | ---: |
| `Google Play Store`    | `Google Play`     | Google    |  45% |
| `Apple App Store`      | `App Store`       | Apple     |  35% |
| `Samsung Galaxy Store` | `Galaxy Store`    | Samsung   |   6% |
| `Huawei AppGallery`    | `AppGallery`      | Huawei    |   5% |
| `Amazon Appstore`      | `Amazon Appstore` | Amazon    |   3% |
| `Xiaomi GetApps`       | `GetApps`         | Xiaomi    |   2% |
| `ONE store`            | `ONE store`       | ONE store |   2% |
| `Aptoide`              | `Aptoide`         | Aptoide   |   1% |
| `F-Droid`              | `F-Droid`         | F-Droid   |   1% |

데스크톱과 노트북. 운영체제의 스토어와 게임을 사는 스토어입니다.

| 스토어             | 자체 이름          | 회사            | 비중 |
| ------------------ | ------------------ | --------------- | ---: |
| `Microsoft Store`  | `Microsoft Store`  | Microsoft       |  30% |
| `Steam`            | `Steam`            | Valve           |  25% |
| `Mac App Store`    | `Mac App Store`    | Apple           |  20% |
| `Epic Games Store` | `Epic Games Store` | Epic Games      |   8% |
| `GOG.com`          | `GOG.com`          | GOG             |   4% |
| `Snap Store`       | `Snap Store`       | Canonical       |   4% |
| `EA app`           | `EA app`           | Electronic Arts |   3% |
| `Ubisoft Connect`  | `Ubisoft Connect`  | Ubisoft         |   3% |
| `Setapp`           | `Setapp`           | MacPaw          |   3% |

Google Play는 데스크톱 운영체제에 들어 있지 않으므로 첫 번째 표에만 있습니다. 이름은 각 스토어의 것이고, 그 권리는 소유자에게 있습니다. randino는 이들 중 어느 곳과도 관계가 없습니다.

## 상세 출력 {#the-detail-output}

상세 출력에는 스토어 자체 이름과 회사가 따로 들어 있어서, 두 열로 저장하고 전체 이름으로 보여 줄 수 있습니다.

::: lang js

```javascript
randAppStore({ output: 'detail' });
// [{ store: 'Samsung Galaxy Store', name: 'Galaxy Store', company: 'Samsung', platform: 'mobile' }]
```

:::

::: lang dart

```dart
randAppStoreDetails().first; // AppStoreDetail(Samsung Galaxy Store, mobile)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randAppStore`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_app_store(output="detail")
# [AppStoreDetail(store='Samsung Galaxy Store', name='Galaxy Store', company='Samsung', platform='mobile')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `store` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 회사 이름을 뺀 스토어 자체 이름: `Galaxy Store`. |
| `company` | <Lang js="string" dart="String" py="str" code /> | 스토어를 운영하는 회사: `Samsung`. |
| `platform` | `SystemPlatform` | `desktop` 또는 `mobile`. |

## 함께 보기 {#see-also}

- [`randOs`](../os/rand-os) — 스토어가 앱을 파는 운영체제.
- [`randDevice`](../device/rand-device) — 스토어에서 앱을 설치할 휴대폰, 태블릿, 노트북.
- [`randVersion`](../version/rand-version) — 스토어에 올라간 앱의 버전.
