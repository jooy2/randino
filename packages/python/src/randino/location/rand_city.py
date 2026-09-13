"""The divisions a region is made of: a Korean 시·군·구, a US city or town."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import LocationDetail, LocationLanguageOption
from randino.location._generator import draw_location


@overload
def rand_city(
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
def rand_city(
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


def rand_city(
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
    """Generate the divisions a region is made of.

    A Korean 시·군·구, written with its city where it is one of a city's districts
    (`수원시 장안구`), or a US city, town, village or census designated place.

    A name can come back more than once from different regions — Korea has a `중구` in
    five of them — and `unique` compares the names. The arguments are the ones
    `rand_location` takes, and they are documented there.

    Returns:
        A `list[str]`, or a `list[LocationDetail]` when `output="detail"`.

    Example:
        >>> rand_city(language="ko", count=3)
        ['강남구', '수원시 장안구', '양평군']
        >>> rand_city(language="en", count=2)
        ['Pasadena', 'Burlington']
        >>> rand_city(language="ko", output="detail")
        [LocationDetail(location='강남구', language='ko', level='city', country='대한민국', region='서울특별시', city='강남구', district=None)]
    """
    return draw_location(
        "unit",
        "city",
        language=language,
        count=count,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
        output=output,
    )
