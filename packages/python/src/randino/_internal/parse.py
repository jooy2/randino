"""Helpers that keep the datasets readable.

Pools are written as whitespace-separated strings inside a triple-quoted string
instead of one list entry per line, which keeps a 120-name pool to a handful of
lines.
"""

from typing import NamedTuple


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
