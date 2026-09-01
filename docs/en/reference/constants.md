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
	NICKNAME_SUFFIX_CHARSET,
	NICKNAME_SUFFIX_LENGTH_MAX,
	NICKNAME_THEMES
} from 'randino';
```

| Name                         | Type                 | Value                             |
| ---------------------------- | -------------------- | --------------------------------- |
| `NICKNAME_LANGUAGES`         | `NicknameLanguage[]` | Every supported nickname language |
| `NICKNAME_THEMES`            | `NicknameTheme[]`    | All fourteen themes               |
| `NICKNAME_LENGTH_MIN`        | `number`             | `1`                               |
| `NICKNAME_LENGTH_MAX`        | `number`             | `40`                              |
| `NICKNAME_COUNT_MAX`         | `number`             | `10000`                           |
| `NICKNAME_SUFFIX_LENGTH_MAX` | `number`             | `32`                              |
| `NICKNAME_SUFFIX_CHARSET`    | `string`             | The default suffix characters     |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name                      | Type                     | Value                             |
| ------------------------- | ------------------------ | --------------------------------- |
| `nicknameLanguages`       | `List<NicknameLanguage>` | Every supported nickname language |
| `nicknameThemes`          | `List<NicknameTheme>`    | All fourteen themes               |
| `nicknameLengthMin`       | `int`                    | `1`                               |
| `nicknameLengthMax`       | `int`                    | `40`                              |
| `nicknameCountMax`        | `int`                    | `10000`                           |
| `nicknameSuffixLengthMax` | `int`                    | `32`                              |
| `nicknameSuffixCharset`   | `String`                 | The default suffix characters     |

:::

::: lang py

```python
from randino import (
    NICKNAME_COUNT_MAX,
    NICKNAME_LANGUAGES,
    NICKNAME_LENGTH_MAX,
    NICKNAME_LENGTH_MIN,
    NICKNAME_SUFFIX_CHARSET,
    NICKNAME_SUFFIX_LENGTH_MAX,
    NICKNAME_THEMES,
)
```

| Name                         | Type                         | Value                             |
| ---------------------------- | ---------------------------- | --------------------------------- |
| `NICKNAME_LANGUAGES`         | `tuple[NicknameLanguage, …]` | Every supported nickname language |
| `NICKNAME_THEMES`            | `tuple[NicknameTheme, …]`    | All fourteen themes               |
| `NICKNAME_LENGTH_MIN`        | `int`                        | `1`                               |
| `NICKNAME_LENGTH_MAX`        | `int`                        | `40`                              |
| `NICKNAME_COUNT_MAX`         | `int`                        | `10000`                           |
| `NICKNAME_SUFFIX_LENGTH_MAX` | `int`                        | `32`                              |
| `NICKNAME_SUFFIX_CHARSET`    | `str`                        | The default suffix characters     |

:::

The suffix charset is alphanumerics **minus the pairs that misread**: no `0` or `O`, no `1`, `l` or `I`. A nickname is something somebody reads off a screen and types into another one, and those five characters are where that goes wrong.

Narrow it or extend it through <Lang js="uniqueSuffixCharset" dart="uniqueSuffixCharset" py="unique_suffix_charset" code /> — starting from the default rather than from the alphabet keeps that property:

::: lang js

```javascript
import { NICKNAME_SUFFIX_CHARSET, randNickname } from 'randino';

// Digits only.
randNickname({ uniqueSuffix: true, uniqueSuffixCharset: '0123456789' });

// The default, minus the upper case.
randNickname({
	uniqueSuffix: true,
	uniqueSuffixCharset: NICKNAME_SUFFIX_CHARSET.replace(/[A-Z]/g, '')
});
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

// Digits only.
randNickname(uniqueSuffix: true, uniqueSuffixCharset: '0123456789');

// The default, minus the upper case.
randNickname(
  uniqueSuffix: true,
  uniqueSuffixCharset: nicknameSuffixCharset.replaceAll(RegExp('[A-Z]'), ''),
);
```

:::

::: lang py

```python
from randino import NICKNAME_SUFFIX_CHARSET, rand_nickname

# Digits only.
rand_nickname(unique_suffix=True, unique_suffix_charset="0123456789")

# The default, minus the upper case.
rand_nickname(
    unique_suffix=True,
    unique_suffix_charset="".join(c for c in NICKNAME_SUFFIX_CHARSET if not c.isupper()),
)
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
	RandNicknameOptions
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
)

language: NameLanguageOption = "ko"
```

They are `Literal` types rather than classes, so `"kr"` is rejected where `NameLanguage` is expected. The `…Option` types add `"all"` — `NameLanguageOption` is `NameLanguage | Literal["all"]`. Use the narrower one wherever `"all"` is not a valid answer.

There is no options type to import: the arguments are keyword-only rather than an object, so there is nothing to annotate.

:::

## See also

- [Supported languages](../guide/languages) — what each language code covers.
- [Themes](../nickname/themes) — what each theme holds.
