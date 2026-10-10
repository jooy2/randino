"""Dates: drawn evenly from a range, written out by a format or one part at a time."""

import re
import time
from datetime import date, datetime, timedelta, timezone
from random import Random
from typing import Any

from randino import (
    DATE_UNITS,
    RAND_COUNT_MAX,
    WORD_LANGUAGES,
    DateDetail,
    DateInput,
    WordLanguageOption,
    rand_date,
)

# Internal, but they are what a range is checked against.
from randino.date.data import (
    DATE_CEILING,
    DATE_FLOOR,
    DATE_MAX_DEFAULT,
    DATE_MIN_DEFAULT,
    DATE_NAMES,
)

SAMPLE = 60
LARGE = 6000

EPOCH = datetime(1970, 1, 1, tzinfo=timezone.utc)
ISO = r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$"


def ms(text: str) -> int:
    """Epoch milliseconds for an ISO 8601 instant written in UTC with a `Z`."""
    moment = datetime.strptime(text, "%Y-%m-%dT%H:%M:%S.%fZ").replace(tzinfo=timezone.utc)

    return (moment - EPOCH) // timedelta(milliseconds=1)


def agrees(detail: DateDetail) -> bool:
    """Whether the standard library reads the detail's timestamp as the same parts."""
    moment = EPOCH + timedelta(milliseconds=detail.timestamp)

    return (
        moment.year,
        moment.month,
        moment.day,
        moment.hour,
        moment.minute,
        moment.second,
        moment.microsecond // 1000,
        moment.isoweekday(),
    ) == (
        detail.year,
        detail.month,
        detail.day,
        detail.hour,
        detail.minute,
        detail.second,
        detail.millisecond,
        detail.weekday,
    )


def in_range(dates: list[DateDetail], start: str, end: str) -> bool:
    """Whether every date falls from `start` to `end`, both included."""
    return all(ms(start) <= detail.timestamp <= ms(end) for detail in dates)


def write(at: DateInput, format: str) -> str:
    """The one date `format` writes for the instant `at`."""
    return rand_date(min_date=at, max_date=at, format=format)[0]


def test_rand_date_returns_one_iso_8601_date_by_default() -> None:
    dates = rand_date()

    assert len(dates) == 1
    assert re.match(ISO, dates[0])


def test_returns_exactly_count_dates() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_date(count=count)) == count

    assert rand_date(count=-3) == []
    assert len(rand_date(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_the_default_range_is_the_years_1900_to_2099() -> None:
    dates = rand_date(count=LARGE, output="detail")

    assert in_range(dates, "1900-01-01T00:00:00.000Z", "2099-12-31T23:59:59.999Z")
    assert ms("1900-01-01T00:00:00.000Z") == DATE_MIN_DEFAULT
    assert ms("2099-12-31T23:59:59.999Z") == DATE_MAX_DEFAULT
    assert ms("0001-01-01T00:00:00.000Z") == DATE_FLOOR
    assert ms("9999-12-31T23:59:59.999Z") == DATE_CEILING


def test_the_parts_of_the_detail_are_the_parts_of_its_timestamp() -> None:
    for detail in rand_date(count=SAMPLE * 5, output="detail"):
        assert agrees(detail), detail
        moment = EPOCH + timedelta(milliseconds=detail.timestamp)
        assert detail.date == moment.strftime("%Y-%m-%dT%H:%M:%S.") + (f"{detail.millisecond:03d}Z")


def test_a_string_bound_names_the_whole_span_it_writes() -> None:
    cases = [
        ("2024", "2024", "2024-01-01T00:00:00.000Z", "2024-12-31T23:59:59.999Z"),
        ("2024-02", "2024-02", "2024-02-01T00:00:00.000Z", "2024-02-29T23:59:59.999Z"),
        ("2023-02", "2023-02", "2023-02-01T00:00:00.000Z", "2023-02-28T23:59:59.999Z"),
        ("2024-03-15", "2024-03-15", "2024-03-15T00:00:00.000Z", "2024-03-15T23:59:59.999Z"),
        (
            "2024-03-15T10:30",
            "2024-03-15 10:30",
            "2024-03-15T10:30:00.000Z",
            "2024-03-15T10:30:59.999Z",
        ),
        (
            "2024-03-15T10:30:15",
            "2024-03-15T10:30:15",
            "2024-03-15T10:30:15.000Z",
            "2024-03-15T10:30:15.999Z",
        ),
    ]

    for min_date, max_date, start, end in cases:
        dates = rand_date(min_date=min_date, max_date=max_date, count=SAMPLE, output="detail")

        assert in_range(dates, start, end), f"{min_date}..{max_date}"

    # The whole of February in a leap year, and nothing past it.
    days = rand_date(min_date="2024-02", max_date="2024-02", unit="day", count=2000)

    assert max(days) == 29
    assert min(days) == 1


def test_a_fraction_and_an_offset_are_read_and_the_rest_is_utc() -> None:
    at = "2024-03-15T10:30:15.5"

    assert rand_date(min_date=at, max_date=at, count=2) == [
        "2024-03-15T10:30:15.500Z",
        "2024-03-15T10:30:15.500Z",
    ]
    # Finer than a millisecond is cut to one, never rounded into the next.
    fine = "2024-03-15T10:30:15.4569"

    assert rand_date(min_date=fine, max_date=fine) == ["2024-03-15T10:30:15.456Z"]

    for offset in ("+09:00", "+0900", "+09"):
        shifted = f"2024-03-15T10:30:15.000{offset}"

        assert rand_date(min_date=shifted, max_date=shifted) == ["2024-03-15T01:30:15.000Z"]

    behind = "2024-03-15T23:30:00.000-02:30"

    assert rand_date(min_date=behind, max_date=behind) == ["2024-03-16T02:00:00.000Z"]


def test_a_datetime_is_the_instant_it_holds_and_a_date_is_its_day() -> None:
    aware = datetime(2024, 3, 15, 10, 30, 15, 123456, tzinfo=timezone.utc)

    assert rand_date(min_date=aware, max_date=aware) == ["2024-03-15T10:30:15.123Z"]

    seoul = datetime(2024, 3, 15, 10, 30, tzinfo=timezone(timedelta(hours=9)))

    assert rand_date(min_date=seoul, max_date=seoul) == ["2024-03-15T01:30:00.000Z"]

    # A naive datetime is the machine's own time, the way `datetime.timestamp` reads it.
    naive = datetime(2024, 3, 15, 10, 30)
    expected = round(naive.timestamp() * 1000)

    assert rand_date(min_date=naive, max_date=naive, output="detail")[0].timestamp == expected

    day = rand_date(
        min_date=date(2024, 3, 15), max_date=date(2024, 3, 15), count=SAMPLE, output="detail"
    )

    assert in_range(day, "2024-03-15T00:00:00.000Z", "2024-03-15T23:59:59.999Z")


def test_a_bound_that_is_not_a_date_is_the_default() -> None:
    for bad in ("2024-02-30", "2024-13", "2024-03-15T24:00", "tomorrow", ""):
        dates = rand_date(min_date=bad, max_date=bad, count=SAMPLE, output="detail")

        assert in_range(dates, "1900-01-01T00:00:00.000Z", "2099-12-31T23:59:59.999Z"), bad


def test_a_bound_left_out_never_contradicts_the_one_that_was_written() -> None:
    late = rand_date(min_date="2200", count=SAMPLE, output="detail")
    early = rand_date(max_date="1850", count=SAMPLE, output="detail")

    assert in_range(late, "2200-01-01T00:00:00.000Z", "9999-12-31T23:59:59.999Z")
    assert in_range(early, "0001-01-01T00:00:00.000Z", "1850-12-31T23:59:59.999Z")
    # Inside the default, it is the default.
    assert in_range(
        rand_date(min_date="2020", count=SAMPLE, output="detail"),
        "2020-01-01T00:00:00.000Z",
        "2099-12-31T23:59:59.999Z",
    )


def test_a_range_the_wrong_way_round_keeps_max_date() -> None:
    assert rand_date(min_date="2030", max_date="2020", count=2) == [
        "2020-12-31T23:59:59.999Z",
        "2020-12-31T23:59:59.999Z",
    ]


def test_the_first_and_the_last_year_are_written_with_four_digits() -> None:
    assert write("0001-01-01T00:00", "YYYY YY M D") == "0001 01 1 1"
    assert write("9999-12-31T23:59", "YYYY-MM-DD HH:mm") == "9999-12-31 23:59"

    for detail in rand_date(min_date="0050", max_date="0099", count=SAMPLE, output="detail"):
        assert 50 <= detail.year <= 99


def test_format_writes_every_token_and_text_in_brackets_as_it_is() -> None:
    at = "2024-03-05T07:08:09.045Z"

    assert write(at, "YYYY YY MM M DD D") == "2024 24 03 3 05 5"
    assert write(at, "HH H hh h mm m ss s SSS A a") == "07 7 07 7 08 8 09 9 045 AM am"
    assert write(at, "YYYY년 M월 D일") == "2024년 3월 5일"
    assert write(at, "[Day] D [at] HH:mm") == "Day 5 at 07:08"
    assert write(at, "YYYY/MM/DD") == "2024/03/05"
    assert write("2024-03-05T19:00:00.000Z", "hh:mm A") == "07:00 PM"
    assert write("2024-03-05T00:00:00.000Z", "h A") == "12 AM"

    # A format that writes nothing is no format at all.
    assert re.match(ISO, rand_date(format="")[0])


def test_a_bracket_with_no_closing_one_is_text_and_so_is_everything_inside_a_pair() -> None:
    at = "2024-03-05T07:08:09.045Z"

    assert write(at, "[YYYY") == "[2024"
    assert write(at, "[]YYYY") == "2024"
    assert write(at, "[a[b]YYYY") == "a[b2024"
    assert write(at, "YYYY]") == "2024]"
    assert write(at, "[[YYYY]] D") == "[YYYY] 5"


def test_a_format_of_many_unclosed_brackets_is_read_in_linear_time() -> None:
    started = time.perf_counter()
    date = rand_date(format="[" * 50000, count=20)[0]

    assert date == "[" * 50000
    # Quadratic, this took seconds; read once and in one pass, it is milliseconds.
    assert time.perf_counter() - started < 1


def test_the_names_are_written_in_the_language_asked_for_english_by_default() -> None:
    # 2024-03-15 was a Friday, in the afternoon.
    at = "2024-03-15T19:05"

    def names(language: WordLanguageOption = "en") -> str:
        return rand_date(
            min_date=at, max_date=at, format="dddd|ddd|MMMM|MMM|A|a", language=language
        )[0]

    assert names() == "Friday|Fri|March|Mar|PM|pm"
    assert names("ko") == "금요일|금|3월|3월|오후|오후"
    assert names("ru") == "пятница|пт|марта|мар.|PM|pm"

    for language in WORD_LANGUAGES:
        table = DATE_NAMES[language]

        assert names(language) == "|".join(
            (
                table.weekdays[4],
                table.weekdays_short[4],
                table.months[2],
                table.months_short[2],
                table.meridiem[1],
                table.meridiem_lower[1],
            )
        ), language


def test_every_language_names_twelve_months_seven_days_and_two_halves_none_twice() -> None:
    assert set(DATE_NAMES) == set(WORD_LANGUAGES)

    for language in WORD_LANGUAGES:
        table = DATE_NAMES[language]

        for names, length in (
            (table.months, 12),
            (table.months_short, 12),
            (table.weekdays, 7),
            (table.weekdays_short, 7),
            (table.meridiem, 2),
            (table.meridiem_lower, 2),
        ):
            assert len(names) == length, language
            assert len(set(names)) == length, f"{language} names a part twice"


def test_all_picks_a_language_per_date_and_the_detail_says_which() -> None:
    details = rand_date(language="all", format="MMMM dddd", count=300, output="detail")

    assert {detail.language for detail in details} == set(WORD_LANGUAGES)

    for detail in details:
        table = DATE_NAMES[detail.language]

        assert (
            detail.date == f"{table.months[detail.month - 1]} {table.weekdays[detail.weekday - 1]}"
        )

    assert all(detail.language == "en" for detail in rand_date(count=20, output="detail"))


def test_utc_offset_writes_every_part_at_the_offset_and_z_writes_it() -> None:
    dates = rand_date(
        utc_offset="+09:00",
        min_date="2024-03-15",
        max_date="2024-03-15",
        count=SAMPLE,
        output="detail",
    )

    # A string bound with no offset of its own is read at the call's: the whole of the 15th
    # in Seoul, which starts at three in the afternoon of the 14th in UTC.
    assert in_range(dates, "2024-03-14T15:00:00.000Z", "2024-03-15T14:59:59.999Z")

    for detail in dates:
        assert re.fullmatch(r"2024-03-15T\d{2}:\d{2}:\d{2}\.\d{3}\+09:00", detail.date)
        assert detail.day == 15

    # A `timedelta` is the same offset as the string.
    assert rand_date(utc_offset=timedelta(hours=9), count=5, random=Random(7).random) == (
        rand_date(utc_offset="+09:00", count=5, random=Random(7).random)
    )
    # A `date` is its whole day at the offset, the way its string is.
    day = rand_date(
        utc_offset="+09:00", min_date=date(2024, 3, 15), max_date=date(2024, 3, 15), count=SAMPLE
    )

    assert all(written.startswith("2024-03-15T") for written in day)


def test_a_bound_with_an_offset_of_its_own_and_a_datetime_keep_their_instant() -> None:
    at = "2024-03-15T20:00:00.000Z"
    aware = datetime(2024, 3, 15, 20, tzinfo=timezone.utc)

    for bound in (at, aware):
        assert rand_date(
            utc_offset="-05:30", min_date=bound, max_date=bound, format="YYYY-MM-DD HH:mm Z ZZ"
        ) == ["2024-03-15 14:30 -05:30 -0530"]

    # UTC is written `Z` by `Z`, which keeps the default format ISO 8601.
    assert rand_date(min_date=at, max_date=at, format="Z ZZ") == ["Z +0000"]


def test_the_day_the_hour_and_the_weekday_are_the_offset_clocks() -> None:
    # Eight in the evening of Friday in UTC is five in the morning of Saturday in Seoul.
    at = "2024-03-15T20:00:00.000Z"
    detail = rand_date(
        utc_offset="+09:00", min_date=at, max_date=at, format="dddd HH", output="detail"
    )[0]

    assert detail.date == "Saturday 05"
    assert (detail.day, detail.hour, detail.weekday) == (16, 5, 6)

    hours = rand_date(
        utc_offset="+09:00",
        min_date="2024-03-15T09:00",
        max_date="2024-03-15T17:59",
        unit="hour",
        count=SAMPLE,
    )

    assert all(9 <= hour <= 17 for hour in hours)


def test_the_default_range_and_the_limits_are_on_the_offset_clock() -> None:
    for offset in ("+14:00", "-12:00"):
        for detail in rand_date(utc_offset=offset, count=SAMPLE, output="detail"):
            assert 1900 <= detail.year <= 2099, (offset, detail.date)

    late = rand_date(utc_offset="+14:00", min_date="9999", count=SAMPLE, output="detail")
    early = rand_date(utc_offset="-12:00", max_date="0001", count=SAMPLE, output="detail")

    assert all(detail.year == 9999 for detail in late)
    assert all(detail.year == 1 for detail in early)


def test_an_offset_no_clock_is_set_to_is_utc() -> None:
    loose: Any = rand_date
    offsets: list[object] = [
        "+25:00",
        "+09:60",
        "Seoul",
        timedelta(days=1),
        timedelta(days=-1),
        540,
        [],
    ]

    for offset in offsets:
        assert re.match(ISO, loose(utc_offset=offset)[0]), offset


def test_unit_returns_that_part_of_each_date_as_a_number() -> None:
    spans = {
        "year": (1900, 2099),
        "month": (1, 12),
        "day": (1, 31),
        "hour": (0, 23),
        "minute": (0, 59),
        "second": (0, 59),
        "millisecond": (0, 999),
    }

    for unit in DATE_UNITS:
        low, high = spans[unit]

        assert all(
            isinstance(value, int) and low <= value <= high
            for value in rand_date(unit=unit, count=LARGE)
        ), unit

    # Every minute of an hour comes up, so the draw spans the whole of it.
    assert len(set(rand_date(unit="minute", count=LARGE))) == 60


def test_a_unit_keeps_to_the_range() -> None:
    years = rand_date(unit="year", min_date="2000", max_date="2009", count=SAMPLE)

    assert all(2000 <= year <= 2009 for year in years)

    hours = rand_date(
        unit="hour", min_date="2024-03-15T09:00", max_date="2024-03-15T17:59", count=SAMPLE
    )

    assert all(9 <= hour <= 17 for hour in hours)


def test_unique_never_repeats_and_stops_when_the_range_runs_out() -> None:
    minutes = rand_date(unit="minute", count=100, unique=True)

    assert sorted(minutes) == list(range(60))

    days = rand_date(
        min_date="2024-01-01", max_date="2024-01-10", format="YYYY-MM-DD", count=20, unique=True
    )

    assert len(days) == 10
    assert len(set(days)) == 10


def test_the_detail_is_the_whole_date_even_when_unit_names_one_part() -> None:
    detail = rand_date(unit="minute", output="detail")[0]

    assert re.match(ISO, detail.date)
    assert agrees(detail)
