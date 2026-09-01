# Changelog

## 1.1.0 (2026-09-01)

- **Breaking:** `randomName`, `randomNameDetails`, `randomNickname` and `randomNicknameDetails` are now `randName`, `randNameDetails`, `randNickname` and `randNicknameDetails`. The old names are gone; there are no aliases.
- **Breaking:** the nickname generator's `uniqueSuffix`, `uniqueSuffixLength`, `uniqueSuffixSeparator` and `uniqueSuffixCharset` parameters are gone, and so are `NicknameDetail.suffix`, `nicknameSuffixLengthMax` and `nicknameSuffixCharset`. `minLength` / `maxLength` now describe the whole nickname, with nothing excluded from them.
- Added `randSuffix` and `randPrefix`, which attach a random token to a `String`, with `length`, `separator` and `charset`. `randSuffixAll` and `randPrefixAll` are the `List<String>` forms — Dart has neither overloads nor union types, so the npm package's `String | List<String>` is two functions here.
- Added `affixLengthDefault`, `affixLengthMax`, `affixSeparatorDefault` and `affixCharset`, the bounds and defaults those are clamped to.

## 1.0.0 (2026-09-01)

- Initial release: a port of the JavaScript package's 1.0.0, generating from the same datasets under the same rules.
- Options are named parameters rather than an options object, and a null enum means every value the generator supports.
- `nameLengthRange` and `nicknameLengthRange` return a `LengthRange` that compares by value.
