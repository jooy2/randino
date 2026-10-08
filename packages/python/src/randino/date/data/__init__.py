"""The parts of a date, and the range a date is drawn from when a bound is left out."""

from dataclasses import dataclass

from randino._types import DateUnit, WordLanguage

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


def words(source: str) -> tuple[str, ...]:
    """Split a whitespace-separated list, with `_` standing for a space inside one entry.

    The same as `randino._internal.parse.words`, which is not imported here: it reaches
    into the word package, and `randino` imports this module before that one, so the two
    would import each other half-finished.
    """
    return tuple(word.replace("_", " ") for word in source.split())


@dataclass(frozen=True, slots=True)
class DateNames:
    """How a language names the parts of a date that a format writes as words."""

    months: tuple[str, ...]
    """`MMMM`, January first."""

    months_short: tuple[str, ...]
    """`MMM`."""

    weekdays: tuple[str, ...]
    """`dddd`, Monday first, the way ISO 8601 counts a week."""

    weekdays_short: tuple[str, ...]
    """`ddd`."""

    meridiem: tuple[str, ...]
    """`A`, before noon and after it."""

    meridiem_lower: tuple[str, ...]
    """`a`. The same as `meridiem` in a language that has no case."""


DATE_NAMES: dict[WordLanguage, DateNames] = {
    "en": DateNames(
        months=words(
            "January February March April May June July August September October November December"
        ),
        months_short=words("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec"),
        weekdays=words("Monday Tuesday Wednesday Thursday Friday Saturday Sunday"),
        weekdays_short=words("Mon Tue Wed Thu Fri Sat Sun"),
        meridiem=words("AM PM"),
        meridiem_lower=words("am pm"),
    ),
    "ko": DateNames(
        months=words("1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월"),
        months_short=words("1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월"),
        weekdays=words("월요일 화요일 수요일 목요일 금요일 토요일 일요일"),
        weekdays_short=words("월 화 수 목 금 토 일"),
        meridiem=words("오전 오후"),
        meridiem_lower=words("오전 오후"),
    ),
    "ja": DateNames(
        months=words("1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月"),
        months_short=words("1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月"),
        weekdays=words("月曜日 火曜日 水曜日 木曜日 金曜日 土曜日 日曜日"),
        weekdays_short=words("月 火 水 木 金 土 日"),
        meridiem=words("午前 午後"),
        meridiem_lower=words("午前 午後"),
    ),
    "zh": DateNames(
        months=words("一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月"),
        months_short=words("1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月"),
        weekdays=words("星期一 星期二 星期三 星期四 星期五 星期六 星期日"),
        weekdays_short=words("周一 周二 周三 周四 周五 周六 周日"),
        meridiem=words("上午 下午"),
        meridiem_lower=words("上午 下午"),
    ),
    "vi": DateNames(
        months=words(
            "tháng_1 tháng_2 tháng_3 tháng_4 tháng_5 tháng_6 tháng_7 tháng_8 tháng_9 tháng_10 tháng_11 tháng_12"
        ),
        months_short=words(
            "thg_1 thg_2 thg_3 thg_4 thg_5 thg_6 thg_7 thg_8 thg_9 thg_10 thg_11 thg_12"
        ),
        weekdays=words("Thứ_Hai Thứ_Ba Thứ_Tư Thứ_Năm Thứ_Sáu Thứ_Bảy Chủ_Nhật"),
        weekdays_short=words("T2 T3 T4 T5 T6 T7 CN"),
        meridiem=words("SA CH"),
        meridiem_lower=words("SA CH"),
    ),
    "es": DateNames(
        months=words(
            "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre"
        ),
        months_short=words("ene feb mar abr may jun jul ago sept oct nov dic"),
        weekdays=words("lunes martes miércoles jueves viernes sábado domingo"),
        weekdays_short=words("lun mar mié jue vie sáb dom"),
        meridiem=words("a._m. p._m."),
        meridiem_lower=words("a._m. p._m."),
    ),
    "it": DateNames(
        months=words(
            "gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre"
        ),
        months_short=words("gen feb mar apr mag giu lug ago set ott nov dic"),
        weekdays=words("lunedì martedì mercoledì giovedì venerdì sabato domenica"),
        weekdays_short=words("lun mar mer gio ven sab dom"),
        meridiem=words("AM PM"),
        meridiem_lower=words("am pm"),
    ),
    "de": DateNames(
        months=words(
            "Januar Februar März April Mai Juni Juli August September Oktober November Dezember"
        ),
        months_short=words("Jan. Feb. März Apr. Mai Juni Juli Aug. Sept. Okt. Nov. Dez."),
        weekdays=words("Montag Dienstag Mittwoch Donnerstag Freitag Samstag Sonntag"),
        weekdays_short=words("Mo. Di. Mi. Do. Fr. Sa. So."),
        meridiem=words("AM PM"),
        meridiem_lower=words("am pm"),
    ),
    "ru": DateNames(
        months=words(
            "января февраля марта апреля мая июня июля августа сентября октября ноября декабря"
        ),
        months_short=words("янв. февр. мар. апр. мая июн. июл. авг. сент. окт. нояб. дек."),
        weekdays=words("понедельник вторник среда четверг пятница суббота воскресенье"),
        weekdays_short=words("пн вт ср чт пт сб вс"),
        meridiem=words("AM PM"),
        meridiem_lower=words("am pm"),
    ),
}
"""Every word language's names for the parts of a date.

Each is written the way the language writes it inside a date rather than on its own:
Spanish and Italian months in lower case, Russian ones in the genitive (`5 марта`), and a
Vietnamese month as `tháng 3`. Ported from the JavaScript package's `date/data/index.ts`.
"""
