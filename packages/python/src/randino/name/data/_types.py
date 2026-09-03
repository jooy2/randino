"""Internal shape of the per-language name datasets.

Not part of the public API — callers only ever see the keyword arguments and
`NameDetail`.
"""

from collections.abc import Mapping
from dataclasses import dataclass
from typing import Literal

from randino._internal.parse import NameToken

NamePool = tuple[str | NameToken, ...]
"""A pool of name parts. A plain string carries no reading of its own; a
`NameToken` does."""

RomanMode = Literal["fold", "hangul", "translit", "token"]
"""How a language's native strings become "English pronunciation".

- `fold`: strip diacritics (Latin scripts).
- `hangul`: surname via map, given name via Revised Romanization.
- `translit`: char-level Cyrillic -> Latin.
- `token`: read the romanization off each `NameToken`.
"""


@dataclass(frozen=True, slots=True)
class SyllableSet:
    """Templates an invented name part is built from."""

    onset: tuple[str, ...]
    """Consonants a syllable can open with."""

    vowel: tuple[str, ...]
    """Vowels a syllable is built around."""

    coda: tuple[str, ...]
    """Endings a final syllable can close with. An empty entry leaves it open."""

    min_syllables: int
    """Fewest syllables an invented part is built from."""

    max_syllables: int
    """Most syllables an invented part is built from."""


@dataclass(frozen=True, slots=True)
class NameLengthSpec:
    """Character span of each part of a full name, joiner included.

    Summing the parts that are actually switched on yields a default length range
    that matches the requested structure, so turning a surname or middle name off
    relaxes the range instead of forcing the remaining parts to stretch and fill it.
    """

    given: tuple[int, int]
    """Shortest and longest given name."""

    last: tuple[int, int]
    """Shortest and longest surname, joiner included."""

    middle: tuple[int, int]
    """Shortest and longest middle name, joiner included."""


@dataclass(frozen=True, slots=True)
class NameLanguageData:
    """Everything the generator knows about one language's names."""

    order: Literal["given-first", "family-first"]
    """Which part of a full name comes first."""

    joiner: str
    """Joins native parts: `""` for CJK (김민준), `" "` for space-separated scripts."""

    has_middle: bool
    """Whether the language uses a middle name at all."""

    roman: RomanMode
    """How this language's names are romanized."""

    length_spec: NameLengthSpec
    """The language's own length range, per part."""

    last: NamePool
    """Surnames."""

    last_weights: Mapping[str, int] | None = None
    """How likely each surname is relative to the others.

    For languages whose surnames are steeply distributed (Korean, Chinese,
    Vietnamese). Written in tenths of a percent of the population; surnames the table
    leaves out keep `LAST_WEIGHT_DEFAULT`. Leave it `None` to draw surnames evenly.
    """

    male: NamePool | None = None
    """Western realistic male given names."""

    female: NamePool | None = None
    """Western realistic female given names."""

    middle_male: NamePool | None = None
    """Male middle names, where the language has a pool of its own."""

    middle_female: NamePool | None = None
    """Female middle names, where the language has a pool of its own."""

    given_male: NamePool | None = None
    """CJK realistic male given names, kept whole."""

    given_female: NamePool | None = None
    """CJK realistic female given names, kept whole."""

    given_len_weights: Mapping[int, int] | None = None
    """CJK relative likelihood of a given name being N syllables long.

    Used when the requested length range leaves room for more than one option.
    """

    first_male: NamePool | None = None
    """CJK opening syllables of an invented male given name."""

    rest_male: NamePool | None = None
    """CJK following syllables of an invented male given name."""

    first_female: NamePool | None = None
    """CJK opening syllables of an invented female given name."""

    rest_female: NamePool | None = None
    """CJK following syllables of an invented female given name."""

    syn: SyllableSet | None = None
    """Western/Vietnamese invented-name synthesis, for `realism="invented"`."""
