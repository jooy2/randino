# randAppStore

Generates real app stores and returns `count` of them, by the name each is known by, with its company in front where the store is called by one: `Google Play Store`, `Apple App Store`, `Samsung Galaxy Store`, `Steam`. The common stores come up most often. [`platform`](#catalog) keeps to the stores of phones and tablets or to those of desktops and laptops, and Google Play is never a desktop's.

A store is called by its own name in every language, so `randAppStore` takes no `language`.

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

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `platform` | <Lang js="SystemPlatformOption" dart="SystemPlatform?" py="SystemPlatformOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | `mobile` for the stores of phones and tablets, `desktop` for those of desktops and laptops. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> draws both evenly. |
| <Lang js="includeCompany" dart="includeCompany" py="include_company" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the company in front where the store is called by one: `Apple App Store` rather than `App Store`. A store whose name carries no company is written the same either way. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many stores to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same store twice. Returns fewer than `count` once the catalog runs out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or an `AppStoreDetail` per store. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

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

## What it draws from {#catalog}

Eighteen stores, each one still open. The platform is drawn first, so with `platform` left out half the results are each, and the shares below are then halved. The shares are written by hand in the order the stores are common in, not measured from any one survey.

On a phone or a tablet, the system's own and the makers' stores first, and the independent ones that ship by themselves after them:

| Store                  | Own name          | Company   | Share |
| ---------------------- | ----------------- | --------- | ----: |
| `Google Play Store`    | `Google Play`     | Google    |   45% |
| `Apple App Store`      | `App Store`       | Apple     |   35% |
| `Samsung Galaxy Store` | `Galaxy Store`    | Samsung   |    6% |
| `Huawei AppGallery`    | `AppGallery`      | Huawei    |    5% |
| `Amazon Appstore`      | `Amazon Appstore` | Amazon    |    3% |
| `Xiaomi GetApps`       | `GetApps`         | Xiaomi    |    2% |
| `ONE store`            | `ONE store`       | ONE store |    2% |
| `Aptoide`              | `Aptoide`         | Aptoide   |    1% |
| `F-Droid`              | `F-Droid`         | F-Droid   |    1% |

On a desktop or a laptop, the system stores and the stores games are bought from:

| Store              | Own name           | Company         | Share |
| ------------------ | ------------------ | --------------- | ----: |
| `Microsoft Store`  | `Microsoft Store`  | Microsoft       |   30% |
| `Steam`            | `Steam`            | Valve           |   25% |
| `Mac App Store`    | `Mac App Store`    | Apple           |   20% |
| `Epic Games Store` | `Epic Games Store` | Epic Games      |    8% |
| `GOG.com`          | `GOG.com`          | GOG             |    4% |
| `Snap Store`       | `Snap Store`       | Canonical       |    4% |
| `EA app`           | `EA app`           | Electronic Arts |    3% |
| `Ubisoft Connect`  | `Ubisoft Connect`  | Ubisoft         |    3% |
| `Setapp`           | `Setapp`           | MacPaw          |    3% |

Google Play is in the first table alone: no desktop system ships it. The names are the stores' own, and they belong to their owners. randino is not affiliated with any of them.

## The detail output {#the-detail-output}

The detail carries the store's own name and the company apart, so a result can be stored in two columns while the whole name is shown.

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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randAppStore`.

:::

::: lang py

```python
rand_app_store(output="detail")
# [AppStoreDetail(store='Samsung Galaxy Store', name='Galaxy Store', company='Samsung', platform='mobile')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `store` | <Lang js="string" dart="String" py="str" code /> | The store, as the value form returns it. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The store's own name, without the company: `Galaxy Store`. |
| `company` | <Lang js="string" dart="String" py="str" code /> | The company that runs it: `Samsung`. |
| `platform` | `SystemPlatform` | `desktop` or `mobile`. |

## See also

- [`randOs`](../os/rand-os) — the operating system a store sells apps for.
- [`randDevice`](../device/rand-device) — a phone, a tablet or a laptop to install from it.
- [`randVersion`](../version/rand-version) — the version of an app it lists.
