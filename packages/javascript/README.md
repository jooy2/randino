# randino for JavaScript

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![npm latest package](https://img.shields.io/npm/v/randino/latest.svg)](https://www.npmjs.com/package/randino) [![npm downloads](https://img.shields.io/npm/dm/randino.svg)](https://www.npmjs.com/package/randino)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **JavaScript** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — 김민준, Emma Clover, Иванов Иван — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — 멋진사자, MistyOwl, 고양이꼬리. Built from everyday words across fourteen themes, never from person names.
- One options object per generator, every option optional: `randomName()` on its own works.
- **No runtime dependencies.** ESM, typed, and it runs in Node and in the browser alike.

This is the JavaScript half. The [Dart package](https://pub.dev/packages/randino) is the other one, and the two generate from the same datasets under the same rules. They version independently, so this package's number and the pub.dev one's will not always agree.

## Install

```bash
npm install randino
```

Requires **Node.js 18 or newer**, or any browser — the package ships ESM with type declarations and pulls nothing in behind it.

## Person names

```javascript
import { randomName, randomNameDetails } from 'randino';

randomName();
// ['Emma Clover']

randomName({ language: 'ko', count: 3 });
// ['김태윤', '원동혁', '조진우']

randomName({ language: 'ko', script: 'roman' });
// ['Kim Minjun']

randomName({ language: 'en', gender: 'female', includeMiddleName: true });
// ['Grace Amelia Bennett']

randomName({ language: 'ja', count: 2, script: 'roman' });
// ['Yamazaki Aina', 'Kato Kaeno']

randomNameDetails({ language: 'ko' });
// [{ native: '여미주', roman: 'Yeo Miju', language: 'ko', gender: 'female' }]
```

| Option              | Type                          | Default    |
| ------------------- | ----------------------------- | ---------- |
| `language`          | `'all'` or a language code    | `'all'`    |
| `gender`            | `'all' \| 'male' \| 'female'` | `'all'`    |
| `count`             | `number`                      | `1`        |
| `style`             | `number` (0 real … 100 invented) | `0`     |
| `minLength` / `maxLength` | `number`                | _language_ |
| `includeSurname`    | `boolean`                     | `true`     |
| `includeMiddleName` | `boolean`                     | `false`    |
| `script`            | `'native' \| 'roman'`         | `'native'` |
| `startsWith`        | `string`                      | —          |
| `unique`            | `boolean`                     | `false`    |

## Nicknames

```javascript
import { randomNickname, randomNicknameDetails } from 'randino';

randomNickname({ language: 'ko', count: 3 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randomNickname({ language: 'en', count: 2 });
// ['FoggyHillside', 'CraneVoyage']

randomNickname({ language: 'ko', theme: 'animal', count: 2 });
// ['깊은연어', '하얀여우갈기']

randomNickname({ language: 'ko', uniqueSuffix: true, count: 2 });
// ['달력_U7aNZ', '조용한바구니_RUKAP']

randomNickname({ baseWord: '고양이', count: 3 });
// ['하얀고양이', '고양이바람', '귀여운고양이뿔']

randomNicknameDetails({ language: 'ko', uniqueSuffix: true });
// [{
//   nickname: '오래된발견_zVShs',
//   words: ['오래된', '발견'],
//   suffix: '_zVShs',
//   language: 'ko',
//   theme: 'concept'
// }]
```

| Option                  | Type                       | Default    |
| ----------------------- | -------------------------- | ---------- |
| `language`              | `'all'` or a language code | `'all'`    |
| `theme`                 | `'all'` or a theme name    | `'all'`    |
| `count`                 | `number`                   | `1`        |
| `style`                 | `number` (0 real … 100 invented) | `0`  |
| `minLength` / `maxLength` | `number`                 | _language_ |
| `includeModifier`       | `boolean`                  | `true`     |
| `wordSeparator`         | `string`                   | _language_ |
| `baseWord`              | `string`                   | —          |
| `uniqueSuffix`          | `boolean`                  | `false`    |
| `uniqueSuffixLength`    | `number`                   | `5`        |
| `uniqueSuffixSeparator` | `string`                   | `'_'`      |
| `uniqueSuffixCharset`   | `string`                   | _built-in_ |
| `startsWith`            | `string`                   | —          |
| `unique`                | `boolean`                  | `false`    |

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`.

## Helpers and constants

```javascript
import {
	nameLengthRange,
	nameSupportsMiddleName,
	nameSupportsRoman,
	nicknameLengthRange,
	NAME_LANGUAGES,
	NICKNAME_THEMES
} from 'randino';

nameLengthRange('ko'); // [3, 3]
nameLengthRange('en', true, true); // [12, 24]
nameSupportsMiddleName('ko'); // false
nameSupportsRoman('en'); // false
nicknameLengthRange('ko'); // [1, 12]
```

`NAME_LANGUAGES`, `NICKNAME_LANGUAGES` and `NICKNAME_THEMES` list what the generators accept; `NAME_COUNT_MAX`, `NAME_LENGTH_MIN` / `_MAX`, `NICKNAME_COUNT_MAX`, `NICKNAME_LENGTH_MIN` / `_MAX`, `NICKNAME_SUFFIX_LENGTH_MAX` and `NICKNAME_SUFFIX_CHARSET` are the bounds every option is clamped to.

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
