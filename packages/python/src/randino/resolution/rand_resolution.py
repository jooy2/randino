"""Screen resolutions, the way a browser reports them, with the common ones most often."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import ResolutionDetail, SystemPlatformOption
from randino.resolution._generator import generate_resolution_details
from randino.resolution.data import RESOLUTION_SEPARATOR_DEFAULT


@overload
def rand_resolution(
    *,
    platform: SystemPlatformOption = ...,
    separator: str = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_resolution(
    *,
    platform: SystemPlatformOption = ...,
    separator: str = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[ResolutionDetail]: ...


def rand_resolution(
    *,
    platform: SystemPlatformOption = "all",
    separator: str = RESOLUTION_SEPARATOR_DEFAULT,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[ResolutionDetail]:
    """Generate screen resolutions, the way a browser reports them: `1920x1080`.

    1920x1080 is about a quarter of the desktops, and the sizes of the common iPhones and
    Android phones lead on mobile. Each is written as the width, `separator` and the height.

    Args:
        platform: `"desktop"` for the screens of desktops and laptops, `"mobile"` for those
            of phones and tablets, written portrait. `"all"` draws both evenly.
        separator: What goes between the width and the height: `"×"` writes `1920×1080`.
        count: How many resolutions to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same resolution twice. Returns fewer than `count` once
            they run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `ResolutionDetail` per result — the
            width and the height as numbers.

    Returns:
        A `list[str]`, or a `list[ResolutionDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_resolution()
        ['1920x1080']
        >>> rand_resolution(platform="mobile", count=2)
        ['390x844', '360x800']
        >>> rand_resolution(separator=" × ")
        ['2560 × 1440']
    """
    details = generate_resolution_details(
        platform=platform, separator=separator, count=count, unique=unique, random=random
    )

    if output == "detail":
        return details

    resolutions: list[str] = [detail.resolution for detail in details]

    return resolutions
