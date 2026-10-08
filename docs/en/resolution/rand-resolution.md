# randResolution

Generates screen resolutions and returns `count` of them, written as the width, an `x` and the height: `1920x1080`, `2560x1440`, `390x844`. They are the sizes people's screens really have, and the common ones come up most often — 1920x1080 is about a quarter of the desktops. [`platform`](#platform) keeps to the screens of desktops and laptops or to those of phones and tablets, and [`separator`](#separator) writes something else between the two numbers.

A resolution is written the same in every language, so `randResolution` takes no `language`.

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

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `desktop` for the screens of desktops and laptops, `mobile` for those of phones and tablets. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws both evenly. See [platform](#platform). |
| `separator` | <Lang js="string" dart="String" py="str" code /> | `'x'` | What goes between the width and the height. See [the separator](#separator). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many resolutions to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same resolution twice. Returns fewer than `count` once they run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `ResolutionDetail` per resolution. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## Platform {#platform}

A desktop screen is wider than it is tall, and a phone or a tablet is written portrait, its width first, the way a page in its browser sees it. Tablets count as `mobile`. Left out, a draw is a desktop half the time and a phone or a tablet the other half, however many sizes each of them lists.

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

## How often each one comes up {#shares}

The sizes are the ones a browser reports for a screen. On a scaled display that is the size the system lays things out at rather than the panel's own pixels: a 1920x1080 laptop at 125% is `1536x864`, and a 14-inch MacBook Pro is `1512x982`. The shares are written by hand in the order the sizes are common in, not measured from any one survey, and each platform's add up to a hundred.

On a desktop or a laptop:

| Size        | Share |
| ----------- | ----: |
| `1920x1080` |   26% |
| `1366x768`  |   10% |
| `1536x864`  |   10% |
| `2560x1440` |    9% |
| `1440x900`  |    5% |
| `3840x2160` |    5% |
| `1280x720`  |    4% |
| `1600x900`  |    4% |
| `1280x800`  |    3% |
| `1680x1050` |    3% |
| `1920x1200` |    3% |
| `2560x1600` |    3% |
| `1470x956`  |    3% |
| `1512x982`  |    3% |
| `1280x1024` |    2% |
| `3440x1440` |    2% |
| `1728x1117` |    2% |
| `1024x768`  |    1% |
| `2560x1080` |    1% |
| `1360x768`  |    1% |

On a phone or a tablet, the phones first and the tablets after them:

| Size        | Share |
| ----------- | ----: |
| `360x800`   |   12% |
| `390x844`   |   10% |
| `412x915`   |    9% |
| `393x852`   |    8% |
| `414x896`   |    6% |
| `375x812`   |    5% |
| `375x667`   |    5% |
| `430x932`   |    5% |
| `393x873`   |    4% |
| `360x780`   |    4% |
| `428x926`   |    4% |
| `768x1024`  |    4% |
| `384x854`   |    3% |
| `360x740`   |    3% |
| `402x874`   |    3% |
| `810x1080`  |    3% |
| `440x956`   |    2% |
| `360x640`   |    2% |
| `820x1180`  |    2% |
| `834x1194`  |    2% |
| `800x1280`  |    2% |
| `320x568`   |    1% |
| `1024x1366` |    1% |

With `platform` left out, each share is half of what the table says.

## The separator {#separator}

`separator` replaces the `x` and may be any string, an empty one included. The [detail](#the-detail-output) carries the two numbers apart whatever it is.

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

## The detail output {#the-detail-output}

The detail carries the width and the height as numbers, so a result can be used without being split again.

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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randResolution`.

:::

::: lang py

```python
rand_resolution(output="detail")
# [ResolutionDetail(resolution='1920x1080', width=1920, height=1080, platform='desktop')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `resolution` | <Lang js="string" dart="String" py="str" code /> | The resolution, as the value form returns it. |
| `width` | <Lang js="number" dart="int" py="int" code /> | The width, in the pixels a browser reports. |
| `height` | <Lang js="number" dart="int" py="int" code /> | The height, in the pixels a browser reports. |
| `platform` | `SystemPlatform` | `desktop` or `mobile`. |

## See also

- [`randDevice`](../device/rand-device) — a phone, a tablet or a laptop the screen could belong to.
- [`randOs`](../os/rand-os) — an operating system to go with it.
