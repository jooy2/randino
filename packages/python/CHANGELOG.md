# Changelog

## 2.0.0

**2026-09-02**

- **Breaking:** the fourteen nickname themes are their own generators now. `rand_word` takes a `theme`, and `rand_animal`, `rand_object`, `rand_nature`, `rand_plant`, `rand_gem`, `rand_concept`, `rand_myth`, `rand_job`, `rand_music`, `rand_place`, `rand_food`, `rand_sport`, `rand_vehicle` and `rand_product` are that generator with the theme already chosen. `word_length_range` reports what the pools hold. `rand_nickname` draws from the same pools rather than owning them.
- **Breaking:** `NicknameLanguage`, `NicknameLanguageOption`, `NicknameTheme`, `NicknameThemeOption`, `NICKNAME_LANGUAGES` and `NICKNAME_THEMES` are `WordLanguage`, `WordLanguageOption`, `WordTheme`, `WordThemeOption`, `WORD_LANGUAGES` and `WORD_THEMES`. They describe the words, and the words are no longer only a nickname's business.
- **Breaking:** `rand_nickname`'s `include_modifier` is gone. `rand_modifier` puts a modifier in front of any string — `rand_modifier("사자")` is `"멋진사자"` — picks the language off the value's own script when none is given, and draws a fresh modifier per entry for a list. `nickname_length_range` loses its `include_modifier` argument with it.
- **Breaking:** `rand_nickname`'s `base_word` is gone, and with it the one argument whose default was `None` rather than `"all"`: `language` now defaults to `"all"` like every other one.
- **Breaking:** `NAME_COUNT_MAX`, `NAME_LENGTH_MIN` / `MAX`, `NICKNAME_COUNT_MAX` and `NICKNAME_LENGTH_MIN` / `MAX` are `RAND_COUNT_MAX` and `RAND_LENGTH_MIN` / `MAX`, one set for every generator. The name length bound goes from 30 to 40 as a result.
- `rand_suffix`, `rand_prefix` and `rand_modifier` all work with **no value at all**, handing back the token or the word they would have attached. `rand_suffix()` is `"nVtRC"`.
- Added `WordDetail`, which `rand_word(output="detail")` returns.

## 1.1.0

**2026-09-01**

- **Breaking:** `random_name` and `random_nickname` are now `rand_name` and `rand_nickname`. The old names are gone; there are no aliases.
- **Breaking:** `random_name_details` and `random_nickname_details` are gone entirely. `rand_name` and `rand_nickname` take `output="detail"` instead and return the same `list[NameDetail]` / `list[NicknameDetail]`, with `@overload` carrying the return type so a checker knows which one it got.
- **Breaking:** the nickname generator's `unique_suffix`, `unique_suffix_length`, `unique_suffix_separator` and `unique_suffix_charset` arguments are gone, and so are `NicknameDetail.suffix`, `NICKNAME_SUFFIX_LENGTH_MAX` and `NICKNAME_SUFFIX_CHARSET`. `min_length` / `max_length` now describe the whole nickname, with nothing excluded from them.
- Added `rand_suffix` and `rand_prefix`, which attach a random token to a `str` or to every `str` in a `list` — a fresh one per value — with `length`, `separator` and `charset`.
- Added `AFFIX_LENGTH_DEFAULT`, `AFFIX_LENGTH_MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET`, the bounds and defaults those two are clamped to, and `RandOutput` for the new `output` argument.

## 1.0.0

**2026-09-01**

- The first release of the Python package, ported from the JavaScript one.
- `random_name` and `random_name_details` generate person names in 9 languages, with the English pronunciation of each.
- `random_nickname` and `random_nickname_details` generate nicknames in 4 languages across 14 themes.
- `name_length_range`, `name_supports_middle_name`, `name_supports_roman` and `nickname_length_range` report what a language can produce before you ask it to.
- No dependencies. Requires Python 3.10 or newer, and ships a `py.typed` marker.
