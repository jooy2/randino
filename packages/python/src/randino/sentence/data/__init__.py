"""The per-language sentence datasets: the grammar every sentence is written in."""

from randino._types import WordLanguage, WordTheme
from randino.sentence.data._types import NounClass, SentenceLanguageData
from randino.sentence.data.de import DE
from randino.sentence.data.en import EN
from randino.sentence.data.es import ES
from randino.sentence.data.it import IT
from randino.sentence.data.ja import JA
from randino.sentence.data.ko import KO
from randino.sentence.data.ru import RU
from randino.sentence.data.vi import VI
from randino.sentence.data.zh import ZH

THEME_CLASS: dict[WordTheme, NounClass] = {
    "animal": "creature",
    "myth": "creature",
    "job": "person",
    "plant": "plant",
    "food": "edible",
    "drink": "edible",
    "object": "thing",
    "tool": "thing",
    "clothing": "thing",
    "product": "thing",
    "gem": "thing",
    "music": "thing",
    "vehicle": "vehicle",
    "place": "place",
    "nature": "place",
    "space": "place",
    "weather": "event",
    "sport": "event",
    "time": "event",
    "concept": "idea",
    "emotion": "idea",
    "finance": "idea",
    "tech": "idea",
    "color": "idea",
    "body": "body",
}
"""What each theme's nouns are, as far as a verb is concerned.

The map is the same in every language, because a theme is: `animal` names creatures
wherever it is written, and a verb that needs one can say so once.

This is what keeps a sentence together. `먹는다` takes an `edible` object and nothing
else, so `여우가 사과를 먹는다` is a sentence the generator can build and `여우가
철학을 먹는다` is not — no tag on any noun, and no rule per language.
"""

SENTENCE_DATA: dict[WordLanguage, SentenceLanguageData] = {
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
"""The sentence dataset for each language the word pools cover."""
