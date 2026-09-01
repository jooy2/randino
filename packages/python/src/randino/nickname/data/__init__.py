"""The per-language nickname datasets, and the bounds the generator works inside."""

from randino._types import NicknameLanguage, NicknameTheme
from randino.nickname.data._types import NicknameLanguageData
from randino.nickname.data.en import EN
from randino.nickname.data.ja import JA
from randino.nickname.data.ko import KO
from randino.nickname.data.zh import ZH

NICKNAME_LANGUAGES: tuple[NicknameLanguage, ...] = ("en", "ko", "ja", "zh")
"""Languages the nickname generator knows about.

Fewer than the name generator: a nickname joins a modifier to a noun, which only
works without grammatical agreement — see CLAUDE.md before adding one.
"""

NICKNAME_THEMES: tuple[NicknameTheme, ...] = (
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
)
"""What a nickname can be about. Person names are deliberately absent."""

NICKNAME_DATA: dict[NicknameLanguage, NicknameLanguageData] = {
    "en": EN,
    "ko": KO,
    "ja": JA,
    "zh": ZH,
}
"""Each language's pools and rules, keyed by its code."""

NICKNAME_LENGTH_MIN = 1
"""Lower bound for `min_length`, in characters of the nickname itself."""

NICKNAME_LENGTH_MAX = 40
"""Upper bound for `max_length`."""

NICKNAME_COUNT_MAX = 10000
"""Upper bound for `count`."""
