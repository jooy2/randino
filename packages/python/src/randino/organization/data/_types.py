"""Internal shape of the per-language organization datasets."""

from dataclasses import dataclass

from randino._types import OrganizationIndustry, OrganizationType

OrganizationPool = tuple[str, ...]
"""Entries to draw from."""


@dataclass(frozen=True, slots=True)
class SyllableOrganizationSynthesis:
    """Invented stems spelled as onset and vowel, repeated, then a coda (Valorin)."""

    onset: OrganizationPool
    """Consonants a syllable can open with."""

    vowel: OrganizationPool
    """Vowels a syllable is built around."""

    coda: OrganizationPool
    """Endings the stem can close on. An empty entry leaves it open."""

    min_syllables: int
    """Fewest syllables in an invented stem."""

    max_syllables: int
    """Most syllables in an invented stem."""


@dataclass(frozen=True, slots=True)
class PoolOrganizationSynthesis:
    """Invented stems built from whole syllables out of a list, joined by `joiner`."""

    pool: OrganizationPool
    """The syllables to draw from."""

    avoid: OrganizationPool
    """The companies two syllables of the pool could spell.

    The pool leaves out a syllable of each, and a caller's `starts_with` can put it back
    in front, so a stem that spells one is drawn again.
    """

    joiner: str
    """What goes between two of them: nothing for 솔람 and 瑞峰, a space for Lộc Phát."""

    min_syllables: int
    """Fewest syllables in an invented stem."""

    max_syllables: int
    """Most syllables in an invented stem."""


OrganizationSynthesis = SyllableOrganizationSynthesis | PoolOrganizationSynthesis
"""How a stem is spelled when `realism` asks for an invented one."""


@dataclass(frozen=True, slots=True)
class OrganizationLanguageData:
    """One language's organizations: stems, the words for a business, and the shapes.

    A template is written in the language's own order with a gap for each part:
    `{stem}`, `{industry}`, `{place}` and `{number}`. See the JavaScript package's
    `organization/data/types.ts` for what each one is.
    """

    stems: OrganizationPool
    """The organization's own name, the part nothing else decides."""

    syn: OrganizationSynthesis
    """How a stem is invented when `realism` asks for one."""

    industries: dict[OrganizationIndustry, OrganizationPool]
    """The words that say what a company does, per industry."""

    generic: OrganizationPool
    """Words a company name carries that say nothing about its business."""

    templates: dict[OrganizationType, tuple[str, ...]]
    """The shapes each kind of organization takes."""

    legal_forms: tuple[str, ...]
    """A company's legal forms, each written around `{name}`."""

    places: OrganizationPool | None = None
    """Cities a company name may open on, for the language whose names do."""

    numbers: tuple[int, int] | None = None
    """The range a `{number}` is drawn from, for the language that numbers institutions."""
