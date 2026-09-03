"""Internal shape of the per-language word datasets.

Not part of the public API — callers only ever see the keyword arguments and the two
details. One dataset per language rather than one per generator: `rand_word` and its
twenty-five themed forms draw from `nouns`, `rand_modifier` draws from `adjectives` and
`actions`, and `rand_nickname` puts them together in the shapes `frames` allows. The
pools are the same words either way, so they are written once.
"""

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Literal

from randino._types import WordTheme

WordPool = tuple[str, ...]
"""A pool of whole words."""


@dataclass(frozen=True, slots=True)
class SyllableSynthesis:
    """Invented words built as onset + vowel + coda, for alphabetic scripts (Blorin)."""

    onset: WordPool
    """Consonants a syllable can open with."""

    vowel: WordPool
    """Vowels a syllable is built around."""

    coda: WordPool
    """Endings a final syllable can close with. An empty entry leaves it open."""

    min_syllables: int
    """Fewest syllables an invented word is built from."""

    max_syllables: int
    """Most syllables an invented word is built from."""


@dataclass(frozen=True, slots=True)
class PoolSynthesis:
    """Invented words built from whole syllables, where one character is one (뮤겔, 星霧)."""

    pool: WordPool
    """Syllables to draw from."""

    min_syllables: int
    """Fewest syllables an invented word is built from."""

    max_syllables: int
    """Most syllables an invented word is built from."""


WordSynthesis = SyllableSynthesis | PoolSynthesis
"""How a word is built when `realism` calls for an invented one.

The npm package tells the two apart with a `kind` field; here they are two classes
and the generator branches on `isinstance`, which is what lets a reader of
`PoolSynthesis` see that it has no `onset` at all.
"""


WordSlot = Literal["adjective", "action", "noun", "part"]
"""What one word does inside a nickname.

`adjective` says what the noun is like (멋진, Brave, 青い), `action` what it is doing
(웃는, Laughing, 踊る), `noun` is the base word, and `part` a trailing noun.
"""


@dataclass(frozen=True, slots=True)
class WordFrame:
    """One shape a nickname can take, written in the order the language puts it in.

    Per language rather than shared, because the shapes themselves differ: Chinese
    needs 的 between a verb and its noun where Korean needs nothing, and a language
    with no possessive particle has no possessive shape at all.
    """

    slots: tuple[WordSlot, ...]
    """The words to draw, in order."""

    weight: int
    """How often this shape is used, against the other frames of the language."""

    glue: tuple[str, ...] = ()
    """A particle for each gap, so one entry shorter than `slots`.

    Empty where every gap is empty. It attaches to the word in front of it, which is
    what puts a word separator after it rather than around it (`사자의 눈물`, never
    `사자 의 눈물`).
    """

    def glue_at(self, index: int) -> str:
        """Return the particle in front of the slot at `index`, or `""` where there is none."""
        return self.glue[index - 1] if 1 <= index <= len(self.glue) else ""


@dataclass(frozen=True, slots=True)
class WordLanguageData:
    """Everything the generators know about one word language."""

    joiner: str
    """Joins words that are put together.

    `""` everywhere so far — Korean and CJK words run together, and alphabetic ones
    read as CamelCase (BraveLion).
    """

    capitalize: bool
    """Whether each word should be capitalized. Meaningless for CJK scripts."""

    nouns: Mapping[WordTheme, WordPool]
    """The words themselves, grouped by theme.

    Deliberately common nouns — never person names.
    """

    adjectives: WordPool
    """Words that say what the noun is like, in the form that can sit straight in front of it.

    Korean attributive: 멋진; Japanese: 青い / 静かな. A handful of them are nouns used
    attributively (별빛, Marble); they describe all the same, so they live here rather
    than in a third pool.
    """

    actions: WordPool
    """Words that say what the noun is doing, in that same attributive form.

    웃는, Laughing, 踊る. Kept apart from `adjectives` because the two are different
    grammar: a language may need something between an action and its noun where an
    adjective needs nothing (Chinese 奔跑的狮子), and only an action can become a
    predicate.
    """

    frames: Sequence[WordFrame]
    """The shapes a nickname of this language can take.

    Every language has to declare its own: a shape is only as natural as the grammar
    behind it.
    """

    syn: WordSynthesis
    """How this language's invented words are built."""

    parts: WordPool | None = None
    """Trailing noun for compounds (고양이 + 꼬리, 狮子 + 的 + 眼泪), used by nicknames only.

    A language with no frame that asks for one leaves it out.
    """
