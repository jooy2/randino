"""The formats a version is numbered in, and the ranges each part is drawn from."""

from randino._types import VersionFormat

VERSION_FORMATS: tuple[VersionFormat, ...] = ("semver", "calver", "number")
"""Every format, in the order the npm package lists them."""

VERSION_PARTS: dict[str, tuple[int, int]] = {
    "major": (0, 20),
    "minor": (0, 30),
    "patch": (0, 30),
    "number": (1, 150),
    "release": (1, 4),
    "micro": (1, 9),
    "prerelease": (1, 9),
}
"""The lowest and highest number each part of a version is drawn from.

A part is drawn with the small numbers most often — a number is about twice as likely as
the one twice as far from the bottom — so `0.x` and `x.y.0` are common and `18.27.30` is
rare, the way they are in a registry. `number` is a version that is one number, the way a
browser's is; `release` and `micro` are a calendar version's, counted within its year or
month.
"""

VERSION_PRERELEASES: dict[str, float] = {"alpha": 30, "beta": 35, "rc": 35}
"""The pre-release labels a semantic version is given, and how often each one."""

VERSION_PRERELEASE_CHANCE = 25
"""The percentage of semantic versions given a pre-release under `include_prerelease`."""

CALVER_SCHEMES: tuple[tuple[str, float], ...] = (
    ("YYYY.MINOR", 25),
    ("YYYY.MM.MICRO", 25),
    ("YY.0M", 20),
    ("YY.0M.MICRO", 15),
    ("YYYY.0M.0D", 15),
)
"""The calendar schemes, in CalVer's notation, and how often each one comes up.

A year and a release within it (`2024.2`), a year, month and fix (`2024.3.1`), a short
year and zero-padded month (`24.04`) with or without a fix, and a whole date
(`2024.03.15`). `MINOR` here is the release within a year, never a semantic version's
minor.
"""

VERSION_YEAR_MIN_DEFAULT = 2010
"""The earliest year a calendar version is drawn from when the caller names none."""

VERSION_YEAR_MAX_DEFAULT = 2026
"""The latest year a calendar version is drawn from when the caller names none."""

VERSION_YEAR_FLOOR = 2000
"""The earliest year a calendar version may be counted from; its short year is the year less 2000."""

VERSION_YEAR_CEILING = 2099
"""The latest year a calendar version may be counted from."""
