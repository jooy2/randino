"""The per-language name datasets, and the bounds the generator works inside."""

from randino._types import NameLanguage
from randino.name.data._types import NameLanguageData
from randino.name.data.de import DE
from randino.name.data.en import EN
from randino.name.data.es import ES
from randino.name.data.it import IT
from randino.name.data.ja import JA
from randino.name.data.ko import KO
from randino.name.data.ru import RU
from randino.name.data.vi import VI
from randino.name.data.zh import ZH

NAME_LANGUAGES: tuple[NameLanguage, ...] = ("en", "ko", "ja", "zh", "it", "de", "ru", "es", "vi")
"""Every language the name generator knows about.

`language="all"` draws from this list, so the order only matters for presentation.
"""

NAME_DATA: dict[NameLanguage, NameLanguageData] = {
    "en": EN,
    "ko": KO,
    "ja": JA,
    "zh": ZH,
    "it": IT,
    "de": DE,
    "ru": RU,
    "es": ES,
    "vi": VI,
}
"""Each language's pools and rules, keyed by its code."""

NAME_LENGTH_MIN = 1
"""Lower bound for `min_length`, in characters of the native form."""

NAME_LENGTH_MAX = 30
"""Upper bound for `max_length`, in characters of the native form."""

NAME_COUNT_MAX = 10000
"""Upper bound for `count`.

Generation is cheap, but an unbounded count with `unique=True` can spend a long
time re-drawing from an exhausted pool.
"""
