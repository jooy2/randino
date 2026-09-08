---
layout: home

title: randino
titleTemplate: A random text generator for sample data
description: Made-up person names, nicknames, words and whole sentences in nine languages. Use them for sample data, for suggesting a name at sign-up, or anywhere you need a set of words of your own. Shipped for JavaScript, Dart and Python, with no runtime dependencies.

hero:
  name: randino
  text: A random text generator for sample data
  tagline: Made-up names, handles, words and whole sentences, generated for you. Use them to fill sample data, to suggest a name at sign-up, or anywhere you need a set of words of your own.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Demo
      link: /demo
  image:
    src: /512x512.png
    alt: randino

features:
  - title: Names people carry
    details: Curated pools per language, with surnames weighted the way a population is. About a fifth of the Korean names come back a Kim.
    link: /name/
    linkText: Person names
  - title: Nicknames from everyday words
    details: A modifier and a noun, across twenty-nine themes. Person names are never used, so a handle never reads as somebody's.
    link: /nickname/
    linkText: Nicknames
  - title: Words by theme
    details: Animals, food and gems through to weather and feelings, twenty-nine themes with a function each. randAnimal, randFood, randGem.
    link: /word/rand-word
    linkText: randWord
  - title: Sentences with grammar
    details: The verb only brings in words that go with it, so the sentence means something. Each language writes its own particles, articles and word order.
    link: /sentence/
    linkText: Sentences
  - title: Three packages, one library
    details: The same datasets and the same rules for JavaScript, Dart and Python. One page documents all of them, so pick your language in the sidebar.
    link: /guide/getting-started
    linkText: Getting started
  - title: Nine languages
    details: Korean, English, Japanese, Chinese, Italian, German, Russian, Spanish and Vietnamese, each with its own script and its own romanization.
    link: /guide/languages
    linkText: Supported languages
---

## Start with your language {#pick-a-package}

<LangStart />

## Examples {#examples}

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

Every option is optional, so the shortest call returns one name in one of the nine languages.

## What people use it for {#use-cases}

| What you need | The call |
| --- | --- |
| Test fixtures and seed data | <Lang js="randName({ count: 100 })" dart="randName(count: 100)" py="rand_name(count=100)" code /> |
| A mockup in one language | <Lang js="randName({ language: 'ko', count: 20 })" dart="randName(language: NameLanguage.ko, count: 20)" py="rand_name(language=&quot;ko&quot;, count=20)" code /> |
| A handle suggested at sign-up | <Lang js="randNickname({ count: 5 })" dart="randNickname(count: 5)" py="rand_nickname(count=5)" code /> |
| A username that cannot collide | <Lang js="randSuffix(randNickname())" dart="randSuffix(value: randNickname().first)" py="rand_suffix(rand_nickname())" code /> |
| Placeholder paragraphs | <Lang js="randSentence({ sentences: 3 })" dart="randSentence(sentences: 3)" py="rand_sentence(sentences=3)" code /> |
| Coupon codes and unique tokens | <Lang js="randSuffix()" dart="randSuffix()" py="rand_suffix()" code /> |
| A set of words on one theme | <Lang js="randAnimal({ count: 10 })" dart="randAnimal(count: 10)" py="rand_animal(count=10)" code /> |
| A field with a length limit | <Lang js="randNickname({ maxLength: 12 })" dart="randNickname(maxLength: 12)" py="rand_nickname(max_length=12)" code /> |

## One set of options, every generator {#one-set-of-options}

How many, how long, which first character, and whether to deduplicate are the same options under the same names on all four generators. What you learn on `randName` works on `randNickname`, `randWord` and `randSentence`.

<Lang js="count" dart="count" py="count" code /> is how many you get back, <Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> bound the characters, <Lang js="startsWith" dart="startsWith" py="starts_with" code /> fixes the first one, `unique` rules out duplicates inside one call, and `realism` decides between real words and invented ones that only read like the language.

You can also ask what a result was built from. <Lang js="output: 'detail'" dart="randNameDetails" py="output=&quot;detail&quot;" code /> returns both scripts of a name with its language and gender, or the words a nickname was put together from and the slot each one filled.

## Installing it is one line {#install}

::: lang js

```bash
npm install randino
```

Node.js 18 or newer, or any browser. It is ESM with type declarations, and nothing is pulled in behind it.

:::

::: lang dart

```bash
dart pub add randino
```

Dart 3.7 or newer (Flutter 3.29). It imports nothing but `dart:math`, so it runs on the VM, on the web and inside Flutter on every platform.

:::

::: lang py

```bash
pip install randino
```

Python 3.10 or newer. It imports nothing outside the standard library and ships a `py.typed` marker, so a type checker reads its annotations.

:::

There are no network calls and no data files to set up. The same code runs on a server, in a build script and in a test fixture.

## Where to go next {#where-to-go-next}

- [**Getting started**](./guide/getting-started) — installing it and calling it, in one page.
- [**Demo**](./demo) — change the options in your browser and watch the output.
- [**Supported languages**](./guide/languages) — what each of the nine can do.
- [**Person names**](./name/) and [**Nicknames**](./nickname/) — what each option does to the output.
- [**Themes**](./word/themes) — the twenty-nine of them, and the words each one holds.
