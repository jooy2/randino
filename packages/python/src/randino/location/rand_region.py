"""A country's first-level divisions: a Korean 시·도, a US state."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import LocationDetail, LocationLanguageOption
from randino.location._generator import draw_location


@overload
def rand_region(
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
def rand_region(
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


def rand_region(
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
    """Generate a country's first-level divisions: a Korean 시·도, a US state or DC.

    Each is drawn as often as any other, whatever its size. The arguments are the ones
    `rand_location` takes, and they are documented there.

    Returns:
        A `list[str]`, or a `list[LocationDetail]` when `output="detail"`.

    Example:
        >>> rand_region(language="ko", count=3)
        ['경기도', '부산광역시', '제주특별자치도']
        >>> rand_region(language="en", count=2)
        ['Ohio', 'New Mexico']
        >>> rand_region(language="en", output="detail")
        [LocationDetail(location='Ohio', language='en', level='region', country='United States', region='Ohio', city=None, district=None)]
    """
    return draw_location(
        "unit",
        "region",
        language=language,
        count=count,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
        output=output,
    )
