"""Syllable templates used at the abstract end of the style range.

Names built from these are invented rather than drawn from a pool, so they should
read as plausible for the language without matching anyone real.
"""

from randino._internal.parse import words
from randino.name.data._types import SyllableSet

WESTERN_SYLLABLES = SyllableSet(
    onset=words("b c d f g h j k l m n p r s t v w br cl dr fr gr st th tr ch"),
    vowel=words("a e i o u ae ai ea ee ia ie oo ou"),
    # The two empty entries make an open syllable the most likely ending.
    coda=("", "", *words("n l r s th ll nn ne ra na la")),
    min_syllables=2,
    max_syllables=3,
)

ITALIAN_SYLLABLES = SyllableSet(
    onset=words("b c d f g l m n p r s t v z br gr tr"),
    vowel=words("a e i o ia io ie"),
    coda=("", "", *words("no na ni lo ra ri llo nti ano")),
    min_syllables=2,
    max_syllables=3,
)

SPANISH_SYLLABLES = SyllableSet(
    onset=words("b c d f g j l m n p r s t v z br gr"),
    vowel=words("a e i o u ia ie ue"),
    coda=("", "", *words("n s z no na lo ro les ndo")),
    min_syllables=2,
    max_syllables=3,
)

GERMAN_SYLLABLES = SyllableSet(
    onset=words("b d f g h k l m n r s t w sch st br kl"),
    vowel=words("a e i o u ei ie au eu"),
    coda=("", *words("n r l s ch rt ng mann ner")),
    min_syllables=2,
    max_syllables=3,
)

RUSSIAN_SYLLABLES = SyllableSet(
    onset=words("б в г д к л м н п р с т ф х ч ш"),
    vowel=words("а е и о у я ю"),
    coda=("", "", *words("н в р л с й к")),
    min_syllables=2,
    max_syllables=3,
)

VIETNAMESE_SYLLABLES = SyllableSet(
    onset=words("b c d h l m n ng nh ph q t th tr v x"),
    vowel=words("a e i o u ai ao ie uy oa"),
    coda=("", *words("n nh ng m c t p")),
    min_syllables=1,
    max_syllables=2,
)
