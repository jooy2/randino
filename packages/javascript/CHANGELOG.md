# Changelog

## 1.1.0 (2026-09-01)

- **Breaking:** `randomName` and `randomNickname` are now `randName` and `randNickname`, and `RandomNameOptions` / `RandomNicknameOptions` are `RandNameOptions` / `RandNicknameOptions`. The old names are gone; there are no aliases.
- **Breaking:** `randomNameDetails` and `randomNicknameDetails` are gone entirely. `randName` and `randNickname` take `output: 'detail'` instead and return the same `NameDetail[]` / `NicknameDetail[]`, with overloads carrying the return type so nothing has to be cast — splitting one generator over its return type meant every option had to be documented twice.
- **Breaking:** the nickname generator's `uniqueSuffix`, `uniqueSuffixLength`, `uniqueSuffixSeparator` and `uniqueSuffixCharset` options are gone, and so are `NicknameDetail.suffix`, `NICKNAME_SUFFIX_LENGTH_MAX` and `NICKNAME_SUFFIX_CHARSET`. `minLength` / `maxLength` now describe the whole nickname, with nothing excluded from them.
- Added `randSuffix` and `randPrefix`, which attach a random token to a string or to every string in an array — a fresh one per value — with `length`, `separator` and `charset`. What used to be a nickname option works on any string now.
- Added `AFFIX_LENGTH_DEFAULT`, `AFFIX_LENGTH_MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET`, the bounds and defaults those two are clamped to, and `RandOutput` for the new `output` option.

## 1.0.0 (2026-09-01)

- Initial release
