"""The divisions inside a city: a Korean 읍·면·동."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import LocationDetail, LocationLanguageOption
from randino.location._generator import draw_location


@overload
def rand_district(
    *,
    language: LocationLanguageOption = ...,
    count: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_district(
    *,
    language: LocationLanguageOption = ...,
    count: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[LocationDetail]: ...


def rand_district(
    *,
    language: LocationLanguageOption = "all",
    count: int = 1,
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[LocationDetail]:
    """Generate the divisions inside a city: a Korean 읍·면·동.

    The legal 동 an address is written with, not the administrative one a community
    centre serves, and never a 리 below it.

    Only Korean locations have this level, so `language="en"` returns nothing and
    `language="all"` draws Korean. The arguments are the ones `rand_location` takes, and
    they are documented there.

    Returns:
        A `list[str]`, or a `list[LocationDetail]` when `output="detail"`.

    Example:
        >>> rand_district(language="ko", count=3)
        ['역삼동', '조치원읍', '한림읍']
        >>> rand_district(language="ko", output="detail")
        [LocationDetail(location='역삼동', language='ko', level='district', country='대한민국', region='서울특별시', city='강남구', district='역삼동')]
    """
    return draw_location(
        "unit",
        "district",
        language=language,
        count=count,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
        output=output,
    )
