# randVersion

소프트웨어 버전 번호를 `count`개만큼 돌려줍니다. [형식](#formats)은 세 가지입니다. 유의적 버전(`2.14.3`), 연도에서 세는 캘린더 버전(`2024.3.1`, `24.04`), 숫자 하나로 된 버전(`42`)입니다. 각 자리는 [작은 숫자일수록 자주](#parts) 나오므로, 패키지 저장소에서처럼 `0.x`나 `x.y.0`이 흔하게 나옵니다. [`prefix`](#prefix)로 `v` 같은 문자를 앞에 붙일 수 있고, [`includePrerelease`](#prerelease)를 켜면 유의적 버전에 가끔 `-beta.2` 같은 사전 릴리스가 붙습니다.

다른 시스템 값과 달리 버전은 카탈로그에서 고르지 않고 직접 뽑습니다. 세상의 버전 번호를 모은 목록은 없으며, 여기서 나온 버전이 우연히 어떤 실제 릴리스와 같을 수는 있습니다. 버전은 어느 언어에서나 같게 쓰므로 `randVersion`은 `language`를 받지 않습니다.

::: lang js

```javascript
import { randVersion } from 'randino';

randVersion();
// ['2.14.3']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randVersion();
// [2.14.3]
```

:::

::: lang py

```python
from randino import rand_version

rand_version()
# ['2.14.3']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `format` | <Lang js="VersionFormatOption" dart="Set&lt;VersionFormat&gt;?" py="VersionFormatOption" code /> | <Lang js="'semver'" dart="{VersionFormat.semver}" py="&quot;semver&quot;" code /> | 버전을 매기는 방식. 형식 하나, 결과마다 하나씩 고르게 뽑을 여러 형식, 또는 <Lang js="'all'" dart="null" py="&quot;all&quot;" code />로 전부를 줄 수 있습니다. [형식](#formats)을 보세요. |
| `prefix` | <Lang js="string" dart="String" py="str" code /> | `''` | 모든 버전 앞에 붙이는 문자열. [접두사](#prefix)를 보세요. |
| <Lang js="includePrerelease" dart="includePrerelease" py="include_prerelease" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 유의적 버전 넷 중 하나쯤에 사전 릴리스를 붙입니다. [사전 릴리스](#prerelease)를 보세요. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | `2010` | 캘린더 버전이 셀 수 있는 가장 이른 해. [연도](#years)를 보세요. |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | `2026` | 캘린더 버전이 셀 수 있는 가장 늦은 해. [연도](#years)를 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 버전 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 버전이 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 버전마다 `VersionDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

버전 열 하나에는 보통 한 가지 방식만 쓰므로, 기본값은 모든 형식이 아니라 `semver`입니다.

## 형식 {#formats}

| 형식     | 방식                | 예           | 설명                                            |
| -------- | ------------------- | ------------ | ----------------------------------------------- |
| `semver` | `MAJOR.MINOR.PATCH` | `2.14.3`     | 유의적 버전. 대부분의 패키지 저장소가 쓰는 방식 |
| `calver` | `YYYY.MINOR`        | `2024.2`     | 연도와 그해의 몇 번째 릴리스                    |
| `calver` | `YYYY.MM.MICRO`     | `2024.3.1`   | 연도, 월, 수정 번호                             |
| `calver` | `YY.0M`             | `24.04`      | 짧은 연도와 두 자리 월                          |
| `calver` | `YY.0M.MICRO`       | `24.04.1`    | 같은 방식에 수정 번호를 더한 것                 |
| `calver` | `YYYY.0M.0D`        | `2024.03.15` | 날짜 전체                                       |
| `number` | `MAJOR`             | `42`         | 브라우저처럼 숫자 하나로 된 버전                |

방식은 [CalVer](https://calver.org) 표기를 따릅니다. `YY`는 연도에서 2000을 뺀 값이고, 캘린더 방식의 `MINOR`는 그해의 몇 번째 릴리스인지를 뜻합니다. 캘린더 버전은 가중치에 따라 방식을 고릅니다. 앞의 두 방식이 각각 4분의 1, `YY.0M`이 5분의 1, 마지막 두 방식이 각각 15%입니다. 날짜를 쓰는 방식은 늘 실제로 있는 날짜를 씁니다.

::: lang js

```javascript
randVersion({ format: 'calver', count: 3 }); // ['2024.3.1', '24.04', '2019.2']
randVersion({ format: 'number', count: 3 }); // ['42', '3', '118']
randVersion({ format: ['semver', 'number'], count: 3 }); // ['1.4.0', '7', '0.12.2']
randVersion({ format: 'all', count: 3 }); // ['2.0.1', '2023.11.2', '15']
```

:::

::: lang dart

```dart
randVersion(format: {VersionFormat.calver}, count: 3); // [2024.3.1, 24.04, 2019.2]
randVersion(format: {VersionFormat.number}, count: 3); // [42, 3, 118]
randVersion(format: {VersionFormat.semver, VersionFormat.number}, count: 3); // [1.4.0, 7, 0.12.2]
randVersion(format: null, count: 3); // [2.0.1, 2023.11.2, 15]
```

null이나 빈 집합을 주면 모든 형식에서 뽑습니다.

:::

::: lang py

```python
rand_version(format="calver", count=3)  # ['2024.3.1', '24.04', '2019.2']
rand_version(format="number", count=3)  # ['42', '3', '118']
rand_version(format=("semver", "number"), count=3)  # ['1.4.0', '7', '0.12.2']
rand_version(format="all", count=3)  # ['2.0.1', '2023.11.2', '15']
```

:::

## 숫자를 뽑는 방식 {#parts}

각 숫자는 정해진 범위에서 뽑습니다. 범위의 맨 아래에서 두 배 멀리 떨어진 숫자는 절반쯤의 빈도로 나옵니다. 그래서 맨 아래 값이 가장 흔하고 맨 위 값은 드뭅니다.

| 자리                                    | 범위        | 맨 아래 값의 비중            |
| --------------------------------------- | ----------- | ---------------------------- |
| 유의적 버전의 메이저                    | `0` … `20`  | 넷 중 하나쯤이 `0.x`         |
| 유의적 버전의 마이너와 패치             | `0` … `30`  | 넷 중 하나쯤이 `.0`으로 끝남 |
| 숫자 하나                               | `1` … `150` | 절반이 `9` 이하              |
| 캘린더 버전의 그해 릴리스 번호(`MINOR`) | `1` … `4`   | 절반쯤이 그해 첫 릴리스      |
| 캘린더 버전의 수정 번호(`MICRO`)        | `1` … `9`   | 셋 중 하나쯤이 첫 수정       |
| 사전 릴리스 번호                        | `1` … `9`   | 셋 중 하나쯤이 첫 번째       |

## 접두사 {#prefix}

`prefix`는 형식과 상관없이 모든 버전 앞에 붙습니다. [상세 출력](#the-detail-output)의 숫자에는 접두사가 섞이지 않습니다.

::: lang js

```javascript
randVersion({ prefix: 'v' }); // ['v2.14.3']
randVersion({ format: 'calver', prefix: 'release-' }); // ['release-24.04']
```

:::

::: lang dart

```dart
randVersion(prefix: 'v'); // [v2.14.3]
randVersion(format: {VersionFormat.calver}, prefix: 'release-'); // [release-24.04]
```

:::

::: lang py

```python
rand_version(prefix="v")  # ['v2.14.3']
rand_version(format="calver", prefix="release-")  # ['release-24.04']
```

:::

## 사전 릴리스 {#prerelease}

<Lang js="includePrerelease" dart="includePrerelease" py="include_prerelease" code />를 켜면 유의적 버전 넷 중 하나쯤에 사전 릴리스가 붙습니다. 유의적 버전의 표기대로 하이픈, 이름표, 번호 순으로 씁니다. 이름표는 `alpha`가 30%, `beta`가 35%, `rc`가 35%입니다. 캘린더 버전과 숫자 하나로 된 버전에는 붙지 않습니다.

::: lang js

```javascript
randVersion({ includePrerelease: true, count: 4 });
// ['1.4.0', '3.0.0-rc.1', '0.12.2', '2.1.0-beta.2']
```

:::

::: lang dart

```dart
randVersion(includePrerelease: true, count: 4);
// [1.4.0, 3.0.0-rc.1, 0.12.2, 2.1.0-beta.2]
```

:::

::: lang py

```python
rand_version(include_prerelease=True, count=4)
# ['1.4.0', '3.0.0-rc.1', '0.12.2', '2.1.0-beta.2']
```

:::

## 연도 {#years}

<Lang js="minYear" dart="minYear" py="min_year" code />와 <Lang js="maxYear" dart="maxYear" py="max_year" code />는 캘린더 버전의 연도를 그 사이로 제한하며, 두 해 모두 범위에 들어가고 각 연도는 같은 확률로 나옵니다. 생략하면 범위는 2010년부터 2026년까지입니다. 오늘 날짜에서 세지 않고 고정한 범위라서, 시드를 준 <Lang js="random" dart="random" py="random" code />는 실행할 때마다 같은 버전을 돌려줍니다. 한쪽만 주면 생략한 쪽이 비켜나므로 <Lang js="minYear: 2030" dart="minYear: 2030" py="min_year=2030" code />만 주면 2030년이 나오고, 범위의 앞뒤가 바뀌면 <Lang js="maxYear" dart="maxYear" py="max_year" code />를 남깁니다. 짧은 연도는 연도에서 2000을 뺀 값이므로 모든 연도는 2000년부터 2099년 사이로 제한됩니다. 두 옵션은 다른 형식에는 영향을 주지 않습니다.

## 상세 출력 {#the-detail-output}

상세 출력에는 버전의 방식과 숫자가 들어 있어서, 다시 파싱하지 않고 비교하거나 정렬할 수 있습니다.

::: lang js

```javascript
randVersion({ format: 'calver', output: 'detail' });
// [{ version: '24.04', format: 'calver', scheme: 'YY.0M', parts: [24, 4], prerelease: null, year: 2024 }]
```

:::

::: lang dart

```dart
randVersionDetails(format: {VersionFormat.calver}).first; // VersionDetail(24.04, calver)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randVersion`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_version(format="calver", output="detail")
# [VersionDetail(version='24.04', format='calver', scheme='YY.0M', parts=(24, 4), prerelease=None, year=2024)]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `version` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. 접두사를 포함합니다. |
| `format` | `VersionFormat` | `semver`, `calver`, `number` 중 하나. |
| `scheme` | <Lang js="string" dart="String" py="str" code /> | CalVer 표기로 쓴 방식: `MAJOR.MINOR.PATCH`, `MAJOR`, `YY.0M`. |
| `parts` | <Lang js="number[]" dart="List&lt;int&gt;" py="tuple[int, …]" code /> | 쓰인 순서대로의 숫자. 짧은 연도는 쓰인 그대로 `24`입니다. |
| `prerelease` | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | 하이픈을 뺀 사전 릴리스(`beta.2`). 없으면 비어 있습니다. |
| `year` | <Lang js="number &#124; null" dart="int?" py="int &#124; None" code /> | 캘린더 버전이 세는 연도 전체. 다른 형식이면 비어 있습니다. |

## 함께 보기 {#see-also}

- [`randOs`](../os/rand-os) — 실제 버전이 붙은 운영체제.
- [`randDate`](../date/rand-date) — 버전이 나온 날짜.
