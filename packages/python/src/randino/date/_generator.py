"""The date generator: an instant drawn evenly from a range, then written out.

Everything here is UTC. A date drawn in the machine's own time zone would come out
differently on two machines from the same seed, and an hour that a daylight-saving change
skips would be a date no clock ever showed.
"""

import calendar
import re
from collections.abc import Callable
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone

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
    r"([Zz]|[+-]\d{2}(?::?\d{2})?)?)?)?)?$"
)
"""`2024`, `2024-03`, `2024-03-15`, `2024-03-15T14:07`, `2024-03-15 14:07:32.481`.

With an offset after the time: `Z`, `+09:00`, `+0900` or `+09`.
"""

_TOKENS = re.compile(r"\[([^\]]*)]|YYYY|YY|MMMM|MMM|MM?|DD?|dddd|ddd|HH?|hh?|mm?|ss?|SSS|A|a")
"""Longest first, so `YYYY` is never read as two `YY` nor `MMMM` as two `MM`.

Text in brackets is written as it is, and so is anything that is not a token.
"""


@dataclass(frozen=True, slots=True)
class _Span:
    """The first and the last millisecond a bound stands for."""

    start: int
    end: int


def _timestamp_of(moment: datetime) -> int:
    """Milliseconds since the epoch for an aware `datetime`, floored to a millisecond."""
    return (moment - _EPOCH) // _MILLISECOND


def _offset_of(text: str | None) -> int | None:
    """An offset as milliseconds east of UTC, or None for one no clock shows."""
    if not text or text in ("Z", "z"):
        return 0

    digits = text[1:].replace(":", "")
    hours = int(digits[:2])
    minutes = int(digits[2:] or "0")

    if hours > 23 or minutes > 59:
        return None

    return (-1 if text[0] == "-" else 1) * (hours * 60 + minutes) * 60000


def _parse_date(text: str) -> _Span | None:
    """A string as the span it names.

    `"2024"` is the whole year and `"2024-03-15"` the whole day, so `max_date="2024-03-15"`
    reaches the evening of the 15th rather than stopping at its first millisecond. A string
    that is not a date — `"2024-02-30"`, `"24:00"` — names nothing.
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
    shift = _offset_of(offset)

    if (
        shift is None
        or parts[0] < 1
        or not 1 <= parts[1] <= 12
        or not 1 <= parts[2] <= calendar.monthrange(parts[0], parts[1])[1]
        or parts[3] > 23
        or parts[4] > 59
        or parts[5] > 59
    ):
        return None

    start = _timestamp_of(datetime(*parts, millisecond * 1000, tzinfo=timezone.utc)) - shift

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


def _span_of(value: object) -> _Span | None:
    """A bound as the span it stands for, or None for anything that is not a date."""
    if isinstance(value, str):
        return _parse_date(value)

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
        start = _timestamp_of(datetime(value.year, value.month, value.day, tzinfo=timezone.utc))

        return _Span(start, start + _DAY - 1)

    return None


def date_range(min_date: object, max_date: object) -> tuple[int, int]:
    """The first and the last millisecond a call may land on.

    A bound left out never contradicts the one that was written: past the default at
    either end, it moves to the end of what a date may be.
    """
    low = _span_of(min_date)
    high = _span_of(max_date)

    if low is not None:
        start = low.start
    elif high is not None and high.end < DATE_MIN_DEFAULT:
        start = DATE_FLOOR
    else:
        start = DATE_MIN_DEFAULT

    if high is not None:
        end = high.end
    elif low is not None and low.start > DATE_MAX_DEFAULT:
        end = DATE_CEILING
    else:
        end = DATE_MAX_DEFAULT

    top = clamp(end, DATE_FLOOR, DATE_CEILING)

    # A range the wrong way round keeps `max_date`, the same way a length range keeps
    # `max_length`: it is the bound a caller is usually holding to.
    return min(clamp(start, DATE_FLOOR, DATE_CEILING), top), top


def _write(token: str, moment: datetime, names: DateNames) -> str:
    """What one token of a format writes for `moment`, in the names of one language."""
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
    }

    return written.get(token, names.meridiem_lower[half])


def format_date(moment: datetime, format: str, language: WordLanguage) -> str:
    """`moment` written out by `format`, in the names of `language`."""
    names = DATE_NAMES[language]

    return _TOKENS.sub(
        lambda match: (
            match.group(1) if match.group(1) is not None else _write(match.group(0), moment, names)
        ),
        format,
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
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[DateDetail]:
    """Generate `count` dates, applied to every option."""
    low, high = date_range(min_date, max_date)
    # A format that writes nothing is no format at all.
    written = format if isinstance(format, str) and format else DATE_FORMAT_DEFAULT
    part = resolve_date_unit(unit)
    chosen = _resolve_date_language(language)

    def draw() -> DateDetail:
        timestamp = rand_int(low, high)
        moment = _EPOCH + timedelta(milliseconds=timestamp)
        drawn: WordLanguage = pick(WORD_LANGUAGES) if chosen == "all" else chosen

        return DateDetail(
            date=format_date(moment, written, drawn),
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
