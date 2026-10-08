# randOs

실제로 나온 운영체제를 `count`개만큼 돌려줍니다. `Windows 11`, `macOS Sonoma 14`, `Android 9 Pie`처럼 릴리스마다 알려진 이름 그대로 씁니다. 지어낸 값은 없습니다. 결과는 모두 실제로 나온 릴리스이며, [`includeBuild`](#builds-and-editions)와 [`includeEdition`](#builds-and-editions)을 주면 그 릴리스의 빌드나 세부 버전, 에디션을 덧붙입니다. [`minYear`와 `maxYear`](#years)로 그 기간에 나온 릴리스만 고를 수 있으므로, 2012년에 쓰이던 운영체제만으로 샘플을 만들 수도 있습니다.

운영체제 이름은 어느 언어에서나 제 이름으로 쓰므로 `randOs`는 `language`를 받지 않습니다.

::: lang js

```javascript
import { randOs } from 'randino';

randOs();
// ['Windows 10']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randOs();
// [Windows 10]
```

:::

::: lang py

```python
from randino import rand_os

rand_os()
# ['Windows 10']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop`은 노트북을 포함한 PC, `mobile`은 휴대폰과 태블릿입니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 둘 다에서 뽑습니다. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 릴리스가 나온 가장 이른 해. [연도](#years)를 보세요. |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 릴리스가 나온 가장 늦은 해. [연도](#years)를 보세요. |
| <Lang js="includeVersion" dart="includeVersion" py="include_version" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 이름 뒤에 버전을 씁니다. 끄면 이름만 돌려줍니다. |
| <Lang js="includeBuild" dart="includeBuild" py="include_build" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 릴리스에 빌드나 세부 버전이 있으면 함께 씁니다. |
| <Lang js="includeEdition" dart="includeEdition" py="include_edition" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 릴리스가 여러 에디션으로 나왔으면 그중 하나를 씁니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 운영체제 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 카탈로그가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 운영체제마다 `OsDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

::: lang js

```javascript
randOs({ platform: 'mobile', count: 3 }); // ['Android 9 Pie', 'iOS 17', 'Android 13']
randOs({ platform: 'desktop', count: 3 }); // ['Windows 7', 'macOS Ventura 13', 'Ubuntu 22.04 LTS']
randOs({ includeVersion: false, count: 3 }); // ['Windows', 'Android', 'macOS']
```

:::

::: lang dart

```dart
randOs(platform: SystemPlatform.mobile, count: 3); // [Android 9 Pie, iOS 17, Android 13]
randOs(platform: SystemPlatform.desktop, count: 3); // [Windows 7, macOS Ventura 13, Ubuntu 22.04 LTS]
randOs(includeVersion: false, count: 3); // [Windows, Android, macOS]
```

:::

::: lang py

```python
rand_os(platform="mobile", count=3)  # ['Android 9 Pie', 'iOS 17', 'Android 13']
rand_os(platform="desktop", count=3)  # ['Windows 7', 'macOS Ventura 13', 'Ubuntu 22.04 LTS']
rand_os(include_version=False, count=3)  # ['Windows', 'Android', 'macOS']
```

:::

## 뽑는 범위 {#catalog}

운영체제 계열 여덟 가지를 담았고, 계열마다 첫 릴리스부터 2026년 10월까지 나온 릴리스까지 모두 들어 있습니다. 이름이 바뀌어도 같은 계열로 묶으므로 macOS에는 Mac OS X와 OS X가, iOS에는 iPhone OS가 함께 들어 있습니다.

| 플랫폼    | 계열    | 릴리스                                         | 플랫폼 안의 비중 |
| --------- | ------- | ---------------------------------------------- | ---------------: |
| `desktop` | Windows | 95, 98, 2000, Me, XP, Vista, 7, 8, 8.1, 10, 11 |              64% |
| `desktop` | macOS   | Mac OS X 10.0 ~ macOS Golden Gate 27           |              22% |
| `desktop` | Ubuntu  | 4.10 ~ 26.04 LTS                               |               7% |
| `desktop` | Fedora  | Fedora Core 1 ~ Fedora 44                      |               4% |
| `desktop` | Debian  | 1.1 ~ 13                                       |               3% |
| `mobile`  | Android | 1.0 ~ 17                                       |              62% |
| `mobile`  | iOS     | iPhone OS 1 ~ iOS 27                           |              30% |
| `mobile`  | iPadOS  | 13 ~ 27                                        |               8% |

먼저 표의 비중대로 계열을 고르고, 그 안에서 릴리스를 고릅니다. 같은 계열의 릴리스는 모두 같은 확률입니다. 계열마다 릴리스를 내는 속도가 달라서 이렇게 합니다. macOS와 iOS는 해마다 새 릴리스가 나오지만 Windows는 30년 동안 열한 번이 전부라서, 릴리스만으로 고르면 데스크톱 결과에서 Windows가 거의 나오지 않습니다. 비중은 계열이 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다. <Lang js="platform: 'all'" dart="platform을 null로" py="platform=&quot;all&quot;" code /> 두면 데스크톱과 모바일이 거의 반반으로 나옵니다.

릴리스는 알려진 이름 그대로 쓰므로 계열마다 쓰는 형식이 다릅니다. macOS 릴리스는 번호 앞에 애플이 붙인 이름을 쓰고(`macOS Sonoma 14`), Android 9까지는 번호 뒤에 디저트 이름을 쓰며(`Android 4.4 KitKat`), Ubuntu의 장기 지원 릴리스에는 `LTS`가 붙습니다.

이름은 각 제품의 것이고, 그 권리는 소유자에게 있습니다. randino는 이들 중 어느 곳과도 관계가 없습니다.

## 빌드와 에디션 {#builds-and-editions}

<Lang js="includeBuild" dart="includeBuild" py="include_build" code />는 릴리스를 알아보는 기준인 빌드나 세부 버전을, <Lang js="includeEdition" dart="includeEdition" py="include_edition" code />은 그 릴리스가 나온 에디션 하나를 덧붙입니다.

| 계열 | 빌드 | 에디션 |
| --- | --- | --- |
| Windows | 기능 업데이트나 서비스 팩과 그 빌드 번호: `23H2 (Build 22631)`, `SP1 (Build 7601)` | Home, Pro, Education, Enterprise, 옛 릴리스는 그 릴리스의 에디션 |
| macOS | 세부 버전: `14.5`, `10.6.8` | — |
| Ubuntu | 장기 지원 릴리스의 세부 버전: `22.04.4` | Desktop, Server(6.06부터) |
| Fedora | — | Workstation, Server(21부터) |
| Debian | — | — |
| Android | API 레벨: `(API 34)` | — |
| iOS, iPadOS | 세부 버전: `17.4` | — |

빌드가 없는 릴리스는 버전까지만 쓰고, 에디션이 없는 릴리스는 에디션 없이 씁니다. 그래서 둘 다 켜도 빈자리가 생기지 않습니다. <Lang js="includeVersion" dart="includeVersion" py="include_version" code />을 끄면 빌드와 에디션도 함께 빠집니다. 둘 다 버전에 딸린 값이라 버전 없이는 뜻이 없기 때문입니다.

::: lang js

```javascript
randOs({ includeBuild: true, count: 3 });
// ['Windows 10 22H2 (Build 19045)', 'macOS Sonoma 14.5', 'Android 14 (API 34)']

randOs({ includeEdition: true, count: 3 });
// ['Windows 11 Pro', 'Ubuntu Server 24.04 LTS', 'iOS 18']

randOs({ includeBuild: true, includeEdition: true });
// ['Windows 11 Pro 23H2 (Build 22631)']
```

:::

::: lang dart

```dart
randOs(includeBuild: true, count: 3);
// [Windows 10 22H2 (Build 19045), macOS Sonoma 14.5, Android 14 (API 34)]

randOs(includeEdition: true, count: 3);
// [Windows 11 Pro, Ubuntu Server 24.04 LTS, iOS 18]

randOs(includeBuild: true, includeEdition: true);
// [Windows 11 Pro 23H2 (Build 22631)]
```

:::

::: lang py

```python
rand_os(include_build=True, count=3)
# ['Windows 10 22H2 (Build 19045)', 'macOS Sonoma 14.5', 'Android 14 (API 34)']

rand_os(include_edition=True, count=3)
# ['Windows 11 Pro', 'Ubuntu Server 24.04 LTS', 'iOS 18']

rand_os(include_build=True, include_edition=True)
# ['Windows 11 Pro 23H2 (Build 22631)']
```

:::

## 연도 {#years}

카탈로그의 릴리스와 빌드에는 모두 일반에 공개된 해가 붙어 있습니다. <Lang js="minYear" dart="minYear" py="min_year" code />와 <Lang js="maxYear" dart="maxYear" py="max_year" code />는 그 범위에 나온 것만 고르고, 두 해 모두 범위에 들어갑니다. 그래서 <Lang js="maxYear: 2015" dart="maxYear: 2015" py="max_year=2015" code />는 2015년 말까지 나온 것, 곧 Windows 10은 들어가고 Windows 11은 빠지는 범위입니다.

기준이 되는 해는 결과가 가리키는 대상이 나온 해입니다. 빌드를 쓰지 않으면 릴리스가 기준이라, 2015년에 나온 Windows 10은 2020년부터 시작하는 범위에 들어가지 않습니다. <Lang js="includeBuild" dart="includeBuild" py="include_build" code />를 켜면 빌드가 기준이 되어, Windows 10도 2020년 이후의 업데이트로 그 범위에 들어갑니다.

::: lang js

```javascript
randOs({ platform: 'desktop', maxYear: 2010, count: 3 });
// ['Windows XP', 'Mac OS X Snow Leopard 10.6', 'Ubuntu 8.04 LTS']

randOs({ minYear: 2020, count: 3 }); // ['Android 13', 'Windows 11', 'iOS 26']
randOs({ minYear: 2020, includeBuild: true, platform: 'desktop' }); // ['Windows 10 21H2 (Build 19044)']
```

:::

::: lang dart

```dart
randOs(platform: SystemPlatform.desktop, maxYear: 2010, count: 3);
// [Windows XP, Mac OS X Snow Leopard 10.6, Ubuntu 8.04 LTS]

randOs(minYear: 2020, count: 3); // [Android 13, Windows 11, iOS 26]
randOs(minYear: 2020, includeBuild: true, platform: SystemPlatform.desktop); // [Windows 10 21H2 (Build 19044)]
```

:::

::: lang py

```python
rand_os(platform="desktop", max_year=2010, count=3)
# ['Windows XP', 'Mac OS X Snow Leopard 10.6', 'Ubuntu 8.04 LTS']

rand_os(min_year=2020, count=3)  # ['Android 13', 'Windows 11', 'iOS 26']
rand_os(min_year=2020, include_build=True, platform="desktop")  # ['Windows 10 21H2 (Build 19044)']
```

:::

범위 안에 나온 릴리스가 없으면 범위 밖의 릴리스로 채우지 않고 빈 결과를 돌려줍니다. 카탈로그에서 가장 오래된 릴리스는 Windows 95이고, 모바일에서는 2007년의 iPhone OS 1입니다. 범위의 앞뒤가 바뀌면 <Lang js="maxYear" dart="maxYear" py="max_year" code />를 남깁니다. "이 해까지"라고 물을 때 기준이 되는 쪽이 그 값이기 때문입니다.

## 상세 출력 {#the-detail-output}

상세 출력에는 결과를 이루는 부분이 하나씩 들어 있어서, 이름과 버전으로 저장하고 전체 문자열로 보여 줄 수 있습니다.

::: lang js

```javascript
randOs({ includeBuild: true, output: 'detail' });
// [{ os: 'macOS Sonoma 14.5', name: 'macOS', version: '14', build: '14.5',
//    edition: null, platform: 'desktop', year: 2024 }]
```

:::

::: lang dart

```dart
randOsDetails(includeBuild: true).first; // OsDetail(macOS Sonoma 14.5, desktop, 2024)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randOs`와 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_os(include_build=True, output="detail")
# [OsDetail(os='macOS Sonoma 14.5', name='macOS', version='14', build='14.5',
#           edition=None, platform='desktop', year=2024)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `os` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 버전을 뺀 이름: `Windows`, `Mac OS X`, `macOS`, `iPhone OS`. |
| `version` | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | 릴리스의 버전: `11`, `14`, `22.04`, `XP`. <Lang js="includeVersion: false" dart="includeVersion: false" py="include_version=False" code />이면 비어 있습니다. |
| `build` | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | 결과에 쓴 빌드나 세부 버전, 쓴 그대로: `23H2 (Build 22631)`, `14.5`, `(API 34)`. |
| `edition` | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | 결과에 쓴 에디션: `Pro`, `Server`. |
| `platform` | `SystemPlatform` | `desktop` 또는 `mobile`. |
| `year` | <Lang js="number" dart="int" py="int" code /> | 릴리스가 나온 해. 빌드를 썼으면 그 빌드가 나온 해. |

## 함께 보기 {#see-also}

- [`randDevice`](../device/rand-device) — 같은 연도에 나온 휴대폰, 태블릿, 노트북.
- [`randDate`](../date/rand-date) — 그 운영체제가 쓰이던 해 안의 날짜.
