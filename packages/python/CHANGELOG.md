# Changelog

## vNext (2026--)

- The words a nickname or `rand_modifier` puts in front of a noun are split by what they say about it, and the half that says what the noun is **doing** grew from a handful to a pool of its own. English went from 214 decorating words to 318, Korean from 192 to 293, Japanese from 163 to 260 and Chinese from 164 to 265, so `rand_modifier("Fox")` now reaches `StudyingFox` as readily as `MistyFox`. Nothing about either function's surface changed.
- `nickname_length_range` moved with those pools: `"ko"` is `(1, 13)` rather than `(1, 12)` and `"en"` is `(3, 31)` rather than `(3, 30)`, because the longest action word is longer than the longest adjective. A caller who pinned `max_length` to the old number keeps the nicknames it allowed.
- Every word theme holds roughly twice the words it did. All fourteen gained at least fifty entries per language, so the smallest pools are no longer the ones that shape the output: `sport` went from 46 to about 115, `vehicle` from 43 to about 113, and `product` from 36 to about 105. Each language now draws from around 1,900 nouns rather than 900, which roughly doubles what `rand_word`, the fourteen themed generators and `rand_nickname` can produce.
- The person-name pools grew with them. The seven languages that had around 45 entries per pool now hold roughly twice that — Italian, German, Spanish and Russian sit near 95 for each of given names and surnames, Vietnamese near 80, and Japanese and Chinese surnames at 95 with their given names at about 75. English and Korean, already the largest, gained too: English is near 235 per pool and Korean holds 272 male and 259 female given names. Russian patronymics went from 18 to 48, and the CJK syllable pools that build invented names grew alongside. Around 3,750 name parts in total, up from about 2,200.
- Fixed the Italian surname `De Luca`, which was two surnames. The pools separate entries by whitespace and spell a space inside one as `_`, and this entry was written with a real space — so `rand_name(language="it")` could hand back `Marco De` or `Marco Luca`. It is one surname now.

## 1.1.0 (2026-09-02)

- **Breaking:** `random_name` and `random_nickname` are now `rand_name` and `rand_nickname`. The old names are gone; there are no aliases.
- **Breaking:** `random_name_details` and `random_nickname_details` are gone entirely. `rand_name` and `rand_nickname` take `output="detail"` instead and return the same `list[NameDetail]` / `list[NicknameDetail]`, with `@overload` carrying the return type so a checker knows which one it got.
- **Breaking:** the fourteen nickname themes are their own generators now. `rand_word` takes a `theme`, and `rand_animal`, `rand_object`, `rand_nature`, `rand_plant`, `rand_gem`, `rand_concept`, `rand_myth`, `rand_job`, `rand_music`, `rand_place`, `rand_food`, `rand_sport`, `rand_vehicle` and `rand_product` are that generator with the theme already chosen. `word_length_range` reports what the pools hold, and `rand_nickname` draws from those pools rather than owning them.
- **Breaking:** `NicknameLanguage`, `NicknameLanguageOption`, `NicknameTheme`, `NicknameThemeOption`, `NICKNAME_LANGUAGES` and `NICKNAME_THEMES` are `WordLanguage`, `WordLanguageOption`, `WordTheme`, `WordThemeOption`, `WORD_LANGUAGES` and `WORD_THEMES`. They describe the words, and the words are no longer only a nickname's business.
- **Breaking:** three groups of nickname arguments are gone, all for one reason — decorating a string was never a thing about nicknames. `unique_suffix`, `unique_suffix_length`, `unique_suffix_separator` and `unique_suffix_charset` are `rand_suffix`; `include_modifier` is `rand_modifier`; and `base_word` is `rand_modifier` on a word you already have, which also takes with it the one argument whose default was `None` rather than `"all"` — `language` now defaults to `"all"` like every other one. `NicknameDetail.suffix`, `NICKNAME_SUFFIX_LENGTH_MAX` and `NICKNAME_SUFFIX_CHARSET` go too, `nickname_length_range` loses its `include_modifier` argument, and `min_length` / `max_length` now describe the whole nickname with nothing excluded from them.
- **Breaking:** `NAME_COUNT_MAX`, `NAME_LENGTH_MIN` / `MAX`, `NICKNAME_COUNT_MAX` and `NICKNAME_LENGTH_MIN` / `MAX` are `RAND_COUNT_MAX` and `RAND_LENGTH_MIN` / `MAX`, one set for every generator. The name length bound goes from 30 to 40 as a result.
- **Breaking:** the `randino.affix` package is `randino.decorate`, which is what the three functions in it now do between them. Everything it holds is still re-exported from `randino` itself, which is where it is meant to be imported from.
- Added the decorators. `rand_suffix` and `rand_prefix` attach a random token to a `str`, or to every `str` in a `list` — a fresh one per value — with `length`, `separator` and `charset`; `rand_modifier` attaches a word out of the pools instead, so `rand_modifier("Owl")` is `"MistyOwl"`, and picks the language off the value's own script when none is given. All three work with **no value at all**, handing back the token or the word they would have attached: `rand_suffix()` is `"nVtRC"`.
- Added `AFFIX_LENGTH_DEFAULT`, `AFFIX_LENGTH_MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET`, the bounds and defaults `rand_suffix` and `rand_prefix` are clamped to.
- Added `RandOutput` for the new `output` argument, and `WordDetail`, which `rand_word(output="detail")` returns.
- `count`, `style`, `min_length` / `max_length`, `starts_with`, `unique` and `output` are the same arguments on every generator now, resolved and applied in one place rather than once per generator. Nothing about them changed from the outside; a new generator gets all of them by construction.

## 1.0.0

**2026-09-01**

- The first release of the Python package, ported from the JavaScript one.
- `random_name` and `random_name_details` generate person names in 9 languages, with the English pronunciation of each.
- `random_nickname` and `random_nickname_details` generate nicknames in 4 languages across 14 themes.
- `name_length_range`, `name_supports_middle_name`, `name_supports_roman` and `nickname_length_range` report what a language can produce before you ask it to.
- No dependencies. Requires Python 3.10 or newer, and ships a `py.typed` marker.
