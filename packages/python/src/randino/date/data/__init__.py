"""The parts of a date, and the range a date is drawn from when a bound is left out."""

from randino._types import DateUnit

DATE_UNITS: tuple[DateUnit, ...] = (
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond",
)
"""The parts of a date, largest first."""

DATE_FLOOR = -62135596800000
"""The earliest instant a date may be, `0001-01-01T00:00:00.000Z`, in epoch milliseconds.

Every package can hold a year of four digits and Python can hold no more, so a range is
held inside the years 1 to 9999.
"""

DATE_CEILING = 253402300799999
"""The latest instant a date may be, `9999-12-31T23:59:59.999Z`."""

DATE_MIN_DEFAULT = -2208988800000
"""Where the range starts when `min_date` is left out, `1900-01-01T00:00:00.000Z`.

Written out rather than counted back from today, so that a seeded `random` hands back
the same dates on every run.
"""

DATE_MAX_DEFAULT = 4102444799999
"""Where the range ends when `max_date` is left out, `2099-12-31T23:59:59.999Z`."""

DATE_FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ss.SSSZ"
"""ISO 8601 in UTC, the way JavaScript's `Date.prototype.toISOString` writes it."""
