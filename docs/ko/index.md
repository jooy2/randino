---
layout: home

title: randino
titleTemplate: 원하는 언어로 만드는 무작위 이름과 닉네임, 그리고 문장
description: 9개 언어로 사람 이름과 닉네임, 단어와 문장을 무작위로 생성합니다. Emma Clover, MistyOwl, 여우가 사과를 먹는다. JavaScript, Dart, Python 패키지로 제공되며 런타임 의존성이 없습니다.

hero:
  name: randino
  text: 그 언어답게 읽히는 무작위 텍스트
  tagline: 실제로 쓰이는 사람 이름과, 사람이 실제로 고를 법한 닉네임, 그 바탕이 되는 일상 단어, 그리고 그 언어의 문법으로 쓴 문장. 9개 언어를 지원하고 JavaScript, Dart, Python으로 제공되며 런타임 의존성이 없습니다.
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/guide/getting-started
    - theme: alt
      text: 사람 이름
      link: /ko/name/
    - theme: alt
      text: 닉네임
      link: /ko/nickname/
    - theme: alt
      text: 단어
      link: /ko/word/rand-word
    - theme: alt
      text: 문장
      link: /ko/sentence/
  image:
    src: /512x512.png
    alt: randino

features:
  - title: 이름처럼 보이는 문자열이 아닌, 진짜 이름
    details: 언어별로 선별한 이름 풀에서 뽑고, 성씨는 실제 인구 분포에 맞춰 가중치를 둡니다. 한국어 이름 다섯 개 중 하나는 김씨입니다.
    link: /ko/name/
    linkText: 사람 이름
  - title: 일상 단어로 만드는 닉네임
    details: 25개 테마의 명사에 수식어를 붙입니다. 사람 이름은 절대 쓰지 않으며, 그래서 닉네임이 이름처럼 읽히지 않습니다.
    link: /ko/nickname/
    linkText: 닉네임
  - title: 단어 그 자체로
    details: 25개 테마마다 함수가 하나씩. randAnimal, randFood, randGem — 닉네임을 만드는 어휘를 닉네임 없이 그대로 씁니다.
    link: /ko/word/rand-word
    linkText: randWord
  - title: 단어 나열이 아닌 문장
    details: 동사가 무엇이 그 행위를 할 수 있고 무엇에 할 수 있는지 밝히므로 한 문장의 단어들이 서로 어울립니다. 조사와 관사와 어순은 각 언어의 것입니다.
    link: /ko/sentence/
    linkText: 문장
  - title: 세 개의 패키지, 하나의 라이브러리
    details: JavaScript, Dart, Python이 같은 데이터셋과 같은 규칙을 씁니다. 문서 한 페이지가 셋 모두를 설명하며, 사이드바에서 원하는 언어를 고르면 됩니다.
    link: /ko/guide/getting-started
    linkText: 시작하기
  - title: 9개 언어
    details: 한국어, 영어, 일본어, 중국어, 이탈리아어, 독일어, 러시아어, 스페인어, 베트남어를 각자의 문자와 로마자 표기 규칙으로 지원합니다.
    link: /ko/guide/languages
    linkText: 지원 언어
---

## 어떤 모습인가요

::: lang js

```javascript
import { randName, randNickname, randSuffix } from 'randino';

randName({ language: 'en', count: 3 });
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

randName({ language: 'en', gender: 'female', includeMiddleName: true });
// ['Danielle Sylvia Owens']

randNickname({ language: 'en', count: 3 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

randSuffix(randNickname({ language: 'en', count: 2 }));
// ['FoggyHillside_gDe2C', 'CraneVoyage_nVtRC']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randName(language: NameLanguage.en, count: 3);
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

randName(
  language: NameLanguage.en,
  gender: NameGender.female,
  includeMiddleName: true,
);
// ['Danielle Sylvia Owens']

randNickname(language: WordLanguage.en, count: 3);
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

randSuffixAll(randNickname(language: WordLanguage.en, count: 2));
// ['FoggyHillside_gDe2C', 'CraneVoyage_nVtRC']
```

:::

::: lang py

```python
from randino import rand_name, rand_nickname, rand_suffix

rand_name(language="en", count=3)
# ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

rand_name(language="en", gender="female", include_middle_name=True)
# ['Danielle Sylvia Owens']

rand_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

rand_suffix(rand_nickname(language="en", count=2))
# ['FoggyHillside_gDe2C', 'CraneVoyage_nVtRC']
```

:::

모든 옵션은 선택 사항이므로, 인자 없이 호출하면 9개 언어 중 하나로 이름 하나를 반환합니다. 각 옵션이 하는 일은 [사람 이름](./name/)과 [닉네임](./nickname/)에 있고, 설치 방법은 [시작하기](./guide/getting-started) 한 페이지로 끝납니다.
