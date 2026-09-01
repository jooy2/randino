# Changelog

## 1.1.0

**2026-09-01**

- **Breaking:** `random_name`, `random_name_details`, `random_nickname` and `random_nickname_details` are now `rand_name`, `rand_name_details`, `rand_nickname` and `rand_nickname_details`. The old names are gone; there are no aliases.
- **Breaking:** the nickname generator's `unique_suffix`, `unique_suffix_length`, `unique_suffix_separator` and `unique_suffix_charset` arguments are gone, and so are `NicknameDetail.suffix`, `NICKNAME_SUFFIX_LENGTH_MAX` and `NICKNAME_SUFFIX_CHARSET`. `min_length` / `max_length` now describe the whole nickname, with nothing excluded from them.
- Added `rand_suffix` and `rand_prefix`, which attach a random token to a `str` or to every `str` in a `list` — a fresh one per value — with `length`, `separator` and `charset`. `@overload` carries the shape through, so a `str` in gives a `str` out.
- Added `AFFIX_LENGTH_DEFAULT`, `AFFIX_LENGTH_MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET`, the bounds and defaults those two are clamped to.

## 1.0.0

**2026-09-01**

- The first release of the Python package, ported from the JavaScript one.
- `random_name` and `random_name_details` generate person names in 9 languages, with the English pronunciation of each.
- `random_nickname` and `random_nickname_details` generate nicknames in 4 languages across 14 themes.
- `name_length_range`, `name_supports_middle_name`, `name_supports_roman` and `nickname_length_range` report what a language can produce before you ask it to.
- No dependencies. Requires Python 3.10 or newer, and ships a `py.typed` marker.
