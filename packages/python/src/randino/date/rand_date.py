"""Dates, drawn evenly from a range and written out in UTC."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import DateDetail, DateInput, DateUnit
from randino.date._generator import generate_date_details, resolve_date_unit, unit_of
from randino.date.data import DATE_FORMAT_DEFAULT


@overload
def rand_date(
    *,
    count: int = ...,
    min_date: DateInput | None = ...,
    max_date: DateInput | None = ...,
    unit: None = ...,
    format: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_date(
    *,
    count: int = ...,
    min_date: DateInput | None = ...,
    max_date: DateInput | None = ...,
    unit: DateUnit,
    format: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[int]: ...


@overload
def rand_date(
    *,
    count: int = ...,
    min_date: DateInput | None = ...,
    max_date: DateInput | None = ...,
    unit: DateUnit | None = ...,
    format: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[DateDetail]: ...


def rand_date(
    *,
    count: int = 1,
    min_date: DateInput | None = None,
    max_date: DateInput | None = None,
    unit: DateUnit | None = None,
    format: str = DATE_FORMAT_DEFAULT,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[int] | list[DateDetail]:
    """Generate dates, drawn evenly from a range and written out in UTC.

    Args:
        count: How many dates to return. Held inside `0`..`RAND_COUNT_MAX`.
        min_date: The earliest date to return. Defaults to `"1900-01-01"`, or to the
            first day of the year 1 when `max_date` is earlier than that. A string names a
            span and the range starts at its first millisecond.
        max_date: The latest date to return. Defaults to the end of `"2099-12-31"`, or to
            the end of the year 9999 when `min_date` is later than that. A string names a
            span and the range ends at its last millisecond, so `"2024-12-31"` reaches the
            evening of that day. A range the wrong way round keeps `max_date`.
        unit: Return one part of each date, as an `int`, instead of the date written
            out. The part is read off a drawn date, so it keeps to the range.
        format: How the date is written. `YYYY`, `YY`, `M`, `MM`, `D`, `DD`, `H`, `HH`,
            `h`, `hh`, `m`, `mm`, `s`, `ss`, `SSS`, `A` and `a` are replaced, text inside
            `[` `]` is written as it is, and so is everything else. Defaults to ISO 8601.
        unique: Never return the same result twice — the same date, or the same part
            when `unit` names one. Returns fewer than `count` once the range runs out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, or numbers when `unit` is named; `"detail"` for a
            `DateDetail` per date, with the date written out and every part on its own.

    Returns:
        A `list[str]`, a `list[int]` when `unit` is named, or a `list[DateDetail]` when
        `output="detail"` — the overloads carry that through, so a type checker knows
        which one it got.

    Example:
        >>> rand_date()
        ['1987-06-21T08:14:51.302Z']
        >>> rand_date(min_date="2024-01-01", max_date="2024-12-31", format="YYYY-MM-DD")
        ['2024-07-09']
        >>> rand_date(unit="minute", count=3)
        [37, 4, 52]
    """
    details = generate_date_details(
        count=count,
        min_date=min_date,
        max_date=max_date,
        unit=unit,
        format=format,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    part = resolve_date_unit(unit)

    if part is None:
        return [detail.date for detail in details]

    return [unit_of(detail, part) for detail in details]
