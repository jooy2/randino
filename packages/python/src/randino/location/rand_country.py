"""The country a language's locations are in."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import LocationDetail, LocationLanguageOption
from randino.location._generator import draw_location


@overload
def rand_country(
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
def rand_country(
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


def rand_country(
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
    """The country a language's locations are in, the way the language writes it.

    There is one per language — `language="all"` is how more than one comes back — and it
    is the top of every location `rand_location` writes. The arguments are the ones
    `rand_location` takes, and they are documented there.

    Returns:
        A `list[str]`, or a `list[LocationDetail]` when `output="detail"`.

    Example:
        >>> rand_country(language="ko")
        ['대한민국']
        >>> rand_country(count=3)
        ['United States', '대한민국', '대한민국']
        >>> rand_country(language="en", output="detail")
        [LocationDetail(location='United States', language='en', level='country', country='United States', region=None, city=None, district=None)]
    """
    return draw_location(
        "unit",
        "country",
        language=language,
        count=count,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
        output=output,
    )
