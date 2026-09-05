# Person names

randino generates names people actually carry — Emma Clover, Jack Reeves — in nine languages, each in its own script and with its English pronunciation alongside. They are for sample data: forms, seeds, mockups, fixtures.

::: lang js

```javascript
import { randName } from 'randino';

randName({ language: 'en', count: 3 });
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randName(language: NameLanguage.en, count: 3);
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

::: lang py

```python
from randino import rand_name

rand_name(language="en", count=3)
# ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

## What is in the box

| Function | Returns |
| --- | --- |
| [`randName`](./rand-name) | The names as strings, or [a detail per name](./rand-name#the-detail-output) |
| [`nameLengthRange`](./name-length-range) | The natural length range of a full name in a language |
| [`nameSupportsMiddleName`](./name-supports-middle-name) | Whether a language has a middle part at all |
| [`nameSupportsRoman`](./name-supports-roman) | Whether romanizing changes anything |

## How the options behave

The two generators share most of their options, and these are the ones whose behaviour is worth knowing before you reach for them.

### `realism` — real names, or invented ones

At `0` — the default — every part is drawn from a curated pool of names in use, and **stays there**: when the length range leaves room for more than one given-name length, the length is chosen from the ones the pool can actually serve rather than rolled first and invented around.

Toward `100` names are invented instead: Latin and Cyrillic scripts from syllable templates, and Korean, Japanese and Chinese by combining given-name characters freely. Values in between decide **per name and per part**, so `50` mixes real and invented parts inside one batch and sometimes inside one name.

::: lang js

```javascript
randName({ language: 'en', realism: 'invented', count: 3 });
// ['Deder Kuvoun', 'Jaihil Brouvinn', 'Thoowoun Wiatou']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.en, realism: RandRealism.invented, count: 3);
// ['Deder Kuvoun', 'Jaihil Brouvinn', 'Thoowoun Wiatou']
```

:::

::: lang py

```python
rand_name(language="en", realism="invented", count=3)
# ['Deder Kuvoun', 'Jaihil Brouvinn', 'Thoowoun Wiatou']
```

:::

### Surnames are weighted where the distribution is steep

Korean, Chinese and Vietnamese surnames are drawn **in proportion to how common they are**, because a handful of them cover most of the population. About a fifth of the Korean names come back a 김 and two Vietnamese names in five a Nguyễn, the way a real roster reads — an even draw over the pool would make 김 one name in seventy-five, which is the single loudest way the output stops reading Korean.

The other six languages have a long enough tail that an even draw is already within the right order of magnitude, so they do not carry a frequency table.

### Length is counted in the native form

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> count **characters of the native form, spaces between parts included**. The structure you asked for always wins: a range too narrow for the requested parts is answered with the closest name the generator can build, never by dropping a surname or middle name you asked for.

For space-separated languages the range is satisfied by re-drawing from the pools, and a range no draw landed inside is answered by drawing each part from the lengths that still can. So a maximum the pools can write a name inside is met; one they cannot reach at all is answered with a name short of the minimum rather than past the maximum. Korean, Japanese and Chinese hit the range exactly, because their given names are composed a syllable at a time.

Leave both out and each language falls back to its own range, which is what <Lang js="nameLengthRange" dart="nameLengthRange" py="name_length_range" code /> reports — and that fallback is resolved **per language**, so mixing languages does not stretch a Korean name to fill a Spanish name's range.

### `startsWith` applies to the whole name

Which means the surname for family-first languages, and the given name otherwise — or whenever the surname is switched off. A character that no real name starts with still returns names rather than nothing: Latin and Cyrillic scripts invent one (`Q` → `Qivu Railooth`), and CJK scripts use the character as a name part of its own (`앙` + `지수` → `앙지수`).

Only the first character of whatever you pass is used, and the match is case-insensitive.

### `unique` is off by default

So that the count you asked for is the count you get. Turn it on to deduplicate; because the pools are finite, a large count then returns **fewer** names rather than looping forever.

### Gender

`gender` picks which pools the given name is drawn from. In most languages that is all it does, and the result is not observable from the outside — a Korean given name does not announce which pool it came from. Russian is the exception: its patronymic and its surname both inflect, so `Иванов` becomes `Иванова` and `Николаевич` becomes `Николаевна`.

Leave it out and a gender is picked per name. [The detail output](./rand-name#the-detail-output) reports which one was used.
