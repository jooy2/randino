"""The date generator: an instant drawn evenly from a range, then written out.

Everything here is UTC unless the caller names an offset. A date drawn in the machine's
own time zone would come out differently on two machines from the same seed, and an hour
that a daylight-saving change skips would be a date no clock ever showed; a fixed offset
has neither problem.
"""

import calendar
import re
from collections.abc import Callable
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import NamedTuple

from randino._internal.generate import collect, resolve_option, resolve_optional
from randino._internal.utils import clamp, pick, rand_int, with_random
from randino._types import DateDetail, DateInput, DateUnit, WordLanguage, WordLanguageOption
from randino.date.data import (
    DATE_CEILING,
    DATE_FLOOR,
    DATE_FORMAT_DEFAULT,
    DATE_MAX_DEFAULT,
    DATE_MIN_DEFAULT,
    DATE_NAMES,
    DATE_UNITS,
    DateNames,
)
from randino.word.data import WORD_LANGUAGES

_EPOCH = datetime(1970, 1, 1, tzinfo=timezone.utc)
_MILLISECOND = timedelta(milliseconds=1)
_DAY = 86400000

_ISO_DATE = re.compile(
    r"^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?"
    r"([Zz]|[+-]\d{2}(?::?\d{2})?)?)?)?)?$",
    # `\d` is any digit Unicode knows without it, and `int` reads them all: `２０２４`
    # was the year 2024 here and no date in JavaScript.
    re.ASCII,
)
"""`2024`, `2024-03`, `2024-03-15`, `2024-03-15T14:07`, `2024-03-15 14:07:32.481`.

With an offset after the time: `Z`, `+09:00`, `+0900` or `+09`.
"""

_TOKENS = (
    "YYYY",
    "YY",
    "MMMM",
    "MMM",
    "MM",
    "M",
    "DD",
    "D",
    "dddd",
    "ddd",
    "HH",
    "H",
    "hh",
    "h",
    "mm",
    "m",
    "ss",
    "s",
    "SSS",
    "A",
    "a",
    "ZZ",
    "Z",
)
"""Longest first, so `YYYY` is never read as two `YY` nor `MMMM` as two `MM`."""


class _Piece(NamedTuple):
    """One piece of a read format: text written as it is, or a token filled in."""

    text: str
    """The text, or `""` for a token."""

    token: str | None
    """The token, or None for text."""


@dataclass(frozen=True, slots=True)
class _Span:
    """The first and the last millisecond a bound stands for."""

    start: int
    end: int


def _timestamp_of(moment: datetime) -> int:
    """Milliseconds since the epoch for an aware `datetime`, floored to a millisecond."""
    return (moment - _EPOCH) // _MILLISECOND


_OFFSET = re.compile(r"^(?:[Zz]|([+-])(\d{2})(?::?(\d{2}))?)$", re.ASCII)
"""`Z`, `+09:00`, `+0900` or `+09`."""

_OFFSET_LIMIT = 24 * 60
"""Minutes an offset stays under: a clock is set at most fourteen hours from UTC."""


def _offset_of(text: str) -> int | None:
    """An offset as milliseconds east of UTC, or None for one no clock shows."""
    match = _OFFSET.match(text)

    if not match:
        return None

    sign, hours, minutes = match.groups()

    if not sign:
        return 0

    if int(hours) > 23 or int(minutes or 0) > 59:
        return None

    return (-1 if sign == "-" else 1) * (int(hours) * 60 + int(minutes or 0)) * 60000


def resolve_offset(utc_offset: object) -> int:
    """`utc_offset` as milliseconds east of UTC, whole minutes only.

    A string is read the way a date string's own offset is, and a `timedelta` is cut to
    whole minutes. Anything that is not an offset a clock could be set to is UTC.
    """
    if isinstance(utc_offset, str):
        return _offset_of(utc_offset.strip()) or 0

    if isinstance(utc_offset, timedelta):
        minutes = int(utc_offset.total_seconds() / 60)

        return minutes * 60000 if abs(minutes) < _OFFSET_LIMIT else 0

    return 0


def _parse_date(text: str, shift: int) -> _Span | None:
    """A string as the span it names.

    `"2024"` is the whole year and `"2024-03-15"` the whole day, so `max_date="2024-03-15"`
    reaches the evening of the 15th rather than stopping at its first millisecond. A string
    with no offset of its own is read at `shift`, the call's `utc_offset`. A string that is
    not a date — `"2024-02-30"`, `"24:00"` — names nothing.
    """
    match = _ISO_DATE.match(text.strip())

    if not match:
        return None

    year, month, day, hour, minute, second, fraction, offset = match.groups()
    parts = (
        int(year),
        int(month or 1),
        int(day or 1),
        int(hour or 0),
        int(minute or 0),
        int(second or 0),
    )
    # A fraction finer than a millisecond is cut to one, never rounded up into the next.
    millisecond = int(fraction[:3].ljust(3, "0")) if fraction else 0
    own = shift if offset is None else _offset_of(offset)

    if (
        own is None
        or parts[0] < 1
        or not 1 <= parts[1] <= 12
        or not 1 <= parts[2] <= calendar.monthrange(parts[0], parts[1])[1]
        or parts[3] > 23
        or parts[4] > 59
        or parts[5] > 59
    ):
        return None

    start = _timestamp_of(datetime(*parts, millisecond * 1000, tzinfo=timezone.utc)) - own

    if fraction:
        span = 1
    elif second:
        span = 1000
    elif minute:
        span = 60000
    elif day:
        span = _DAY
    elif month:
        span = calendar.monthrange(parts[0], parts[1])[1] * _DAY
    else:
        span = (366 if calendar.isleap(parts[0]) else 365) * _DAY

    return _Span(start, start + span - 1)


def _span_of(value: object, shift: int) -> _Span | None:
    """A bound as the span it stands for, or None for anything that is not a date.

    A string and a `date` with no offset of their own are read at `shift`.
    """
    if isinstance(value, str):
        return _parse_date(value, shift)

    if isinstance(value, datetime):
        if value.tzinfo is None:
            # A naive `datetime` is the machine's own time, the way `datetime.timestamp`
            # reads it — which is what `datetime.now()` means. A year the platform cannot
            # convert in its own zone is read as UTC rather than not at all.
            try:
                value = value.astimezone(timezone.utc)
            except (OverflowError, OSError, ValueError):
                value = value.replace(tzinfo=timezone.utc)

        instant = _timestamp_of(value)

        return _Span(instant, instant)

    if isinstance(value, date):
        start = (
            _timestamp_of(datetime(value.year, value.month, value.day, tzinfo=timezone.utc)) - shift
        )

        return _Span(start, start + _DAY - 1)

    return None


def date_range(min_date: object, max_date: object, shift: int = 0) -> tuple[int, int]:
    """The first and the last millisecond a call may land on, for dates read at `shift`.

    A bound left out never contradicts the one that was written: past the default at
    either end, it moves to the end of what a date may be. The defaults and the limits
    are dates on a calendar, so they move with the offset: the range left out is 1900 to
    2099 on the clock the dates are written in, and no date is written with a year
    outside 1 to 9999.
    """
    floor = DATE_FLOOR - shift
    ceiling = DATE_CEILING - shift
    min_default = DATE_MIN_DEFAULT - shift
    max_default = DATE_MAX_DEFAULT - shift
    low = _span_of(min_date, shift)
    high = _span_of(max_date, shift)

    if low is not None:
        start = low.start
    elif high is not None and high.end < min_default:
        start = floor
    else:
        start = min_default

    if high is not None:
        end = high.end
    elif low is not None and low.start > max_default:
        end = ceiling
    else:
        end = max_default

    top = clamp(end, floor, ceiling)

    # A range the wrong way round keeps `max_date`, the same way a length range keeps
    # `max_length`: it is the bound a caller is usually holding to.
    return min(clamp(start, floor, ceiling), top), top


def _zone(minutes: int, colon: bool) -> str:
    """An offset in minutes as ISO 8601 writes it: `+09:00`, or `+0900` without the colon."""
    hours, rest = divmod(abs(minutes), 60)

    return f"{'-' if minutes < 0 else '+'}{hours:02d}{':' if colon else ''}{rest:02d}"


def _write(token: str, moment: datetime, names: DateNames, offset: int) -> str:
    """What one token of a format writes for `moment`, in the names of one language.

    `offset` is the minutes east of UTC the date was read at. UTC is `Z` to `Z`, which is
    what keeps the default format the string JavaScript's `toISOString` writes.
    """
    twelve = moment.hour % 12 or 12
    half = 0 if moment.hour < 12 else 1
    written = {
        "YYYY": f"{moment.year:04d}",
        "YY": f"{moment.year % 100:02d}",
        "MMMM": names.months[moment.month - 1],
        "MMM": names.months_short[moment.month - 1],
        "dddd": names.weekdays[moment.isoweekday() - 1],
        "ddd": names.weekdays_short[moment.isoweekday() - 1],
        "MM": f"{moment.month:02d}",
        "M": str(moment.month),
        "DD": f"{moment.day:02d}",
        "D": str(moment.day),
        "HH": f"{moment.hour:02d}",
        "H": str(moment.hour),
        "hh": f"{twelve:02d}",
        "h": str(twelve),
        "mm": f"{moment.minute:02d}",
        "m": str(moment.minute),
        "ss": f"{moment.second:02d}",
        "s": str(moment.second),
        "SSS": f"{moment.microsecond // 1000:03d}",
        "A": names.meridiem[half],
        "Z": _zone(offset, colon=True) if offset else "Z",
        "ZZ": _zone(offset, colon=False),
    }

    return written.get(token, names.meridiem_lower[half])


def read_format(format: str) -> tuple[_Piece, ...]:
    """`format` read once, left to right.

    Text in brackets is written as it is, and so is anything that is not a token, a `[`
    with no `]` after it included. A scan rather than a regular expression: matching a
    bracket pair at every `[` runs to the end of the format whenever no `]` follows, so a
    format of many `[` took time growing with the square of its length — and it was read
    again for every date drawn.
    """
    pieces: list[_Piece] = []
    text: list[str] = []
    # Whether a `]` is still ahead. Once none is, every `[` left is plain text.
    closing = True
    at = 0

    def flush() -> None:
        if text:
            pieces.append(_Piece("".join(text), None))
            text.clear()

    while at < len(format):
        if closing and format[at] == "[":
            end = format.find("]", at + 1)

            if end >= 0:
                text.append(format[at + 1 : end])
                at = end + 1
                continue

            closing = False

        token = next((each for each in _TOKENS if format.startswith(each, at)), None)

        if token is not None:
            flush()
            pieces.append(_Piece("", token))
            at += len(token)
        else:
            text.append(format[at])
            at += 1

    flush()

    return tuple(pieces)


def format_date(
    moment: datetime, pieces: tuple[_Piece, ...], language: WordLanguage, offset: int = 0
) -> str:
    """`moment` written out by a read format, in the names of `language`, at `offset` minutes."""
    names = DATE_NAMES[language]

    return "".join(
        piece.text if piece.token is None else _write(piece.token, moment, names, offset)
        for piece in pieces
    )


def _resolve_date_language(language: object) -> WordLanguageOption:
    """The caller's `language`, or English for one the package does not know.

    Not `"all"` by default the way the other generators have it: a format is written in
    one language, and nine languages' month names in one format is no format.
    """
    known: tuple[WordLanguageOption, ...] = (*WORD_LANGUAGES, "all")

    return resolve_option(language, known, "en")


def resolve_date_unit(unit: object) -> DateUnit | None:
    """The caller's `unit`, or None for the whole date."""
    return resolve_optional(unit, DATE_UNITS)


def unit_of(detail: DateDetail, unit: DateUnit) -> int:
    """The part of `detail` that `unit` names."""
    value: int = getattr(detail, unit)

    return value


def generate_date_details(
    *,
    count: int = 1,
    min_date: DateInput | None = None,
    max_date: DateInput | None = None,
    unit: DateUnit | None = None,
    format: str = DATE_FORMAT_DEFAULT,
    language: WordLanguageOption = "en",
    utc_offset: str | timedelta | None = None,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    write: bool = True,
) -> list[DateDetail]:
    """Generate `count` dates, applied to every option.

    `write` is False when the caller is handed a `unit` and nothing else, which leaves
    `date` empty: formatting a date nobody reads was most of the time a call spent.
    """
    shift = resolve_offset(utc_offset)
    low, high = date_range(min_date, max_date, shift)
    # A format that writes nothing is no format at all.
    written = read_format(format if isinstance(format, str) and format else DATE_FORMAT_DEFAULT)
    part = resolve_date_unit(unit)
    chosen = _resolve_date_language(language)

    def draw() -> DateDetail:
        timestamp = rand_int(low, high)
        # The parts read at the offset: a `datetime` that is UTC in name, holding the clock
        # the date is written on.
        moment = _EPOCH + timedelta(milliseconds=timestamp + shift)
        drawn: WordLanguage = pick(WORD_LANGUAGES) if chosen == "all" else chosen

        return DateDetail(
            date=format_date(moment, written, drawn, shift // 60000) if write else "",
            timestamp=timestamp,
            year=moment.year,
            month=moment.month,
            day=moment.day,
            hour=moment.hour,
            minute=moment.minute,
            second=moment.second,
            millisecond=moment.microsecond // 1000,
            weekday=moment.isoweekday(),
            language=drawn,
        )

    def key_of(detail: DateDetail) -> str:
        # Deduplicated by what the caller is handed: two dates in one minute are one
        # result when `unit` asks for the minute.
        return detail.date if part is None else str(unit_of(detail, part))

    with with_random(random):
        return collect(count=count, unique=unique, starts_with="", draw=draw, key_of=key_of)
