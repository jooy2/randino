<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for JavaScript

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![npm latest package](https://img.shields.io/npm/v/randino/latest.svg)](https://www.npmjs.com/package/randino) [![npm downloads](https://img.shields.io/npm/dm/randino.svg)](https://www.npmjs.com/package/randino)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **JavaScript** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — Emma Clover, Jack Reeves — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across fourteen themes, never from person names.
- **Words** are those themes on their own — `randWord`, plus `randAnimal`, `randFood` and twelve more.
- **Decorators** attach something to a string you already have: `randSuffix`, `randPrefix` and `randModifier`.
- One options object per generator, every option optional: `randName()` on its own works.
- **No runtime dependencies.** ESM, typed, and it runs in Node and in the browser alike.

This is the JavaScript half. The [Dart package](https://pub.dev/packages/randino) is the other one, and the two generate from the same datasets under the same rules. They version independently, so this package's number and the pub.dev one's will not always agree.

## Install

```bash
npm install randino
```

Requires **Node.js 18 or newer**, or any browser — the package ships ESM with type declarations and pulls nothing in behind it.

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

randNickname({ language: 'en', output: 'detail' });
// [{
//   nickname: 'MistyOwl',
//   words: ['Misty', 'Owl'],
//   language: 'en',
//   theme: 'animal'
// }]
```

| Option                    | Type                       | Default    |
| ------------------------- | -------------------------- | ---------- |
| `language`                | `'all'` or a language code | `'all'`    |
| `theme`                   | `'all'` or a theme name    | `'all'`    |
| `count`                   | `number`                   | `1`        |
| `realism`                 | `RandRealism`              | `'real'`   |
| `minLength` / `maxLength` | `number`                   | _language_ |
| `wordSeparator`           | `string`                   | _language_ |
| `startsWith`              | `string`                   | —          |
| `unique`                  | `boolean`                  | `false`    |
| `output`                  | `'value' \| 'detail'`      | `'value'`  |

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`.

## Words

The pools the nicknames are built from, on their own. Fourteen themes, four languages, and a function per theme.

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
| `minLength` / `maxLength` | `number`                   | _pools_   |
| `startsWith`              | `string`                   | —         |
| `unique`                  | `boolean`                  | `false`   |
| `output`                  | `'value' \| 'detail'`      | `'value'` |

One function per theme: `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle`, `randProduct`. Each is `randWord` with the theme already chosen.

## Decorators

`randSuffix`, `randPrefix` and `randModifier` attach something to a string you already have, rather than generating one. They take anything, not just this library's output, which is why none of them is an option on a generator — and each of them works with no value at all, handing back the thing it would have attached.

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

`randModifier` attaches a word instead of a token — what `randNickname`'s `includeModifier` used to do, for any string:

```javascript
import { randAnimal, randModifier } from 'randino';

randModifier('Owl'); // 'MistyOwl'
randModifier('Owl', { separator: ' ' }); // 'Misty Owl'
randModifier(); // 'Misty'

randModifier(randAnimal({ language: 'en', count: 2 }));
// ['TwinklingLynx', 'OnyxCrane']
```

| Option      | Type                 | Default    |
| ----------- | -------------------- | ---------- |
| `language`  | `WordLanguageOption` | _script_   |
| `realism`   | `RandRealism`        | `'real'`   |
| `separator` | `string`             | _language_ |

With no `language`, the script of the value picks one, so `'고양이'` is never handed an English modifier.

## Helpers and constants

```javascript
import {
	nameLengthRange,
	nameSupportsMiddleName,
	nameSupportsRoman,
	nicknameLengthRange,
	wordLengthRange,
	NAME_LANGUAGES,
	WORD_THEMES
} from 'randino';

nameLengthRange('ko'); // [3, 3]
nameLengthRange('en', true, true); // [12, 24]
nameSupportsMiddleName('ko'); // false
nameSupportsRoman('en'); // false
nicknameLengthRange('ko'); // [1, 13]
wordLengthRange('ko'); // [1, 4]
```

`NAME_LANGUAGES`, `WORD_LANGUAGES` and `WORD_THEMES` list what the generators accept; `RAND_COUNT_MAX`, `RAND_LENGTH_MIN` / `_MAX`, `AFFIX_LENGTH_DEFAULT` / `_MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET` are the bounds and defaults every option is clamped to.

## Development

```bash
npm install
npm run test      # tsc, then node --test over test/**
npm run build     # format, tsc, minify
npm run lint
```

The tests import from `dist/`, so they need a build — `npm run test` does that first.

## License

MIT © [CDGet](https://cdget.com)
