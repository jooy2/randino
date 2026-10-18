"""The fictional datasets parsed into pools, and the drawing every fictional generator shares.

A word from a pool, or one invented out of parts. The datasets are strings until a draw
needs them, and each is split the first time one does.
"""

import math
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from functools import cache

from randino._internal.parse import words
from randino._internal.utils import chance, pick
from randino._types import NameGender
from randino.fictional._spelling import (
    LATIN,
    Spelling,
    fitting,
    join_parts,
    joinable,
    leads_with,
    miss_by,
    span_of,
    spelled_rows,
)
from randino.fictional.data import (
    FICTIONAL_AVOID,
    FICTIONAL_AVOID_INSIDE,
    FICTIONAL_COMPOUNDS,
    FICTIONAL_GIVEN_NAMES,
    FICTIONAL_MIDDLE_CHANCE,
    FICTIONAL_SURNAMES,
    FICTIONAL_SYLLABLES,
)

Room = tuple[int, int] | None
"""The length range a word has to land in, or None for none."""

Slots = Sequence[Sequence[Spelling]]
"""The pools a word's parts are drawn from, one per part, in order."""


@dataclass(frozen=True, slots=True)
class NamePools:
    """The name datasets, split into the pools a draw reads."""

    given: dict[NameGender, tuple[Spelling, ...]]
    """The given names the pools hold, per gender."""

    surnames: tuple[Spelling, ...]
    """The family names the pools hold."""

    heads: tuple[Spelling, ...]
    """The syllables an invented word opens on."""

    middles: tuple[Spelling, ...]
    """The syllables an invented word may take in its middle."""

    ends: dict[NameGender, tuple[Spelling, ...]]
    """The syllables an invented given name closes on, per gender."""

    fronts: tuple[tuple[str, Spelling], ...]
    """The first halves of a compound, each with the letters of what it may build."""

    backs: tuple[tuple[str, Spelling], ...]
    """The second halves of a compound, each with the letters of what it may build."""

    avoid: frozenset[str]
    """The words no invented word may be, lower case."""

    avoid_inside: tuple[str, ...]
    """The runs of letters no invented word may hold in any spelling."""


@cache
def pools() -> NamePools:
    """The name datasets, split the first time a draw needs them, and kept."""
    given: dict[NameGender, list[Spelling]] = {"male": [], "female": []}
    ends: dict[NameGender, list[Spelling]] = {"male": [], "female": []}
    heads: list[Spelling] = []
    middles: list[Spelling] = []
    fronts: list[tuple[str, Spelling]] = []
    backs: list[tuple[str, Spelling]] = []

    for row in spelled_rows(FICTIONAL_GIVEN_NAMES):
        given["female" if row.cells[0] == "f" else "male"].append(row.spelling)

    for row in spelled_rows(FICTIONAL_SYLLABLES):
        role = row.cells[0]

        if role == "head":
            heads.append(row.spelling)
        elif role == "middle":
            middles.append(row.spelling)
        else:
            ends["female" if role == "female" else "male"].append(row.spelling)

    for row in spelled_rows(FICTIONAL_COMPOUNDS):
        (fronts if row.cells[0] == "front" else backs).append((row.cells[1], row.spelling))

    return NamePools(
        given={gender: tuple(pool) for gender, pool in given.items()},
        surnames=tuple(row.spelling for row in spelled_rows(FICTIONAL_SURNAMES)),
        heads=tuple(heads),
        middles=tuple(middles),
        ends={gender: tuple(pool) for gender, pool in ends.items()},
        fronts=tuple(fronts),
        backs=tuple(backs),
        avoid=frozenset(word.lower() for word in words(FICTIONAL_AVOID)),
        avoid_inside=words(FICTIONAL_AVOID_INSIDE),
    )


_POOLS_KEPT = 512
"""How many entries each table below holds before it is emptied."""

_matched: dict[tuple[int, int, str], tuple[Sequence[Spelling], tuple[Spelling, ...]]] = {}
"""The entries of a pool that lead with a prefix in one script, kept per pool.

A call draws many results with the same prefix, and filtering a pool of two hundred names
for each one of them is most of what a large call would cost. Keyed on the pool's identity
and held with it, so the identity stays its own.
"""


def spelled_matching(pool: Sequence[Spelling], script: int, prefix: str) -> Sequence[Spelling]:
    """The spellings of `pool` that lead with `prefix` in `script`, or all of them for none.

    Args:
        pool: The spellings to narrow.
        script: Where in a spelling the prefix is read.
        prefix: The first character asked for, or `""`.

    Returns:
        The spellings that lead with the prefix.
    """
    if not prefix:
        return pool

    key = (id(pool), script, prefix)
    held = _matched.get(key)

    if held is not None and held[0] is pool:
        return held[1]

    found = tuple(entry for entry in pool if leads_with(entry[script], prefix))

    if len(_matched) >= _POOLS_KEPT:
        _matched.clear()

    _matched[key] = (pool, found)

    return found


def compose(parts: Sequence[Spelling]) -> Spelling | None:
    """Parts joined into one word.

    None when two of them cannot be joined part by part, or the word is one the datasets
    keep out: `FICTIONAL_AVOID` as a whole, `FICTIONAL_AVOID_INSIDE` anywhere in any of its
    spellings.

    Args:
        parts: The parts, in order.

    Returns:
        The word, or None.
    """
    for i in range(1, len(parts)):
        if not joinable(parts[i - 1][LATIN], parts[i][LATIN]):
            return None

    word = join_parts(parts)
    data = pools()

    if word[LATIN].lower() in data.avoid:
        return None

    for spelling in word:
        lower = spelling.lower()

        if any(run in lower for run in data.avoid_inside):
            return None

    return word


_INVENT_ATTEMPTS = 16
"""How many times an invented word is put together before the closest one made is kept.

A pair that cannot be joined, a word to avoid and a length outside the range are each
drawn again, and each is a small share of the draws.
"""


def invent(
    make: Callable[[], Spelling | None], script: int, prefix: str, room: Room
) -> Spelling | None:
    """A word `make` puts together that leads with `prefix` in `script` and lands inside `room`.

    Or the closest it made when none did, and None when it made nothing at all. The prefix
    is checked on the word rather than on its first part, because joining can change how a
    script writes the first part: `아` and `라` are `알라`.

    Args:
        make: Puts one word together, or answers None.
        script: Where in a spelling the prefix and the length are read.
        prefix: The first character asked for, or `""`.
        room: The length range the word has to land in, or None.

    Returns:
        The word, or None.
    """
    best: Spelling | None = None
    best_miss = math.inf

    for _ in range(_INVENT_ATTEMPTS):
        word = make()

        if word is None or not leads_with(word[script], prefix):
            continue

        miss = 0.0 if room is None else miss_by(len(word[script]), room[0], room[1])

        if miss == 0:
            return word

        if miss < best_miss:
            best = word
            best_miss = miss

    return best


def draw_word(
    pool: Sequence[Spelling],
    make: Callable[[], Spelling | None],
    invent_chance: int,
    script: int,
    prefix: str,
    room: Room,
) -> Spelling | None:
    """A word for one part of a result: one out of `pool`, or one `make` invents.

    The second `invent_chance` times in a hundred, and whenever the pool (already narrowed
    to the prefix) has nothing to offer. An invented word that cannot be made to lead with
    the prefix falls back to the pool.

    Args:
        pool: The words the pools hold that lead with the prefix.
        make: Invents one word.
        invent_chance: How often to invent, as a percentage.
        script: Where in a spelling the prefix and the length are read.
        prefix: The first character asked for, or `""`.
        room: The length range the word has to land in, or None.

    Returns:
        The word, or None when there is nothing to draw.
    """
    if chance(invent_chance) or not pool:
        made = invent(make, script, prefix, room)

        if made is not None:
            return made

    if not pool:
        return None

    if room is None:
        return pick(pool)

    return pick(fitting(pool, lambda entry: entry[script], room[0], room[1]))


_slot_spans: dict[int, tuple[Sequence[Spelling], tuple[tuple[int, int], ...]]] = {}
"""The shortest and the longest entry of a slot in each script, kept per slot."""


def _slot_span(slot: Sequence[Spelling], script: int) -> tuple[int, int]:
    """The shortest and the longest entry of `slot` in `script`."""
    held = _slot_spans.get(id(slot))

    if held is None or held[0] is not slot:
        spans = tuple(span_of([entry[each] for entry in slot]) for each in range(5))

        if len(_slot_spans) >= _POOLS_KEPT:
            _slot_spans.clear()

        held = (slot, spans)
        _slot_spans[id(slot)] = held

    return held[1][script]


def assemble(slots: Slots, script: int, prefix: str, room: Room) -> Spelling | None:
    """One part out of each slot, joined into a word that leads with `prefix` in `script`.

    The first slot is narrowed to the prefix, and the word lands inside `room` where the
    slots can reach it: each part is drawn from the entries that leave the slots after it
    able to land the whole word there.

    Args:
        slots: The pools the parts are drawn from, one per part.
        script: Where in a spelling the prefix and the length are read.
        prefix: The first character asked for, or `""`.
        room: The length range the word has to land in, or None.

    Returns:
        The word, or None when it cannot be joined or is one to keep out.
    """
    parts: list[Spelling] = []
    length = 0

    for i, slot in enumerate(slots):
        pool: Sequence[Spelling] = spelled_matching(slot, script, prefix) if i == 0 else slot

        if room is not None:
            rest_low = 0
            rest_high = 0

            for later in slots[i + 1 :]:
                low, high = _slot_span(later, script)
                rest_low += low
                rest_high += high

            fit = [
                entry
                for entry in pool
                if length + len(entry[script]) + rest_low <= room[1]
                and length + len(entry[script]) + rest_high >= room[0]
            ]

            # A slot nothing of which fits is drawn from whole, and the word comes out as
            # close as the rest of it can bring it.
            if fit:
                pool = fit

        if not pool:
            return None

        part = pick(pool)
        parts.append(part)
        length += len(part[script])

    return compose(parts)


def make_given(gender: NameGender, script: int, prefix: str, room: Room) -> Spelling | None:
    """A given name put together out of syllables: `Al` + `dric`, `Va` + `le` + `ria`.

    Args:
        gender: Whose endings the name closes on.
        script: Where in a spelling the prefix and the length are read.
        prefix: The first character asked for, or `""`.
        room: The length range the name has to land in, or None.

    Returns:
        The name, or None when it cannot be joined or is one to keep out.
    """
    data = pools()
    slots: Slots = (
        (data.heads, data.middles, data.ends[gender])
        if chance(FICTIONAL_MIDDLE_CHANCE)
        else (data.heads, data.ends[gender])
    )

    return assemble(slots, script, prefix, room)


@dataclass(frozen=True, slots=True)
class Halves:
    """The fronts and backs that may build one kind of thing."""

    fronts: tuple[Spelling, ...]
    """The first halves."""

    backs: tuple[Spelling, ...]
    """The second halves."""


_halves: dict[str, Halves] = {}
"""The halves that may build each kind of thing, kept by the letter that names it."""


def halves_for(use: str) -> Halves:
    """The fronts and backs that may build `use`.

    `s` a surname, `r` a region, `c` a city, `d` a district.
    """
    halves = _halves.get(use)

    if halves is None:
        data = pools()
        halves = Halves(
            fronts=tuple(spelling for uses, spelling in data.fronts if use in uses),
            backs=tuple(spelling for uses, spelling in data.backs if use in uses),
        )
        _halves[use] = halves

    return halves


def make_compound(use: str, script: int, prefix: str, room: Room) -> Spelling | None:
    """A word put together out of a front and a back that may build `use`: `Raven` + `ford`.

    Args:
        use: The letter of what the word names: `s`, `r`, `c` or `d`.
        script: Where in a spelling the prefix and the length are read.
        prefix: The first character asked for, or `""`.
        room: The length range the word has to land in, or None.

    Returns:
        The word, or None when it cannot be joined or is one to keep out.
    """
    halves = halves_for(use)
    word = assemble((halves.fronts, halves.backs), script, prefix, room)

    # A half that is both a front and a back (`stone`) is not joined to itself.
    if word is not None and any(
        front[LATIN] + front[LATIN] == word[LATIN].lower() for front in halves.fronts
    ):
        return None

    return word


def span_in(pool: Sequence[Spelling], made_of: Sequence[Slots], script: int) -> tuple[int, int]:
    """The shortest and longest a part can come out in one script.

    The pool's words and the invented ones together.

    Args:
        pool: The words the pools hold, or none when only invented ones are drawn.
        made_of: The shapes an invented word can take, or none when none is invented.
        script: Where in a spelling the length is read.

    Returns:
        The two lengths, `(0, 0)` when there is nothing to measure.
    """
    low: float = math.inf
    high = 0

    if pool:
        low, high = span_of([entry[script] for entry in pool])

    for shape in made_of:
        shortest = 0
        longest = 0

        for slot in shape:
            slot_low, slot_high = span_of([entry[script] for entry in slot])
            shortest += slot_low
            longest += slot_high

        low = min(low, shortest)
        high = max(high, longest)

    return (0 if math.isinf(low) else int(low)), high
