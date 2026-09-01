# Constants

The lists the generators accept, and the hard bounds every numeric option is clamped to. Nothing here throws: a `count` of `-10` returns nothing and a `count` of a million returns ten thousand.

## Names

::: lang js

```javascript
import { NAME_COUNT_MAX, NAME_LANGUAGES, NAME_LENGTH_MAX, NAME_LENGTH_MIN } from 'randino';
```

| Name              | Type             | Value                         |
| ----------------- | ---------------- | ----------------------------- |
| `NAME_LANGUAGES`  | `NameLanguage[]` | Every supported name language |
| `NAME_LENGTH_MIN` | `number`         | `1`                           |
| `NAME_LENGTH_MAX` | `number`         | `30`                          |
| `NAME_COUNT_MAX`  | `number`         | `10000`                       |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name            | Type                 | Value                         |
| --------------- | -------------------- | ----------------------------- |
| `nameLanguages` | `List<NameLanguage>` | Every supported name language |
| `nameLengthMin` | `int`                | `1`                           |
| `nameLengthMax` | `int`                | `30`                          |
| `nameCountMax`  | `int`                | `10000`                       |

:::

::: lang py

```python
from randino import NAME_COUNT_MAX, NAME_LANGUAGES, NAME_LENGTH_MAX, NAME_LENGTH_MIN
```

| Name              | Type                     | Value                         |
| ----------------- | ------------------------ | ----------------------------- |
| `NAME_LANGUAGES`  | `tuple[NameLanguage, …]` | Every supported name language |
| `NAME_LENGTH_MIN` | `int`                    | `1`                           |
| `NAME_LENGTH_MAX` | `int`                    | `30`                          |
| `NAME_COUNT_MAX`  | `int`                    | `10000`                       |

:::

The length options are clamped into `1 … 30`, counted in characters of the native form. `count` is clamped into `0 … 10000` — the upper bound is there because an unbounded count with `unique` on can spend a long time re-drawing from an exhausted pool.

## Nicknames

::: lang js

```javascript
import {
	NICKNAME_COUNT_MAX,
	NICKNAME_LANGUAGES,
	NICKNAME_LENGTH_MAX,
	NICKNAME_LENGTH_MIN,
	NICKNAME_THEMES
} from 'randino';
```

| Name                  | Type                 | Value                             |
| --------------------- | -------------------- | --------------------------------- |
| `NICKNAME_LANGUAGES`  | `NicknameLanguage[]` | Every supported nickname language |
| `NICKNAME_THEMES`     | `NicknameTheme[]`    | All fourteen themes               |
| `NICKNAME_LENGTH_MIN` | `number`             | `1`                               |
| `NICKNAME_LENGTH_MAX` | `number`             | `40`                              |
| `NICKNAME_COUNT_MAX`  | `number`             | `10000`                           |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name                | Type                     | Value                             |
| ------------------- | ------------------------ | --------------------------------- |
| `nicknameLanguages` | `List<NicknameLanguage>` | Every supported nickname language |
| `nicknameThemes`    | `List<NicknameTheme>`    | All fourteen themes               |
| `nicknameLengthMin` | `int`                    | `1`                               |
| `nicknameLengthMax` | `int`                    | `40`                              |
| `nicknameCountMax`  | `int`                    | `10000`                           |

:::

::: lang py

```python
from randino import (
    NICKNAME_COUNT_MAX,
    NICKNAME_LANGUAGES,
    NICKNAME_LENGTH_MAX,
    NICKNAME_LENGTH_MIN,
    NICKNAME_THEMES,
)
```

| Name                  | Type                         | Value                             |
| --------------------- | ---------------------------- | --------------------------------- |
| `NICKNAME_LANGUAGES`  | `tuple[NicknameLanguage, …]` | Every supported nickname language |
| `NICKNAME_THEMES`     | `tuple[NicknameTheme, …]`    | All fourteen themes               |
| `NICKNAME_LENGTH_MIN` | `int`                        | `1`                               |
| `NICKNAME_LENGTH_MAX` | `int`                        | `40`                              |
| `NICKNAME_COUNT_MAX`  | `int`                        | `10000`                           |

:::

## Affixes

::: lang js

```javascript
import {
	AFFIX_CHARSET,
	AFFIX_LENGTH_DEFAULT,
	AFFIX_LENGTH_MAX,
	AFFIX_SEPARATOR_DEFAULT
} from 'randino';
```

| Name                      | Type     | Value                        |
| ------------------------- | -------- | ---------------------------- |
| `AFFIX_LENGTH_DEFAULT`    | `number` | `5`                          |
| `AFFIX_LENGTH_MAX`        | `number` | `32`                         |
| `AFFIX_SEPARATOR_DEFAULT` | `string` | `'_'`                        |
| `AFFIX_CHARSET`           | `string` | The default token characters |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name                    | Type     | Value                        |
| ----------------------- | -------- | ---------------------------- |
| `affixLengthDefault`    | `int`    | `5`                          |
| `affixLengthMax`        | `int`    | `32`                         |
| `affixSeparatorDefault` | `String` | `'_'`                        |
| `affixCharset`          | `String` | The default token characters |

:::

::: lang py

```python
from randino import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_DEFAULT,
    AFFIX_LENGTH_MAX,
    AFFIX_SEPARATOR_DEFAULT,
)
```

| Name                      | Type  | Value                        |
| ------------------------- | ----- | ---------------------------- |
| `AFFIX_LENGTH_DEFAULT`    | `int` | `5`                          |
| `AFFIX_LENGTH_MAX`        | `int` | `32`                         |
| `AFFIX_SEPARATOR_DEFAULT` | `str` | `"_"`                        |
| `AFFIX_CHARSET`           | `str` | The default token characters |

:::

The charset is alphanumerics **minus the pairs that misread**: no `0` or `O`, no `1`, `l` or `I`. An affix is something somebody reads off a screen and types into another one, and those five characters are where that goes wrong.

Narrow it or extend it through <Lang js="charset" dart="charset" py="charset" code /> — starting from the default rather than from the alphabet keeps that property:

::: lang js

```javascript
import { AFFIX_CHARSET, randSuffix } from 'randino';

// Digits only.
randSuffix('MistyOwl', { charset: '0123456789' });

// The default, minus the upper case.
randSuffix('MistyOwl', { charset: AFFIX_CHARSET.replace(/[A-Z]/g, '') });
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

// Digits only.
randSuffix('MistyOwl', charset: '0123456789');

// The default, minus the upper case.
randSuffix('MistyOwl', charset: affixCharset.replaceAll(RegExp('[A-Z]'), ''));
```

:::

::: lang py

```python
from randino import AFFIX_CHARSET, rand_suffix

# Digits only.
rand_suffix("MistyOwl", charset="0123456789")

# The default, minus the upper case.
rand_suffix("MistyOwl", charset="".join(c for c in AFFIX_CHARSET if not c.isupper()))
```

:::

## Types

::: lang js

Every public type is exported alongside the functions, so an options object can be typed on its own:

```typescript
import type {
	NameDetail,
	NameGender,
	NameGenderOption,
	NameLanguage,
	NameLanguageOption,
	NameScript,
	NicknameDetail,
	NicknameLanguage,
	NicknameLanguageOption,
	NicknameTheme,
	NicknameThemeOption,
	RandNameOptions,
	RandNicknameOptions,
	RandOutput
} from 'randino';

const options: RandNameOptions = { language: 'ko', count: 3 };
```

The `…Option` types are the union of a language or theme with `'all'` — `NameLanguageOption` is `NameLanguage | 'all'`. Use the narrower one wherever `'all'` is not a valid answer, which is what the helpers do.

:::

::: lang dart

Every public type is exported alongside the functions:

```dart
import 'package:randino/randino.dart';

// Enums
NameLanguage, NameGender, NameScript
NicknameLanguage, NicknameTheme

// Values
LengthRange, NameDetail, NicknameDetail
```

There is no `…Option` type and no `all` member: **a null enum is what means "every one of them"**, so the parameter you do not write is already the mixed draw. That also means the helpers take the same type the generators do, rather than a narrower one.

:::

::: lang py

Every public type is importable alongside the functions, and the package ships a `py.typed` marker so a checker reads them:

```python
from randino import (
    NameDetail,
    NameGender,
    NameGenderOption,
    NameLanguage,
    NameLanguageOption,
    NameScript,
    NicknameDetail,
    NicknameLanguage,
    NicknameLanguageOption,
    NicknameTheme,
    NicknameThemeOption,
    RandOutput,
)

language: NameLanguageOption = "ko"
```

They are `Literal` types rather than classes, so `"kr"` is rejected where `NameLanguage` is expected. The `…Option` types add `"all"` — `NameLanguageOption` is `NameLanguage | Literal["all"]`. Use the narrower one wherever `"all"` is not a valid answer.

There is no options type to import: the arguments are keyword-only rather than an object, so there is nothing to annotate.

:::

## See also

- [Supported languages](../guide/languages) — what each language code covers.
- [Themes](../nickname/themes) — what each theme holds.
