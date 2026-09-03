"""The per-language word datasets: the pools every generator draws from."""

from randino._types import WordLanguage, WordTheme
from randino.word.data._types import WordLanguageData
from randino.word.data.de import DE
from randino.word.data.en import EN
from randino.word.data.es import ES
from randino.word.data.it import IT
from randino.word.data.ja import JA
from randino.word.data.ko import KO
from randino.word.data.vi import VI
from randino.word.data.zh import ZH

WORD_LANGUAGES: tuple[WordLanguage, ...] = ("en", "ko", "ja", "zh", "vi", "es", "it", "de")
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
)
"""What the words can be about. Person names are deliberately absent."""

LOOSE_THEMES: tuple[WordTheme, ...] = ("color", "finance", "tech")
"""Themes a nickname only reaches once `realism` loosens.

Every one of them is a word theme like any other, and `rand_word` draws from them at
any level; what they are not is a slice of vocabulary you can put a modifier in front
of and still have something anybody would type — `멋진대출`, `BraveInvoice` and
`奔跑的服务器` read as a joke rather than a handle.

So `rand_nickname` leaves them out of `theme="all"` at `realism="real"` and puts them
back at `"mixed"` and `"invented"`. A theme the caller named is always honoured: asking
for `finance` and getting something else would be the argument not working.
"""

WORD_DATA: dict[WordLanguage, WordLanguageData] = {
    "en": EN,
    "ko": KO,
    "ja": JA,
    "zh": ZH,
    "vi": VI,
    "es": ES,
    "it": IT,
    "de": DE,
}
"""Each language's pools and rules, keyed by its code."""
