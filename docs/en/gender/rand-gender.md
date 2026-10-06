# randGender

Generates genders for sample people and returns `count` of them as strings, written the way a form in the language labels them: `여성`, `Female`, `Weiblich`. Male and female come up evenly, and two more answers are there when you ask for them: a gender nobody stated, and a third gender, much more rarely. With [`output: 'detail'`](#the-detail-output) it reports the code behind each label.

::: lang js

```javascript
import { randGender } from 'randino';

randGender({ language: 'ko', count: 3 });
// ['여성', '남성', '여성']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randGender(language: WordLanguage.ko, count: 3);
// [여성, 남성, 여성]
```

:::

::: lang py

```python
from randino import rand_gender

rand_gender(language="ko", count=3)
# ['여성', '남성', '여성']
```

:::

## Options

Every option is optional, and the defaults are what a call with nothing in it uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Language the labels are written in. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> picks one per result. |
| <Lang js="includeUnknown" dart="includeUnknown" py="include_unknown" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Answer `unknown` now and then: a record whose gender was never stated. |
| <Lang js="includeNonbinary" dart="includeNonbinary" py="include_nonbinary" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Answer `nonbinary` now and then, rarely. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many genders to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same label twice. Returns fewer than `count` once the labels run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `GenderDetail` per gender. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## How often each one comes up {#how-often}

Male and female split evenly. The other two are off until you ask for them, and when they are on they stay uncommon, so a sample still reads like a set of people:

| Switched on | Male | Female | Unknown | Non-binary |
| --- | --: | --: | --: | --: |
| Neither | 50% | 50% | — | — |
| <Lang js="includeUnknown" dart="includeUnknown" py="include_unknown" code /> | 45.5% | 45.5% | 9.1% | — |
| <Lang js="includeNonbinary" dart="includeNonbinary" py="include_nonbinary" code /> | 49.5% | 49.5% | — | 1.1% |
| Both | 45% | 45% | 9% | 1% |

Non-binary is about one draw in a hundred, which is the order it comes up in when people are asked. Unknown is about one in eleven, often enough that a screen showing it gets exercised in a sample of fifty.

::: lang js

```javascript
randGender({ language: 'en', includeUnknown: true, count: 5 });
// ['Male', 'Female', 'Unknown', 'Female', 'Male']

randGender({ language: 'de', includeNonbinary: true, includeUnknown: true, count: 5 });
// ['Weiblich', 'Männlich', 'Weiblich', 'Divers', 'Männlich']
```

:::

::: lang dart

```dart
randGender(language: WordLanguage.en, includeUnknown: true, count: 5);
// [Male, Female, Unknown, Female, Male]

randGender(language: WordLanguage.de, includeNonbinary: true, includeUnknown: true, count: 5);
// [Weiblich, Männlich, Weiblich, Divers, Männlich]
```

:::

::: lang py

```python
rand_gender(language="en", include_unknown=True, count=5)
# ['Male', 'Female', 'Unknown', 'Female', 'Male']

rand_gender(language="de", include_nonbinary=True, include_unknown=True, count=5)
# ['Weiblich', 'Männlich', 'Weiblich', 'Divers', 'Männlich']
```

:::

## The labels {#labels}

Each language writes the word a sign-up page or a table of records uses, rather than the noun for a person:

| Code | `male`    | `female`  | `nonbinary`         | `unknown`      |
| ---- | --------- | --------- | ------------------- | -------------- |
| `en` | Male      | Female    | Non-binary          | Unknown        |
| `ko` | 남성      | 여성      | 논바이너리          | 미상           |
| `ja` | 男性      | 女性      | ノンバイナリー      | 不明           |
| `zh` | 男        | 女        | 非二元性别          | 未知           |
| `vi` | Nam       | Nữ        | Phi nhị nguyên giới | Không xác định |
| `es` | Masculino | Femenino  | No binario          | Desconocido    |
| `it` | Maschile  | Femminile | Non binario         | Sconosciuto    |
| `de` | Männlich  | Weiblich  | Divers              | Unbekannt      |
| `ru` | Мужской   | Женский   | Небинарный          | Не указан      |

German writes `Divers`, the third option its own forms carry. Spanish, Italian and Russian write the adjective that agrees with their word for the field (`sexo`, `genere`, `пол`), which is how a form in those languages reads.

## The detail output {#the-detail-output}

The detail carries the code beside the label, so you can store `female` and show `여성`. `male` and `female` are the same two codes [`randName`](../name/rand-name)'s `gender` takes, so a drawn gender can pick the pool a name comes from.

::: lang js

```javascript
randGender({ language: 'ko', output: 'detail' });
// [{ gender: '여성', code: 'female', language: 'ko' }]
```

:::

::: lang dart

```dart
randGenderDetails(language: WordLanguage.ko).first; // GenderDetail(여성, female, ko)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randGender`.

:::

::: lang py

```python
rand_gender(language="ko", output="detail")
# [GenderDetail(gender='여성', code='female', language='ko')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `gender` | <Lang js="string" dart="String" py="str" code /> | The label, as the value form returns it. |
| `code` | `GenderCode` | `male`, `female`, `nonbinary` or `unknown`, the same whatever the language. |
| `language` | `WordLanguage` | The language the label is written in. |

## See also

- [`randAge`](../age/rand-age) — an age to go with it.
- [`randName`](../name/rand-name) — a name, from the pool the gender names.
