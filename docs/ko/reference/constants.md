# 상수

생성기가 받아들이는 목록과, 모든 숫자 옵션이 제한되는 절대 범위입니다. 여기에서 예외를 던지는 것은 없습니다. `count`가 `-10`이면 아무것도 반환하지 않고, 100만이면 1만 개를 반환합니다.

## 이름

::: lang js

```javascript
import { NAME_COUNT_MAX, NAME_LANGUAGES, NAME_LENGTH_MAX, NAME_LENGTH_MIN } from 'randino';
```

| 이름              | 타입             | 값                      |
| ----------------- | ---------------- | ----------------------- |
| `NAME_LANGUAGES`  | `NameLanguage[]` | 지원하는 모든 이름 언어 |
| `NAME_LENGTH_MIN` | `number`         | `1`                     |
| `NAME_LENGTH_MAX` | `number`         | `30`                    |
| `NAME_COUNT_MAX`  | `number`         | `10000`                 |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| 이름            | 타입                 | 값                      |
| --------------- | -------------------- | ----------------------- |
| `nameLanguages` | `List<NameLanguage>` | 지원하는 모든 이름 언어 |
| `nameLengthMin` | `int`                | `1`                     |
| `nameLengthMax` | `int`                | `30`                    |
| `nameCountMax`  | `int`                | `10000`                 |

:::

`minLength`와 `maxLength`는 고유 표기의 글자 수 기준으로 `1 … 30` 범위로 제한됩니다. `count`는 `0 … 10000`으로 제한되는데, 상한이 있는 이유는 `unique`를 켠 채로 개수를 제한하지 않으면 조합이 바닥난 풀에서 오래 다시 뽑을 수 있기 때문입니다.

## 닉네임

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

| 이름                         | 타입                 | 값                        |
| ---------------------------- | -------------------- | ------------------------- |
| `NICKNAME_LANGUAGES`         | `NicknameLanguage[]` | 지원하는 모든 닉네임 언어 |
| `NICKNAME_THEMES`            | `NicknameTheme[]`    | 14개 테마 전체            |
| `NICKNAME_LENGTH_MIN`        | `number`             | `1`                       |
| `NICKNAME_LENGTH_MAX`        | `number`             | `40`                      |
| `NICKNAME_COUNT_MAX`         | `number`             | `10000`                   |
| `NICKNAME_SUFFIX_LENGTH_MAX` | `number`             | `32`                      |
| `NICKNAME_SUFFIX_CHARSET`    | `string`             | 기본 접미사 문자 집합     |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| 이름                      | 타입                     | 값                        |
| ------------------------- | ------------------------ | ------------------------- |
| `nicknameLanguages`       | `List<NicknameLanguage>` | 지원하는 모든 닉네임 언어 |
| `nicknameThemes`          | `List<NicknameTheme>`    | 14개 테마 전체            |
| `nicknameLengthMin`       | `int`                    | `1`                       |
| `nicknameLengthMax`       | `int`                    | `40`                      |
| `nicknameCountMax`        | `int`                    | `10000`                   |
| `nicknameSuffixLengthMax` | `int`                    | `32`                      |
| `nicknameSuffixCharset`   | `String`                 | 기본 접미사 문자 집합     |

:::

접미사 문자 집합은 영숫자에서 **헷갈리는 쌍을 뺀 것**입니다. `0`과 `O`가 없고 `1`, `l`, `I`도 없습니다. 닉네임은 누군가 화면에서 읽고 다른 화면에 입력하는 것이며, 그 다섯 글자가 바로 그 지점에서 문제를 일으킵니다.

`uniqueSuffixCharset`으로 좁히거나 넓힐 수 있습니다. 알파벳 전체가 아니라 기본값에서 출발하면 이 성질이 유지됩니다.

::: lang js

```javascript
import { NICKNAME_SUFFIX_CHARSET, randomNickname } from 'randino';

// 숫자만.
randomNickname({ uniqueSuffix: true, uniqueSuffixCharset: '0123456789' });

// 기본값에서 대문자만 뺀 것.
randomNickname({
	uniqueSuffix: true,
	uniqueSuffixCharset: NICKNAME_SUFFIX_CHARSET.replace(/[A-Z]/g, '')
});
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

// 숫자만.
randomNickname(uniqueSuffix: true, uniqueSuffixCharset: '0123456789');

// 기본값에서 대문자만 뺀 것.
randomNickname(
  uniqueSuffix: true,
  uniqueSuffixCharset: nicknameSuffixCharset.replaceAll(RegExp('[A-Z]'), ''),
);
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
	RandomNameOptions,
	RandomNicknameOptions
} from 'randino';

const options: RandomNameOptions = { language: 'ko', count: 3 };
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

## 함께 보기

- [지원 언어](../guide/languages) — 각 언어 코드가 다루는 범위.
- [테마](../nickname/themes) — 각 테마가 담고 있는 것.
