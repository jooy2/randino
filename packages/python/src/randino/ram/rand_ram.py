"""Amounts of memory a machine is really sold with."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import RamDetail, RamUnitOption, SystemPlatformOption
from randino.ram._generator import generate_ram_details


@overload
def rand_ram(
    *,
    platform: SystemPlatformOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    unit: RamUnitOption = ...,
    include_unit: bool = ...,
    min_size: float | None = ...,
    max_size: float | None = ...,
    include_type: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_ram(
    *,
    platform: SystemPlatformOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    unit: RamUnitOption = ...,
    include_unit: bool = ...,
    min_size: float | None = ...,
    max_size: float | None = ...,
    include_type: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[RamDetail]: ...


def rand_ram(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    unit: RamUnitOption = "auto",
    include_unit: bool = True,
    min_size: float | None = None,
    max_size: float | None = None,
    include_type: bool = False,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[RamDetail]:
    """Generate amounts of memory a machine is really sold with.

    8 and 16 GB are the most common, the sizes of old phones and of workstations the
    rarest. No size is ever written with a decimal point. Each size comes with the kind of
    memory it was sold as on its platform — `DDR5` in a desktop, `LPDDR5X` in a phone —
    which `platform`, `min_year` and `max_year` narrow and `include_type` writes.

    Args:
        platform: `"desktop"` for desktops and laptops, `"mobile"` for phones and tablets,
            or `"all"` for both. A phone's sizes stop at 24 GB, and only a desktop or a
            laptop is sold with `DDR` memory.
        min_year: The earliest year a machine with the memory may have been sold in: only
            the kinds of memory still sold by then, and the sizes they came in, are drawn.
        max_year: The latest year a machine with the memory may have been sold in — `2010`
            is what was sold by the end of 2010. A range the wrong way round keeps
            `max_year`, and a range no kind of memory was sold in returns nothing.
        unit: `"MB"`, `"GB"`, or `"auto"` for the largest unit each size is a whole number
            of. A named unit keeps to the sizes that are whole in it.
        include_unit: Write the unit after the number: `16 GB` rather than `16`. Left off
            with `unit="auto"`, every size is written in gigabytes, because a bare `512` and
            a bare `16` would otherwise be in two different units.
        min_size: The smallest size to return, in `unit` — in gigabytes for `"auto"`.
        max_size: The largest size to return, in `unit` — in gigabytes for `"auto"`. A range
            the wrong way round keeps `max_size`, and a range no real size is inside
            returns nothing.
        include_type: Write the kind of memory after the size: `16 GB DDR5` rather than
            `16 GB`. With `include_unit=False` it is left out, the way the unit is: a kind
            of memory belongs to a size written as one, not to a bare number. The detail
            carries it either way.
        count: How many sizes to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same size twice. Returns fewer than `count` once the
            sizes run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `RamDetail` per size — the number,
            the unit, the bytes, the kind of memory and the platform.

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
        >>> rand_ram(platform="mobile", include_type=True)
        ['12 GB LPDDR5X']
        >>> rand_ram(platform="desktop", max_year=2010, include_type=True)
        ['4 GB DDR3']
    """
    details = generate_ram_details(
        platform=platform,
        min_year=min_year,
        max_year=max_year,
        unit=unit,
        include_unit=include_unit,
        min_size=min_size,
        max_size=max_size,
        include_type=include_type,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.ram for detail in details]
