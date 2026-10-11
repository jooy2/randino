---
layout: home

title: randino
titleTemplate: 9개 언어로 만드는 무작위 샘플 데이터
description: 가상의 사람 이름과 닉네임, 단어, 문장, 조직과 실제 지역, 나이, 성별, 날짜, 전화번호를 9개 언어로 만들고, 예시 기기의 운영체제와 하드웨어와 파일 형식도 만듭니다. 데이터베이스 시드, 목업, 가입 화면의 이름 추천에 쓰면 됩니다. JavaScript, Dart, Python 패키지로 제공되며 런타임 의존성이 없습니다.

hero:
  name: randino
  text: 9개 언어로 만드는 무작위 샘플 데이터
  tagline: 이름과 닉네임, 단어와 문장부터 지역, 날짜, 전화번호, 예시 기기의 사양까지 만들어 줍니다. 예시 데이터나 추천 이름, 나만의 값 묶음이 필요한 곳에 쓰면 됩니다.
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/guide/getting-started
    - theme: alt
      text: 데모
      link: /ko/demo
  image:
    src: /512x512.webp
    alt: randino

features:
  - title: 사람이 쓰는 이름
    details: 언어별로 선별한 풀에서 뽑고, 성씨는 실제 인구 분포에 맞춰 가중치를 둡니다. 한국어 이름은 다섯 개 중 하나쯤이 김씨입니다.
    link: /ko/name/
    linkText: 사람 이름
  - title: 일상 단어로 만드는 닉네임
    details: 37개 테마의 명사에 수식어를 붙여 만듭니다. 사람 이름은 쓰지 않으므로 닉네임이 누군가의 실명처럼 읽히지 않습니다.
    link: /ko/nickname/
    linkText: 닉네임
  - title: 테마별 단어
    details: 동물, 음식, 보석부터 날씨와 감정까지 37개 테마마다 함수가 하나씩 있습니다. randAnimal, randFood, randGem처럼 쓰면 됩니다.
    link: /ko/word/rand-word
    linkText: randWord
  - title: 문법을 갖춘 문장
    details: 동사가 어울리는 단어만 골라 오므로 문장이 말이 됩니다. 조사와 관사와 어순은 각 언어의 것입니다.
    link: /ko/sentence/
    linkText: 문장
  - title: 레코드에 필요한 나머지 값
    details: 한국의 읍·면·동이나 미국의 도시까지 내려가는 실제 지역, 인구 분포를 따르는 나이, 서식에 쓰는 성별 표기, 존재하지 않는 회사와 학교, 원하는 형식의 날짜, 나라마다 쓰는 방식 그대로의 전화번호를 만듭니다.
    link: /ko/demo
    linkText: 데모에서 써 보기
  - title: 예시 기기의 사양
    details: 운영체제, 기기, 프로세서, 그래픽, 메모리, 저장 장치, 화면, 파일 형식을 출시된 실제 제품의 이름 그대로 뽑습니다.
    link: /ko/os/rand-os
    linkText: randOs
  - title: 세 개의 패키지, 하나의 라이브러리
    details: JavaScript, Dart, Python이 같은 데이터셋과 같은 규칙을 씁니다. 문서 한 페이지가 셋 모두를 설명하며, 사이드바에서 원하는 언어를 고르면 됩니다.
    link: /ko/guide/getting-started
    linkText: 시작하기
  - title: 9개 언어
    details: 한국어, 영어, 일본어, 중국어, 이탈리아어, 독일어, 러시아어, 스페인어, 베트남어를 각자의 문자와 로마자 표기 규칙으로 지원합니다.
    link: /ko/guide/languages
    linkText: 지원 언어
---

## 다음 언어로 시작하세요 {#pick-a-package}

<LangStart />

## 사용 예시 {#examples}

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

모든 옵션은 선택 사항이라, 인자 없이 호출하면 9개 언어 중 하나로 이름 하나를 돌려줍니다.

## 이럴 때 씁니다 {#use-cases}

| 필요한 것 | 이렇게 |
| --- | --- |
| 테스트 픽스처와 시드 데이터 | <Lang js="randName({ count: 100 })" dart="randName(count: 100)" py="rand_name(count=100)" code /> |
| 한국어 화면 목업 | <Lang js="randName({ language: 'ko', count: 20 })" dart="randName(language: NameLanguage.ko, count: 20)" py="rand_name(language=&quot;ko&quot;, count=20)" code /> |
| 가입 폼의 닉네임 추천 | <Lang js="randNickname({ count: 5 })" dart="randNickname(count: 5)" py="rand_nickname(count=5)" code /> |
| 겹치지 않는 아이디 | <Lang js="randSuffix(randNickname())" dart="randSuffix(value: randNickname().first)" py="rand_suffix(rand_nickname())" code /> |
| 자리를 채울 문단 | <Lang js="randSentence({ sentences: 3 })" dart="randSentence(sentences: 3)" py="rand_sentence(sentences=3)" code /> |
| 쿠폰 코드와 고유 토큰 | <Lang js="randSuffix()" dart="randSuffix()" py="rand_suffix()" code /> |
| 예시 프로필의 시·군·구 | <Lang js="randLocation({ language: 'ko', level: 'city' })" dart="randLocation(language: LocationLanguage.ko, level: LocationLevel.city)" py="rand_location(language=&quot;ko&quot;, level=&quot;city&quot;)" code /> |
| 테마별 단어 세트 | <Lang js="randAnimal({ count: 10 })" dart="randAnimal(count: 10)" py="rand_animal(count=10)" code /> |
| 길이가 정해진 입력칸 | <Lang js="randNickname({ maxLength: 12 })" dart="randNickname(maxLength: 12)" py="rand_nickname(max_length=12)" code /> |

## 어느 함수에서나 같은 옵션 {#one-set-of-options}

개수와 길이, 시작 글자, 중복 제거는 모든 생성 함수가 같은 이름으로 받습니다. `randName`에서 익힌 옵션이 `randNickname`, `randWord`, `randSentence`, `randLocation`에서 그대로 통합니다.

<Lang js="count" dart="count" py="count" code />는 몇 개를 받을지, <Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 글자 수, <Lang js="startsWith" dart="startsWith" py="starts_with" code />는 첫 글자, `unique`는 한 번의 호출 안에서 중복을 없앨지, `realism`은 실제 단어를 뽑을지 그 언어처럼 읽히는 단어를 지어낼지 정합니다.

결과가 무엇으로 만들어졌는지 물어볼 수도 있습니다. <Lang js="output: 'detail'" dart="randNameDetails" py="output=&quot;detail&quot;" code />은 문자열 대신 이름의 두 표기와 언어와 성별을, 닉네임이라면 어떤 단어를 어떤 자리에 썼는지를 함께 돌려줍니다.

## 설치는 한 줄이면 끝 {#install}

::: lang js

```bash
npm install randino
```

Node.js 22 이상 또는 아무 브라우저에서 동작합니다. 타입 선언이 포함된 ESM이고, 뒤따라 설치되는 패키지가 없습니다.

:::

::: lang dart

```bash
dart pub add randino
```

Dart 3.7 이상(Flutter 3.29)에서 동작합니다. `dart:math` 외에는 아무것도 import하지 않으므로 VM과 웹은 물론 모든 플랫폼의 Flutter에서 그대로 씁니다.

:::

::: lang py

```bash
pip install randino
```

Python 3.10 이상에서 동작합니다. 표준 라이브러리 외에는 아무것도 import하지 않으며, `py.typed` 마커를 포함하므로 타입 검사기가 주석을 그대로 읽습니다.

:::

네트워크 호출도, 준비해 둘 데이터 파일도 없습니다. 서버에서도 빌드 스크립트에서도 테스트 픽스처에서도 같은 코드가 그대로 돕니다.

## 더 볼 것 {#where-to-go-next}

- [**시작하기**](./guide/getting-started) — 설치부터 첫 호출까지 한 페이지.
- [**데모**](./demo) — 브라우저에서 옵션을 직접 바꿔 보기.
- [**지원 언어**](./guide/languages) — 9개 언어가 각각 무엇을 할 수 있는지.
- [**사람 이름**](./name/)과 [**닉네임**](./nickname/) — 옵션이 출력에 미치는 영향.
- [**테마**](./word/themes) — 37개 테마와 각 테마가 담은 단어.
