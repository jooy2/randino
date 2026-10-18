"""Cities and towns that do not exist, for the map of a story or a game."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import (
    FictionalKindStyle,
    FictionalLanguageOption,
    FictionalPlaceDetail,
    RandRealism,
)
from randino.fictional._place_generator import generate_fictional_place_details


@overload
def rand_fictional_city(
    *,
    language: FictionalLanguageOption = ...,
    include_kind: bool | None = ...,
    kind_style: FictionalKindStyle | None = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_fictional_city(
    *,
    language: FictionalLanguageOption = ...,
    include_kind: bool | None = ...,
    kind_style: FictionalKindStyle | None = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[FictionalPlaceDetail]: ...


def rand_fictional_city(
    *,
    language: FictionalLanguageOption = "all",
    include_kind: bool | None = None,
    kind_style: FictionalKindStyle | None = None,
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[FictionalPlaceDetail]:
    """Generate the names of cities and towns that do not exist.

    For the map of a story or a game. A place may carry the kind it is beside its name, and
    left out, `include_kind` decides that per place. A name is spelled in Latin letters
    first and written by its sound in every other language, and the kind in each
    language's own words: a sequence of languages draws one per place, and the detail form
    writes each place in all of them.

    Args:
        language: Language, or languages, of the places. `"all"` mixes every language, and
            a sequence draws one of its languages per place.
        include_kind: Write the kind of place beside its name: `Kingdom of Edlin`, `Evelyn
            Bay`. Left out, it is decided per place.
        kind_style: How a kind is written outside English: `"borrowed"` writes the English
            word in the language's script, `"translated"` the language's own word. Left
            out, a country's or a region's kind is translated and a city's or a district's
            borrowed; see `FictionalKindStyle`.
        count: How many places to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: Whether a name is one the pools hold or one invented out of syllables and
            halves. `"mixed"` decides per place.
        min_length: Minimum length of the whole place, its kind included, in characters.
        max_length: Maximum length of the whole place. A range nothing fits is answered
            with the closest there is.
        starts_with: Keep only places whose name — not a kind written in front of it —
            starts with this character, in the language each is written in.
        unique: Never return the same place twice, in any language.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does.
        output: `"value"` for strings, `"detail"` for a `FictionalPlaceDetail` each — the
            place and its name in the language drawn for it, its kind, and the same place
            in each language of `language` under `forms`.

    Returns:
        A `list[str]`, or a `list[FictionalPlaceDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_fictional_city(language="en", count=3)
        ['Ashwick', 'Port Ravenford', 'Hollowbrook Falls']
        >>> rand_fictional_city(language="ko", count=3)
        ['애시윅', '포트 레이븐퍼드', '할로브룩 폴스']
        >>> rand_fictional_city(language="es", kind_style="translated", include_kind=True)
        ['Puerto Ravenford']
        >>> rand_fictional_city(language=["en", "ru"], include_kind=True, output="detail")
        [FictionalPlaceDetail(place='Ashwick Springs', name='Ashwick', kind='springs', level='city', language='en', forms={'en': 'Ashwick Springs', 'ru': 'Эшуик-Спрингс'})]
    """
    details = generate_fictional_place_details(
        "city",
        language=language,
        include_kind=include_kind,
        kind_style=kind_style,
        count=count,
        realism=realism,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.place for detail in details]
