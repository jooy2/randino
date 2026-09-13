"""Country names: every ISO 3166-1 country and territory, in any word language."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import CountryDetail, WordLanguageOption
from randino.location._generator import generate_country_details


@overload
def rand_country(
    *,
    language: WordLanguageOption = ...,
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
    language: WordLanguageOption = ...,
    count: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[CountryDetail]: ...


def rand_country(
    *,
    language: WordLanguageOption = "all",
    count: int = 1,
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[CountryDetail]:
    """Generate country names: every ISO 3166-1 country and territory, 249 of them.

    Each is named the way the language names it. Every word language has a name for every
    one, so this takes any of the nine, where the other location generators write only the
    languages whose countries publish their divisions.

    Each is drawn as often as any other. The names are Wikidata's, and the list is ISO's: a
    territory is in because ISO 3166-1 gives it a code of its own.

    Args:
        language: Language the country names are written in. `"all"` mixes every one.
        count: How many countries to return. Held inside `0`..`RAND_COUNT_MAX`.
        min_length: Minimum length in characters. Defaults to what the names hold.
        max_length: Maximum length in characters. A range nothing fits is answered with
            the names closest to it.
        starts_with: Keep only names whose first character is this one.
        unique: Never return the same name twice. May return fewer than `count` once the
            names run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run. Used for every draw the call makes.
        output: `"value"` for strings, `"detail"` for a `CountryDetail` per country — the
            name, the ISO 3166-1 code it is known by, and its language.

    Returns:
        A `list[str]`, or a `list[CountryDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_country(language="ko", count=3)
        ['아르헨티나', '방글라데시', '세인트키츠 네비스']
        >>> rand_country(language="en", count=2)
        ['Gibraltar', 'Burkina Faso']
        >>> rand_country(language="ja", output="detail")
        [CountryDetail(country='サウジアラビア', code='SA', language='ja')]
    """
    details = generate_country_details(
        language=language,
        count=count,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.country for detail in details]
