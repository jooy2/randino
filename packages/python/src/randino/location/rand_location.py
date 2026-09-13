"""Real locations, written out from the country down to the level asked for."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import LocationDetail, LocationLanguageOption, LocationLevel
from randino.location._generator import draw_location
from randino.location.data import resolve_level


@overload
def rand_location(
    *,
    language: LocationLanguageOption = ...,
    level: LocationLevel = ...,
    count: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_location(
    *,
    language: LocationLanguageOption = ...,
    level: LocationLevel = ...,
    count: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[LocationDetail]: ...


def rand_location(
    *,
    language: LocationLanguageOption = "all",
    level: LocationLevel = "district",
    count: int = 1,
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[LocationDetail]:
    """Generate real locations, written out from the country down to `level`.

    Written the way the language writes a location. Every division is one the country
    itself publishes, and each sits inside the one written beside it.

    Nothing goes below a Korean 읍·면·동 or a US city — no street, no building, no number —
    so a result is a place, never somebody's address. `realism` is not an argument here:
    a location is a real place or it is not a location, so there is nothing to invent.

    Args:
        language: Language, and so country, of the places. `"all"` mixes every one.
        level: How far down the location goes. A country without that level stops at the
            deepest one it has. `"district"`, the default, is as far as any goes.
        count: How many locations to return. Held inside `0`..`RAND_COUNT_MAX`.
        min_length: Minimum length in characters, the whole location counted. Defaults to
            what the divisions hold.
        max_length: Maximum length in characters. A range nothing fits is answered with
            the locations closest to it.
        starts_with: Keep only locations whose first character is this one.
        unique: Never return the same location twice. May return fewer than `count` once
            the divisions run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run. Used for every draw the call makes.
        output: `"value"` for strings, `"detail"` for a `LocationDetail` per location —
            the location and every level it names.

    Returns:
        A `list[str]`, or a `list[LocationDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_location(language="ko")
        ['대한민국 경기도 수원시 장안구 파장동']
        >>> rand_location(language="en")
        ['Pasadena, California, United States']
        >>> rand_location(language="ko", level="city", count=2)
        ['대한민국 경상남도 창원시 진해구', '대한민국 충청북도 단양군']
        >>> rand_location(language="ko", output="detail")
        [LocationDetail(location='대한민국 서울특별시 종로구 청운동', language='ko', level='district', country='대한민국', region='서울특별시', city='종로구', district='청운동')]
    """
    return draw_location(
        "path",
        resolve_level(level),
        language=language,
        count=count,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
        output=output,
    )
