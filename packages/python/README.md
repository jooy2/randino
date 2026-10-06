<img src="https://raw.githubusercontent.com/jooy2/randino/main/docs/public/128x128.png" alt="randino" width="96" height="96" />

# randino for Python

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/randino/blob/main/LICENSE) [![pypi package](https://img.shields.io/pypi/v/randino.svg)](https://pypi.org/project/randino/)

### 📘 [**randino.cdget.com**](https://randino.cdget.com)

Every option and every example, with **Python** picked in the sidebar. This README is just the quick start.

---

**randino** generates random person names, nicknames, words, sentences, real locations, ages and genders in the language you ask for.

- **Person names** read like names people carry: Emma Clover, Jack Reeves, each with its English pronunciation. 9 languages.
- **Nicknames** are handles for a game or a website: MistyOwl, CraneVoyage, RustyBoot. Built from everyday words across twenty-nine themes, and never from person names.
- **Words** are those twenty-nine themes on their own: `rand_word`, plus `rand_animal`, `rand_food` and twenty-seven more.
- **Sentences** are whole statements in the language's own grammar, from `rand_sentence`. The verb decides what can stand beside it, so the words of one sentence belong together.
- **Locations** are real places down to a neighbourhood or a city, from `rand_location`: Korean and US divisions, as each country publishes them.
- **Ages** are whole numbers drawn along a curve shaped like a population, from `rand_age`, so a sample of people is mostly adults.
- **Genders** are the labels a form in the language writes, from `rand_gender`: 여성, Female, Weiblich. An unstated gender and a third gender are there when you ask for them.
- **Decorators** attach something to a string you already have: `rand_suffix`, `rand_prefix` and `rand_modifier`.
- Every argument is keyword-only and optional, so `rand_name()` on its own works.
- **Pure Python, no dependencies.** It imports nothing outside the standard library, and ships a `py.typed` marker so mypy and Pyright read the annotations.
- **Every generator and decorator takes a `random`.** `SystemRandom().random` for a value nobody may predict, `Random(42).random` for one that has to come out the same every run.

This is the Python package. The [npm package](https://www.npmjs.com/package/randino) and the [pub.dev package](https://pub.dev/packages/randino) are the other two, and all three generate from the same datasets under the same rules. They version independently, so the numbers on PyPI, npm and pub.dev will not always agree.

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

`output="detail"` returns a `NameDetail` for each name instead of a string, carrying `native`, `roman`, `language` and `gender`, which makes `script` moot because both forms are already there. The two shapes are `@overload`ed, so a type checker knows which one a call returns.

## Nicknames

```python
from randino import rand_nickname

rand_nickname(language="en", count=3)
# ['FoggyHillside', 'CraneVoyage', 'TinyLeopardCloak']

rand_nickname(language="en", theme="animal", count=2)
# ['FloatingFalcon', 'ChewyOtter']

rand_nickname(language="en", slots="action", count=2)
# ['CountingHarmonics', 'HaulingBurrito']

rand_nickname(language="en", output="detail")[0]
# NicknameDetail(nickname='MistyOwl', words=('Misty', 'Owl'),
#                slots=('adjective', 'noun'), language='en', theme='animal')
```

| Argument                    | Type                              | Default    |
| --------------------------- | --------------------------------- | ---------- |
| `language`                  | `WordLanguageOption`          | `"all"`    |
| `theme`                     | `WordThemeOption`             | `"all"`    |
| `slots`                     | `WordSlotOption`              | `"all"`    |
| `count`                     | `int`                             | `1`        |
| `realism`                   | `RandRealism`                     | `"real"`   |
| `vocabulary`                | `RandVocabulary`                  | `"full"`   |
| `min_length` / `max_length` | `int \| None`                     | _language_ |
| `word_separator`            | `str \| None`                     | _language_ |
| `starts_with`               | `str`                             | `""`       |
| `unique`                    | `bool`                            | `False`    |
| `output`                    | `RandOutput`                      | `"value"`  |

`output="detail"` returns a `NicknameDetail` for each nickname instead of a string, carrying `nickname`, `words`, `slots`, `language` and `theme`.

Themes: `animal`, `object`, `nature`, `plant`, `gem`, `concept`, `myth`, `job`, `music`, `place`, `food`, `sport`, `vehicle`, `product`, `color`, `finance`, `tech`, `weather`, `space`, `time`, `emotion`, `body`, `clothing`, `tool`, `drink`, `toy`, `sound`, `person`, `furniture`.

## Words

The pools the nicknames are built from, on their own. Twenty-nine themes, nine languages, and a function per theme.

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
| `vocabulary`                | `RandVocabulary`                 | `"full"`  |
| `min_length` / `max_length` | `int \| None`                    | _pools_   |
| `starts_with`               | `str`                            | `""`      |
| `unique`                    | `bool`                           | `False`   |
| `output`                    | `RandOutput`                     | `"value"` |

One function per theme: `rand_animal`, `rand_object`, `rand_nature`, `rand_plant`, `rand_gem`, `rand_concept`, `rand_myth`, `rand_job`, `rand_music`, `rand_place`, `rand_food`, `rand_sport`, `rand_vehicle`, `rand_product`, `rand_color`, `rand_finance`, `rand_tech`, `rand_weather`, `rand_space`, `rand_time`, `rand_emotion`, `rand_body`, `rand_clothing`, `rand_tool`, `rand_drink`. Each is `rand_word` with the theme already chosen.

## Sentences

Whole statements, written the way the language writes them. The nouns are the same pools the words and nicknames come from, and what a sentence adds is the grammar: a verb that states what can do it and what it can be done to, and the shapes each language allows.

```python
from randino import rand_sentence, sentence_length_range

rand_sentence(language="en", count=3)
# ['The brave lion runs quietly.', 'The otter swims in the cove.', 'The sky is blue.']

rand_sentence(language="ko", count=2)
# ['검은 고양이가 숲에서 잠잔다.', '여우가 사과를 먹는다.']

rand_sentence(language="en", shape="simple")  # ['The gondola passes.']
rand_sentence(language="en", include=["brave", "lion"])
# ['The brave lion yawns quietly.']

rand_sentence(language="ko", output="detail")
# [SentenceDetail(sentence='검은 고양이가 숲에서 잠잔다.',
#                 phrases=('검은 고양이', '숲', '잠잔다'),
#                 slots=('subject', 'place', 'verb'), language='ko', theme='animal')]

sentence_length_range("en")  # (12, 92)
```

| Argument                    | Type                                | Default   |
| --------------------------- | ----------------------------------- | --------- |
| `language`                  | `WordLanguageOption`                | `"all"`   |
| `theme`                     | `WordThemeOption`                   | `"all"`   |
| `shape`                     | `SentenceShapeOption`               | `"all"`   |
| `slots`                     | `SentenceSlotOption`                | `"all"`   |
| `include`                   | `str \| Sequence[str]`              | `()`      |
| `type`                      | `SentenceTypeOption \| None`        | _drawn_   |
| `quote`                     | `SentenceQuote \| None`             | `None`    |
| `style`                     | `SentenceStyle \| None`             | _drawn_   |
| `sentences`                 | `int`                               | `1`       |
| `include_name`              | `bool \| None`                      | _drawn_   |
| `count`                     | `int`                               | `1`       |
| `realism`                   | `RandRealism`                       | `"real"`  |
| `vocabulary`                | `RandVocabulary`                    | `"common"`  |
| `min_length` / `max_length` | `int \| None`                       | _language_ |
| `starts_with`               | `str`                               | `""`      |
| `unique`                    | `bool`                              | `False`   |
| `output`                    | `RandOutput`                        | `"value"` |

`slots` names the parts a shape may carry beside its subject: `object`, `place`, `time`, `manner`, `state`, `quantity`, `money`, `date`, `clock`, or `"none"` for a subject and its predicate alone. A language declares its own shapes, so German has no `object` and Russian no `place`, because both would mark those with a case their nouns have to change for. Asking for one falls back to the closest shape the language does have.

`include` puts words you name into every sentence. A word the pools hold goes in the phrase it belongs to, and a word from anywhere else is used as a noun.

`type` is what the sentence does: a statement, a question, an exclamation, a line that trails off, or one somebody says or thinks. `style` is the speech level, which Korean writes four of. `sentences` puts up to ten of them in one string, about one subject. `include_name` puts a generated person's name where a person can stand. Left out, the three of them are drawn per result.

## Locations

Real places, written out from the country down the way the language writes one. Every division is one the country itself publishes, inside the one written beside it, and nothing goes below a Korean 읍·면·동 or a US city, so a result is never somebody's address. Korean and English only: a country is in when its list comes with no conditions a user of this package would inherit.

```python
from randino import rand_city, rand_district, rand_location, rand_region

rand_location(language="ko", count=2)
# ['대한민국 경기도 양평군 단월면', '대한민국 충청북도 청주시 서원구 미평동']
rand_location(language="en", level="city")
# ['Gig Harbor, Washington, United States']

rand_region(language="en", count=3)  # ['Idaho', 'Georgia', 'Vermont']
rand_city(language="ko", count=3)  # ['함안군', '영덕군', '여수시']
rand_district(count=3)  # ['가현동', '겸면', '행주외동']

rand_city(language="ko", output="detail")
# [LocationDetail(location='중랑구', language='ko', level='city', country='대한민국',
#                 region='서울특별시', city='중랑구', district=None)]
```

| Argument                    | Type                     | Default      |
| --------------------------- | ------------------------ | ------------ |
| `language`                  | `LocationLanguageOption` | `"all"`      |
| `level`                     | `LocationLevel`          | `"district"` |
| `include_country`           | `bool`                   | `True`       |
| `count`                     | `int`                    | `1`          |
| `min_length` / `max_length` | `int \| None`            | `None`       |
| `starts_with`               | `str`                    | `""`         |
| `unique`                    | `bool`                   | `False`      |
| `output`                    | `"value" \| "detail"`    | `"value"`    |

`level` is how far down the location goes: `"country"`, `"region"`, `"city"` or `"district"`. A country without that level stops at the deepest one it has, so an English location ends at its city. `include_country=False` leaves the country out of the string, which is what a fixed `language` usually wants. `rand_region`, `rand_city` and `rand_district` take the same arguments minus `level`, and hand back that one division's name. `rand_country` is the exception: its `language` is any `WordLanguage`, and it names any of the 249 ISO 3166-1 countries and territories in any of the nine languages, with each one's code in a `CountryDetail` when `output="detail"`.

## Ages

Ages for sample people, in whole years. The draw follows a curve shaped like a population rather than an even spread: it peaks from 25 to 35, sits lower for children and falls away past seventy, so a third of the ages are in their twenties and thirties and about 2% are past eighty.

```python
from randino import rand_age

rand_age(count=5)  # [27, 8, 41, 63, 30]
rand_age(min_age=18, max_age=39, count=3)  # [22, 35, 31]
rand_age(group=("teen", "senior"), count=3)  # [15, 71, 66]
rand_age(distribution="uniform", count=3)  # [91, 4, 57]

rand_age(output="detail")  # [AgeDetail(age=16, group='teen')]
```

| Argument              | Type                        | Default        |
| --------------------- | --------------------------- | -------------- |
| `min_age` / `max_age` | `int \| None`               | `0` / `100`    |
| `group`               | `AgeGroupOption`            | `"all"`        |
| `distribution`        | `"population" \| "uniform"` | `"population"` |
| `count`               | `int`                       | `1`            |
| `unique`              | `bool`                      | `False`        |
| `output`              | `"value" \| "detail"`       | `"value"`      |

`group` is `"child"` (0 to 12), `"teen"` (13 to 19), `"adult"` (20 to 64) or `"senior"` (65 and up), or a sequence of them, and narrows the range rather than replacing it. An age has no language, so `rand_age` takes none.

## Genders

Genders for sample people, written the way a form in the language labels them. Male and female split evenly; `include_unknown` adds a gender nobody stated, about one draw in eleven, and `include_nonbinary` a third gender, about one in a hundred.

```python
from randino import rand_gender

rand_gender(language="ko", count=3)  # ['여성', '남성', '여성']
rand_gender(language="en", include_unknown=True, count=3)  # ['Male', 'Unknown', 'Female']
rand_gender(language="de", include_nonbinary=True)  # ['Divers']

rand_gender(language="ko", output="detail")
# [GenderDetail(gender='여성', code='female', language='ko')]
```

| Argument            | Type                  | Default   |
| ------------------- | --------------------- | --------- |
| `language`          | `WordLanguageOption`  | `"all"`   |
| `include_unknown`   | `bool`                | `False`   |
| `include_nonbinary` | `bool`                | `False`   |
| `count`             | `int`                 | `1`       |
| `unique`            | `bool`                | `False`   |
| `output`            | `"value" \| "detail"` | `"value"` |

The detail's `code` is `"male"`, `"female"`, `"nonbinary"` or `"unknown"` whatever the language, and the first two are the codes `rand_name`'s `gender` takes.

## Decorators

`rand_suffix`, `rand_prefix` and `rand_modifier` attach something to a string you already have, rather than generating one. They take anything, not just this library's output, which is why none of them is an argument on a generator. Each of them also works with no value at all, handing back the thing it would have attached.

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

`rand_modifier` attaches a word instead of a token, in front of any string:

```python
from randino import rand_animal, rand_modifier

rand_modifier("Owl")  # 'MistyOwl'
rand_modifier("Owl", separator=" ")  # 'Misty Owl'
rand_modifier("Owl", kind="action")  # 'CountingOwl'
rand_modifier()  # 'Misty'

rand_modifier(rand_animal(language="en", count=2))
# ['TwinklingLynx', 'OnyxCrane']
```

| Argument    | Type                         | Default    |
| ----------- | ---------------------------- | ---------- |
| `value`     | `str \| list[str] \| None`   | `None`     |
| `language`  | `WordLanguageOption \| None` | _script_   |
| `realism`   | `RandRealism`                | `"real"`   |
| `kind`      | `ModifierKind \| "all"`      | `"all"`    |
| `separator` | `str \| None`                | _language_ |

With no `language`, the script of the value picks one, so `"고양이"` is never handed an English modifier.

## Helpers and constants

```python
from randino import name_length_range, name_supports_roman, nickname_length_range

name_length_range("ko")  # (2, 3)
name_length_range("en", include_middle_name=True)  # (11, 32)
name_supports_middle_name("ko")  # False
name_supports_roman("en")  # False
nickname_length_range("ko")  # (1, 13)
sentence_length_range("ko")  # (5, 43)
```

`NAME_LANGUAGES`, `WORD_LANGUAGES`, `WORD_THEMES`, `LOCATION_LANGUAGES`, `LOCATION_LEVELS` and `AGE_GROUPS` list what the generators accept; `RAND_COUNT_MAX`, `RAND_LENGTH_MIN` / `MAX`, `RAND_LOCATION_LENGTH_MAX`, `RAND_AGE_MAX`, `AFFIX_LENGTH_DEFAULT` / `MAX`, `AFFIX_SEPARATOR_DEFAULT` and `AFFIX_CHARSET` are the bounds and defaults every argument is clamped to.

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
