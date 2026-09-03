# Changelog

## vNext (2026--)

- Every word theme holds roughly twice the words it did. All fourteen gained at least fifty entries per language, so the smallest pools are no longer the ones that shape the output: `sport` went from 46 to about 115, `vehicle` from 43 to about 113, and `product` from 36 to about 105. Each language now draws from around 1,900 nouns rather than 900, which roughly doubles what `randWord`, the fourteen themed generators and `randNickname` can produce.
- The person-name pools grew with them. The seven languages that had around 45 entries per pool now hold roughly twice that — Italian, German, Spanish and Russian sit near 95 for each of given names and surnames, Vietnamese near 80, and Japanese and Chinese surnames at 95 with their given names at about 75. English and Korean, already the largest, gained too: English is near 235 per pool and Korean holds 272 male and 259 female given names. Russian patronymics went from 18 to 48, and the CJK syllable pools that build invented names grew alongside. Around 3,750 name parts in total, up from about 2,200.

## 1.1.0 (2026-09-02)

- **Breaking:** `randomName`, `randomNameDetails`, `randomNickname` and `randomNicknameDetails` are now `randName`, `randNameDetails`, `randNickname` and `randNicknameDetails`. The old names are gone; there are no aliases.
- **Breaking:** the fourteen nickname themes are their own generators now. `randWord` takes a `theme`, and `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle` and `randProduct` are that generator with the theme already chosen. `randWordDetails` is the detail form — the themed functions have none of their own, and take the theme here instead. `wordLengthRange` reports what the pools hold, and `randNickname` draws from those pools rather than owning them.
- **Breaking:** `NicknameLanguage` and `NicknameTheme` are `WordLanguage` and `WordTheme`, and `nicknameLanguages`, `nicknameThemes` and `nicknameData` are `wordLanguages`, `wordThemes` and `wordData`. They describe the words, and the words are no longer only a nickname's business.
- **Breaking:** three groups of nickname parameters are gone, all for one reason — decorating a string was never a thing about nicknames. `uniqueSuffix`, `uniqueSuffixLength`, `uniqueSuffixSeparator` and `uniqueSuffixCharset` are `randSuffix`; `includeModifier` is `randModifier`; and `baseWord` is `randModifier` on a word you already have. `NicknameDetail.suffix`, `nicknameSuffixLengthMax` and `nicknameSuffixCharset` go too, `nicknameLengthRange` loses its `includeModifier` parameter, and `minLength` / `maxLength` now describe the whole nickname with nothing excluded from them.
- **Breaking:** `nameCountMax`, `nameLengthMin` / `Max`, `nicknameCountMax` and `nicknameLengthMin` / `Max` are `randCountMax` and `randLengthMin` / `Max`, one set for every generator. The name length bound goes from 30 to 40 as a result.
- Added the decorators. `randSuffix` and `randPrefix` attach a random token with `length`, `separator` and `charset`; `randModifier` attaches a word out of the pools instead, so `randModifier(value: 'Owl')` is `'MistyOwl'`, and picks the language off the value's own script when none is given. `randSuffixAll`, `randPrefixAll` and `randModifierAll` are the `List<String>` forms — Dart has neither overloads nor union types, so the npm package's `String | List<String>` is two functions here.
- All three decorators take `value` as a **named** parameter — `randSuffix(value: 'a')` — because Dart cannot make a positional parameter optional alongside named ones, and all three work with no value at all: `randSuffix()` hands back the bare token, `randModifier()` the bare modifier.
- Added `affixLengthDefault`, `affixLengthMax`, `affixSeparatorDefault` and `affixCharset`, the bounds and defaults `randSuffix` and `randPrefix` are clamped to.
- Added `WordDetail`, which `randWordDetails` returns.
- Added `example/`, which is what pub.dev renders on the package's Example tab.
- `count`, `style`, `minLength` / `maxLength`, `startsWith` and `unique` are the same parameters on every generator now, resolved and applied in one place rather than once per generator. Nothing about them changed from the outside; a new generator gets all of them by construction.

## 1.0.0 (2026-09-01)

- Initial release: a port of the JavaScript package's 1.0.0, generating from the same datasets under the same rules.
- Options are named parameters rather than an options object, and a null enum means every value the generator supports.
- `nameLengthRange` and `nicknameLengthRange` return a `LengthRange` that compares by value.
