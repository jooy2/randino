"""Phone numbers, written the way their country writes them."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import PhoneCountryOption, PhoneDetail, PhoneTypeOption
from randino.phone._generator import generate_phone_details


@overload
def rand_phone(
    *,
    country: PhoneCountryOption = ...,
    type: PhoneTypeOption = ...,
    count: int = ...,
    include_country_code: bool = ...,
    separator: str | None = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_phone(
    *,
    country: PhoneCountryOption = ...,
    type: PhoneTypeOption = ...,
    count: int = ...,
    include_country_code: bool = ...,
    separator: str | None = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[PhoneDetail]: ...


def rand_phone(
    *,
    country: PhoneCountryOption = "all",
    type: PhoneTypeOption = "mobile",
    count: int = 1,
    include_country_code: bool = False,
    separator: str | None = None,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[PhoneDetail]:
    """Generate phone numbers, written the way their country writes them.

    Each number opens on a block the country's numbering plan gives out — a mobile block,
    or the area code of a real city — and the digits after it are random. That is what
    makes it look like a real number, and it is also why it can be one: a drawn number
    may belong to somebody. Use the numbers as sample data, and never call or text one.

    Args:
        country: Which country's numbers, by ISO 3166-1 alpha-2 code, read regardless of
            case, or `"all"` to mix every one.
        type: `"mobile"`, `"landline"`, or `"all"` for either, decided per number.
        count: How many numbers to return. Held inside `0`..`RAND_COUNT_MAX`.
        include_country_code: Write the number the way it is dialled from abroad,
            `+82 10-2345-6789` rather than `010-2345-6789`. The trunk prefix the country
            dials at home is dropped.
        separator: What goes between the groups of digits, in place of the country's own
            way of writing them. `""` writes the digits alone, which with
            `include_country_code` is E.164. None keeps each country's own.
        unique: Never return the same number twice.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `PhoneDetail` per number — its
            country, its type and its E.164 form.

    Returns:
        A `list[str]`, or a `list[PhoneDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_phone(country="KR")
        ['010-4821-3967']
        >>> rand_phone(country="US", count=2)
        ['(415) 726-0193', '(917) 384-5520']
        >>> rand_phone(country="KR", include_country_code=True, separator="")
        ['+821048213967']
    """
    details = generate_phone_details(
        country=country,
        type=type,
        count=count,
        include_country_code=include_country_code,
        separator=separator,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.phone for detail in details]
