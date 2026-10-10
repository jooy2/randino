"""Sizes of memory and storage: a pool of real capacities and the units they are written in.

`rand_ram` and `rand_disk_size` both draw from here. A size is always one a machine is
really sold with, and it is only ever written in a unit it is a whole number of: 512 MB of
memory is never `0.5 GB`, and a 500 GB drive is never `0.5 TB`. Asking for a unit leaves
out the sizes that are not whole in it rather than rounding them into a size nobody sells.
"""

from dataclasses import dataclass
from typing import Generic, TypeVar

from randino._internal.generate import finite

U = TypeVar("U", bound=str)


@dataclass(frozen=True, slots=True)
class CapacityScale(Generic[U]):
    """How one kind of size is measured: its units, and the pool it draws from."""

    units: tuple[U, ...]
    """The units, smallest first, each `step` times the one before it."""

    step: int
    """How many of one unit make the next: `1024` for memory, `1000` for storage."""

    base: U
    """The unit `pool` is written in."""

    reference: U
    """The unit `min_size` and `max_size` are read in when the unit is `"auto"`."""

    bytes: int
    """How many bytes one `base` unit is."""

    pool: tuple[tuple[int, float], ...]
    """Every size there is, in `base`, with how often it comes up."""


@dataclass(frozen=True, slots=True)
class CapacityCandidate(Generic[U]):
    """A size a call may land on, with the unit it is written in."""

    size: int
    """The size, in the scale's base unit."""

    weight: float
    """How often the size comes up."""

    unit: U
    """The unit the size is written in."""

    value: int
    """The number written, in `unit`."""


def in_unit(scale: CapacityScale[U], size: int, unit: U) -> float:
    """Return `size`, given in the scale's base unit, as a number of `unit`.

    Multiplied for a smaller unit and divided for a larger one, never multiplied by a
    fraction, so a size that is whole in a unit comes out exactly whole.
    """
    steps = scale.units.index(scale.base) - scale.units.index(unit)

    if steps >= 0:
        return size * int(scale.step**steps)

    return size / int(scale.step**-steps)


def fit_unit(scale: CapacityScale[U], size: int) -> U:
    """The largest unit `size` is a whole number of — what `"auto"` writes it in."""
    for unit in reversed(scale.units[1:]):
        if float(in_unit(scale, size, unit)).is_integer():
            return unit

    return scale.units[0]


def capacity_candidates(
    scale: CapacityScale[U], unit: str, min_size: object, max_size: object
) -> list[CapacityCandidate[U]]:
    """The sizes one call may land on, each in the unit it is written in.

    A named unit keeps to the sizes that are whole in it. `min_size` and `max_size` are
    read in that unit, or in the scale's reference unit for `"auto"`, and keep to the sizes
    inside them, both ends included. Nothing is fitted afterwards, so a range no real size
    is inside is answered with nothing.

    Args:
        scale: The kind of size.
        unit: One of the scale's units, or `"auto"`.
        min_size: The smallest size, or None.
        max_size: The largest size, or None.

    Returns:
        Every size the call may return, with its unit and the number written.
    """
    named: U | None = unit if unit in scale.units else None
    bound = named if named is not None else scale.reference
    # As written, not floored: `min_size=1.5` in terabytes is no terabyte, and
    # `max_size=0.5` in gigabytes is 512 MB.
    high = finite(max_size)
    asked = finite(min_size)
    # A range the wrong way round keeps `max_size`, the way a length range keeps
    # `max_length`: it is the bound a caller is usually holding to.
    low = min(asked, high) if asked is not None and high is not None else asked
    candidates: list[CapacityCandidate[U]] = []

    for size, weight in scale.pool:
        written = named if named is not None else fit_unit(scale, size)
        value = in_unit(scale, size, written)
        measured = in_unit(scale, size, bound)

        if not float(value).is_integer():
            continue
        if low is not None and measured < low:
            continue
        if high is not None and measured > high:
            continue

        candidates.append(CapacityCandidate(size, weight, written, int(value)))

    return candidates


def write_capacity(value: int, unit: str, include_unit: bool) -> str:
    """Write a size out: `16 GB`, or `16` without its unit."""
    return f"{value} {unit}" if include_unit else str(value)
