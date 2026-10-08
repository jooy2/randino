# randOs

Generates real operating systems and returns `count` of them, each written the way its release is known: `Windows 11`, `macOS Sonoma 14`, `Android 9 Pie`. Nothing is invented: every result is a release that came out, and [`includeBuild`](#builds-and-editions) and [`includeEdition`](#builds-and-editions) add the build or the point release and the edition it shipped with. [`minYear` and `maxYear`](#years) keep to the releases out in those years, so a sample can be what was in use in 2012.

An operating system is written by its own name in every language, so `randOs` takes no `language`.

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

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop` for a PC, a laptop included, `mobile` for a phone or a tablet. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws from both. |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The earliest year a release may have come out in. See [years](#years). |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | The latest year a release may have come out in. See [years](#years). |
| <Lang js="includeVersion" dart="includeVersion" py="include_version" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the version after the name. Left off, the result is the name alone. |
| <Lang js="includeBuild" dart="includeBuild" py="include_build" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Write the build or the point release, where the release has them. |
| <Lang js="includeEdition" dart="includeEdition" py="include_edition" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Write an edition, where the release came in more than one. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many systems to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same system twice. Returns fewer than `count` once the catalog runs out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or an `OsDetail` per system. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

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

## What it draws from {#catalog}

Eight lines of operating systems, every release of each from its first to the ones out by October 2026. A line keeps its releases across a rename, so macOS holds Mac OS X and OS X, and iOS holds iPhone OS.

| Platform  | Line    | Releases                                       | Share of its platform |
| --------- | ------- | ---------------------------------------------- | --------------------: |
| `desktop` | Windows | 95, 98, 2000, Me, XP, Vista, 7, 8, 8.1, 10, 11 |                   64% |
| `desktop` | macOS   | Mac OS X 10.0 to macOS Golden Gate 27          |                   22% |
| `desktop` | Ubuntu  | 4.10 to 26.04 LTS                              |                    7% |
| `desktop` | Fedora  | Fedora Core 1 to Fedora 44                     |                    4% |
| `desktop` | Debian  | 1.1 to 13                                      |                    3% |
| `mobile`  | Android | 1.0 to 17                                      |                   62% |
| `mobile`  | iOS     | iPhone OS 1 to iOS 27                          |                   30% |
| `mobile`  | iPadOS  | 13 to 27                                       |                    8% |

A draw picks the line first, by the share in the table, and a release inside it second, every release as likely as the next. The lines do not ship at the same pace — macOS and iOS put out a release every year, Windows has eleven in thirty years — so drawing over releases alone would make Windows a sliver of every desktop. The shares are written by hand in the order the lines are common in, not measured from any one survey. With <Lang js="platform: 'all'" dart="a null platform" py="platform=&quot;all&quot;" code />, desktop and mobile come up about evenly.

Each release is written the way it is known, which is not the same pattern for every line: the macOS releases carry the name Apple gave them before the number (`macOS Sonoma 14`), the Android releases up to 9 the dessert after it (`Android 4.4 KitKat`), and an Ubuntu long-term release its `LTS`.

The names are the products' own, and they belong to their owners. randino is not affiliated with any of them.

## Builds and editions {#builds-and-editions}

<Lang js="includeBuild" dart="includeBuild" py="include_build" code /> writes the build or the point release a release is known by, and <Lang js="includeEdition" dart="includeEdition" py="include_edition" code /> an edition it came in:

| Line | Build | Editions |
| --- | --- | --- |
| Windows | The feature update or service pack and its build: `23H2 (Build 22631)`, `SP1 (Build 7601)` | Home, Pro, Education, Enterprise, and the editions of each older release |
| macOS | The point release: `14.5`, `10.6.8` | — |
| Ubuntu | The point release of a long-term release: `22.04.4` | Desktop, Server, from 6.06 |
| Fedora | — | Workstation, Server, from 21 |
| Debian | — | — |
| Android | The API level: `(API 34)` | — |
| iOS, iPadOS | The point release: `17.4` | — |

A release with no builds is written at its version, and a release with no editions without one, so asking for both never leaves a gap. Left off, <Lang js="includeVersion" dart="includeVersion" py="include_version" code /> takes the build and the edition with it, because neither means anything without the version it belongs to.

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

## Years {#years}

Every release and every build in the catalog carries the year it reached the public. <Lang js="minYear" dart="minYear" py="min_year" code /> and <Lang js="maxYear" dart="maxYear" py="max_year" code /> keep to the ones that came out in that range, both years included, so <Lang js="maxYear: 2015" dart="maxYear: 2015" py="max_year=2015" code /> is what was out by the end of 2015: Windows 10 but not Windows 11.

The year that counts is the year of what the result names. Without a build that is the release, so Windows 10, out in 2015, is not in a range that starts in 2020. With <Lang js="includeBuild" dart="includeBuild" py="include_build" code /> it is the build, and Windows 10 is in that range at its 2020 and later updates.

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

A range nothing came out in is answered with nothing rather than with a release from outside it: the first release in the catalog is Windows 95, and the first mobile one iPhone OS 1 in 2007. A range the wrong way round keeps <Lang js="maxYear" dart="maxYear" py="max_year" code />, the year a caller asking "as of" means.

## The detail output {#the-detail-output}

The detail carries each part of what was written, so a result can be stored as the name and the version while the whole string is shown.

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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randOs`.

:::

::: lang py

```python
rand_os(include_build=True, output="detail")
# [OsDetail(os='macOS Sonoma 14.5', name='macOS', version='14', build='14.5',
#           edition=None, platform='desktop', year=2024)]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `os` | <Lang js="string" dart="String" py="str" code /> | The system, as the value form returns it. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The name without a version: `Windows`, `Mac OS X`, `macOS`, `iPhone OS`. |
| `version` | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | The release's version: `11`, `14`, `22.04`, `XP`. Empty with <Lang js="includeVersion: false" dart="includeVersion: false" py="include_version=False" code />. |
| `build` | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | The build or point release written, as it is written: `23H2 (Build 22631)`, `14.5`, `(API 34)`. |
| `edition` | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | The edition written: `Pro`, `Server`. |
| `platform` | `SystemPlatform` | `desktop` or `mobile`. |
| `year` | <Lang js="number" dart="int" py="int" code /> | The year the release came out, or the build when one is written. |

## See also

- [`randDevice`](../device/rand-device) — a phone, a tablet or a laptop from the same years.
- [`randDate`](../date/rand-date) — a date inside the years the system was current.
