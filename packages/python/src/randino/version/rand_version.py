"""Software version numbers: `2.14.3`, `2024.3.1`, `42`."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import VersionDetail, VersionFormatOption
from randino.version._generator import generate_version_details


@overload
def rand_version(
    *,
    format: VersionFormatOption = ...,
    prefix: str = ...,
    include_prerelease: bool = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_version(
    *,
    format: VersionFormatOption = ...,
    prefix: str = ...,
    include_prerelease: bool = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[VersionDetail]: ...


def rand_version(
    *,
    format: VersionFormatOption = "semver",
    prefix: str = "",
    include_prerelease: bool = False,
    min_year: int | None = None,
    max_year: int | None = None,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[VersionDetail]:
    """Generate software version numbers: `2.14.3`, `2024.3.1`, `42`.

    Every part is drawn with the small numbers most often, so `0.x` and `x.y.0` come up the
    way they do in a registry.

    Args:
        format: `"semver"`, `"calver"` or `"number"`, a sequence of them drawn evenly one
            per result, or `"all"`. A column of versions is one scheme, so `"semver"` is
            the default.
        prefix: Written in front of every version: `"v"` writes `v2.14.3`.
        include_prerelease: Give about one semantic version in four a pre-release, such as
            `-beta.2`.
        min_year: The earliest year a calendar version may be counted from. Kept inside
            2000 to 2099; `None` is 2010.
        max_year: The latest year a calendar version may be counted from. `None` is 2026,
            or `min_year` when that is later. A range the wrong way round keeps `max_year`.
        count: How many versions to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same version twice. Returns fewer than `count` once they
            run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `VersionDetail` per result — the
            scheme and the numbers it is made of.

    Returns:
        A `list[str]`, or a `list[VersionDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_version()
        ['2.14.3']
        >>> rand_version(format="calver", count=3)
        ['2024.3.1', '24.04', '2019.2']
        >>> rand_version(format="number", prefix="v")
        ['v42']
    """
    details = generate_version_details(
        format=format,
        prefix=prefix,
        include_prerelease=include_prerelease,
        min_year=min_year,
        max_year=max_year,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    versions: list[str] = [detail.version for detail in details]

    return versions
