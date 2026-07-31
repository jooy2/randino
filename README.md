# randnick

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randnick/blob/main/LICENSE) ![Commit Count](https://img.shields.io/github/commit-activity/y/jooy2/randnick) [![Followers](https://img.shields.io/github/followers/jooy2?style=social)](https://github.com/jooy2) ![Stars](https://img.shields.io/github/stars/jooy2/randnick?style=social)

**randnick** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — 김민준, Emma Clover, Иванов Иван — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — 멋진사자, MistyOwl, 고양이꼬리. Built from everyday words, never from person names, with more than two million combinations before the unique suffix is added.
- One options object per generator: language, length, count, and a style setting that runs from realistic to fully invented.
- No runtime dependencies. Works in Node and in the browser.

## Installation

```bash
npm install randnick
```

## Quick start

```javascript
import { randomName, randomNickname } from 'randnick';

randomName({ language: 'ko', count: 3 });
// ['변태윤', '원동혁', '조진우']

randomName({ language: 'en', gender: 'female', includeMiddleName: true });
// ['Grace Amelia Bennett']

randomNickname({ language: 'ko', count: 3 });
// ['오래된곰', '영원한도마뱀', '귀여운신화다발']

randomNickname({ language: 'ko', uniqueSuffix: true, count: 2 });
// ['달력_U7aNZ', '조용한바구니_RUKAP']

randomNickname({ baseWord: '고양이', count: 3 });
// ['하얀고양이', '고양이바람', '귀여운고양이뿔']
```

---

# Person names

## `randomName(options?): string[]`

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

## `randomNameDetails(options?): NameDetail[]`

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

## `nameLengthRange(language?, includeSurname?, includeMiddleName?): [number, number]`

The natural length range of a full name in that language, which is what `randomName` falls back to when `minLength` or `maxLength` is omitted. It covers only the parts that are switched on, so dropping the surname relaxes the range instead of making the given name stretch to fill it.

```javascript
nameLengthRange('ko'); // [3, 3]
nameLengthRange('ko', false); // [2, 2]
nameLengthRange('en'); // [8, 16]
nameLengthRange('en', true, true); // [12, 24]
```

## `nameSupportsMiddleName(language?): boolean`

Whether the language uses a middle name at all. Korean, Japanese and Chinese names have no middle part, so `includeMiddleName` is ignored for them.

## `nameSupportsRoman(language?): boolean`

Whether `script: 'roman'` produces anything different from `script: 'native'`. Only `'en'` returns `false` — English names are already written in the Latin alphabet.

## Name languages

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

## How the name options behave

**`style`** — At `0`, names are drawn from curated pools of real names. Toward `100` they are invented instead: Latin and Cyrillic scripts from syllable templates, and Korean, Japanese and Chinese by combining given-name characters freely. Values in between decide per name and per part, so `50` mixes real and invented names in one batch.

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

---

# Nicknames

A nickname is an everyday word with something added to it: a modifier in front (`멋진사자`), a second word behind (`고양이꼬리`), or both (`파란고양이발바닥`). The words are animals, things, nature and ideas — **person names are never used**, which is what keeps a nickname from reading like one.

## `randomNickname(options?): string[]`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `NicknameLanguageOption` | `'all'` | Language of the generated nicknames. `'all'` mixes every supported language, picking one per nickname. |
| `theme` | `NicknameThemeOption` | `'all'` | What the nickname is about: `'animal'`, `'object'`, `'nature'`, `'concept'`, or `'all'`. |
| `count` | `number` | `1` | How many nicknames to return. Clamped to `0` … `10000` (`NICKNAME_COUNT_MAX`). |
| `style` | `number` | `0` | `0` uses real words, `100` invents words that only read like the language, and anything between mixes the two. |
| `minLength` | `number` | _language_ | Minimum length in characters, the unique suffix **not** counted. Defaults to `nicknameLengthRange`. |
| `maxLength` | `number` | _language_ | Maximum length in characters, the unique suffix **not** counted. |
| `includeModifier` | `boolean` | `true` | Decorate the word (`멋진사자` rather than `사자`). |
| `baseWord` | `string` | — | Build every nickname around this word, varying only the decoration. |
| `uniqueSuffix` | `boolean` | `false` | Append a random token so no two people end up with the same nickname (`멋진사자_nVtRC`). |
| `uniqueSuffixLength` | `number` | `5` | Characters in the token. Clamped to `1` … `32` (`NICKNAME_SUFFIX_LENGTH_MAX`). |
| `uniqueSuffixSeparator` | `string` | `'_'` | Placed between the nickname and the token. `''` joins them directly. |
| `uniqueSuffixCharset` | `string` | _built-in_ | Characters the token is drawn from. Defaults to alphanumerics without the pairs that misread (`0O`, `1lI`). |
| `startsWith` | `string` | — | Keep only nicknames whose first character is this one. |
| `unique` | `boolean` | `false` | Never return the same nickname twice. May return fewer than `count` once the pools run out of combinations. |

```javascript
randomNickname({ language: 'en', count: 4 });
// ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak', 'MathematicsShard']

randomNickname({ language: 'ja', count: 4 });
// ['小さな雨', '海の彗星', '鋭いペンギン', '柔らかい記憶']

randomNickname({ language: 'zh', count: 4 });
// ['勇敢余烬', '快乐薄雾', '节日', '安静小狗']

randomNickname({ language: 'ko', theme: 'animal', count: 3 });
// ['깊은연어', '하얀여우갈기', '떠도는잉어']

randomNickname({ language: 'ko', count: 4, includeModifier: false });
// ['미래', '반지', '고릴라', '구름언덕']

randomNickname({ count: 5 });
// ['FalconTale', 'LoudBangle', 'Algebra', '苦涩历史', '走るサル']
```

## `randomNicknameDetails(options?): NicknameDetail[]`

Same options as `randomNickname`, plus the pieces each nickname was built from — for highlighting the base word, grouping by theme, or storing the unique suffix on its own.

```javascript
import { randomNicknameDetails } from 'randnick';

randomNicknameDetails({ language: 'ko', uniqueSuffix: true });
// [{
//   nickname: '오래된발견_zVShs',
//   words: ['오래된', '발견'],
//   suffix: '_zVShs',
//   language: 'ko',
//   theme: 'concept'
// }]
```

| Field | Type | Description |
| --- | --- | --- |
| `nickname` | `string` | The finished nickname, unique suffix included. |
| `words` | `string[]` | The words it is made of, in order, without the suffix. |
| `suffix` | `string` | The suffix, separator included. Empty when `uniqueSuffix` is off. |
| `language` | `NicknameLanguage` | Language this nickname was generated in. |
| `theme` | `NicknameTheme \| null` | Theme of the base word, or `null` when that word is invented or came from `baseWord`. |

## `nicknameLengthRange(language?, includeModifier?): [number, number]`

Every nickname length the language can produce, which is what `randomNickname` falls back to when `minLength` or `maxLength` is omitted. The lower end is a bare word and the upper end a modifier, a word and a trailing word together, so the range is wide on purpose — the shape of each nickname is chosen inside it.

```javascript
nicknameLengthRange('ko'); // [1, 12]
nicknameLengthRange('ko', false); // [1, 8]
nicknameLengthRange('zh'); // [2, 5]
```

## Nickname languages and themes

Nicknames cover fewer languages than names. Joining a modifier to a noun only reads naturally where the language asks for no agreement between them — Italian, German, Russian and Spanish need the modifier inflected for the noun's gender, so they are left out rather than shipped wrong.

| Code | Language | Shapes                      | Example                |
| ---- | -------- | --------------------------- | ---------------------- |
| `ko` | Korean   | modifier, trailing word     | 멋진사자, 고양이꼬리   |
| `en` | English  | modifier, trailing word     | MistyOwl, CatTail      |
| `ja` | Japanese | modifier (attributive form) | 青いライオン, 静かな海 |
| `zh` | Chinese  | modifier                    | 快乐熊猫, 神秘森林     |

Japanese and Chinese use the modifier shapes only: a noun-noun compound in those languages needs a particle, or reads as garbled once the base word is abstract.

| Theme       | What it holds                        | Korean       | English    |
| ----------- | ------------------------------------ | ------------ | ---------- |
| `'animal'`  | animals                              | 사자, 고양이 | Lion, Cat  |
| `'object'`  | things within reach                  | 물병, 우산   | Bottle     |
| `'nature'`  | nature and its phenomena             | 하늘, 노을   | Sky, Dawn  |
| `'concept'` | terms, and ideas from the humanities | 철학, 자유   | Philosophy |

## How the nickname options behave

**`baseWord`** — Pins the word every nickname is built around, so only the decoration varies. Something is always added, or the answer would be the word you passed in. When you leave `language` out, the script of the word picks it, which keeps `'고양이'` from being decorated in English.

```javascript
randomNickname({ baseWord: '고양이', count: 5 });
// ['하얀고양이', '고양이바람', '떠도는고양이', '귀여운고양이뿔', '검은고양이손길']

randomNickname({ baseWord: 'Cat', count: 4 });
// ['FlyingCat', 'DancingCatScale', 'MistyCatTail', 'WildCatScale']
```

**`uniqueSuffix`** — A nickname built from words can always collide with someone else's; the suffix is what makes it unique. It is appended after `minLength` / `maxLength` have been satisfied, so those options describe the readable part and the suffix never eats into it.

```javascript
randomNickname({ language: 'ko', count: 3, uniqueSuffix: true });
// ['달력_U7aNZ', '금빛독수리다발_AVcCV', '조용한바구니_RUKAP']

randomNickname({
	language: 'ko',
	count: 2,
	uniqueSuffix: true,
	uniqueSuffixLength: 8,
	uniqueSuffixSeparator: '-'
});
// ['금빛앵무새여행-Qw9NND4j', '느린연필-uxscYCy6']
```

**`minLength` / `maxLength`** — Pick the shape before the words: a range too short for a modifier drops that shape instead of cutting a word short, and a long range brings the three-word shapes in. A `baseWord` longer than the range widens it rather than being truncated.

```javascript
randomNickname({ language: 'ko', count: 4, minLength: 4, maxLength: 6 });
// ['엉뚱한진리춤', '엉뚱한가위별', '해바라기', '별빛안개열매']

randomNickname({ language: 'en', count: 4, minLength: 4, maxLength: 9 });
// ['RustyBoot', 'DustyDuck', 'DustyMyth', 'RiddleEgg']
```

**`style`** — At `0` every word is a real one. Toward `100` the words are invented from the language's own syllables, which reads as a made-up handle rather than a dictionary word.

```javascript
randomNickname({ language: 'ko', style: 100, count: 3 });
// ['토한조해한', '가파모토히', '리누채무애저차부']

randomNickname({ language: 'en', style: 100, count: 3 });
// ['Duhusk', 'DresaelSlobru', 'BroureexGrosex']
```

**`startsWith`** — Applies to the first character of the nickname, which is the modifier when there is one. A character no real word starts with is answered with an invented word rather than nothing (`Z` → `ZeegrellSunflower`).

**`unique`** — Off by default, so `randomNickname` returns exactly `count` nicknames. Korean and English have over a million word combinations each, so duplicates are rare either way; turn `unique` on to rule them out, or `uniqueSuffix` on to make collisions impossible.

---

## Constants

| Name | Value |
| --- | --- |
| `NAME_LANGUAGES` | Every supported name language, in presentation order. |
| `NAME_LENGTH_MIN` / `..._MAX` | `1` / `30` — bounds for a name's `minLength` / `maxLength`. |
| `NAME_COUNT_MAX` | `10000` — upper bound for `count`. |
| `NICKNAME_LANGUAGES` | Every supported nickname language. |
| `NICKNAME_THEMES` | Every nickname theme. |
| `NICKNAME_LENGTH_MIN` / `..._MAX` | `1` / `40` — bounds for a nickname's `minLength` / `maxLength`. |
| `NICKNAME_COUNT_MAX` | `10000` — upper bound for `count`. |
| `NICKNAME_SUFFIX_LENGTH_MAX` | `32` — upper bound for `uniqueSuffixLength`. |
| `NICKNAME_SUFFIX_CHARSET` | The default suffix characters, to extend or narrow. |

## Contributing

Anyone can contribute to the project by reporting new issues or submitting a pull request. For more information, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Please see the [LICENSE](LICENSE) file for more information about project owners, usage rights, and more.
