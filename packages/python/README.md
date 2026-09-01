<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for Python

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![pypi package](https://img.shields.io/pypi/v/randino.svg)](https://pypi.org/project/randino/)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **Python** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names and nicknames in the language you ask for.

- **Person names** read like names people actually carry — 김민준, Emma Clover, Иванов Иван — and come with their English pronunciation. 9 languages.
- **Nicknames** are the handles you would pick for a game or a website — 멋진사자, MistyOwl, 고양이꼬리. Built from everyday words across fourteen themes, never from person names.
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
from randino import rand_name, rand_name_details

rand_name()
# ['Emma Clover']

rand_name(language="ko", count=3)
# ['김태윤', '원동혁', '조진우']

rand_name(language="ko", script="roman")
# ['Kim Minjun']

rand_name(language="en", gender="female", include_middle_name=True)
# ['Grace Amelia Bennett']

rand_name_details(language="ko")[0]
# NameDetail(native='여미주', roman='Yeo Miju', language='ko', gender='female')
```

| Argument                    | Type                          | Default    |
| --------------------------- | ----------------------------- | ---------- |
| `language`                  | `NameLanguageOption`          | `"all"`    |
| `gender`                    | `NameGenderOption`            | `"all"`    |
| `count`                     | `int`                         | `1`        |
| `style`                     | `int` (0 real … 100 invented) | `0`        |
| `min_length` / `max_length` | `int \| None`                 | _language_ |
| `include_surname`           | `bool`                        | `True`     |
| `include_middle_name`       | `bool`                        | `False`    |
| `script`                    | `NameScript`                  | `"native"` |
| `starts_with`               | `str`                         | `""`       |
| `unique`                    | `bool`                        | `False`    |

`rand_name_details` takes the same arguments except `script`, and returns a `NameDetail` — `native`, `roman`, `language` and `gender` — for each name.

## Nicknames

```python
from randino import rand_nickname, rand_nickname_details

rand_nickname(language="ko", count=3)
# ['오래된곰', '영원한도마뱀', '귀여운신화다발']

rand_nickname(language="en", count=2)
# ['FoggyHillside', 'CraneVoyage']

rand_nickname(language="ko", theme="animal", count=2)
# ['깊은연어', '하얀여우갈기']

rand_nickname(language="ko", unique_suffix=True, count=2)
# ['달력_U7aNZ', '조용한바구니_RUKAP']

rand_nickname(base_word="고양이", count=3)
# ['하얀고양이', '고양이바람', '귀여운고양이뿔']

rand_nickname_details(language="ko", unique_suffix=True)[0]
# NicknameDetail(nickname='오래된발견_zVShs', words=('오래된', '발견'), suffix='_zVShs', language='ko', theme='concept')
```

| Argument                    | Type                              | Default    |
| --------------------------- | --------------------------------- | ---------- |
| `language`                  | `NicknameLanguageOption \| None`  | `None`     |
| `theme`                     | `NicknameThemeOption`             | `"all"`    |
| `count`                     | `int`                             | `1`        |
| `style`                     | `int` (0 real … 100 invented)     | `0`        |
| `min_length` / `max_length` | `int \| None`                     | _language_ |
| `include_modifier`          | `bool`                            | `True`     |
| `word_separator`            | `str \| None`                     | _language_ |
| `base_word`                 | `str`                             | `""`       |
| `unique_suffix`             | `bool`                            | `False`    |
| `unique_suffix_length`      | `int`                             | `5`        |
| `unique_suffix_separator`   | `str`                             | `"_"`      |
| `unique_suffix_charset`     | `str`                             | _built-in_ |
| `starts_with`               | `str`                             | `""`       |
| `unique`                    | `bool`                            | `False`    |

`language` is the one argument whose default is `None` rather than `"all"`, and the two are not the same thing: left out, a `base_word` picks the language it is written in, so `"고양이"` is never handed an English modifier. Passing `"all"` mixes every language regardless.

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`.

## Helpers and constants

```python
from randino import name_length_range, name_supports_roman, nickname_length_range

name_length_range("ko")  # (3, 3)
name_length_range("en", include_middle_name=True)  # (12, 24)
name_supports_middle_name("ko")  # False
name_supports_roman("en")  # False
nickname_length_range("ko")  # (1, 12)
```

`NAME_LANGUAGES`, `NICKNAME_LANGUAGES` and `NICKNAME_THEMES` list what the generators accept; `NAME_COUNT_MAX`, `NAME_LENGTH_MIN` / `MAX`, `NICKNAME_COUNT_MAX`, `NICKNAME_LENGTH_MIN` / `MAX`, `NICKNAME_SUFFIX_LENGTH_MAX` and `NICKNAME_SUFFIX_CHARSET` are the bounds every argument is clamped to.

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
