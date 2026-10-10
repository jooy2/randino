"""Amounts of memory a machine is really sold with."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import RamDetail, RamUnitOption
from randino.ram._generator import generate_ram_details


@overload
def rand_ram(
    *,
    unit: RamUnitOption = ...,
    include_unit: bool = ...,
    min_size: float | None = ...,
    max_size: float | None = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_ram(
    *,
    unit: RamUnitOption = ...,
    include_unit: bool = ...,
    min_size: float | None = ...,
    max_size: float | None = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[RamDetail]: ...


def rand_ram(
    *,
    unit: RamUnitOption = "auto",
    include_unit: bool = True,
    min_size: float | None = None,
    max_size: float | None = None,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[RamDetail]:
    """Generate amounts of memory a machine is really sold with.

    8 and 16 GB are the most common, the sizes of old phones and of workstations the
    rarest. No size is ever written with a decimal point.

    Args:
        unit: `"MB"`, `"GB"`, or `"auto"` for the largest unit each size is a whole number
            of. A named unit keeps to the sizes that are whole in it.
        include_unit: Write the unit after the number: `16 GB` rather than `16`. Left off
            with `unit="auto"`, every size is written in gigabytes, because a bare `512` and
            a bare `16` would otherwise be in two different units.
        min_size: The smallest size to return, in `unit` — in gigabytes for `"auto"`.
        max_size: The largest size to return, in `unit` — in gigabytes for `"auto"`. A range
            the wrong way round keeps `max_size`, and a range no real size is inside
            returns nothing.
        count: How many sizes to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same size twice. Returns fewer than `count` once the
            sizes run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `RamDetail` per size — the number,
            the unit and the bytes.

    Returns:
        A `list[str]`, or a `list[RamDetail]` when `output="detail"` — the overloads carry
        that through, so a type checker knows which one it got.

    Example:
        >>> rand_ram()
        ['16 GB']
        >>> rand_ram(unit="MB")
        ['8192 MB']
        >>> rand_ram(min_size=32, include_unit=False)
        ['64']
    """
    details = generate_ram_details(
        unit=unit,
        include_unit=include_unit,
        min_size=min_size,
        max_size=max_size,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.ram for detail in details]
