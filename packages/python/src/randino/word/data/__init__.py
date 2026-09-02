"""The per-language word datasets: the pools every generator draws from."""

from randino._types import WordLanguage, WordTheme
from randino.word.data._types import WordLanguageData
from randino.word.data.en import EN
from randino.word.data.ja import JA
from randino.word.data.ko import KO
from randino.word.data.zh import ZH

WORD_LANGUAGES: tuple[WordLanguage, ...] = ("en", "ko", "ja", "zh")
"""Languages the word pools cover.

Fewer than the name generator: a modifier has to sit in front of a noun exactly as it
is written in the dictionary, which only works without grammatical agreement — see
CLAUDE.md before adding one.
"""

WORD_THEMES: tuple[WordTheme, ...] = (
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
"""What the words can be about. Person names are deliberately absent."""

WORD_DATA: dict[WordLanguage, WordLanguageData] = {
    "en": EN,
    "ko": KO,
    "ja": JA,
    "zh": ZH,
}
"""Each language's pools and rules, keyed by its code."""
