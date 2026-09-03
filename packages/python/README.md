<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for Python

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![pypi package](https://img.shields.io/pypi/v/randino.svg)](https://pypi.org/project/randino/)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **Python** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — Emma Clover, Jack Reeves — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across twenty-five themes, never from person names.
- **Words** are those twenty-five themes on their own — `rand_word`, plus `rand_animal`, `rand_food` and twelve more.
- **Decorators** attach something to a string you already have: `rand_suffix`, `rand_prefix` and `rand_modifier`.
- Every argument is keyword-only and optional, so `rand_name()` on its own works.
- **Pure Python, no dependencies.** It imports nothing outside the standard library, and ships a `py.typed` marker so mypy and Pyright read the annotations.

This is the Python half. The [npm package](https://www.npmjs.com/package/randino) and the [pub.dev package](https://pub.dev/packages/randino) are the others, and all three generate from the same datasets under the same rules. They version independently, so this package's number and the others' will not always agree.

## Install

```bash
pip install randino
```

Requires **Python 3.10 or newer**. There is nothing else to install.

## Person names

```python
from randino import rand_name

rand_name()
# ['Emma Clover']

rand_name(language="en", count=3)
# ['Christina Mills', 'Jack Reeves', 'Brian Wallace']

rand_name(language="ko", script="roman")
# ['Kim Minjun']

rand_name(language="en", gender="female", include_middle_name=True)
# ['Grace Amelia Bennett']

rand_name(language="ko", output="detail")[0]
# NameDetail(native='여미주', roman='Yeo Miju', language='ko', gender='female')
```

| Argument                    | Type                          | Default    |
| --------------------------- | ----------------------------- | ---------- |
| `language`                  | `NameLanguageOption`          | `"all"`    |
| `gender`                    | `NameGenderOption`            | `"all"`    |
| `count`                     | `int`                         | `1`        |
| `realism`                   | `RandRealism`                 | `"real"`   |
| `min_length` / `max_length` | `int \| None`                 | _language_ |
| `include_surname`           | `bool`                        | `True`     |
| `include_middle_name`       | `bool`                        | `False`    |
| `script`                    | `NameScript`                  | `"native"` |
| `starts_with`               | `str`                         | `""`       |
| `unique`                    | `bool`                        | `False`    |
| `output`                    | `RandOutput`                  | `"value"`  |

`output="detail"` returns a `NameDetail` — `native`, `roman`, `language` and `gender` — for each name instead of a string, and makes `script` moot because both forms are already there. The two shapes are `@overload`ed, so a type checker knows which one a call returns.

## Nicknames

```python
from randino import rand_nickname

rand_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

rand_nickname(language="en", theme="animal", count=2)
# ['FloatingFalcon', 'ChewyOtter']

rand_nickname(language="en", output="detail")[0]
# NicknameDetail(nickname='MistyOwl', words=('Misty', 'Owl'), language='en', theme='animal')
```

| Argument                    | Type                              | Default    |
| --------------------------- | --------------------------------- | ---------- |
| `language`                  | `WordLanguageOption`          | `"all"`    |
| `theme`                     | `WordThemeOption`             | `"all"`    |
| `count`                     | `int`                             | `1`        |
| `realism`                   | `RandRealism`                     | `"real"`   |
| `min_length` / `max_length` | `int \| None`                     | _language_ |
| `word_separator`            | `str \| None`                     | _language_ |
| `starts_with`               | `str`                             | `""`       |
| `unique`                    | `bool`                            | `False`    |
| `output`                    | `RandOutput`                      | `"value"`  |

`output="detail"` returns a `NicknameDetail` — `nickname`, `words`, `language` and `theme` — for each nickname instead of a string.

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`, `color`, `finance`, `tech`, `weather`, `space`, `time`, `emotion`, `body`, `clothing`, `tool`, `drink`.

## Words

The pools the nicknames are built from, on their own. Fourteen themes, four languages, and a function per theme.

```python
from randino import rand_animal, rand_food, rand_word, word_length_range

rand_word(language="en", theme="animal", count=3)
# ['Otter', 'Falcon', 'Lynx']

rand_animal(language="en", count=2)  # ['Turtle', 'Crane']
rand_food(language="en", count=2)  # ['Dumpling', 'Cocoa']

rand_word(language="en", theme="plant", output="detail")
# [WordDetail(word='Cedar', language='en', theme='plant')]

word_length_range("en")  # (3, 11)
```

| Argument                    | Type                             | Default   |
| --------------------------- | -------------------------------- | --------- |
| `language`                  | `WordLanguageOption`             | `"all"`   |
| `theme`                     | `WordThemeOption`                | `"all"`   |
| `count`                     | `int`                            | `1`       |
| `realism`                   | `RandRealism`                    | `"real"`  |
| `min_length` / `max_length` | `int \| None`                    | _pools_   |
| `starts_with`               | `str`                            | `""`      |
| `unique`                    | `bool`                           | `False`   |
| `output`                    | `RandOutput`                     | `"value"` |

One function per theme: `rand_animal`, `rand_object`, `rand_nature`, `rand_plant`, `rand_gem`, `rand_concept`, `rand_myth`, `rand_job`, `rand_music`, `rand_place`, `rand_food`, `rand_sport`, `rand_vehicle`, `rand_product`, `rand_color`, `rand_finance`, `rand_tech`, `rand_weather`, `rand_space`, `rand_time`, `rand_emotion`, `rand_body`, `rand_clothing`, `rand_tool`, `rand_drink`. Each is `rand_word` with the theme already chosen.

## Decorators

`rand_suffix`, `rand_prefix` and `rand_modifier` attach something to a string you already have, rather than generating one. They take anything, not just this library's output, which is why none of them is an argument on a generator — and each of them works with no value at all, handing back the thing it would have attached.

```python
from randino import rand_nickname, rand_prefix, rand_suffix

rand_suffix("MistyOwl")  # 'MistyOwl_nVtRC'
rand_suffix(rand_nickname(language="en", count=2))
# ['RoundSeason_RVBnC', 'RowdyDusk_dwtu5']

rand_prefix("order-4021", length=4, separator="-")  # 'k3Rm-order-4021'
rand_suffix("MistyOwl", length=8, charset="0123456789")  # 'MistyOwl_40218836'
rand_suffix()  # 'nVtRC' — the token on its own
```

| Argument    | Type  | Default    |
| ----------- | ----- | ---------- |
| `length`    | `int` | `5`        |
| `separator` | `str` | `"_"`      |
| `charset`   | `str` | _built-in_ |

A fresh token per value, never one for the batch. The default charset leaves out `0O1lI`, because these end up in names people read aloud and type back in. `value` is positional and optional, the rest keyword-only, and the overloads carry the shape through: a `str` in gives a `str`, a `list[str]` gives a `list[str]`.

`rand_modifier` attaches a word instead of a token — what `rand_nickname`'s `include_modifier` used to do, for any string:

```python
from randino import rand_animal, rand_modifier

rand_modifier("Owl")  # 'MistyOwl'
rand_modifier("Owl", separator=" ")  # 'Misty Owl'
rand_modifier()  # 'Misty'

rand_modifier(rand_animal(language="en", count=2))
# ['TwinklingLynx', 'OnyxCrane']
```

| Argument    | Type                         | Default    |
| ----------- | ---------------------------- | ---------- |
| `value`     | `str \| list[str] \| None`   | `None`     |
| `language`  | `WordLanguageOption \| None` | _script_   |
| `realism`   | `RandRealism`                | `"real"`   |
| `separator` | `str \| None`                | _language_ |

With no `language`, the script of the value picks one, so `"고양이"` is never handed an English modifier.

## Helpers and constants

```python
from randino import name_length_range, name_supports_roman, nickname_length_range

name_length_range("ko")  # (3, 3)
name_length_range("en", include_middle_name=True)  # (12, 24)
name_supports_middle_name("ko")  # False
name_supports_roman("en")  # False
nickname_length_range("ko")  # (1, 13)
```

`NAME_LANGUAGES`, `WORD_LANGUAGES` and `WORD_THEMES` list what the generators accept; `RAND_COUNT_MAX`, `RAND_LENGTH_MIN` / `MAX`, `AFFIX_LENGTH_DEFAULT` / `MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET` are the bounds and defaults every argument is clamped to.

## Differences from the npm package

The two generate the same output from the same data, and only the surface is Python's rather than JavaScript's.

| npm                                        | PyPI                                            |
| ------------------------------------------ | ----------------------------------------------- |
| One options object                         | Keyword-only arguments                          |
| `includeSurname`, `minLength`              | `include_surname`, `min_length`                 |
| `language: 'ko'`, `language: 'all'`        | The same strings, as `Literal` types            |
| `[number, number]`                         | `tuple[int, int]`                               |
| `NameDetail` / `NicknameDetail` interfaces | The same two names, as frozen dataclasses       |
| `detail.words` is an array                 | `detail.words` is a tuple                       |

## Development

```bash
uv venv && uv pip install -e ".[dev]"
pytest
ruff check . && ruff format --check .
mypy
```

## License

MIT © [CDGet](https://cdget.com)
