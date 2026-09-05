<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for JavaScript

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![npm latest package](https://img.shields.io/npm/v/randino/latest.svg)](https://www.npmjs.com/package/randino) [![npm downloads](https://img.shields.io/npm/dm/randino.svg)](https://www.npmjs.com/package/randino)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **JavaScript** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names, nicknames, words and sentences in the language you ask for.

- **Person names** read like names people actually carry — Emma Clover, Jack Reeves — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across twenty-five themes, never from person names.
- **Words** are those themes on their own — `randWord`, plus `randAnimal`, `randFood` and twenty-three more.
- **Sentences** are whole statements in the language's own grammar — `randSentence`. The verb decides what can stand beside it, so the words of one sentence belong together.
- **Decorators** attach something to a string you already have: `randSuffix`, `randPrefix` and `randModifier`.
- One options object per generator, every option optional: `randName()` on its own works.
- **No runtime dependencies.** ESM, typed, and it runs in Node and in the browser alike.

This is the JavaScript package. The [Dart package](https://pub.dev/packages/randino) and the [Python package](https://pypi.org/project/randino/) are the other two, and all three generate from the same datasets under the same rules. They version independently, so the numbers on npm, pub.dev and PyPI will not always agree.

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
| `minLength` / `maxLength` | `number`                   | _language_ |
| `wordSeparator`           | `string`                   | _language_ |
| `startsWith`              | `string`                   | —          |
| `unique`                  | `boolean`                  | `false`    |
| `output`                  | `'value' \| 'detail'`      | `'value'`  |

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`, `color`, `finance`, `tech`, `weather`, `space`, `time`, `emotion`, `body`, `clothing`, `tool`, `drink`.

## Words

The pools the nicknames are built from, on their own. Twenty-five themes, nine languages, and a function per theme.

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

One function per theme: `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle`, `randProduct`, `randColor`, `randFinance`, `randTech`, `randWeather`, `randSpace`, `randTime`, `randEmotion`, `randBody`, `randClothing`, `randTool`, `randDrink`. Each is `randWord` with the theme already chosen.

## Sentences

Whole statements, written the way the language writes them. The nouns are the same pools the words and nicknames come from; what a sentence adds is the grammar — a verb that states what can do it and what it can be done to, and the shapes each language allows.

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
| `minLength` / `maxLength` | `number`                                        | _language_ |
| `startsWith`              | `string`                                        | —          |
| `unique`                  | `boolean`                                       | `false`    |
| `output`                  | `'value' \| 'detail'`                           | `'value'`  |

`slots` names the parts a shape may carry beside its subject: `object`, `place`, `time`, `manner`, `state`, `quantity`, `money`, `date`, `clock`, or `'none'` for a subject and its predicate alone. A language declares its own shapes, so German has no `object` and Russian no `place` — both mark those with a case their nouns would have to change for — and asking for one falls back to the closest shape the language does have.

`include` puts words you name into every sentence. A word the pools hold goes in the phrase it belongs to, and a word from anywhere else is used as a noun.

`type` is what the sentence does: a statement, a question, an exclamation, a line that trails off, or one somebody says or thinks. `style` is the speech level, which Korean writes four of. `sentences` puts up to ten of them in one string, about one subject. `includeName` puts a generated person's name where a person can stand. Left out, the three of them are drawn per result.

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

`NAME_LANGUAGES`, `WORD_LANGUAGES` and `WORD_THEMES` list what the generators accept; `RAND_COUNT_MAX`, `RAND_LENGTH_MIN` / `_MAX`, `RAND_SENTENCE_LENGTH_MAX`, `AFFIX_LENGTH_DEFAULT` / `_MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET` are the bounds and defaults every option is clamped to.

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
