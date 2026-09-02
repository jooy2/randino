# 상수

생성기가 받아들이는 목록과, 모든 숫자 옵션이 제한되는 절대 범위입니다. 여기에서 예외를 던지는 것은 없습니다. `count`가 `-10`이면 아무것도 반환하지 않고, 100만이면 1만 개를 반환합니다.

## 공통 범위 {#shared-bounds}

모든 생성 함수는 같은 방식으로 개수를 세고, 값을 제한하고, 중복을 걸러냅니다. 그래서 범위 상수도 생성 함수마다 하나씩 두지 않고 하나로 묶여 있습니다.

::: lang js

```javascript
import { RAND_COUNT_MAX, RAND_LENGTH_MAX, RAND_LENGTH_MIN } from 'randino';
```

| 이름              | 타입     | 값      |
| ----------------- | -------- | ------- |
| `RAND_LENGTH_MIN` | `number` | `1`     |
| `RAND_LENGTH_MAX` | `number` | `40`    |
| `RAND_COUNT_MAX`  | `number` | `10000` |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| 이름            | 타입  | 값      |
| --------------- | ----- | ------- |
| `randLengthMin` | `int` | `1`     |
| `randLengthMax` | `int` | `40`    |
| `randCountMax`  | `int` | `10000` |

:::

::: lang py

```python
from randino import RAND_COUNT_MAX, RAND_LENGTH_MAX, RAND_LENGTH_MIN
```

| 이름              | 타입  | 값      |
| ----------------- | ----- | ------- |
| `RAND_LENGTH_MIN` | `int` | `1`     |
| `RAND_LENGTH_MAX` | `int` | `40`    |
| `RAND_COUNT_MAX`  | `int` | `10000` |

:::

길이 옵션은 생성 결과의 글자 수를 기준으로 `1 … 40`으로 제한됩니다. `count`는 `0 … 10000`으로 제한되는데, 상한이 있는 이유는 `unique`를 켠 채로 개수를 제한하지 않으면 이미 바닥난 후보에서 계속 다시 뽑느라 오래 걸릴 수 있기 때문입니다.

## 이름

::: lang js

```javascript
import { NAME_LANGUAGES } from 'randino';
```

| 이름             | 타입             | 값                      |
| ---------------- | ---------------- | ----------------------- |
| `NAME_LANGUAGES` | `NameLanguage[]` | 지원하는 모든 이름 언어 |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| 이름            | 타입                 | 값                      |
| --------------- | -------------------- | ----------------------- |
| `nameLanguages` | `List<NameLanguage>` | 지원하는 모든 이름 언어 |

:::

::: lang py

```python
from randino import NAME_LANGUAGES
```

| 이름             | 타입                     | 값                      |
| ---------------- | ------------------------ | ----------------------- |
| `NAME_LANGUAGES` | `tuple[NameLanguage, …]` | 지원하는 모든 이름 언어 |

:::

## 닉네임

::: lang js

```javascript
import { NICKNAME_LANGUAGES, NICKNAME_THEMES } from 'randino';
```

| 이름                 | 타입                 | 값                        |
| -------------------- | -------------------- | ------------------------- |
| `NICKNAME_LANGUAGES` | `NicknameLanguage[]` | 지원하는 모든 닉네임 언어 |
| `NICKNAME_THEMES`    | `NicknameTheme[]`    | 14개 테마 전체            |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| 이름                | 타입                     | 값                        |
| ------------------- | ------------------------ | ------------------------- |
| `nicknameLanguages` | `List<NicknameLanguage>` | 지원하는 모든 닉네임 언어 |
| `nicknameThemes`    | `List<NicknameTheme>`    | 14개 테마 전체            |

:::

::: lang py

```python
from randino import NICKNAME_LANGUAGES, NICKNAME_THEMES
```

| 이름                 | 타입                         | 값                        |
| -------------------- | ---------------------------- | ------------------------- |
| `NICKNAME_LANGUAGES` | `tuple[NicknameLanguage, …]` | 지원하는 모든 닉네임 언어 |
| `NICKNAME_THEMES`    | `tuple[NicknameTheme, …]`    | 14개 테마 전체            |

:::

## 접미사와 접두사 {#affixes}

::: lang js

```javascript
import {
	AFFIX_CHARSET,
	AFFIX_LENGTH_DEFAULT,
	AFFIX_LENGTH_MAX,
	AFFIX_SEPARATOR_DEFAULT
} from 'randino';
```

| 이름                      | 타입     | 값                    |
| ------------------------- | -------- | --------------------- |
| `AFFIX_LENGTH_DEFAULT`    | `number` | `5`                   |
| `AFFIX_LENGTH_MAX`        | `number` | `32`                  |
| `AFFIX_SEPARATOR_DEFAULT` | `string` | `'_'`                 |
| `AFFIX_CHARSET`           | `string` | 토큰의 기본 문자 집합 |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| 이름                    | 타입     | 값                    |
| ----------------------- | -------- | --------------------- |
| `affixLengthDefault`    | `int`    | `5`                   |
| `affixLengthMax`        | `int`    | `32`                  |
| `affixSeparatorDefault` | `String` | `'_'`                 |
| `affixCharset`          | `String` | 토큰의 기본 문자 집합 |

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

| 이름                      | 타입  | 값                    |
| ------------------------- | ----- | --------------------- |
| `AFFIX_LENGTH_DEFAULT`    | `int` | `5`                   |
| `AFFIX_LENGTH_MAX`        | `int` | `32`                  |
| `AFFIX_SEPARATOR_DEFAULT` | `str` | `"_"`                 |
| `AFFIX_CHARSET`           | `str` | 토큰의 기본 문자 집합 |

:::

이 문자 집합은 영숫자에서 **헷갈리는 쌍을 뺀 것**입니다. `0`과 `O`가 없고 `1`, `l`, `I`도 없습니다. 접미사는 누군가 화면에서 읽고 다른 화면에 입력하는 값이며, 그 다섯 글자가 바로 그 지점에서 문제를 일으킵니다.

<Lang js="charset" dart="charset" py="charset" code />으로 좁히거나 넓힐 수 있습니다. 알파벳 전체가 아니라 기본값에서 출발하면 이 성질이 유지됩니다.

::: lang js

```javascript
import { AFFIX_CHARSET, randSuffix } from 'randino';

// 숫자만.
randSuffix('MistyOwl', { charset: '0123456789' });

// 기본값에서 대문자를 뺀 것.
randSuffix('MistyOwl', { charset: AFFIX_CHARSET.replace(/[A-Z]/g, '') });
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

// 숫자만.
randSuffix('MistyOwl', charset: '0123456789');

// 기본값에서 대문자를 뺀 것.
randSuffix('MistyOwl', charset: affixCharset.replaceAll(RegExp('[A-Z]'), ''));
```

:::

::: lang py

```python
from randino import AFFIX_CHARSET, rand_suffix

# 숫자만.
rand_suffix("MistyOwl", charset="0123456789")

# 기본값에서 대문자를 뺀 것.
rand_suffix("MistyOwl", charset="".join(c for c in AFFIX_CHARSET if not c.isupper()))
```

:::

## 타입

::: lang js

모든 공개 타입이 함수와 함께 export되므로, 옵션 객체에 따로 타입을 붙일 수 있습니다.

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

`…Option`으로 끝나는 타입은 언어나 테마에 `'all'`을 더한 유니온입니다. `NameLanguageOption`은 `NameLanguage | 'all'`입니다. `'all'`이 유효한 답이 아닌 곳에서는 더 좁은 쪽을 쓰면 되고, 헬퍼들이 그렇게 하고 있습니다.

:::

::: lang dart

모든 공개 타입이 함수와 함께 export됩니다.

```dart
import 'package:randino/randino.dart';

// enum
NameLanguage, NameGender, NameScript
NicknameLanguage, NicknameTheme

// 값
LengthRange, NameDetail, NicknameDetail
```

`…Option` 타입도 없고 `all` 멤버도 없습니다. **null인 enum이 "전부"를 뜻하므로**, 쓰지 않은 파라미터가 이미 섞인 결과를 의미합니다. 그래서 헬퍼들도 더 좁은 타입이 아니라 생성기와 같은 타입을 받습니다.

:::

::: lang py

모든 공개 타입을 함수와 함께 import할 수 있으며, 패키지에 `py.typed` 마커가 포함되어 있어 타입 검사기가 이 주석들을 그대로 읽습니다.

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

클래스가 아니라 `Literal` 타입이므로, `NameLanguage`를 기대하는 자리에 `"kr"`를 넘기면 거부됩니다. `…Option` 타입은 여기에 `"all"`을 더한 것으로, `NameLanguageOption`은 `NameLanguage | Literal["all"]`입니다. `"all"`이 유효한 답이 아닌 자리에서는 더 좁은 쪽을 쓰세요.

import할 옵션 타입은 없습니다. 인자가 객체가 아니라 키워드 전용이므로 타입을 붙일 대상 자체가 없습니다.

:::

## 함께 보기

- [지원 언어](../guide/languages) — 각 언어 코드가 다루는 범위.
- [테마](../nickname/themes) — 각 테마가 담고 있는 것.
