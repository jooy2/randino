# Changelog

## 2.0.0 (2026-09-02)

- **Breaking:** the fourteen nickname themes are their own generators now. `randWord` takes a `theme`, and `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle` and `randProduct` are that generator with the theme already chosen. `randWordDetails` is the detail form — the themed functions have none of their own, and take the theme here instead. `wordLengthRange` reports what the pools hold.
- **Breaking:** `NicknameLanguage` and `NicknameTheme` are `WordLanguage` and `WordTheme`, and `nicknameLanguages`, `nicknameThemes` and `nicknameData` are `wordLanguages`, `wordThemes` and `wordData`. They describe the words, and the words are no longer only a nickname's business.
- **Breaking:** `randNickname`'s `includeModifier` is gone. `randModifier` puts a modifier in front of any string — `randModifier(value: '사자')` is `'멋진사자'` — picks the language off the value's own script when none is given, and `randModifierAll` is the list form. `nicknameLengthRange` loses its `includeModifier` parameter with it.
- **Breaking:** `randNickname`'s `baseWord` is gone. Pinning a word and varying only the decoration is `randModifier` on a word you already have.
- **Breaking:** `randSuffix` and `randPrefix` take `value` as a **named** parameter: `randSuffix(value: 'a')`. Dart cannot make a positional parameter optional alongside named ones, and all three decorators now work with no value at all — `randSuffix()` hands back the bare token, `randModifier()` the bare modifier.
- **Breaking:** `nameCountMax`, `nameLengthMin` / `Max`, `nicknameCountMax` and `nicknameLengthMin` / `Max` are `randCountMax` and `randLengthMin` / `Max`, one set for every generator. The name length bound goes from 30 to 40 as a result.
- Added `WordDetail`, which `randWordDetails` returns.

## 1.1.0 (2026-09-01)

- **Breaking:** `randomName`, `randomNameDetails`, `randomNickname` and `randomNicknameDetails` are now `randName`, `randNameDetails`, `randNickname` and `randNicknameDetails`. The old names are gone; there are no aliases.
- **Breaking:** the nickname generator's `uniqueSuffix`, `uniqueSuffixLength`, `uniqueSuffixSeparator` and `uniqueSuffixCharset` parameters are gone, and so are `NicknameDetail.suffix`, `nicknameSuffixLengthMax` and `nicknameSuffixCharset`. `minLength` / `maxLength` now describe the whole nickname, with nothing excluded from them.
- Added `randSuffix` and `randPrefix`, which attach a random token to a `String`, with `length`, `separator` and `charset`. `randSuffixAll` and `randPrefixAll` are the `List<String>` forms — Dart has neither overloads nor union types, so the npm package's `String | List<String>` is two functions here.
- Added `affixLengthDefault`, `affixLengthMax`, `affixSeparatorDefault` and `affixCharset`, the bounds and defaults those are clamped to.
- Added `example/`, which is what pub.dev renders on the package's Example tab.

## 1.0.0 (2026-09-01)

- Initial release: a port of the JavaScript package's 1.0.0, generating from the same datasets under the same rules.
- Options are named parameters rather than an options object, and a null enum means every value the generator supports.
- `nameLengthRange` and `nicknameLengthRange` return a `LengthRange` that compares by value.
