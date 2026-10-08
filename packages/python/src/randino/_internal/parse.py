"""Helpers that keep the datasets readable.

Pools are written as whitespace-separated strings inside a triple-quoted string
instead of one list entry per line, which keeps a 120-name pool to a handful of
lines.
"""

import re
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


class OutlineEntry(NamedTuple):
    """One division an outline names, and where it sits."""

    path: tuple[str | None, ...]
    """The division's name and the name of every division it sits inside.

    Largest first, one per level down to its own. None for a level its branch skips.
    """

    depth: int
    """The level the division itself is, as an index into the dataset's levels."""

    below: int | None
    """The shallowest level among the divisions directly inside it, or None for none."""


_MARKER = re.compile(r"(#+) (\S+)")
"""A line that opens a division: one `#` per level down, then the division's name."""


def outline(source: str, levels: int) -> tuple[OutlineEntry, ...]:
    """Split an outline of divisions, `levels` deep.

    A line `# name` opens a division at the first level and `## name` one at the second;
    a line with no marker is a pool of divisions at the last level, inside the division
    opened last. `_` stands for a space, the way it does in `words`.

    A pool straight after a `#` line skips the levels between: 세종특별자치시 has no
    시·군·구, so its 읍·면·동 follow its own line.

    Args:
        source: The outline, one division or one pool of them per line.
        levels: How many levels the outline holds.

    Returns:
        Every division the outline names, in the order it names them.
    """
    # Built as three parallel lists and frozen at the end, because a division learns
    # what is `below` it only once the lines inside it have been read.
    paths: list[tuple[str | None, ...]] = []
    depths: list[int] = []
    belows: list[int | None] = []
    # The division opened last at each level, as an index into the lists above, down to
    # the deepest one still open. None where a marker skipped a level.
    opened: list[int | None] = []

    def add(name: str, depth: int, parent: int | None) -> int:
        path: list[str | None] = [] if parent is None else list(paths[parent])

        while len(path) < depth:
            path.append(None)

        path.append(name.replace("_", " "))

        if parent is not None:
            below = belows[parent]
            belows[parent] = depth if below is None else min(below, depth)

        paths.append(tuple(path))
        depths.append(depth)
        belows.append(None)

        return len(paths) - 1

    for line in source.split("\n"):
        text = line.strip()

        if not text:
            continue

        marker = _MARKER.fullmatch(text)

        if marker:
            depth = len(marker.group(1)) - 1

            del opened[depth:]

            while len(opened) < depth:
                opened.append(None)

            parent = opened[depth - 1] if depth > 0 else None
            opened.append(add(marker.group(2), depth, parent))
            continue

        parent = opened[-1] if opened else None

        for name in text.split():
            add(name, levels - 1, parent)

    return tuple(
        OutlineEntry(path, depth, below)
        for path, depth, below in zip(paths, depths, belows, strict=True)
    )
