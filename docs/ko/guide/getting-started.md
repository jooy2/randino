# 시작하기

randino는 하나의 데이터셋을 세 개의 패키지로 제공합니다. 사이드바에서 사용할 언어를 고르세요. 이 사이트의 모든 코드 예제는 그 선택을 따라갑니다.

::: lang js

JavaScript 패키지는 npm에 [`randino`](https://www.npmjs.com/package/randino)로 배포됩니다. 타입 선언이 포함된 ESM이며 **런타임 의존성이 없습니다**. 뒤따라 설치되는 패키지가 없고, Node와 브라우저 양쪽에서 그대로 동작합니다.

:::

::: lang dart

Dart 패키지는 pub.dev에 [`randino`](https://pub.dev/packages/randino)로 배포됩니다. **순수 Dart**로 작성되어 `dart:math` 외에는 아무것도 import하지 않으므로, VM과 웹은 물론 모든 플랫폼의 Flutter에서 플러그인이나 에셋 없이 동작합니다.

:::

::: lang py

Python 패키지는 PyPI에 [`randino`](https://pypi.org/project/randino/)로 배포됩니다. **순수 Python**으로 작성되어 표준 라이브러리 외에는 아무것도 import하지 않으며, `py.typed` 마커를 포함하므로 mypy와 Pyright가 타입 주석을 무시하지 않고 그대로 읽습니다.

:::

> **세 패키지의 출력은 동일합니다.** 이름 풀, 가중치, 길이 규칙, 로마자 표기는 하나의 구현을 세 언어로 옮긴 것이고, 세 테스트 스위트가 같은 데이터에 대해 같은 속성을 검증합니다. 다만 버전은 각각 관리하므로 npm, pub.dev, PyPI의 버전 번호는 항상 같지는 않습니다.

## 설치

::: lang js

```bash
npm install randino
```

**Node.js 18 이상** 또는 아무 브라우저면 됩니다. 설치는 이게 전부이고, 따로 설정할 것이 없습니다.

:::

::: lang dart

```bash
dart pub add randino
```

**Dart 3.7 이상**(Flutter 3.29)이면 됩니다. 설치는 이게 전부이고, 따로 설정할 것이 없습니다.

:::

::: lang py

```bash
pip install randino
```

**Python 3.10 이상**이면 됩니다. 설치는 이게 전부이고, 따로 설정할 것이 없습니다.

:::

## 첫 번째 이름

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

모든 옵션에 기본값이 있어서 인자 없이 호출해도 동작합니다. 이때 반환되는 것은 [지원하는 9개 언어](./languages) 중 하나로 된 이름 하나입니다. 여러 언어를 섞는 것이 기본 동작인데, 샘플 데이터를 만들 때는 이게 알맞지만 한 언어로 통일해야 하는 화면에는 맞지 않습니다. 언어를 지정하면 그 언어로 고정됩니다.

::: lang js

```javascript
randName({ language: 'ko', count: 3 });
// ['김태윤', '원동혁', '조진우']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.ko, count: 3);
// ['김태윤', '원동혁', '조진우']
```

:::

::: lang py

```python
rand_name(language="ko", count=3)
# ['김태윤', '원동혁', '조진우']
```

:::

## 첫 번째 닉네임

닉네임은 이름이 아니고, randino는 이 둘을 의도적으로 분리합니다. 닉네임은 동물, 사물, 장소, 음식 같은 일상 단어로만 만들어지고 **사람 이름은 절대 쓰지 않습니다**. 생성된 핸들이 누군가의 실명처럼 읽히지 않게 하는 것이 바로 이 규칙입니다.

::: lang js

```javascript
import { randNickname } from 'randino';

randNickname({ language: 'ko', count: 3 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randNickname({ language: 'en', count: 3 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNickname(language: WordLanguage.ko, count: 3);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randNickname(language: WordLanguage.en, count: 3);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

::: lang py

```python
from randino import rand_nickname

rand_nickname(language="ko", count=3)
# ['오래된곰', '영원한도마뱀', '귀여운신화다발']

rand_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']
```

:::

## 옵션을 쓰는 방식

세 패키지는 같은 이름의 같은 옵션을 받습니다. 다른 것은 옵션을 전달하는 형태뿐이고, 익혀야 할 차이도 그것 하나입니다.

::: lang js

모든 함수는 **옵션 객체 하나**를 받고, 그 안의 모든 키는 선택 사항입니다.

```javascript
randName({
	language: 'ja',
	gender: 'female',
	count: 5,
	script: 'roman'
});
```

"전부"를 뜻하는 값은 `'all'`이고, `language`, `gender`, `theme`의 기본값이 그것입니다.

:::

::: lang dart

모든 함수는 **named parameter**를 받고, 모든 파라미터가 선택 사항입니다.

```dart
randName(
  language: NameLanguage.ja,
  gender: NameGender.female,
  count: 5,
  script: NameScript.roman,
);
```

"전부"를 뜻하는 것은 **null인 enum**, 즉 파라미터를 아예 쓰지 않는 것입니다. `NameLanguage.all` 같은 값은 없습니다. 쓰지 않은 파라미터가 이미 Dart에서 "지정하지 않음"을 뜻하기 때문입니다.

```dart
randName(count: 5); // 9개 언어 중 하나씩, 이름 다섯 개
```

null이 다른 뜻을 갖는 곳은 `NicknameDetail.theme` 하나뿐입니다. 여기서 null은 그 단어를 생성기가 모른다는 뜻으로, 새로 만들어낸 단어인 경우입니다.

:::

::: lang py

모든 함수는 **키워드 전용 인자**를 받고, 모든 인자가 선택 사항입니다.

```python
rand_name(
    language="ja",
    gender="female",
    count=5,
    script="roman",
)
```

키워드 전용인 것은 의도적입니다. `rand_name("ja", "female", 5)`는 짧게 쓸 수는 있지만 읽을 수 없고, 파라미터 순서를 API에 고정시켜 버립니다. 그래서 위치 인자 형태는 아예 제공하지 않습니다.

옵션 값은 npm 패키지가 쓰는 것과 같은 문자열이며 `Literal`로 타입이 지정되어 있어서, `language="kr"` 같은 실수는 실행 전에 타입 검사기가 잡아냅니다. "전부"를 뜻하는 값은 `"all"`이고, `language`, `gender`, `theme`의 기본값이 그것입니다.

```python
rand_name(count=5)  # 9개 언어 중 하나씩, 이름 다섯 개
```

이름은 `snake_case`를 씁니다. `includeMiddleName`은 `include_middle_name`, `minLength`는 `min_length`, `startsWith`는 `starts_with`입니다.

:::

## 다음으로

- [**지원 언어**](./languages) — 9개 언어 코드가 무엇을 다루는지, 그리고 닉네임이 그보다 적은 언어만 지원하는 이유.
- [**사람 이름**](../name/) — 모든 옵션과, 각 옵션이 출력에 미치는 영향.
- [**닉네임**](../nickname/) — 모든 옵션과 14개 테마.
