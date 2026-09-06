"""Helpers that keep the datasets readable.

Pools are written as whitespace-separated strings inside a triple-quoted string
instead of one list entry per line, which keeps a 120-name pool to a handful of
lines.
"""

from collections.abc import Mapping
from typing import TYPE_CHECKING, NamedTuple, cast

from randino._types import WordTheme
from randino.word.data._types import WordGender, WordPool

if TYPE_CHECKING:
    from randino.sentence.data._types import PredicateTense


class NameToken(NamedTuple):
    """A name part that carries its own romanization (Japanese kanji, Chinese hanzi)."""

    n: str
    """The part in its own script."""

    r: str
    """How that part is read in the Latin alphabet."""


def words(source: str) -> tuple[str, ...]:
    """Split a whitespace-separated pool.

    `_` stands for a space inside a single entry, so multi-word names survive the
    split (`De_Luca` -> `De Luca`).
    """
    return tuple(word.replace("_", " ") for word in source.split())


def tokens(source: str) -> tuple[NameToken, ...]:
    """Split a whitespace-separated pool of `native:roman` pairs.

    For scripts whose characters carry their own reading (Japanese kanji, Chinese
    hanzi).
    """
    return tuple(NameToken(*pair.split(":", 1)) for pair in words(source))


def weights(source: str) -> dict[str, int]:
    """Split a whitespace-separated pool of `native:weight` pairs into a lookup.

    For pools whose entries are not equally likely (surname frequency). Entries left
    out of the source keep whatever default the caller falls back to.
    """
    return {token.n: int(token.r) for token in tokens(source)}


def roman_map(source: str) -> dict[str, str]:
    """Build a native -> romanization lookup from `native:roman` pairs."""
    return {token.n: token.r for token in tokens(source)}


def tagged_nouns(
    source: Mapping[WordTheme, str],
) -> tuple[dict[WordTheme, WordPool], dict[str, WordGender]]:
    """Split a `theme -> "gato:m luna:f"` map into the pools and the gender lookup.

    One pass over one source, so a language that inflects still writes each noun
    exactly once.
    """
    pools: dict[WordTheme, WordPool] = {}
    gender: dict[str, WordGender] = {}

    for theme, pool in source.items():
        entries = []

        for tagged in words(pool):
            word, _, tag = tagged.rpartition(":")

            gender[word] = cast(WordGender, tag)
            entries.append(word)

        pools[theme] = tuple(entries)

    return pools, gender


def conjugate(stems: str, endings: Mapping[str, str]) -> "PredicateTense":
    """Every form of a tense from one pool of stems and one ending per form.

    For a language whose endings are the same whatever the stem: a Korean past stem
    closes on `ㅆ`, so `달렸` takes `다`, `니`, `구나`, `어요` and `습니다` exactly the
    way `걸었` does. `endings` maps `"statement"` and any form to its ending; an ending
    may list alternatives with `|` between them, and each stem gets every one of them, so
    the pools stay index-aligned with the present-tense words the stems were written for.

    Args:
        stems: The past stems, whitespace-separated.
        endings: The ending each form takes, `"statement"` included.

    Returns:
        The tense, with the statement in `words` and the rest in `forms`.
    """
    bases = words(stems)

    def attach(ending: str) -> tuple[str, ...]:
        return tuple("|".join(stem + each for each in ending.split("|")) for stem in bases)

    # Imported here rather than at the top: the sentence package imports this module
    # through its data files, and a module-level import would be a cycle.
    from randino.sentence.data._types import PredicateForm, PredicateTense

    return PredicateTense(
        words=attach(endings["statement"]),
        forms={
            cast(PredicateForm, form): attach(ending)
            for form, ending in endings.items()
            if form != "statement"
        },
    )
