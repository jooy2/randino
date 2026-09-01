# Changelog

## 1.1.0

**2026-09-01**

- **Breaking:** `random_name`, `random_name_details`, `random_nickname` and `random_nickname_details` are now `rand_name`, `rand_name_details`, `rand_nickname` and `rand_nickname_details`. The old names are gone; there are no aliases.

## 1.0.0

**2026-09-01**

- The first release of the Python package, ported from the JavaScript one.
- `random_name` and `random_name_details` generate person names in 9 languages, with the English pronunciation of each.
- `random_nickname` and `random_nickname_details` generate nicknames in 4 languages across 14 themes.
- `name_length_range`, `name_supports_middle_name`, `name_supports_roman` and `nickname_length_range` report what a language can produce before you ask it to.
- No dependencies. Requires Python 3.10 or newer, and ships a `py.typed` marker.
