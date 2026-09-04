---
layout: home

title: randino
titleTemplate: Random names, nicknames and sentences, in the language you ask for
description: Generate random person names, nicknames, words and sentences in nine languages — Emma Clover, MistyOwl, 여우가 사과를 먹는다. One library shipped for JavaScript, Dart and Python, with no runtime dependencies.

hero:
  name: randino
  text: Random text that reads like the language
  tagline: Person names people actually carry, nicknames someone would actually pick, the everyday words behind them, and whole sentences in the language's own grammar. Nine languages, shipped for JavaScript, Dart and Python, with no runtime dependencies.
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
    - theme: alt
      text: Words
      link: /word/rand-word
    - theme: alt
      text: Sentences
      link: /sentence/
  image:
    src: /512x512.png
    alt: randino

features:
  - title: Names, not name-shaped strings
    details: Drawn from curated pools per language, with surnames weighted the way the population is. A fifth of the Korean names come back a Kim.
    link: /name/
    linkText: Person names
  - title: Nicknames from everyday words
    details: A modifier and a noun across twenty-five themes — and never a person name, which is what keeps a handle from reading like one.
    link: /nickname/
    linkText: Nicknames
  - title: The words on their own
    details: Twenty-five themes, a function each. randAnimal, randFood, randGem — the vocabulary a nickname is built from, without the nickname.
    link: /word/rand-word
    linkText: randWord
  - title: Sentences, not word salad
    details: A verb states what can do it and what it can be done to, so the words of one sentence belong together. Each language writes its own particles, articles and word order.
    link: /sentence/
    linkText: Sentences
  - title: Three packages, one library
    details: The same datasets and the same rules for JavaScript, Dart and Python. One page documents all of them — pick your language in the sidebar.
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

Every option is optional, so the shortest call there is returns one name in one of the nine languages. What each option does is on [Person names](./name/) and [Nicknames](./nickname/); installing it is one page, [Getting started](./guide/getting-started).
