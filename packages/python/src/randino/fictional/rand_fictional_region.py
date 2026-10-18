"""Regions that do not exist — provinces, valleys, coasts — for a story's map."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import (
    FictionalKindStyle,
    FictionalLanguageOption,
    FictionalPlaceDetail,
    RandRealism,
    WordLanguage,
    WordLanguageOption,
)
from randino.fictional._options import is_listed
from randino.fictional._place_generator import generate_fictional_place_details


@overload
def rand_fictional_region(
    *,
    language: WordLanguageOption = ...,
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
def rand_fictional_region(
    *,
    language: list[WordLanguage] | tuple[WordLanguage, ...],
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
) -> list[dict[WordLanguage, str]]: ...


@overload
def rand_fictional_region(
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


@overload
def rand_fictional_region(
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
) -> list[str] | list[dict[WordLanguage, str]]: ...


def rand_fictional_region(
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
) -> list[str] | list[dict[WordLanguage, str]] | list[FictionalPlaceDetail]:
    """Generate the names of regions — provinces, valleys, coasts and the like — that do not exist.

    For the map of a story or a game. A region may carry the kind of place it is
    beside its name — left out, `include_kind` decides that per region, and a region's
    kind is translated outside English unless `kind_style` says otherwise.

    A name is spelled in Latin letters first and written by its sound in every other
    language, and the kind in each language's own words. `"all"`, the default, draws a
    language per result. A list of languages writes every place in all of them at once,
    for a game or a book that shows the same map to every reader in the reader's own
    language: each result is a dict of the place in each language, keyed by its code in
    the order of the list. The first language of the list is the one `starts_with` and the
    length range read.

    Args:
        language: Language of the places, `"all"` to draw one per place, or a list (or a
            tuple) to write every place in each language of it.
        include_kind: Write the kind of place beside its name: `Kingdom of Edlin`, `Evelyn
            Bay`. Left out, it is decided per place.
        kind_style: How a kind is written outside English: `"borrowed"` writes the English
            word in the language's script, `"translated"` the language's own word. Left
            out, a country's or a region's kind is translated and a city's or a district's
            borrowed; see `FictionalKindStyle`.
        count: How many places to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: Whether a name is one the pools hold or one invented out of syllables and
            halves. `"mixed"` decides per place.
        min_length: Minimum length of the whole place, its kind included, in characters,
            in the language it is drawn in: the first of a list.
        max_length: Maximum length of the whole place. A range nothing fits is answered
            with the closest there is.
        starts_with: Keep only places whose name — not a kind written in front of it —
            starts with this character, in the language each is drawn in: the first of a
            list, which returns nothing when that language does not write the character.
        unique: Never return the same place twice, in any language.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does.
        output: `"value"` for strings, or a dict each for a list of languages; `"detail"`
            for a `FictionalPlaceDetail` each — the place and its name in its language,
            its kind, and the same place in every language asked for under `forms`.

    Returns:
        A `list[str]` for one language or `"all"`, a `list[dict[WordLanguage, str]]` for a
        list of them, or a `list[FictionalPlaceDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_fictional_region(language="en", count=3)
        ['Silverfen Valley', 'Altheria', 'Isle of Lumeria']
        >>> rand_fictional_region(language="ko", count=3)
        ['실버펜 계곡', '알테리아', '루메리아섬']
        >>> rand_fictional_region(language="de", include_kind=True)
        ['Grafschaft Altheria']
        >>> rand_fictional_region(language=["ko", "en"], include_kind=True)
        [{'ko': '실버펜 계곡', 'en': 'Silverfen Valley'}]
        >>> rand_fictional_region(language=["en", "ja"], include_kind=True, output="detail")
        [FictionalPlaceDetail(place='Novaria Frontier', name='Novaria', kind='frontier', level='region', language='en', forms={'en': 'Novaria Frontier', 'ja': 'ノヴァリア辺境'})]
    """
    details = generate_fictional_place_details(
        "region",
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

    if is_listed(language):
        return [detail.forms for detail in details]

    return [detail.place for detail in details]
