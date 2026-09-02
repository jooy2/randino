# Changelog

## 2.0.0 (2026-09-02)

- **Breaking:** the fourteen nickname themes are their own generators now. `randWord` takes a `theme`, and `randAnimal`, `randObject`, `randNature`, `randPlant`, `randGem`, `randConcept`, `randMyth`, `randJob`, `randMusic`, `randPlace`, `randFood`, `randSport`, `randVehicle` and `randProduct` are that generator with the theme already chosen. `wordLengthRange` reports what the pools hold. `randNickname` draws from the same pools rather than owning them.
- **Breaking:** `NicknameLanguage`, `NicknameLanguageOption`, `NicknameTheme`, `NicknameThemeOption`, `NICKNAME_LANGUAGES` and `NICKNAME_THEMES` are `WordLanguage`, `WordLanguageOption`, `WordTheme`, `WordThemeOption`, `WORD_LANGUAGES` and `WORD_THEMES`. They describe the words, and the words are no longer only a nickname's business.
- **Breaking:** `randNickname`'s `includeModifier` is gone. `randModifier` puts a modifier in front of any string — `randModifier('사자')` is `'멋진사자'` — picks the language off the value's own script when none is given, and draws a fresh modifier per entry for an array. `nicknameLengthRange` loses its `includeModifier` argument with it.
- **Breaking:** `randNickname`'s `baseWord` is gone. Pinning a word and varying only the decoration is `randModifier` on a word you already have, and it carried the only piece of language guesswork a generator did.
- **Breaking:** `NAME_COUNT_MAX`, `NAME_LENGTH_MIN` / `_MAX`, `NICKNAME_COUNT_MAX` and `NICKNAME_LENGTH_MIN` / `_MAX` are `RAND_COUNT_MAX` and `RAND_LENGTH_MIN` / `_MAX`, one set for every generator. The name length bound goes from 30 to 40 as a result.
- `randSuffix`, `randPrefix` and `randModifier` all work with **no value at all**, handing back the token or the word they would have attached. `randSuffix()` is `'nVtRC'`; `randSuffix({ length: 8 })` is the same thing eight characters long.
- Added `RandCommonOptions`, which is what `count`, `style`, `minLength` / `maxLength`, `startsWith`, `unique` and `output` are on every generator, and `RandWordOptions`, `RandThemedWordOptions`, `WordDetail` and `RandModifierOptions`.

## 1.1.0 (2026-09-01)

- **Breaking:** `randomName` and `randomNickname` are now `randName` and `randNickname`, and `RandomNameOptions` / `RandomNicknameOptions` are `RandNameOptions` / `RandNicknameOptions`. The old names are gone; there are no aliases.
- **Breaking:** `randomNameDetails` and `randomNicknameDetails` are gone entirely. `randName` and `randNickname` take `output: 'detail'` instead and return the same `NameDetail[]` / `NicknameDetail[]`, with overloads carrying the return type so nothing has to be cast — splitting one generator over its return type meant every option had to be documented twice.
- **Breaking:** the nickname generator's `uniqueSuffix`, `uniqueSuffixLength`, `uniqueSuffixSeparator` and `uniqueSuffixCharset` options are gone, and so are `NicknameDetail.suffix`, `NICKNAME_SUFFIX_LENGTH_MAX` and `NICKNAME_SUFFIX_CHARSET`. `minLength` / `maxLength` now describe the whole nickname, with nothing excluded from them.
- Added `randSuffix` and `randPrefix`, which attach a random token to a string or to every string in an array — a fresh one per value — with `length`, `separator` and `charset`. What used to be a nickname option works on any string now.
- Added `AFFIX_LENGTH_DEFAULT`, `AFFIX_LENGTH_MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET`, the bounds and defaults those two are clamped to, and `RandOutput` for the new `output` option.

## 1.0.0 (2026-09-01)

- Initial release
