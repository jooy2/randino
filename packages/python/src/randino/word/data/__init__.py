"""The per-language word datasets: the pools every generator draws from."""

from randino._internal.generate import resolve_option
from randino._types import (
    WordLanguage,
    WordLanguageOption,
    WordTheme,
    WordThemeOption,
)
from randino.word.data._types import WordLanguageData
from randino.word.data.de import DE
from randino.word.data.en import EN
from randino.word.data.es import ES
from randino.word.data.it import IT
from randino.word.data.ja import JA
from randino.word.data.ko import KO
from randino.word.data.ru import RU
from randino.word.data.vi import VI
from randino.word.data.zh import ZH

WORD_LANGUAGES: tuple[WordLanguage, ...] = ("en", "ko", "ja", "zh", "vi", "es", "it", "de", "ru")
"""Languages the word pools cover — the same nine the name generator knows.

A modifier has to sit beside a noun in the form that language puts it in, which each of
them says in its own `frames` and `agreement` rather than in a rule here: Vietnamese
writes `mèo xanh`, German `blauer Wal`. See CLAUDE.md before adding one.
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
    "toy",
    "sound",
    "person",
    "furniture",
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
    "ru": RU,
}
"""Each language's pools and rules, keyed by its code."""


_WORD_LANGUAGE_OPTIONS: tuple[WordLanguageOption, ...] = (*WORD_LANGUAGES, "all")
_WORD_THEME_OPTIONS: tuple[WordThemeOption, ...] = (*WORD_THEMES, "all")
"""Every value `language` and `theme` accept, and what an unknown one falls back to.

The types rule one out and an unchecked caller can still pass it; answering with
`WORD_DATA["xx"]` names the value and not the option.
"""


def resolve_word_language(language: object) -> WordLanguageOption:
    """The caller's `language`, or `"all"` for one this package does not know."""
    return resolve_option(language, _WORD_LANGUAGE_OPTIONS, "all")


def resolve_theme(theme: object) -> WordThemeOption:
    """The caller's `theme`, or `"all"` for one this package does not know."""
    return resolve_option(theme, _WORD_THEME_OPTIONS, "all")
