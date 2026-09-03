"""Every type randino's public API is described in.

The options themselves are keyword arguments rather than a type: `randName({ … })`
in the npm package is `rand_name(…)` here.
"""

from dataclasses import dataclass
from typing import Literal

NameLanguage = Literal["en", "ko", "ja", "zh", "it", "de", "ru", "es", "vi"]
"""A language the generator can produce names in."""

NameLanguageOption = Literal[NameLanguage, "all"]
""""all" mixes every supported language."""

NameGender = Literal["male", "female"]
"""The pool a given name is drawn from."""

NameGenderOption = Literal[NameGender, "all"]
""""all" picks a gender per name."""

NameScript = Literal["native", "roman"]
"""How a name is written out.

- `native`: the language's own script (김민준, 佐藤陽斗, Иванов Иван).
- `roman`: the English pronunciation of the native form (Kim Minjun).
"""

RandOutput = Literal["value", "detail"]
"""What a generator hands back.

- `value`: the finished strings, which is what most callers want.
- `detail`: an object per result, with the pieces it was built from.

One option rather than a second function. `rand_name_details` used to be that
second function, and splitting one generator into two over its return type meant
every option had to be documented twice.
"""

RandRealism = Literal["real", "mixed", "invented"]
"""How close to the real language a result stays.

`"real"` draws every part from the curated pools, so it is a word or a name the
language actually has. `"mixed"` decides per part, so one name can pair a real surname
with an invented given name. `"invented"` builds every part from the language's own
sounds instead, so it reads like the language without being any of its words.

Three levels rather than the 0-100 number this used to be. The decision is taken per
part and there is nothing between "always" and "half the time" worth naming, so the
numbers in between promised a precision that was not there.
"""

WordLanguage = Literal["en", "ko", "ja", "zh", "vi", "es", "it", "de", "ru"]
"""A language the word pools cover.

And so a language `rand_word`, `rand_modifier` and `rand_nickname` can work in. The
same nine `NameLanguage` holds: what used to keep a language out was word order or
agreement between a modifier and its noun, and both are the language's own data now —
the shapes in its frames, the endings in its agreement rules.
"""

WordLanguageOption = Literal[WordLanguage, "all"]
""""all" mixes every supported language."""

WordTheme = Literal[
    "animal",
    "object",
    "nature",
    "plant",
    "gem",
    "concept",
    "myth",
    "job",
    "music",
    "place",
    "food",
    "sport",
    "vehicle",
    "product",
    "color",
    "finance",
    "tech",
    "weather",
    "space",
    "time",
    "emotion",
    "body",
    "clothing",
    "tool",
    "drink",
]
"""What a word is about.

Animals (`사자`), everyday things (`물병`), nature and its phenomena (`노을`), plants
(`민들레`), stones and metals (`흑요석`), ideas from the humanities and social world
(`철학`), creatures out of myth (`구미호`), the trades and roles people hold
(`대장장이`), music (`교향곡`), places (`광장`), food (`떡볶이`), sports (`양궁`),
things that carry you (`열기구`), or things you buy (`이어폰`). Person names are
never used.

Each one is also a generator of its own — `"animal"` is `rand_animal`.
"""

WordThemeOption = Literal[WordTheme, "all"]
""""all" draws from every theme."""


@dataclass(frozen=True, slots=True)
class NameDetail:
    """A generated name in both scripts, with the choices that produced it."""

    native: str
    """The name in its own script."""

    roman: str
    """The English pronunciation of `native`. Identical to `native` for English."""

    language: NameLanguage
    """The language this name was generated in."""

    gender: NameGender
    """The pool the given name was drawn from."""


@dataclass(frozen=True, slots=True)
class WordDetail:
    """A generated word with where it came from."""

    word: str
    """The word itself."""

    language: WordLanguage
    """The language this word was drawn from."""

    theme: WordTheme | None
    """Theme the word belongs to.

    `None` when it is not one the generator knows, which happens when it was
    invented.
    """


@dataclass(frozen=True, slots=True)
class NicknameDetail:
    """A generated nickname with the pieces it was built from."""

    nickname: str
    """The finished nickname."""

    words: tuple[str, ...]
    """The words the nickname is made of, in order — the words only.

    A shape that needs a particle between two of them carries it in `nickname` and
    nowhere here, so `사자의눈물` reports `("사자", "눈물")`.
    """

    language: WordLanguage
    """The language this nickname was generated in."""

    theme: WordTheme | None
    """Theme the nickname's base word belongs to.

    `None` when that word is not one the generator knows, which happens when it
    was invented.
    """
