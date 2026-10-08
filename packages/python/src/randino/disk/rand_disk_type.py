"""The kind of storage a machine has: `SSD`, `HDD`, `UFS`."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import DiskTypeDetail, SystemPlatformOption
from randino.disk._type_generator import generate_disk_type_details


@overload
def rand_disk_type(
    *,
    platform: SystemPlatformOption = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_disk_type(
    *,
    platform: SystemPlatformOption = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[DiskTypeDetail]: ...


def rand_disk_type(
    *,
    platform: SystemPlatformOption = "all",
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[DiskTypeDetail]:
    """Generate the kind of storage a machine has: `SSD`, `HDD`, `UFS`.

    A desktop or a laptop is mostly an SSD and a hard disk after it, a phone or a tablet
    UFS or eMMC.

    Args:
        platform: `"desktop"`, `"mobile"`, or `"all"` for both.
        count: How many labels to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same label twice. Returns fewer than `count` once the
            labels run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for labels, `"detail"` for a `DiskTypeDetail` per result — the
            label, its code, its name and the platform it was drawn for.

    Returns:
        A `list[str]`, or a `list[DiskTypeDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_disk_type()
        ['SSD']
        >>> rand_disk_type(platform="mobile")
        ['UFS']
    """
    details = generate_disk_type_details(
        platform=platform, count=count, unique=unique, random=random
    )

    if output == "detail":
        return details

    return [detail.disk_type for detail in details]
