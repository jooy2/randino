# Changelog

## 1.1.0 (2026-08-25)

- Add the `wordSeparator` option to `randomNickname` and `randomNicknameDetails`, placing a separator of your own between the words (`멋진 사자`, `Misty-Owl`), and a matching third argument to `nicknameLengthRange`
- Add the `plant`, `gem`, `myth`, `job` and `music` nickname themes
- Expand the nickname `modifiers` pools for every language
- Draw `ko`, `zh` and `vi` surnames in proportion to how common they really are, instead of evenly across the pool
- Fix `style: 0` inventing a given name part where the curated pool held one

## 1.0.1 (2026-07-31)

- Add more names and nickname sets

## 1.0.0 (2026-07-30)

- Initial release
- Add `randomName` and `randomNameDetails` methods, generating person names in 9 languages
- Add `nameLengthRange`, `nameSupportsMiddleName` and `nameSupportsRoman` helper methods
- Add `randomNickname` and `randomNicknameDetails` methods, generating nicknames in 4 languages
- Add `nicknameLengthRange` helper method
