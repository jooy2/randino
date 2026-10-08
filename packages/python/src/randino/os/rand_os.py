"""Real operating systems, written the way each release is known."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import OsDetail, SystemPlatformOption
from randino.os._generator import generate_os_details


@overload
def rand_os(
    *,
    platform: SystemPlatformOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    include_version: bool = ...,
    include_build: bool = ...,
    include_edition: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_os(
    *,
    platform: SystemPlatformOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    include_version: bool = ...,
    include_build: bool = ...,
    include_edition: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[OsDetail]: ...


def rand_os(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    include_version: bool = True,
    include_build: bool = False,
    include_edition: bool = False,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[OsDetail]:
    """Generate real operating systems, written the way each release is known.

    Windows, macOS, Ubuntu, Debian and Fedora on the desktop, Android, iOS and iPadOS on
    mobile.

    Args:
        platform: `"desktop"`, `"mobile"`, or `"all"` for both.
        min_year: The earliest year a release may have come out in. With
            `include_build`, the year the build or point release came out in.
        max_year: The latest year a release may have come out in — `2015` is what was
            out by the end of 2015. A range the wrong way round keeps `max_year`.
        include_version: Write the version after the name. Left off, the build and the
            edition go with it, because neither means anything without its version.
        include_build: Write the build or the point release where the release has them:
            `Windows 11 23H2 (Build 22631)`, `macOS Sonoma 14.5`, `Android 14 (API 34)`.
        include_edition: Write an edition where the release has them: `Windows 11 Pro`,
            `Ubuntu Server 24.04 LTS`, `Fedora Workstation 40`.
        count: How many systems to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same system twice. Returns fewer than `count` once the
            catalog runs out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for an `OsDetail` per system — its
            name, the version, build and edition written, and the year it came out.

    Returns:
        A `list[str]`, or a `list[OsDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got. Empty when no
        release came out inside the year range.

    Example:
        >>> rand_os()
        ['Windows 10']
        >>> rand_os(platform="mobile", count=3)
        ['Android 9 Pie', 'iOS 17', 'Android 13']
        >>> rand_os(include_build=True, include_edition=True)
        ['Windows 11 Pro 23H2 (Build 22631)']
    """
    details = generate_os_details(
        platform=platform,
        min_year=min_year,
        max_year=max_year,
        include_version=include_version,
        include_build=include_build,
        include_edition=include_edition,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.os for detail in details]
