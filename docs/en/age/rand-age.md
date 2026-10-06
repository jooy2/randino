# randAge

Generates ages for sample people and returns `count` of them as whole numbers of years. The draw follows a curve shaped like a population rather than an even spread, so a young adult comes up far more often than a child or anybody past seventy. With [`output: 'detail'`](#the-detail-output) it reports the part of a life each age falls in.

An age has no language, so this is the one generator that takes none.

::: lang js

```javascript
import { randAge } from 'randino';

randAge();
// [34]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randAge();
// [34]
```

:::

::: lang py

```python
from randino import rand_age

rand_age()
# [34]
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| <Lang js="minAge" dart="minAge" py="min_age" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | `0` | The youngest age to return. Clamped to `0` … `120`. |
| <Lang js="maxAge" dart="maxAge" py="max_age" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | `100` | The oldest age to return. Clamped to `0` … `120`, and `120` when left out with a <Lang js="minAge" dart="minAge" py="min_age" code /> above `100`. |
| `group` | <Lang js="AgeGroupOption" dart="Set&lt;AgeGroup&gt;?" py="AgeGroupOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Which parts of a life the ages come from. See [groups](#groups). |
| `distribution` | `AgeDistribution` | <Lang js="'population'" dart="AgeDistribution.population" py="&quot;population&quot;" code /> | `population` follows [the curve](#how-ages-are-spread), `uniform` draws every age in the range alike. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many ages to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same age twice. Returns fewer than `count` once the range runs out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Numbers, or an `AgeDetail` per age. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

A range the wrong way round keeps <Lang js="maxAge" dart="maxAge" py="max_age" code />, the bound a caller is usually holding to, the same way the length options of the other generators keep their maximum.

::: lang js

```javascript
randAge({ minAge: 18, count: 3 }); // [22, 45, 31]
randAge({ minAge: 30, maxAge: 39, count: 3 }); // [33, 30, 37]
```

:::

::: lang dart

```dart
randAge(minAge: 18, count: 3); // [22, 45, 31]
randAge(minAge: 30, maxAge: 39, count: 3); // [33, 30, 37]
```

:::

::: lang py

```python
rand_age(min_age=18, count=3)  # [22, 45, 31]
rand_age(min_age=30, max_age=39, count=3)  # [33, 30, 37]
```

:::

## How ages are spread {#how-ages-are-spread}

An even draw from 0 to 100 hands back as many people in their nineties as in their twenties, which is not what a set of sample people looks like. So the default draw follows a curve: it peaks from 25 to 35, sits lower for children, eases down through middle age and falls away past seventy. Over the default range it works out to this:

| Ages      | Share |
| --------- | ----- |
| 0 to 12   | 10.7% |
| 13 to 19  | 9.0%  |
| 20 to 39  | 33.8% |
| 40 to 64  | 33.7% |
| 65 to 100 | 12.9% |
| 80 to 100 | 2.2%  |

The curve is the shape of a population in general, not any one country's census. It is written by hand rather than measured: a census would be a dataset with terms of its own, and no country's shape is the one a sample wants anyway, since Korea's peaks in its fifties and Nigeria's at birth.

Narrowing the range keeps the curve, so `minAge: 60` still draws a 62 more often than an 88. `distribution: 'uniform'` turns it off and draws every age in the range alike.

::: lang js

```javascript
randAge({ minAge: 60, count: 5 }); // [62, 68, 61, 75, 64]
randAge({ minAge: 60, distribution: 'uniform', count: 5 }); // [91, 63, 77, 88, 70]
```

:::

::: lang dart

```dart
randAge(minAge: 60, count: 5); // [62, 68, 61, 75, 64]
randAge(minAge: 60, distribution: AgeDistribution.uniform, count: 5); // [91, 63, 77, 88, 70]
```

:::

::: lang py

```python
rand_age(min_age=60, count=5)  # [62, 68, 61, 75, 64]
rand_age(min_age=60, distribution="uniform", count=5)  # [91, 63, 77, 88, 70]
```

:::

The curve runs to `120`, where it reaches zero. A centenarian is already about one draw in twenty thousand, so the default range stops at `100`, and a <Lang js="minAge" dart="minAge" py="min_age" code /> above that moves the default <Lang js="maxAge" dart="maxAge" py="max_age" code /> to `120` rather than contradicting a bound nobody wrote.

## Groups {#groups}

`group` names a part of a life:

| Group    | Ages      |
| -------- | --------- |
| `child`  | 0 to 12   |
| `teen`   | 13 to 19  |
| `adult`  | 20 to 64  |
| `senior` | 65 and up |

`teen` is the ages that end in "-teen", and `senior` starts where most pension and statistics systems start counting old age.

::: lang js

Pass one group, or an array to draw from several.

```javascript
randAge({ group: 'teen', count: 3 }); // [15, 13, 18]
randAge({ group: ['adult', 'senior'], count: 3 }); // [41, 70, 28]
```

:::

::: lang dart

Pass a set of groups. An empty set names none, which is every one of them, the same as `null`.

```dart
randAge(group: {AgeGroup.teen}, count: 3); // [15, 13, 18]
randAge(group: {AgeGroup.adult, AgeGroup.senior}, count: 3); // [41, 70, 28]
```

:::

::: lang py

Pass one group, or a sequence to draw from several.

```python
rand_age(group="teen", count=3)  # [15, 13, 18]
rand_age(group=("adult", "senior"), count=3)  # [41, 70, 28]
```

:::

A group narrows the range rather than replacing it, so `group: 'adult'` with a <Lang js="maxAge" dart="maxAge" py="max_age" code /> of `30` draws from 20 to 30. A group with no age inside the range is a request the range cannot answer, and the range wins: the ages come from <Lang js="minAge" dart="minAge" py="min_age" code /> to <Lang js="maxAge" dart="maxAge" py="max_age" code /> as though no group had been named. The range is a number you wrote, where a group is only a name for one.

## The detail output {#the-detail-output}

::: lang js

```javascript
randAge({ output: 'detail' });
// [{ age: 16, group: 'teen' }]
```

:::

::: lang dart

```dart
randAgeDetails().first; // AgeDetail(16, teen)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randAge`.

:::

::: lang py

```python
rand_age(output="detail")
# [AgeDetail(age=16, group='teen')]
```

:::

| Field   | Type                                          | Description                     |
| ------- | --------------------------------------------- | ------------------------------- |
| `age`   | <Lang js="number" dart="int" py="int" code /> | The age, in whole years.        |
| `group` | `AgeGroup`                                    | The part of a life it falls in. |

## See also

- [`randName`](../name/rand-name) — a name to go with the age.
