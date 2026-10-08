"""Capacities a drive is really sold with."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import DiskSizeDetail, DiskUnitOption
from randino.disk._size_generator import generate_disk_size_details


@overload
def rand_disk_size(
    *,
    unit: DiskUnitOption = ...,
    include_unit: bool = ...,
    min_size: int | None = ...,
    max_size: int | None = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_disk_size(
    *,
    unit: DiskUnitOption = ...,
    include_unit: bool = ...,
    min_size: int | None = ...,
    max_size: int | None = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[DiskSizeDetail]: ...


def rand_disk_size(
    *,
    unit: DiskUnitOption = "auto",
    include_unit: bool = True,
    min_size: int | None = None,
    max_size: int | None = None,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[DiskSizeDetail]:
    """Generate capacities a drive is really sold with.

    256 GB, 512 GB and 1 TB are the most common, the small flash of an old phone and the
    largest hard disks the rarest. No size is ever written with a decimal point, and a
    terabyte is 1000 gigabytes, the way a drive is sold.

    Args:
        unit: `"MB"`, `"GB"`, `"TB"`, or `"auto"` for the largest unit each size is a whole
            number of. A named unit keeps to the sizes that are whole in it.
        include_unit: Write the unit after the number: `1 TB` rather than `1`. Left off
            with `unit="auto"`, every size is written in gigabytes, because a bare `2` and a
            bare `512` would otherwise be in two different units.
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
        output: `"value"` for strings, `"detail"` for a `DiskSizeDetail` per size — the
            number, the unit and the bytes.

    Returns:
        A `list[str]`, or a `list[DiskSizeDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_disk_size()
        ['512 GB']
        >>> rand_disk_size(unit="GB")
        ['1000 GB']
        >>> rand_disk_size(min_size=2000)
        ['4 TB']
    """
    details = generate_disk_size_details(
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

    return [detail.size for detail in details]
