# randVersion

Generates software version numbers and returns `count` of them, in one of three [formats](#formats): a semantic version (`2.14.3`), a calendar version counted from a year (`2024.3.1`, `24.04`), or a single number (`42`). Every part is drawn with the [small numbers most often](#parts), so `0.x` and `x.y.0` come up the way they do in a package registry. [`prefix`](#prefix) writes something such as `v` in front, and [`includePrerelease`](#prerelease) gives a semantic version a `-beta.2` now and then.

Unlike the other system values, a version is drawn rather than picked from a catalog: no list of the world's version numbers exists, and any version here may belong to some real release by chance. A version is written the same in every language, so `randVersion` takes no `language`.

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

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `format` | <Lang js="VersionFormatOption" dart="Set&lt;VersionFormat&gt;?" py="VersionFormatOption" code /> | <Lang js="'semver'" dart="{VersionFormat.semver}" py="&quot;semver&quot;" code /> | How the version is numbered: one format, several drawn evenly one per result, or every one of them with <Lang js="'all'" dart="null" py="&quot;all&quot;" code />. See [formats](#formats). |
| `prefix` | <Lang js="string" dart="String" py="str" code /> | `''` | Written in front of every version. See [the prefix](#prefix). |
| <Lang js="includePrerelease" dart="includePrerelease" py="include_prerelease" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Give about one semantic version in four a pre-release. See [pre-releases](#prerelease). |
| <Lang js="minYear" dart="minYear" py="min_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | `2010` | The earliest year a calendar version may be counted from. See [years](#years). |
| <Lang js="maxYear" dart="maxYear" py="max_year" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | `2026` | The latest year a calendar version may be counted from. See [years](#years). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many versions to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same version twice. Returns fewer than `count` once they run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `VersionDetail` per version. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

The default is `semver` rather than every format, because a column of versions is usually one scheme.

## Formats {#formats}

| Format | Scheme | Example | What it is |
| --- | --- | --- | --- |
| `semver` | `MAJOR.MINOR.PATCH` | `2.14.3` | Semantic versioning, the scheme most package registries use |
| `calver` | `YYYY.MINOR` | `2024.2` | A year and the release within it |
| `calver` | `YYYY.MM.MICRO` | `2024.3.1` | A year, a month and a fix |
| `calver` | `YY.0M` | `24.04` | A short year and a zero-padded month |
| `calver` | `YY.0M.MICRO` | `24.04.1` | The same with a fix |
| `calver` | `YYYY.0M.0D` | `2024.03.15` | A whole date |
| `number` | `MAJOR` | `42` | A version that is one number, the way a browser's is |

The schemes are written in [CalVer](https://calver.org)'s notation, where `YY` is the year less 2000 and `MINOR` in a calendar scheme is the release within the year. A calendar version draws a scheme by weight — the first two a quarter each, `YY.0M` a fifth, the last two fifteen percent each — and a date it writes is always a real day.

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

A null or empty set draws every format.

:::

::: lang py

```python
rand_version(format="calver", count=3)  # ['2024.3.1', '24.04', '2019.2']
rand_version(format="number", count=3)  # ['42', '3', '118']
rand_version(format=("semver", "number"), count=3)  # ['1.4.0', '7', '0.12.2']
rand_version(format="all", count=3)  # ['2.0.1', '2023.11.2', '15']
```

:::

## How the numbers are drawn {#parts}

Each number is drawn from a range, and a number comes up about twice as often as the one twice as far from the bottom of it. The bottom of a range is the most common value, and the top is rare.

| Part | Range | The bottom of it |
| --- | --- | --- |
| Semantic major | `0` … `20` | About a quarter of the versions are `0.x` |
| Semantic minor and patch | `0` … `30` | About a quarter end on `.0` |
| Single number | `1` … `150` | Half of them are `9` or less |
| Calendar release within a year (`MINOR`) | `1` … `4` | About half are the year's first |
| Calendar fix (`MICRO`) | `1` … `9` | About a third are the first fix |
| Pre-release number | `1` … `9` | About a third are the first |

## The prefix {#prefix}

`prefix` is written in front of every version, whatever its format. The [detail](#the-detail-output) keeps the numbers apart from it.

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

## Pre-releases {#prerelease}

<Lang js="includePrerelease" dart="includePrerelease" py="include_prerelease" code /> gives about one semantic version in four a pre-release, written the way semantic versioning writes it: a hyphen, a label and a number. The label is `alpha` 30% of the time, `beta` 35% and `rc` 35%. Calendar and single-number versions never carry one.

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

## Years {#years}

<Lang js="minYear" dart="minYear" py="min_year" code /> and <Lang js="maxYear" dart="maxYear" py="max_year" code /> keep a calendar version to the years between them, both included, and every year is as likely as the next. Left out, the range is 2010 to 2026. It is fixed rather than counted from today, so a seeded <Lang js="random" dart="random" py="random" code /> gives the same versions on every run. A bound left out moves out of the way of the one that was written, so <Lang js="minYear: 2030" dart="minYear: 2030" py="min_year=2030" code /> alone is 2030, and a range the wrong way round keeps <Lang js="maxYear" dart="maxYear" py="max_year" code />. Every year is kept inside 2000 to 2099, because the short year is the year less 2000. The two options do nothing to the other formats.

## The detail output {#the-detail-output}

The detail carries the scheme and the numbers a version is made of, so a result can be compared or sorted without being parsed again.

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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randVersion`.

:::

::: lang py

```python
rand_version(format="calver", output="detail")
# [VersionDetail(version='24.04', format='calver', scheme='YY.0M', parts=(24, 4), prerelease=None, year=2024)]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `version` | <Lang js="string" dart="String" py="str" code /> | The version, as the value form returns it, prefix included. |
| `format` | `VersionFormat` | `semver`, `calver` or `number`. |
| `scheme` | <Lang js="string" dart="String" py="str" code /> | How it is numbered, in CalVer's notation: `MAJOR.MINOR.PATCH`, `MAJOR`, `YY.0M`. |
| `parts` | <Lang js="number[]" dart="List&lt;int&gt;" py="tuple[int, …]" code /> | The numbers in the order they are written. A short year is written as it is, `24`. |
| `prerelease` | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | The pre-release without its hyphen, `beta.2`, or none. |
| `year` | <Lang js="number &#124; null" dart="int?" py="int &#124; None" code /> | The full year a calendar version is counted from, or none for the other formats. |

## See also

- [`randOs`](../os/rand-os) — an operating system, with a real version of its own.
- [`randDate`](../date/rand-date) — a date, for the day a version was released.
