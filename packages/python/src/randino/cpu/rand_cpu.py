"""Real processors, by the names their makers gave them."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import CpuDetail, SystemPlatformOption
from randino.cpu._generator import generate_cpu_details


@overload
def rand_cpu(
    *,
    platform: SystemPlatformOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    include_vendor: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_cpu(
    *,
    platform: SystemPlatformOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    include_vendor: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[CpuDetail]: ...


def rand_cpu(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    include_vendor: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[CpuDetail]:
    """Generate real processors, by the names their makers gave them.

    Intel, AMD, Apple and Qualcomm parts for desktops and laptops, and the systems-on-chip
    of phones and tablets from Apple, Qualcomm, Samsung, MediaTek, Google and HiSilicon.

    Args:
        platform: `"desktop"`, `"mobile"`, or `"all"` for both.
        min_year: The earliest year the first machines with it went on sale.
        max_year: The latest year the first machines with it went on sale — `2015` is
            what was out by the end of 2015. A range the wrong way round keeps `max_year`.
        include_vendor: Write the maker in front of the processor: `Intel Core i7-13700K`
            rather than `Core i7-13700K`.
        count: How many processors to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same processor twice. Returns fewer than `count` once
            the catalog runs out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `CpuDetail` per processor — the
            maker, the model, the platform and the year.

    Returns:
        A `list[str]`, or a `list[CpuDetail]` when `output="detail"` — the overloads carry
        that through, so a type checker knows which one it got. Empty when no processor
        came out inside the year range.

    Example:
        >>> rand_cpu()
        ['Intel Core i7-13700K']
        >>> rand_cpu(platform="mobile", count=2)
        ['Qualcomm Snapdragon 8 Gen 3', 'Apple A17 Pro']
        >>> rand_cpu(include_vendor=False)
        ['Ryzen 7 7800X3D']
    """
    details = generate_cpu_details(
        platform=platform,
        min_year=min_year,
        max_year=max_year,
        include_vendor=include_vendor,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.cpu for detail in details]
