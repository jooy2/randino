# randnick

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randnick/blob/main/LICENSE) ![Commit Count](https://img.shields.io/github/commit-activity/y/jooy2/randnick) [![Followers](https://img.shields.io/github/followers/jooy2?style=social)](https://github.com/jooy2) ![Stars](https://img.shields.io/github/stars/jooy2/randnick?style=social)

**randnick** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — 김민준, Emma Clover, Иванов Иван — and come with their English pronunciation.
- **Nicknames** (planned) are the handles you would pick for a game or a website.
- 9 languages, one option object, and a style setting that runs from realistic to fully invented.
- No runtime dependencies. Works in Node and in the browser.

## Installation

```bash
npm install randnick
```

## Quick start

```javascript
import { randomName } from 'randnick';

randomName();
// ['Audrey Boyd']

randomName({ language: 'ko', count: 3 });
// ['변태윤', '원동혁', '조진우']

randomName({ language: 'ko', count: 3, script: 'roman' });
// ['Bae Seojin', 'Ko Jiseong', 'Lim Seungjun']

randomName({ language: 'en', gender: 'female', includeMiddleName: true, count: 2 });
// ['Grace Amelia Bennett', 'Nina Rosie Ellis']
```

## API

### `randomName(options?): string[]`

Generates person names and returns them as an array of `count` strings, written in the script given by `options.script`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NameLanguageOption` | `'all'` | Language of the generated names. `'all'` mixes every supported language, picking one per name. |
| `gender` | `'all' \| 'male' \| 'female'` | `'all'` | Which pools the given name is drawn from. `'all'` picks a gender per name. |
| `count` | `number` | `1` | How many names to return. Clamped to `0` … `10000` (`NAME_COUNT_MAX`). |
| `style` | `number` | `0` | `0` draws names people actually carry, `100` invents new ones, and anything between mixes the two per name. |
| `minLength` | `number` | _language_ | Minimum length of the native form, in characters. Defaults to the language's own range (see `nameLengthRange`). |
| `maxLength` | `number` | _language_ | Maximum length of the native form, in characters. |
| `includeSurname` | `boolean` | `true` | Include the family name. |
| `includeMiddleName` | `boolean` | `false` | Include a middle name. Ignored for languages that have none (see `nameSupportsMiddleName`). |
| `script` | `'native' \| 'roman'` | `'native'` | `'native'` writes the name in its own script, `'roman'` in its English pronunciation. |
| `startsWith` | `string` | — | Keep only names whose native form starts with this character. Only the first character is used, and the match is case-insensitive. |
| `unique` | `boolean` | `false` | Never return the same name twice. May return fewer than `count` names once the pools run out of combinations. |

```javascript
randomName({ language: 'ja', count: 3, script: 'roman' });
// ['Yamazaki Aina', 'Kato Kaeno', 'Yoshida Naoyato']

randomName({ language: 'en', count: 3, includeSurname: false });
// ['Rachel', 'Eliza', 'Tessa']

randomName({ language: 'ko', count: 3, startsWith: '이' });
// ['이예빈', '이우진', '이서현']

randomName({ language: 'vi', count: 3, includeMiddleName: true });
// ['Lý Thu Thảo', 'Phạm Quang Hùng', 'Dương Văn Phong']

randomName({ language: 'ru', count: 2, gender: 'female', includeMiddleName: true });
// ['Людмила Николаевна Богданова', 'Марина Максимовна Богданова']

randomName({ count: 5 });
// ['Nuria Ramírez', '조동민', 'Stella Reeves', 'Anna Mariani', 'Lê Phương']
```

### `randomNameDetails(options?): NameDetail[]`

Same options as `randomName` except `script`, because every name is returned in both scripts at once. Use it when you want to show a name next to its English pronunciation, or when `language` is `'all'` and you need to know what each name is.

```javascript
import { randomNameDetails } from 'randnick';

randomNameDetails({ language: 'ko' });
// [{ native: '여미주', roman: 'Yeo Miju', language: 'ko', gender: 'female' }]
```

| Field | Type | Description |
| --- | --- | --- |
| `native` | `string` | The name in its own script. |
| `roman` | `string` | English pronunciation of `native`. Same as `native` for English. |
| `language` | `NameLanguage` | Language this name was generated in — useful with `language: 'all'`. |
| `gender` | `'male' \| 'female'` | Gender the given name was drawn from. |

### `nameLengthRange(language?, includeSurname?, includeMiddleName?): [number, number]`

The natural length range of a full name in that language, which is what `randomName` falls back to when `minLength` or `maxLength` is omitted. It covers only the parts that are switched on, so dropping the surname relaxes the range instead of making the given name stretch to fill it.

```javascript
nameLengthRange('ko'); // [3, 3]
nameLengthRange('ko', false); // [2, 2]
nameLengthRange('en'); // [8, 16]
nameLengthRange('en', true, true); // [12, 24]
```

### `nameSupportsMiddleName(language?): boolean`

Whether the language uses a middle name at all. Korean, Japanese and Chinese names have no middle part, so `includeMiddleName` is ignored for them.

### `nameSupportsRoman(language?): boolean`

Whether `script: 'roman'` produces anything different from `script: 'native'`. Only `'en'` returns `false` — English names are already written in the Latin alphabet.

### Constants

| Name              | Value                                                 |
| ----------------- | ----------------------------------------------------- |
| `NAME_LANGUAGES`  | Every supported language code, in presentation order. |
| `NAME_LENGTH_MIN` | `1` — lower bound for `minLength` / `maxLength`.      |
| `NAME_LENGTH_MAX` | `30` — upper bound for `minLength` / `maxLength`.     |
| `NAME_COUNT_MAX`  | `10000` — upper bound for `count`.                    |

## Languages

| Code | Language   | Name order   | Middle name      | Example                         |
| ---- | ---------- | ------------ | ---------------- | ------------------------------- |
| `en` | English    | given first  | yes              | Paisley Lewis                   |
| `ko` | Korean     | family first | no               | 변태윤 → Byun Taeyun            |
| `ja` | Japanese   | family first | no               | 山口直人 → Yamaguchi Naoto      |
| `zh` | Chinese    | family first | no               | 赵勇轩 → Zhao Yongxuan          |
| `it` | Italian    | given first  | yes              | Giorgia Mancini                 |
| `de` | German     | given first  | yes              | Johanna Wolf                    |
| `ru` | Russian    | given first  | yes (patronymic) | Иван Семёнов → Ivan Semyonov    |
| `es` | Spanish    | given first  | yes              | Gonzalo Martín → Gonzalo Martin |
| `vi` | Vietnamese | family first | yes              | Đặng Quân → Dang Quan           |

Pass `'all'` (the default) to mix every language, one per name.

## How the options behave

**`style`** — At `0`, names are drawn from curated pools of real names. Toward `100` they are invented instead: Latin and Cyrillic scripts from syllable templates, Korean by combining given-name syllables freely. Values in between decide per name and per part, so `50` mixes real and invented names in one batch. Japanese and Chinese names are always composed from single characters, so `style` changes little for them.

```javascript
randomName({ language: 'en', style: 100, count: 3 });
// ['Deder Kuvoun', 'Jaihil Brouvinn', 'Thoowoun Wiatou']

randomName({ language: 'ko', style: 100, count: 3 });
// ['송승완', '구상겸', '채진훈']
```

**`minLength` / `maxLength`** — Counted in characters of the **native** form, including the spaces between parts. The structure you asked for always wins: a range too narrow for the requested parts is answered with the closest name the generator can build rather than by dropping the surname or the middle name. For space-separated languages the range is satisfied by re-drawing, so a very narrow range (`minLength === maxLength`) is best-effort. Korean, Japanese and Chinese names hit the range exactly, because their given names are composed a syllable at a time.

**`startsWith`** — Applies to the first character of the whole name, which is the surname for family-first languages and the given name otherwise (or when `includeSurname: false`). A character that no real name starts with still returns names: Latin and Cyrillic scripts invent one (`Q` → `Qivu Railooth`), and CJK scripts use the character as a name part of its own.

**`unique`** — Off by default, so `randomName` always returns exactly `count` names. Turn it on to deduplicate; because the pools are finite, a large `count` then returns fewer names instead of looping.

**Romanization** — `script: 'roman'` is the English pronunciation of the native form, not a translation. Latin scripts drop their diacritics (`Pérez` → `Perez`), Cyrillic is transliterated (`Семёнов` → `Semyonov`), Korean follows the Revised Romanization of Korean including the sound changes between syllables (`석민` → `Seongmin`), with the conventional spelling for surnames (`김` → `Kim`), and Japanese and Chinese carry the reading of each character.

## Contributing

Anyone can contribute to the project by reporting new issues or submitting a pull request. For more information, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Please see the [LICENSE](LICENSE) file for more information about project owners, usage rights, and more.
