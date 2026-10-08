# randResolution

화면 해상도를 `count`개만큼 돌려줍니다. `1920x1080`, `2560x1440`, `390x844`처럼 가로, `x`, 세로 순으로 씁니다. 실제로 쓰이는 화면 크기만 나오고, 흔한 크기일수록 자주 나옵니다. 데스크톱이라면 1920x1080이 넷 중 하나쯤입니다. [`platform`](#platform)으로 데스크톱·노트북 화면이나 휴대폰·태블릿 화면만 고를 수 있고, [`separator`](#separator)로 두 숫자 사이에 다른 문자를 넣을 수 있습니다.

해상도는 어느 언어에서나 같게 쓰므로 `randResolution`은 `language`를 받지 않습니다.

::: lang js

```javascript
import { randResolution } from 'randino';

randResolution();
// ['1920x1080']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randResolution();
// [1920x1080]
```

:::

::: lang py

```python
from randino import rand_resolution

rand_resolution()
# ['1920x1080']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop`은 데스크톱과 노트북 화면, `mobile`은 휴대폰과 태블릿 화면입니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 둘을 같은 비율로 뽑습니다. [플랫폼](#platform)을 보세요. |
| `separator` | <Lang js="string" dart="String" py="str" code /> | `'x'` | 가로와 세로 사이에 넣는 문자열. [구분 기호](#separator)를 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 해상도 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 해상도가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 해상도마다 `ResolutionDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 플랫폼 {#platform}

데스크톱 화면은 가로가 세로보다 깁니다. 휴대폰과 태블릿은 그 안의 브라우저가 보는 대로 세로로 세운 크기를 쓰므로 가로가 더 짧습니다. 태블릿은 `mobile`에 들어갑니다. `platform`을 생략하면 각 플랫폼에 든 해상도 수와 상관없이 절반은 데스크톱, 절반은 휴대폰이나 태블릿이 나옵니다.

::: lang js

```javascript
randResolution({ platform: 'desktop', count: 3 }); // ['1920x1080', '2560x1440', '1366x768']
randResolution({ platform: 'mobile', count: 3 }); // ['390x844', '360x800', '820x1180']
```

:::

::: lang dart

```dart
randResolution(platform: SystemPlatform.desktop, count: 3); // [1920x1080, 2560x1440, 1366x768]
randResolution(platform: SystemPlatform.mobile, count: 3); // [390x844, 360x800, 820x1180]
```

:::

::: lang py

```python
rand_resolution(platform="desktop", count=3)  # ['1920x1080', '2560x1440', '1366x768']
rand_resolution(platform="mobile", count=3)  # ['390x844', '360x800', '820x1180']
```

:::

## 해상도별 비중 {#shares}

해상도는 브라우저가 알려 주는 화면 크기입니다. 배율을 쓰는 화면이라면 패널의 실제 픽셀이 아니라 시스템이 화면을 배치하는 크기여서, 125%로 쓰는 1920x1080 노트북은 `1536x864`, 14인치 MacBook Pro는 `1512x982`가 됩니다. 비중은 해상도가 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다. 플랫폼마다 합하면 100입니다.

데스크톱과 노트북:

| 해상도      | 비중 |
| ----------- | ---: |
| `1920x1080` |  26% |
| `1366x768`  |  10% |
| `1536x864`  |  10% |
| `2560x1440` |   9% |
| `1440x900`  |   5% |
| `3840x2160` |   5% |
| `1280x720`  |   4% |
| `1600x900`  |   4% |
| `1280x800`  |   3% |
| `1680x1050` |   3% |
| `1920x1200` |   3% |
| `2560x1600` |   3% |
| `1470x956`  |   3% |
| `1512x982`  |   3% |
| `1280x1024` |   2% |
| `3440x1440` |   2% |
| `1728x1117` |   2% |
| `1024x768`  |   1% |
| `2560x1080` |   1% |
| `1360x768`  |   1% |

휴대폰과 태블릿. 휴대폰이 먼저이고 태블릿이 뒤에 있습니다.

| 해상도      | 비중 |
| ----------- | ---: |
| `360x800`   |  12% |
| `390x844`   |  10% |
| `412x915`   |   9% |
| `393x852`   |   8% |
| `414x896`   |   6% |
| `375x812`   |   5% |
| `375x667`   |   5% |
| `430x932`   |   5% |
| `393x873`   |   4% |
| `360x780`   |   4% |
| `428x926`   |   4% |
| `768x1024`  |   4% |
| `384x854`   |   3% |
| `360x740`   |   3% |
| `402x874`   |   3% |
| `810x1080`  |   3% |
| `440x956`   |   2% |
| `360x640`   |   2% |
| `820x1180`  |   2% |
| `834x1194`  |   2% |
| `800x1280`  |   2% |
| `320x568`   |   1% |
| `1024x1366` |   1% |

`platform`을 생략하면 각 비중은 표에 적힌 값의 절반입니다.

## 구분 기호 {#separator}

`separator`는 `x` 자리에 들어가며, 빈 문자열을 포함해 어떤 문자열이든 받습니다. 구분 기호가 무엇이든 [상세 출력](#the-detail-output)에는 두 숫자가 따로 들어 있습니다.

::: lang js

```javascript
randResolution({ separator: '×' }); // ['1920×1080']
randResolution({ separator: ' × ' }); // ['2560 × 1440']
randResolution({ separator: ',' }); // ['1366,768']
```

:::

::: lang dart

```dart
randResolution(separator: '×'); // [1920×1080]
randResolution(separator: ' × '); // [2560 × 1440]
randResolution(separator: ','); // [1366,768]
```

:::

::: lang py

```python
rand_resolution(separator="×")  # ['1920×1080']
rand_resolution(separator=" × ")  # ['2560 × 1440']
rand_resolution(separator=",")  # ['1366,768']
```

:::

## 상세 출력 {#the-detail-output}

상세 출력에는 가로와 세로가 숫자로 들어 있어서, 결과를 다시 나누지 않고 바로 쓸 수 있습니다.

::: lang js

```javascript
randResolution({ output: 'detail' });
// [{ resolution: '1920x1080', width: 1920, height: 1080, platform: 'desktop' }]
```

:::

::: lang dart

```dart
randResolutionDetails().first; // ResolutionDetail(1920x1080, desktop)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randResolution`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_resolution(output="detail")
# [ResolutionDetail(resolution='1920x1080', width=1920, height=1080, platform='desktop')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `resolution` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `width` | <Lang js="number" dart="int" py="int" code /> | 브라우저가 알려 주는 가로 픽셀 수. |
| `height` | <Lang js="number" dart="int" py="int" code /> | 브라우저가 알려 주는 세로 픽셀 수. |
| `platform` | `SystemPlatform` | `desktop` 또는 `mobile`. |

## 함께 보기 {#see-also}

- [`randDevice`](../device/rand-device) — 이 화면이 달려 있을 만한 휴대폰, 태블릿, 노트북.
- [`randOs`](../os/rand-os) — 함께 쓸 운영체제.
