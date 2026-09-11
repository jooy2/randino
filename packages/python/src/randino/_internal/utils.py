"""Small shared helpers. Internal only — nothing here is exported from the package."""

import random as _random
from collections.abc import Callable, Iterator, MutableSequence, Sequence
from contextlib import contextmanager
from typing import TypeVar

T = TypeVar("T")

_source: Callable[[], float] = _random.random
"""Where every draw in this package comes from.

A source is ambient rather than threaded through every signature, because every
function here would have to carry it and hand it on: `rand_sentence` alone reaches
`pick` from some fifty places, through the word generator, the name generator and the
story planner. The library is synchronous from the entry point down — there is no
`await` anywhere in it — so nothing can interleave between `with_random` setting this
and putting it back.
"""


def random() -> float:
    """One number in `[0, 1)`, from whatever source is in play.

    A source that hands back something else — `nan`, a number out of range, the wrong
    type — reads as `0` rather than as an index off the end of a pool. The same
    reasoning the option resolvers use: a caller who got it wrong should not be answered
    from somewhere that says nothing about what they got wrong.

    Returns:
        A number in `[0, 1)`.
    """
    try:
        value = float(_source())
    except (TypeError, ValueError):
        return 0.0

    return value if 0.0 <= value < 1.0 else 0.0


@contextmanager
def with_random(source: Callable[[], float] | None) -> Iterator[None]:
    """Run the block with `source` as the source of randomness.

    The previous source goes back afterwards, including when the block raises, and
    including when `source` is what raised. Restoring rather than clearing, because a
    generator can reach another one: `rand_sentence` writes a person's name through
    `rand_name`, and the name is meant to come from the same source the sentence did.

    Args:
        source: What to draw from, or None to leave the source alone.

    Yields:
        Nothing; the block runs with the source in place.
    """
    global _source

    if source is None:
        yield
        return

    previous = _source
    _source = source

    try:
        yield
    finally:
        _source = previous


def shuffle(items: MutableSequence[T]) -> None:
    """Shuffle `items` in place, drawing from the source in play.

    Written out rather than `random.shuffle`, which draws from the `random` module and
    so from a source the caller's own never reaches. The same Fisher-Yates the
    JavaScript package walks, so the two shuffle a list the same way.

    Args:
        items: The sequence to shuffle, in place.
    """
    for i in range(len(items) - 1, 0, -1):
        j = rand_int(0, i)
        items[i], items[j] = items[j], items[i]


def pick(items: Sequence[T]) -> T:
    """Return a random entry of a non-empty sequence."""
    return items[int(random() * len(items))]


def pick_weighted(items: Sequence[T], weight_of: Callable[[T], float]) -> T:
    """Return a random entry of a non-empty sequence, drawn in proportion to `weight_of`.

    Falls back to an even draw when every weight is zero, so a caller never has to
    check that its weight table covers the pool.
    """
    total = sum(max(0.0, weight_of(item)) for item in items)

    if total <= 0:
        return pick(items)

    roll = random() * total

    for item in items:
        roll -= max(0.0, weight_of(item))

        if roll < 0:
            return item

    return items[-1]


def rand_int(low: int, high: int) -> int:
    """Return a random integer between `low` and `high`, both inclusive."""
    return low + int(random() * (high - low + 1))


def chance(percent: float) -> bool:
    """Return True with a `percent` chance (`0` never, `100` always)."""
    return random() * 100 < percent


def clamp(value: int, low: int, high: int) -> int:
    """Return `value` held inside `low`..`high`."""
    return max(low, min(high, value))


def capitalize_first(value: str) -> str:
    """Upper-case the first character, leaving the rest of `value` alone.

    `str.capitalize` lower-cases the remainder, which would turn `McCoy` into
    `Mccoy` and `BraveLion` into `Bravelion`.
    """
    return value[0].upper() + value[1:] if value else value


def rand_token(length: int, charset: str) -> str:
    """Return a random string of `length` characters drawn from `charset`."""
    return "".join(charset[int(random() * len(charset))] for _ in range(length))
