<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for JavaScript

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![npm latest package](https://img.shields.io/npm/v/randino/latest.svg)](https://www.npmjs.com/package/randino) [![npm downloads](https://img.shields.io/npm/dm/randino.svg)](https://www.npmjs.com/package/randino)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **JavaScript** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names, nicknames, words, sentences, real locations, ages, genders, organizations, dates and phone numbers in the language you ask for, and real operating systems, devices, processors, memory and storage for a sample machine.

- **Person names** read like names people carry: Emma Clover, Jack Reeves, each with its English pronunciation. 9 languages.
- **Nicknames** are handles for a game or a website: MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across twenty-nine themes, and never from person names.
- **Words** are those themes on their own: `randWord`, plus `randAnimal`, `randFood` and twenty-seven more.
- **Sentences** are whole statements in the language's own grammar, from `randSentence`. The verb decides what can stand beside it, so the words of one sentence belong together.
- **Locations** are real places down to a neighbourhood or a city, from `randLocation`: Korean and US divisions, as each country publishes them, and every country's name in all nine languages from `randCountry`.
- **Ages** are whole numbers drawn along a curve shaped like a population, from `randAge`, so a sample of people is mostly adults.
- **Genders** are the labels a form in the language writes, from `randGender`: 여성, Female, Weiblich. An unstated gender and a third gender are there when you ask for them.
- **Organizations** are companies, schools, offices and associations that do not exist, from `randOrganization`: (주)새솔테크, Westbrook High School, Stadtwerke Bergtal.
- **Dates** are drawn evenly from a range and written out in UTC by a format of your own, from `randDate`, or one part at a time.
- **Phone numbers** are written the way their country writes them, from `randPhone`, in nine countries. They open on blocks the country really gives out, so one can by chance be real: sample data, never a number to call.
- **System values** describe a sample machine with real products: an operating system from `randOs`, written the way its release is known, `Windows 11 Pro 23H2 (Build 22631)`, a phone, tablet or laptop from `randDevice`, `Apple iPhone 15 Pro`, its processor from `randCpu`, `Intel Core i7-13700K`, its memory from `randRam`, `16 GB`, and its storage from `randDiskType` and `randDiskSize`, `SSD`, `1 TB`.
- **Decorators** attach something to a string you already have: `randSuffix`, `randPrefix` and `randModifier`.
- One options object per generator, every option optional: `randName()` on its own works.
- **No runtime dependencies.** ESM, typed, and it runs in Node and in the browser alike.

This is the JavaScript package. The [Dart package](https://pub.dev/packages/randino) and the [Python package](https://pypi.org/project/randino/) are the other two, and all three generate from the same datasets under the same rules. They version independently, so the numbers on npm, pub.dev and PyPI will not always agree.

## Install

```bash
npm install randino
```

Requires **Node.js 22 or newer**, or any browser. The package ships ESM with type declarations and pulls nothing in behind it.

`sideEffects: false` is declared, so a bundler drops the pools nothing reaches — and the pools are nearly all of it. Minified and gzipped, `randSuffix` alone is 0.5 KB, `randName` 23 KB, `randWord` and `randNickname` 265 KB, and `randSentence` 449 KB. In a browser bundle that is worth knowing: the word pools are one object per language, so one theme costs what twenty-nine do.

## Person names

```javascript
import { randName } from 'randino';

randName();
// ['Emma Clover']

randName({ language: 'en', count: 3 });
// ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

randName({ language: 'ko', script: 'roman' });
// ['Kim Minjun']

randName({ language: 'en', gender: 'female', includeMiddleName: true });
// ['Grace Amelia Bennett']

randName({ language: 'ja', count: 2, script: 'roman' });
// ['Yamazaki Aina', 'Kato Kaeno']

randName({ language: 'ko', output: 'detail' });
// [{ native: '여미주', roman: 'Yeo Miju', language: 'ko', gender: 'female' }]
```

| Option                    | Type                          | Default    |
| ------------------------- | ----------------------------- | ---------- |
| `language`                | `'all'` or a language code    | `'all'`    |
| `gender`                  | `'all' \| 'male' \| 'female'` | `'all'`    |
| `count`                   | `number`                      | `1`        |
| `realism`                 | `RandRealism`                 | `'real'`   |
| `minLength` / `maxLength` | `number`                      | _language_ |
| `includeSurname`          | `boolean`                     | `true`     |
| `includeMiddleName`       | `boolean`                     | `false`    |
| `script`                  | `'native' \| 'roman'`         | `'native'` |
| `output`                  | `'value' \| 'detail'`         | `'value'`  |
| `startsWith`              | `string`                      | —          |
| `unique`                  | `boolean`                     | `false`    |

## Nicknames

```javascript
import { randNickname } from 'randino';

randNickname({ language: 'en', count: 3 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

randNickname({ language: 'en', theme: 'animal', count: 2 });
// ['FloatingFalcon', 'ChewyOtter']

randNickname({ language: 'en', slots: 'action', count: 2 });
// ['CountingHarmonics', 'HaulingBurrito']

randNickname({ language: 'en', output: 'detail' });
// [{
//   nickname: 'MistyOwl',
//   words: ['Misty', 'Owl'],
//   slots: ['adjective', 'noun'],
//   language: 'en',
//   theme: 'animal'
// }]
```

| Option                    | Type                       | Default    |
| ------------------------- | -------------------------- | ---------- |
| `language`                | `'all'` or a language code | `'all'`    |
| `theme`                   | `'all'` or a theme name    | `'all'`    |
| `slots`                   | `WordSlotOption`           | `'all'`    |
| `count`                   | `number`                   | `1`        |
| `realism`                 | `RandRealism`              | `'real'`   |
| `vocabulary`              | `RandVocabulary`           | `'full'`   |
| `minLength` / `maxLength` | `number`                   | _language_ |
| `wordSeparator`           | `string`                   | _language_ |
| `startsWith`              | `string`                   | —          |
| `unique`                  | `boolean`                  | `false`    |
| `output`                  | `'value' \| 'detail'`      | `'value'`  |

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`, `color`, `finance`, `tech`, `weather`, `space`, `time`, `emotion`, `body`, `clothing`, `tool`, `drink`, `toy`, `sound`, `person`, `furniture`.

## Words

The pools the nicknames are built from, on their own. Twenty-nine themes, nine languages, and a function per theme.

```javascript
import { randAnimal, randFood, randWord, wordLengthRange } from 'randino';

randWord({ language: 'en', theme: 'animal', count: 3 });
// ['Otter', 'Falcon', 'Lynx']

randAnimal({ language: 'en', count: 2 }); // ['Turtle', 'Crane']
randFood({ language: 'en', count: 2 }); // ['Dumpling', 'Cocoa']

randWord({ language: 'en', theme: 'plant', output: 'detail' });
// [{ word: 'Cedar', language: 'en', theme: 'plant' }]

wordLengthRange('en'); // [3, 11]
```

| Option                    | Type                       | Default   |
| ------------------------- | -------------------------- | --------- |
| `language`                | `'all'` or a language code | `'all'`   |
| `theme`                   | `'all'` or a theme name    | `'all'`   |
| `count`                   | `number`                   | `1`       |
| `realism`                 | `RandRealism`              | `'real'`  |
| `vocabulary`              | `RandVocabulary`           | `'full'`  |
| `minLength` / `maxLength` | `number`                   | _pools_   |
| `startsWith`              | `string`                   | —         |
| `unique`                  | `boolean`                  | `false`   |
| `output`                  | `'value' \| 'detail'`      | `'value'` |

One function per theme: `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle`, `randProduct`, `randColor`, `randFinance`, `randTech`, `randWeather`, `randSpace`, `randTime`, `randEmotion`, `randBody`, `randClothing`, `randTool`, `randDrink`. Each is `randWord` with the theme already chosen.

## Sentences

Whole statements, written the way the language writes them. The nouns are the same pools the words and nicknames come from, and what a sentence adds is the grammar: a verb that states what can do it and what it can be done to, and the shapes each language allows.

```javascript
import { randSentence, sentenceLengthRange } from 'randino';

randSentence({ language: 'en', count: 3 });
// ['The brave lion runs quietly.', 'The otter swims in the cove.', 'The sky is blue.']

randSentence({ language: 'ko', count: 2 });
// ['검은 고양이가 숲에서 잠잔다.', '여우가 사과를 먹는다.']

randSentence({ language: 'en', shape: 'simple' }); // ['The gondola passes.']
randSentence({ language: 'en', include: ['brave', 'lion'] });
// ['The brave lion yawns quietly.']

randSentence({ language: 'ko', output: 'detail' });
// [{
//   sentence: '검은 고양이가 숲에서 잠잔다.',
//   phrases: ['검은 고양이', '숲', '잠잔다'],
//   slots: ['subject', 'place', 'verb'],
//   language: 'ko',
//   theme: 'animal'
// }]

sentenceLengthRange('en'); // [12, 92]
```

| Option                    | Type                                            | Default    |
| ------------------------- | ----------------------------------------------- | ---------- |
| `language`                | `'all'` or a language code                      | `'all'`    |
| `theme`                   | `'all'` or a theme name                         | `'all'`    |
| `shape`                   | `'all' \| 'simple' \| 'detailed' \| 'complex'`  | `'all'`    |
| `slots`                   | `'all' \| 'none'` or one or more `SentenceSlot` | `'all'`    |
| `include`                 | `string` or `string[]`                          | —          |
| `type`                    | `'all'` or one or more `SentenceType`           | _drawn_    |
| `quote`                   | `'double' \| 'single'`                          | —          |
| `style`                   | `SentenceStyle`                                 | _drawn_    |
| `sentences`               | `number`                                        | `1`        |
| `includeName`             | `boolean`                                       | _drawn_    |
| `count`                   | `number`                                        | `1`        |
| `realism`                 | `RandRealism`                                   | `'real'`   |
| `vocabulary`              | `RandVocabulary`                                | `'common'` |
| `minLength` / `maxLength` | `number`                                        | _language_ |
| `startsWith`              | `string`                                        | —          |
| `unique`                  | `boolean`                                       | `false`    |
| `output`                  | `'value' \| 'detail'`                           | `'value'`  |

`slots` names the parts a shape may carry beside its subject: `object`, `place`, `time`, `manner`, `state`, `quantity`, `money`, `date`, `clock`, or `'none'` for a subject and its predicate alone. A language declares its own shapes, so German has no `object` and Russian no `place`, because both would mark those with a case their nouns have to change for. Asking for one falls back to the closest shape the language does have.

`include` puts words you name into every sentence. A word the pools hold goes in the phrase it belongs to, and a word from anywhere else is used as a noun.

`type` is what the sentence does: a statement, a question, an exclamation, a line that trails off, or one somebody says or thinks. `style` is the speech level, which Korean writes four of. `sentences` puts up to ten of them in one string, about one subject. `includeName` puts a generated person's name where a person can stand. Left out, the three of them are drawn per result.

## Locations

Real places, written out from the country down the way the language writes one. Every division is one the country itself publishes, inside the one written beside it, and nothing goes below a Korean 읍·면·동 or a US city, so a result is never somebody's address. Korean and English only: a country is in when its list comes with no conditions a user of this package would inherit.

```javascript
import { randCity, randDistrict, randLocation, randRegion } from 'randino';

randLocation({ language: 'ko', count: 2 });
// ['대한민국 경기도 양평군 단월면', '대한민국 충청북도 청주시 서원구 미평동']
randLocation({ language: 'en', level: 'city' });
// ['Gig Harbor, Washington, United States']

randRegion({ language: 'en', count: 3 }); // ['Idaho', 'Georgia', 'Vermont']
randCity({ language: 'ko', count: 3 }); // ['함안군', '영덕군', '여수시']
randDistrict({ count: 3 }); // ['가현동', '겸면', '행주외동']

randLocation({ language: 'ko', output: 'detail' });
// [{ location: '대한민국 전남광주통합특별시 서구 양동', language: 'ko', level: 'district',
//    country: '대한민국', region: '전남광주통합특별시', city: '서구', district: '양동' }]
```

| Option                    | Type                    | Default      |
| ------------------------- | ----------------------- | ------------ |
| `language`                | `'all' \| 'ko' \| 'en'` | `'all'`      |
| `level`                   | `LocationLevel`         | `'district'` |
| `includeCountry`          | `boolean`               | `true`       |
| `count`                   | `number`                | `1`          |
| `minLength` / `maxLength` | `number`                | —            |
| `startsWith`              | `string`                | —            |
| `unique`                  | `boolean`               | `false`      |
| `output`                  | `'value' \| 'detail'`   | `'value'`    |

`level` is how far down the location goes: `country`, `region`, `city` or `district`. A country without that level stops at the deepest one it has, so an English location ends at its city. `includeCountry: false` leaves the country out of the string, which is what a fixed `language` usually wants. `randRegion`, `randCity` and `randDistrict` take the same options minus `level`, and hand back that one division's name.

`randCountry` names any of the 249 ISO 3166-1 countries and territories, in any of the nine languages rather than only the two with divisions:

```javascript
import { randCountry } from 'randino';

randCountry({ language: 'ko', count: 3 }); // ['아르헨티나', '방글라데시', '세인트키츠 네비스']
randCountry({ language: 'ja', output: 'detail' });
// [{ country: 'サウジアラビア', code: 'SA', language: 'ja' }]
```

## Ages

Ages for sample people, in whole years. The draw follows a curve shaped like a population rather than an even spread: it peaks from 25 to 35, sits lower for children and falls away past seventy, so a third of the ages are in their twenties and thirties and about 2% are past eighty.

```javascript
import { randAge } from 'randino';

randAge({ count: 5 }); // [27, 8, 41, 63, 30]
randAge({ minAge: 18, maxAge: 39, count: 3 }); // [22, 35, 31]
randAge({ group: ['teen', 'senior'], count: 3 }); // [15, 71, 66]
randAge({ distribution: 'uniform', count: 3 }); // [91, 4, 57]

randAge({ output: 'detail' }); // [{ age: 16, group: 'teen' }]
```

| Option              | Type                        | Default        |
| ------------------- | --------------------------- | -------------- |
| `minAge` / `maxAge` | `number`                    | `0` / `100`    |
| `group`             | `AgeGroupOption`            | `'all'`        |
| `distribution`      | `'population' \| 'uniform'` | `'population'` |
| `count`             | `number`                    | `1`            |
| `unique`            | `boolean`                   | `false`        |
| `output`            | `'value' \| 'detail'`       | `'value'`      |

`group` is `child` (0 to 12), `teen` (13 to 19), `adult` (20 to 64) or `senior` (65 and up), or an array of them, and narrows the range rather than replacing it. An age has no language, so `randAge` takes none.

## Genders

Genders for sample people, written the way a form in the language labels them. Male and female split evenly; `includeUnknown` adds a gender nobody stated, about one draw in eleven, and `includeNonbinary` a third gender, about one in a hundred.

```javascript
import { randGender } from 'randino';

randGender({ language: 'ko', count: 3 }); // ['여성', '남성', '여성']
randGender({ language: 'en', includeUnknown: true, count: 3 }); // ['Male', 'Unknown', 'Female']
randGender({ language: 'de', includeNonbinary: true }); // ['Divers']

randGender({ language: 'ko', output: 'detail' });
// [{ gender: '여성', code: 'female', language: 'ko' }]
```

| Option             | Type                  | Default   |
| ------------------ | --------------------- | --------- |
| `language`         | `WordLanguageOption`  | `'all'`   |
| `includeUnknown`   | `boolean`             | `false`   |
| `includeNonbinary` | `boolean`             | `false`   |
| `count`            | `number`              | `1`       |
| `unique`           | `boolean`             | `false`   |
| `output`           | `'value' \| 'detail'` | `'value'` |

The detail's `code` is `male`, `female`, `nonbinary` or `unknown` whatever the language, and the first two are the codes `randName`'s `gender` takes.

## Organizations

Companies, schools, government offices, public institutions and associations that do not exist, each written the way its language writes that kind of organization. A company may carry its legal form (`Inc.`, `(주)`, `GmbH`, `ООО`), and the stems are chosen to be nobody's brand.

```javascript
import { randOrganization } from 'randino';

randOrganization({ language: 'ko', count: 3 }); // ['(주)가람에너지', '윤슬교육지원청', '새솔홀딩스']
randOrganization({ language: 'en', industry: 'logistics' }); // ['Greenbriar Logistics Corp.']
randOrganization({ language: 'de', type: ['school', 'public'], count: 2 });
// ['Gymnasium Eschenhain', 'Stadtbibliothek Tannenhof']

randOrganization({ language: 'ko', type: 'company', output: 'detail' });
// [{ organization: '(주)새솔테크', name: '새솔테크', legalForm: '(주)',
//    type: 'company', industry: 'tech', language: 'ko' }]
```

| Option                    | Type                         | Default   |
| ------------------------- | ---------------------------- | --------- |
| `language`                | `WordLanguageOption`         | `'all'`   |
| `type`                    | `OrganizationTypeOption`     | `'all'`   |
| `industry`                | `OrganizationIndustryOption` | `'all'`   |
| `includeLegalForm`        | `boolean`                    | _drawn_   |
| `count`                   | `number`                     | `1`       |
| `realism`                 | `RandRealism`                | `'real'`  |
| `minLength` / `maxLength` | `number`                     | —         |
| `startsWith`              | `string`                     | —         |
| `unique`                  | `boolean`                    | `false`   |
| `output`                  | `'value' \| 'detail'`        | `'value'` |

`type` is `company`, `nonprofit`, `school`, `government` or `public`, or an array of them; left out, companies come up most often. `industry` is one of ten, written into a company's name as a word for its business, and naming one with `type` left out asks for companies. `realism: 'invented'` builds the stem from the language's own sounds, for a name nobody has.

## Dates

Dates drawn evenly from a range and written out in UTC. The range defaults to the years 1900 to 2099 and the format to ISO 8601. A string bound names a span, so `maxDate: '2024-12-31'` reaches the last millisecond of that day.

```javascript
import { randDate } from 'randino';

randDate(); // ['1987-06-21T08:14:51.302Z']
randDate({ minDate: '2024-01-01', maxDate: '2024-12-31', format: 'YYYY-MM-DD', count: 3 });
// ['2024-07-09', '2024-02-27', '2024-11-30']
randDate({ format: 'YYYY년 M월 D일 HH:mm' }); // ['2031년 3월 4일 19:40']

randDate({ unit: 'minute', count: 5 }); // [37, 4, 52, 19, 0]
randDate({ output: 'detail' });
// [{ date: '1987-06-21T08:14:51.302Z', timestamp: 551261691302, year: 1987, month: 6,
//    day: 21, hour: 8, minute: 14, second: 51, millisecond: 302 }]
```

| Option                | Type                       | Default                    |
| --------------------- | -------------------------- | -------------------------- |
| `minDate` / `maxDate` | `string \| Date \| number` | `'1900'` / `'2099'`        |
| `format`              | `string`                   | `YYYY-MM-DDTHH:mm:ss.SSSZ` |
| `language`            | `WordLanguageOption`       | `'en'`                     |
| `utcOffset`           | `string \| number`         | UTC                        |
| `unit`                | `DateUnit`                 | —                          |
| `count`               | `number`                   | `1`                        |
| `unique`              | `boolean`                  | `false`                    |
| `output`              | `'value' \| 'detail'`      | `'value'`                  |

`format` replaces `YYYY`, `YY`, `MMMM`, `MMM`, `MM`, `M`, `DD`, `D`, `dddd`, `ddd`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`, `SSS`, `A`, `a`, `Z` and `ZZ`, and writes text inside `[` `]` as it is. `MMMM`, `MMM`, `dddd`, `ddd`, `A` and `a` write words, in `language`: English unless another of the nine is named. `utcOffset` writes the dates at a fixed offset, `'+09:00'` or `540` minutes, and `Z` writes it. `unit` is `year`, `month`, `day`, `hour`, `minute`, `second` or `millisecond`, read off a date drawn from the range, so a minute is `0` to `59` and a year keeps inside the range.

## Phone numbers

Phone numbers written the way their country writes them, for the United States, Korea, Japan, China, Vietnam, Spain, Italy, Germany and Russia. Each opens on a mobile block or a city's area code that the country really gives out, and the digits after it are random — so a number can by chance belong to somebody. Use them as sample data, and never call or text one.

```javascript
import { randPhone } from 'randino';

randPhone({ country: 'KR', count: 2 }); // ['010-4821-3967', '010-7302-1958']
randPhone({ country: 'US', type: 'landline' }); // ['(212) 846-0147']
randPhone({ country: 'KR', includeCountryCode: true }); // ['+82 10-4821-3967']
randPhone({ country: 'KR', includeCountryCode: true, separator: '' }); // ['+821048213967']

randPhone({ country: 'JP', output: 'detail' });
// [{ phone: '090-3718-2046', e164: '+819037182046', country: 'JP', callingCode: '81', type: 'mobile' }]
```

| Option               | Type                  | Default    |
| -------------------- | --------------------- | ---------- |
| `country`            | `PhoneCountryOption`  | `'all'`    |
| `type`               | `PhoneTypeOption`     | `'mobile'` |
| `includeCountryCode` | `boolean`             | `false`    |
| `separator`          | `string`              | _country_  |
| `fictional`          | `boolean`             | `false`    |
| `count`              | `number`              | `1`        |
| `unique`             | `boolean`             | `false`    |
| `output`             | `'value' \| 'detail'` | `'value'`  |

`country` is an ISO 3166-1 alpha-2 code, read regardless of case. `includeCountryCode` drops the trunk prefix the country dials at home, and `separator` replaces the country's own punctuation: `''` writes the digits alone, which with the country code is E.164. `fictional` keeps to the numbers a country sets aside for films and books, which nobody is given: `555-0100` to `555-0199` in the United States and the drama numbers in Germany; the other seven countries reserve none and return nothing.

## System

Values that describe a sample machine. They are real products rather than invented ones, written by the names they were released under, so none of them takes a `language`.

### Operating systems

Windows, macOS, Ubuntu, Debian and Fedora on the desktop, Android, iOS and iPadOS on mobile, every release from the first to the ones out by October 2026, written the way each release is known.

```javascript
import { randOs } from 'randino';

randOs({ count: 3 }); // ['Windows 10', 'macOS Sonoma 14', 'Android 9 Pie']
randOs({ platform: 'mobile' }); // ['iOS 17']
randOs({ includeBuild: true, includeEdition: true }); // ['Windows 11 Pro 23H2 (Build 22631)']
randOs({ platform: 'desktop', maxYear: 2010 }); // ['Mac OS X Snow Leopard 10.6']

randOs({ includeBuild: true, output: 'detail' });
// [{ os: 'Android 14 (API 34)', name: 'Android', version: '14', build: '(API 34)',
//    edition: null, platform: 'mobile', year: 2023 }]
```

| Option           | Type                   | Default   |
| ---------------- | ---------------------- | --------- |
| `platform`       | `SystemPlatformOption` | `'all'`   |
| `minYear`        | `number`               | —         |
| `maxYear`        | `number`               | —         |
| `includeVersion` | `boolean`              | `true`    |
| `includeBuild`   | `boolean`              | `false`   |
| `includeEdition` | `boolean`              | `false`   |
| `count`          | `number`               | `1`       |
| `unique`         | `boolean`              | `false`   |
| `output`         | `'value' \| 'detail'`  | `'value'` |

A draw picks the line first — Windows is about two desktops in three, Android about three phones in five — and a release inside it second. `minYear` and `maxYear` read the year a release came out, or with `includeBuild` the year of the build written, and a range nothing came out in returns nothing.

### Devices

Real phones, tablets and laptops, by the names their makers gave them, from the first iPhone to the devices released by the end of 2025. A desktop PC is left out: it is built from parts and has no model name of its own.

```javascript
import { randDevice } from 'randino';

randDevice({ count: 2 }); // ['Samsung Galaxy S24 Ultra', 'Apple iPad (10th generation)']
randDevice({ type: 'laptop' }); // ['Lenovo ThinkPad X1 Carbon Gen 11']
randDevice({ type: ['phone', 'tablet'], maxYear: 2012 }); // ['Apple iPhone 4']
randDevice({ type: 'phone', includeVendor: false }); // ['Pixel 8 Pro']

randDevice({ output: 'detail' });
// [{ device: 'Google Pixel 8', vendor: 'Google', model: 'Pixel 8', type: 'phone', year: 2023 }]
```

| Option          | Type                  | Default   |
| --------------- | --------------------- | --------- |
| `type`          | `DeviceTypeOption`    | `'all'`   |
| `minYear`       | `number`              | —         |
| `maxYear`       | `number`              | —         |
| `includeVendor` | `boolean`             | `true`    |
| `count`         | `number`              | `1`       |
| `unique`        | `boolean`             | `false`   |
| `output`        | `'value' \| 'detail'` | `'value'` |

`type` is `phone`, `tablet` or `laptop`, or an array of them. A model is written the way its maker writes it, generation and all, and one whose name already opens on its maker's (`Xiaomi 14`) is never written with the maker twice.

### Processors

Real processors, by the names their makers gave them: Intel, AMD, Apple and Qualcomm parts for desktops and laptops, and the chips of phones and tablets from Apple, Qualcomm, Samsung, MediaTek, Google and HiSilicon, from the Pentium 4 to the parts out by the end of 2025.

```javascript
import { randCpu } from 'randino';

randCpu({ count: 2 }); // ['Intel Core i7-13700K', 'Apple A17 Pro']
randCpu({ platform: 'desktop', maxYear: 2012 }); // ['AMD Phenom II X4 940']
randCpu({ platform: 'mobile', includeVendor: false }); // ['Snapdragon 8 Gen 3']

randCpu({ output: 'detail' });
// [{ cpu: 'Apple M3 Pro', vendor: 'Apple', model: 'M3 Pro', platform: 'desktop', year: 2023 }]
```

| Option          | Type                   | Default   |
| --------------- | ---------------------- | --------- |
| `platform`      | `SystemPlatformOption` | `'all'`   |
| `minYear`       | `number`               | —         |
| `maxYear`       | `number`               | —         |
| `includeVendor` | `boolean`              | `true`    |
| `count`         | `number`               | `1`       |
| `unique`        | `boolean`              | `false`   |
| `output`        | `'value' \| 'detail'`  | `'value'` |

### Memory

Amounts of memory a machine is really sold with, from 512 MB to a terabyte, drawn by how common each one is: 8 and 16 GB are most of a sample. A size is only written in a unit it is a whole number of, so nothing carries a decimal point; a gigabyte is 1024 megabytes, the way an operating system counts.

```javascript
import { randRam } from 'randino';

randRam({ count: 3 }); // ['8 GB', '16 GB', '4 GB']
randRam({ unit: 'MB' }); // ['8192 MB']
randRam({ minSize: 16, maxSize: 64 }); // ['32 GB']
randRam({ includeUnit: false }); // ['16']

randRam({ output: 'detail' }); // [{ ram: '16 GB', value: 16, unit: 'GB', bytes: 17179869184 }]
```

| Option        | Type                  | Default   |
| ------------- | --------------------- | --------- |
| `unit`        | `RamUnitOption`       | `'auto'`  |
| `includeUnit` | `boolean`             | `true`    |
| `minSize`     | `number`              | —         |
| `maxSize`     | `number`              | —         |
| `count`       | `number`              | `1`       |
| `unique`      | `boolean`             | `false`   |
| `output`      | `'value' \| 'detail'` | `'value'` |

`unit: 'auto'` writes each size in the largest unit it is whole in; `'GB'` or `'MB'` keeps to the sizes whole in that unit. `minSize` and `maxSize` are in `unit`, or in gigabytes for `'auto'`, and a range no real size is inside returns nothing.

### Storage

The kind of storage a machine has, by the platform it is drawn for: an SSD or a hard disk on a desktop or a laptop, UFS or eMMC on a phone or a tablet.

```javascript
import { randDiskType } from 'randino';

randDiskType({ platform: 'desktop', count: 3 }); // ['SSD', 'HDD', 'SSD']
randDiskType({ platform: 'mobile' }); // ['UFS']

randDiskType({ output: 'detail' });
// [{ diskType: 'SSD', code: 'ssd', name: 'Solid State Drive', platform: 'desktop' }]
```

| Option     | Type                   | Default   |
| ---------- | ---------------------- | --------- |
| `platform` | `SystemPlatformOption` | `'all'`   |
| `count`    | `number`               | `1`       |
| `unique`   | `boolean`              | `false`   |
| `output`   | `'value' \| 'detail'`  | `'value'` |

`randDiskSize` writes how much it holds, the way `randRam` writes memory: a size a drive is sold with, drawn by how common it is, in a unit it is whole in. A terabyte is 1000 gigabytes, the way the box counts.

```javascript
randDiskSize({ count: 3 }); // ['1 TB', '256 GB', '2 TB']
randDiskSize({ unit: 'GB' }); // ['1000 GB']
randDiskSize({ unit: 'TB', minSize: 8 }); // ['12 TB']

randDiskSize({ output: 'detail' }); // [{ size: '1 TB', value: 1, unit: 'TB', bytes: 1000000000000 }]
```

It takes `randRam`'s options, with `unit` a `DiskUnitOption`: `'MB'`, `'GB'`, `'TB'` or `'auto'`.

## Decorators

`randSuffix`, `randPrefix` and `randModifier` attach something to a string you already have, rather than generating one. They take anything, not just this library's output, which is why none of them is an option on a generator. Each of them also works with no value at all, handing back the thing it would have attached.

```javascript
import { randNickname, randPrefix, randSuffix } from 'randino';

randSuffix('MistyOwl'); // 'MistyOwl_nVtRC'
randSuffix(randNickname({ language: 'en', count: 2 }));
// ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5']

randPrefix('order-4021', { length: 4, separator: '-' }); // 'k3Rm-order-4021'
randSuffix('MistyOwl', { length: 8, charset: '0123456789' }); // 'MistyOwl_40218836'
randSuffix(); // 'nVtRC' — the token on its own
```

| Option      | Type     | Default    |
| ----------- | -------- | ---------- |
| `length`    | `number` | `5`        |
| `separator` | `string` | `'_'`      |
| `charset`   | `string` | _built-in_ |

A fresh token per value, never one for the batch. The default charset leaves out `0O1lI`, because these end up in names people read aloud and type back in.

`randModifier` attaches a word instead of a token, in front of any string:

```javascript
import { randAnimal, randModifier } from 'randino';

randModifier('Owl'); // 'MistyOwl'
randModifier('Owl', { separator: ' ' }); // 'Misty Owl'
randModifier('Owl', { kind: 'action' }); // 'CountingOwl'
randModifier(); // 'Misty'

randModifier(randAnimal({ language: 'en', count: 2 }));
// ['TwinklingLynx', 'OnyxCrane']
```

| Option      | Type                    | Default    |
| ----------- | ----------------------- | ---------- |
| `language`  | `WordLanguageOption`    | _script_   |
| `realism`   | `RandRealism`           | `'real'`   |
| `kind`      | `ModifierKind \| 'all'` | `'all'`    |
| `separator` | `string`                | _language_ |

With no `language`, the script of the value picks one, so `'고양이'` is never handed an English modifier.

## Helpers and constants

```javascript
import {
	nameLengthRange,
	nameSupportsMiddleName,
	nameSupportsRoman,
	nicknameLengthRange,
	sentenceLengthRange,
	wordLengthRange,
	NAME_LANGUAGES,
	WORD_THEMES
} from 'randino';

nameLengthRange('ko'); // [2, 3]
nameLengthRange('en', true, true); // [11, 32]
nameSupportsMiddleName('ko'); // false
nameSupportsRoman('en'); // false
nicknameLengthRange('ko'); // [1, 13]
sentenceLengthRange('ko'); // [5, 43]
wordLengthRange('ko'); // [1, 4]
```

`NAME_LANGUAGES`, `WORD_LANGUAGES`, `WORD_THEMES`, `AGE_GROUPS`, `ORGANIZATION_TYPES`, `ORGANIZATION_INDUSTRIES`, `DATE_UNITS`, `PHONE_COUNTRIES`, `PHONE_TYPES`, `SYSTEM_PLATFORMS`, `DEVICE_TYPES`, `RAM_UNITS`, `DISK_TYPES` and `DISK_UNITS` list what the generators accept; `RAND_COUNT_MAX`, `RAND_LENGTH_MIN` / `_MAX`, `RAND_SENTENCE_LENGTH_MAX`, `RAND_AGE_MAX`, `RAND_ORGANIZATION_LENGTH_MAX`, `AFFIX_LENGTH_DEFAULT` / `_MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET` are the bounds and defaults every option is clamped to.

## Development

```bash
npm install
npm run test      # tsc, then node --test over test/**
npm run build     # format, tsc, minify
npm run lint
```

The tests import from `dist/`, so they need a build. `npm run test` does that first.

## License

MIT © [CDGet](https://cdget.com)
