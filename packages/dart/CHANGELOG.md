# Changelog

## 1.0.0 (2026-09-01)

- Initial release: a port of the JavaScript package's 1.0.0, generating from the same datasets under the same rules.
- Options are named parameters rather than an options object, and a null enum means every value the generator supports.
- `nameLengthRange` and `nicknameLengthRange` return a `LengthRange` that compares by value.
