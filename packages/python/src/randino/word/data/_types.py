"""Internal shape of the per-language word datasets.

Not part of the public API — callers only ever see the keyword arguments and the two
details. One dataset per language rather than one per generator: `rand_word` and its
fourteen themed forms draw from `nouns`, `rand_modifier` draws from `modifiers`, and
`rand_nickname` puts the two together and adds `parts`. The pools are the same words
either way, so they are written once.
"""

from collections.abc import Mapping
from dataclasses import dataclass

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
"""How invented words are built at the abstract end of the style range.

The npm package tells the two apart with a `kind` field; here they are two classes
and the generator branches on `isinstance`, which is what lets a reader of
`PoolSynthesis` see that it has no `onset` at all.
"""


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

    modifiers: WordPool
    """Words that decorate a noun, in the form that can precede it directly.

    Korean attributive: 멋진; Japanese: 青い / 静かな. `rand_modifier` draws from here,
    and so does the nickname generator's modifier slot.
    """

    syn: WordSynthesis
    """How this language's invented words are built."""

    parts: WordPool | None = None
    """Optional trailing noun for compounds (고양이 + 꼬리), used by nicknames only.

    Languages that would need a particle or a different word order for this leave it
    out, and the compound patterns are then skipped for them.
    """
