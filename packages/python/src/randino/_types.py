"""Every type randino's public API is described in.

The options themselves are keyword arguments rather than a type: `randomName({ … })`
in the npm package is `random_name(…)` here.
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

NicknameLanguage = Literal["en", "ko", "ja", "zh"]
"""A language the nickname generator can build nicknames in.

Fewer than `NameLanguage`: a nickname joins a modifier to a noun, which only reads
naturally in languages that ask for no grammatical agreement.
"""

NicknameLanguageOption = Literal[NicknameLanguage, "all"]
""""all" mixes every supported language."""

NicknameTheme = Literal[
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
]
"""What a nickname is about.

Animals (`사자`), everyday things (`물병`), nature and its phenomena (`노을`), plants
(`민들레`), stones and metals (`흑요석`), ideas from the humanities and social world
(`철학`), creatures out of myth (`구미호`), the trades and roles people hold
(`대장장이`), music (`교향곡`), places (`광장`), food (`떡볶이`), sports (`양궁`),
things that carry you (`열기구`), or things you buy (`이어폰`). Person names are
never used.
"""

NicknameThemeOption = Literal[NicknameTheme, "all"]
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
class NicknameDetail:
    """A generated nickname with the pieces it was built from."""

    nickname: str
    """The finished nickname, unique suffix included."""

    words: tuple[str, ...]
    """The words the nickname is made of, in order, without the unique suffix."""

    suffix: str
    """The unique suffix, separator included. Empty when `unique_suffix` is off."""

    language: NicknameLanguage
    """The language this nickname was generated in."""

    theme: NicknameTheme | None
    """Theme the nickname's base word belongs to.

    `None` when that word is not one the generator knows — an invented one, or a
    `base_word` of your own.
    """
