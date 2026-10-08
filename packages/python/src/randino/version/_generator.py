"""The version generator: a version number in one of three schemes, small numbers most often."""

import calendar
from collections.abc import Callable

from randino._internal.generate import collect, resolve_many, resolve_whole
from randino._internal.utils import chance, pick, pick_weighted, rand_int, random, with_random
from randino._types import VersionDetail, VersionFormat
from randino.version.data import (
    CALVER_SCHEMES,
    VERSION_FORMATS,
    VERSION_PARTS,
    VERSION_PRERELEASE_CHANCE,
    VERSION_PRERELEASES,
    VERSION_YEAR_CEILING,
    VERSION_YEAR_FLOOR,
    VERSION_YEAR_MAX_DEFAULT,
    VERSION_YEAR_MIN_DEFAULT,
)

_PRERELEASES = tuple(VERSION_PRERELEASES)

_Drawn = tuple[str, str, tuple[int, ...], str | None, int | None]
"""What one draw writes: the version, its scheme, its parts, its pre-release and its year."""


def small_number(span: tuple[int, int]) -> int:
    """A number from `span`, weighted by one over its distance from the bottom plus one.

    The bottom is most likely, and a number is about twice as likely as the one twice as
    far up.
    """
    low, high = span
    total = sum(1 / (n - low + 1) for n in range(low, high + 1))
    roll = random() * total

    for n in range(low, high + 1):
        roll -= 1 / (n - low + 1)

        if roll < 0:
            return n

    return high


def resolve_version_years(min_year: object, max_year: object) -> tuple[int, int]:
    """`min_year` and `max_year` as the years a calendar version may come from.

    A bound left out moves out of the way of the one that was written, and a range the
    wrong way round keeps `max_year`.
    """
    low = resolve_whole(
        min_year, VERSION_YEAR_MIN_DEFAULT, VERSION_YEAR_FLOOR, VERSION_YEAR_CEILING
    )
    high = resolve_whole(
        max_year,
        max(VERSION_YEAR_MAX_DEFAULT, low),
        VERSION_YEAR_FLOOR,
        VERSION_YEAR_CEILING,
    )

    return min(low, high), high


def _draw_semver(include_prerelease: bool) -> _Drawn:
    parts = (
        small_number(VERSION_PARTS["major"]),
        small_number(VERSION_PARTS["minor"]),
        small_number(VERSION_PARTS["patch"]),
    )
    prerelease = None

    if include_prerelease and chance(VERSION_PRERELEASE_CHANCE):
        label = pick_weighted(_PRERELEASES, lambda each: VERSION_PRERELEASES[each])
        prerelease = f"{label}.{small_number(VERSION_PARTS['prerelease'])}"

    written = ".".join(str(part) for part in parts) + (f"-{prerelease}" if prerelease else "")

    return written, "MAJOR.MINOR.PATCH", parts, prerelease, None


def _draw_calver(years: tuple[int, int]) -> _Drawn:
    scheme = pick_weighted(CALVER_SCHEMES, lambda each: each[1])[0]
    year = rand_int(years[0], years[1])
    month = rand_int(1, 12)
    parts: list[int] = []
    written: list[str] = []

    # Each token is drawn in the order it is written, so a scheme draws only the parts
    # it has.
    for token in scheme.split("."):
        if token == "YYYY":
            parts.append(year)
            written.append(str(year))
        elif token == "YY":
            parts.append(year - 2000)
            written.append(str(year - 2000))
        elif token == "MM":
            parts.append(month)
            written.append(str(month))
        elif token == "0M":
            parts.append(month)
            written.append(f"{month:02d}")
        elif token == "0D":
            day = rand_int(1, calendar.monthrange(year, month)[1])
            parts.append(day)
            written.append(f"{day:02d}")
        elif token == "MINOR":
            release = small_number(VERSION_PARTS["release"])
            parts.append(release)
            written.append(str(release))
        else:
            micro = small_number(VERSION_PARTS["micro"])
            parts.append(micro)
            written.append(str(micro))

    return ".".join(written), scheme, tuple(parts), None, year


def _draw_number() -> _Drawn:
    number = small_number(VERSION_PARTS["number"])

    return str(number), "MAJOR", (number,), None, None


def generate_version_details(
    *,
    format: object = "semver",
    prefix: object = "",
    include_prerelease: bool = False,
    min_year: object = None,
    max_year: object = None,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[VersionDetail]:
    """Generate `count` versions, applied to every option."""
    formats: tuple[VersionFormat, ...] = (
        VERSION_FORMATS if format == "all" else resolve_many(format, VERSION_FORMATS, ("semver",))
    )
    before = prefix if isinstance(prefix, str) else ""
    # `is True` rather than truthiness, the way the npm package reads it.
    with_prerelease = include_prerelease is True
    years = resolve_version_years(min_year, max_year)

    def draw() -> VersionDetail:
        chosen = pick(formats)

        if chosen == "semver":
            drawn = _draw_semver(with_prerelease)
        elif chosen == "calver":
            drawn = _draw_calver(years)
        else:
            drawn = _draw_number()

        written, scheme, parts, prerelease, year = drawn

        return VersionDetail(
            version=before + written,
            format=chosen,
            scheme=scheme,
            parts=parts,
            prerelease=prerelease,
            year=year,
        )

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.version,
        )
