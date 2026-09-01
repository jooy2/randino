# Getting started

randino ships as three packages from one set of datasets. Pick your language in the sidebar — every code sample on this site follows that choice, including the ones below.

::: lang js

The JavaScript package is published to npm as [`randino`](https://www.npmjs.com/package/randino). It is ESM with type declarations, and it has **no runtime dependencies** — nothing is pulled in behind it, and it runs in Node and in the browser alike.

:::

::: lang dart

The Dart package is published to pub.dev as [`randino`](https://pub.dev/packages/randino). It is **pure Dart** and imports nothing but `dart:math`, so it runs on the VM, on the web and inside Flutter on every platform, with no plugins and no assets.

:::

::: lang py

The Python package is published to PyPI as [`randino`](https://pypi.org/project/randino/). It is **pure Python** and imports nothing outside the standard library, and it ships a `py.typed` marker, so mypy and Pyright read its annotations rather than treating it as untyped.

:::

> **Every package generates the same output.** The pools, the weights, the length rules and the romanization are one implementation ported three ways, and all three test suites assert the same properties over the same data. They version independently, so the numbers on npm, pub.dev and PyPI will not always agree.

## Install

::: lang js

```bash
npm install randino
```

**Node.js 18 or newer**, or any browser. That is the whole install — there is nothing to configure.

:::

::: lang dart

```bash
dart pub add randino
```

**Dart 3.7 or newer** (Flutter 3.29). That is the whole install — there is nothing to configure.

:::

::: lang py

```bash
pip install randino
```

**Python 3.10 or newer**. That is the whole install — there is nothing to configure.

:::

## Your first name

::: lang js

```javascript
import { randomName } from 'randino';

randomName();
// ['Emma Clover']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randomName();
// ['Emma Clover']
```

:::

::: lang py

```python
from randino import random_name

random_name()
# ['Emma Clover']
```

:::

Every option has a default, so a call with nothing in it works. What it returns is one name in one of the [nine supported languages](./languages) — the mixed draw is the default, which is what you want for sample data and not what you want for a screen that has to be in one language. Name the language and it stays there:

::: lang js

```javascript
randomName({ language: 'ko', count: 3 });
// ['김태윤', '원동혁', '조진우']
```

:::

::: lang dart

```dart
randomName(language: NameLanguage.ko, count: 3);
// ['김태윤', '원동혁', '조진우']
```

:::

::: lang py

```python
random_name(language="ko", count=3)
# ['김태윤', '원동혁', '조진우']
```

:::

## Your first nickname

A nickname is not a name, and randino keeps the two apart on purpose: nicknames are built from everyday words — animals, things, places, food — and **never from person names**, which is what stops a generated handle from reading like somebody's identity.

::: lang js

```javascript
import { randomNickname } from 'randino';

randomNickname({ language: 'ko', count: 3 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randomNickname({ language: 'en', count: 3 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randomNickname(language: NicknameLanguage.ko, count: 3);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randomNickname(language: NicknameLanguage.en, count: 3);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang py

```python
from randino import random_nickname

random_nickname(language="ko", count=3)
# ['오래된곰', '영원한도마뱀', '귀여운신화다발']

random_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

## How the options are written

Every package takes the same options under the same names. What differs is the shape they arrive in, and that is the only difference worth learning.

::: lang js

Every function takes **one options object**, and every key in it is optional:

```javascript
randomName({
	language: 'ja',
	gender: 'female',
	count: 5,
	script: 'roman'
});
```

`'all'` is the value that means "every one of them", and it is the default for `language`, `gender` and `theme`.

:::

::: lang dart

Every function takes **named parameters**, and every one of them is optional:

```dart
randomName(
  language: NameLanguage.ja,
  gender: NameGender.female,
  count: 5,
  script: NameScript.roman,
);
```

A **null enum is what means "every one of them"**, which is to say: leave the parameter out. There is no `NameLanguage.all` to pass, because a parameter you do not write is already the way Dart says "no preference".

```dart
randomName(count: 5); // five names, each in one of the nine languages
```

The one nullable that means something else is `NicknameDetail.theme`, where null says the word is not one the generator knows — an invented one, or a `baseWord` of your own.

:::

::: lang py

Every function takes **keyword-only arguments**, and every one of them is optional:

```python
random_name(
    language="ja",
    gender="female",
    count=5,
    script="roman",
)
```

They are keyword-only on purpose. `random_name("ja", "female", 5)` would be shorter to write and impossible to read, and it would freeze the parameter order into the API — so there is no positional form to reach for.

The options are the same strings the npm package uses, typed as `Literal`, so a checker catches `language="kr"` before it runs. `"all"` is the value that means "every one of them", and it is the default for `language`, `gender` and `theme`.

```python
random_name(count=5)  # five names, each in one of the nine languages
```

Names are `snake_case`: `includeMiddleName` is `include_middle_name`, `minLength` is `min_length`, `startsWith` is `starts_with`.

`random_nickname`'s `language` is the one argument whose default is `None` rather than `"all"`, and the two are not the same request. Left out, a `base_word` picks the language it is written in, so `"고양이"` is never handed an English modifier; passing `"all"` mixes every language regardless.

:::

## Where to go next

- [**Supported languages**](./languages) — what the nine codes cover, and why nicknames cover fewer of them.
- [**Person names**](../name/) — every option, and what it does to the output.
- [**Nicknames**](../nickname/) — every option, and the fourteen themes.
