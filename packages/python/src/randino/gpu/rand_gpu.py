"""Real graphics processors, by the names their makers gave them."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import GpuDetail, GpuVendorOption, SystemPlatformOption
from randino.gpu._generator import generate_gpu_details


@overload
def rand_gpu(
    *,
    platform: SystemPlatformOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    vendor: GpuVendorOption = ...,
    include_vendor: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_gpu(
    *,
    platform: SystemPlatformOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    vendor: GpuVendorOption = ...,
    include_vendor: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[GpuDetail]: ...


def rand_gpu(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    vendor: GpuVendorOption = "all",
    include_vendor: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[GpuDetail]:
    """Generate real graphics processors, by the names their makers gave them.

    NVIDIA, AMD and Intel cards, laptop GPUs and integrated graphics for desktops and
    laptops, and the GPUs inside the chips of phones and tablets from Qualcomm, Arm and
    Samsung.

    Args:
        platform: `"desktop"`, `"mobile"`, or `"all"` for both.
        min_year: The earliest year the first cards or machines with it went on sale.
        max_year: The latest year the first cards or machines with it went on sale —
            `2015` is what was out by the end of 2015. A range the wrong way round keeps
            `max_year`.
        vendor: Which makers, by the name each sells under: `"NVIDIA"`, or a sequence of
            them. A maker with no part on the platform or in the years asked for is
            answered with nothing.
        include_vendor: Write the maker in front of the graphics processor: `NVIDIA
            GeForce RTX 4090` rather than `GeForce RTX 4090`.
        count: How many graphics processors to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same graphics processor twice. Returns fewer than `count`
            once the catalog runs out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `GpuDetail` per graphics processor
            — the maker, the model, the platform and the year.

    Returns:
        A `list[str]`, or a `list[GpuDetail]` when `output="detail"` — the overloads carry
        that through, so a type checker knows which one it got. Empty when no graphics
        processor came out inside the year range.

    Example:
        >>> rand_gpu()
        ['NVIDIA GeForce RTX 3060']
        >>> rand_gpu(platform="mobile", count=2)
        ['Qualcomm Adreno 740', 'Arm Mali-G78']
        >>> rand_gpu(include_vendor=False)
        ['Radeon RX 7900 XTX']
    """
    details = generate_gpu_details(
        platform=platform,
        min_year=min_year,
        max_year=max_year,
        vendor=vendor,
        include_vendor=include_vendor,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.gpu for detail in details]
