"""Small shared helpers. Internal only — nothing here is exported from the package."""

import random
from collections.abc import Callable, Sequence
from typing import TypeVar

T = TypeVar("T")


def pick(items: Sequence[T]) -> T:
    """Return a random entry of a non-empty sequence."""
    return items[random.randrange(len(items))]


def pick_weighted(items: Sequence[T], weight_of: Callable[[T], float]) -> T:
    """Return a random entry of a non-empty sequence, drawn in proportion to `weight_of`.

    Falls back to an even draw when every weight is zero, so a caller never has to
    check that its weight table covers the pool.
    """
    total = sum(max(0.0, weight_of(item)) for item in items)

    if total <= 0:
        return pick(items)

    roll = random.random() * total

    for item in items:
        roll -= max(0.0, weight_of(item))

        if roll < 0:
            return item

    return items[-1]


def rand_int(low: int, high: int) -> int:
    """Return a random integer between `low` and `high`, both inclusive."""
    return random.randint(low, high)


def chance(percent: float) -> bool:
    """Return True with a `percent` chance (`0` never, `100` always)."""
    return random.random() * 100 < percent


def clamp(value: int, low: int, high: int) -> int:
    """Return `value` held inside `low`..`high`."""
    return max(low, min(high, value))


def capitalize_first(value: str) -> str:
    """Upper-case the first character, leaving the rest of `value` alone.

    `str.capitalize` lower-cases the remainder, which would turn `McCoy` into
    `Mccoy` and `BraveLion` into `Bravelion`.
    """
    return value[0].upper() + value[1:] if value else value


def random_token(length: int, charset: str) -> str:
    """Return a random string of `length` characters drawn from `charset`."""
    return "".join(charset[random.randrange(len(charset))] for _ in range(length))
