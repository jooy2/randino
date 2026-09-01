---
layout: home

title: randino
titleTemplate: Random names and nicknames, in the language you ask for
description: Generate random person names and nicknames in nine languages — 김민준, Emma Clover, 멋진사자, MistyOwl. One library shipped for JavaScript and for Dart, with no runtime dependencies.

hero:
  name: randino
  text: Random text that reads like the language
  tagline: Person names people actually carry, and nicknames someone would actually pick. Nine languages, shipped for JavaScript and for Dart, with no runtime dependencies.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Person names
      link: /name/
    - theme: alt
      text: Nicknames
      link: /nickname/
  image:
    src: /logo.svg
    alt: randino

features:
  - title: Names, not name-shaped strings
    details: Drawn from curated pools per language, with surnames weighted the way the population is. A fifth of the Korean names come back a 김.
    link: /name/
    linkText: Person names
  - title: Nicknames from everyday words
    details: A modifier and a noun across fourteen themes — and never a person name, which is what keeps a handle from reading like one.
    link: /nickname/
    linkText: Nicknames
  - title: Two packages, one library
    details: The same datasets and the same rules for JavaScript and for Dart. One page documents both — pick yours in the sidebar.
    link: /guide/getting-started
    linkText: Getting started
  - title: Nine languages
    details: Korean, English, Japanese, Chinese, Italian, German, Russian, Spanish and Vietnamese, each with its own script and its own romanization.
    link: /guide/languages
    linkText: Supported languages
---

## What it looks like

::: lang js

```javascript
import { randomName, randomNickname } from 'randino';

randomName({ language: 'ko', count: 3 });
// ['김태윤', '원동혁', '조진우']

randomName({ language: 'ru', gender: 'female', includeMiddleName: true });
// ['Людмила Николаевна Богданова']

randomNickname({ language: 'ko', count: 3 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randomNickname({ language: 'en', uniqueSuffix: true, count: 2 });
// ['FoggyHillside_gDe2C', 'CraneVoyage_nVtRC']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randomName(language: NameLanguage.ko, count: 3);
// ['김태윤', '원동혁', '조진우']

randomName(
  language: NameLanguage.ru,
  gender: NameGender.female,
  includeMiddleName: true,
);
// ['Людмила Николаевна Богданова']

randomNickname(language: NicknameLanguage.ko, count: 3);
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randomNickname(language: NicknameLanguage.en, uniqueSuffix: true, count: 2);
// ['FoggyHillside_gDe2C', 'CraneVoyage_nVtRC']
```

:::

Every option is optional, so the shortest call there is returns one name in one of the nine languages. What each option does is on [Person names](./name/) and [Nicknames](./nickname/); installing it is one page, [Getting started](./guide/getting-started).
