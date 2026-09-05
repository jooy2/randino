# Getting started

randino ships as three packages from one set of datasets. Pick your language in the sidebar, and every code sample on this site follows that choice, including the ones below.

::: lang js

The JavaScript package is published to npm as [`randino`](https://www.npmjs.com/package/randino). It is ESM with type declarations and has **no runtime dependencies**. Nothing is pulled in behind it, and it runs in Node and in the browser alike.

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

**Node.js 18 or newer**, or any browser. That is the whole install, and there is nothing to configure.

:::

::: lang dart

```bash
dart pub add randino
```

**Dart 3.7 or newer** (Flutter 3.29). That is the whole install, and there is nothing to configure.

:::

::: lang py

```bash
pip install randino
```

**Python 3.10 or newer**. That is the whole install, and there is nothing to configure.

:::

## Your first name

::: lang js

```javascript
import { randName } from 'randino';

randName();
// ['Emma Clover']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randName();
// ['Emma Clover']
```

:::

::: lang py

```python
from randino import rand_name

rand_name()
# ['Emma Clover']
```

:::

Every option has a default, so a call with nothing in it works. It returns one name in one of the [nine supported languages](./languages). The mixed draw is the default, which suits sample data and does not suit a screen that has to be in one language. Name the language and it stays there:

::: lang js

```javascript
randName({ language: 'en', count: 3 });
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.en, count: 3);
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

::: lang py

```python
rand_name(language="en", count=3)
# ['Christina Mills', 'Jack Reeves', 'Brian Wallace']
```

:::

## Your first nickname

randino keeps nicknames and names apart on purpose. Nicknames are built from everyday words such as animals, things, places and food, and **never from person names**, which stops a generated handle from reading like somebody's identity.

::: lang js

```javascript
import { randNickname } from 'randino';

randNickname({ language: 'en', count: 3 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNickname(language: WordLanguage.en, count: 3);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

## How the options are written

Every package takes the same options under the same names. What differs is the shape they arrive in.

::: lang js

Every function takes **one options object**, and every key in it is optional:

```javascript
randName({
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
randName(
  language: NameLanguage.ja,
  gender: NameGender.female,
  count: 5,
  script: NameScript.roman,
);
```

A **null enum is what means "every one of them"**, which is to say: leave the parameter out. There is no `NameLanguage.all` to pass, because a parameter you do not write is already the way Dart says "no preference".

```dart
randName(count: 5); // five names, each in one of the nine languages
```

The one nullable that means something else is `NicknameDetail.theme`, where null says the word is not one the generator knows, which happens when it was invented.

:::

::: lang py

Every function takes **keyword-only arguments**, and every one of them is optional:

```python
rand_name(
    language="ja",
    gender="female",
    count=5,
    script="roman",
)
```

They are keyword-only on purpose. `rand_name("ja", "female", 5)` would be shorter to write and impossible to read, and it would freeze the parameter order into the API, so there is no positional form to reach for.

The options are the same strings the npm package uses, typed as `Literal`, so a checker catches `language="kr"` before it runs. `"all"` is the value that means "every one of them", and it is the default for `language`, `gender` and `theme`.

```python
rand_name(count=5)  # five names, each in one of the nine languages
```

Names are `snake_case`: `includeMiddleName` is `include_middle_name`, `minLength` is `min_length`, `startsWith` is `starts_with`.

:::

## Where to go next

- [**Supported languages**](./languages) — what the nine codes cover, and where they differ from one another.
- [**Person names**](../name/) — every option, and what it does to the output.
- [**Nicknames**](../nickname/) — every option, and how the shapes are chosen.
- [**`randWord`**](../word/rand-word) — the twenty-five themes on their own, one function each.
- [**`randSentence`**](../sentence/rand-sentence) — whole statements, in the language's own grammar.
- [**`randModifier`**](../decorate/rand-modifier) — a modifier in front of any string, the way `randSuffix` puts a token behind one.
