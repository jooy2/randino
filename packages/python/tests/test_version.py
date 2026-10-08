"""Versions: numbers in one of three schemes, the small numbers most often."""

import calendar
import re
from random import Random

from randino import RAND_COUNT_MAX, VERSION_FORMATS, rand_version

# Internal, but they are what a result is checked against.
from randino.version.data import CALVER_SCHEMES, VERSION_PARTS, VERSION_PRERELEASES

SAMPLE = 60
LARGE = 6000
SEMVER = re.compile(r"(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?")


def inside(value: int, span: tuple[int, int]) -> bool:
    return span[0] <= value <= span[1]


def test_rand_version_returns_one_semantic_version_by_default() -> None:
    versions = rand_version()

    assert len(versions) == 1
    assert re.fullmatch(r"\d+\.\d+\.\d+", versions[0])


def test_returns_exactly_count_versions() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_version(count=count)) == count

    assert rand_version(count=-3) == []
    assert len(rand_version(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_a_semantic_version_keeps_every_part_inside_its_range() -> None:
    for detail in rand_version(count=SAMPLE * 5, output="detail"):
        major, minor, patch = detail.parts

        assert detail.format == "semver"
        assert detail.scheme == "MAJOR.MINOR.PATCH"
        assert detail.version == ".".join(str(part) for part in detail.parts)
        assert inside(major, VERSION_PARTS["major"])
        assert inside(minor, VERSION_PARTS["minor"])
        assert inside(patch, VERSION_PARTS["patch"])
        assert detail.prerelease is None
        assert detail.year is None


def test_the_small_numbers_come_up_most_often() -> None:
    details = rand_version(count=LARGE, output="detail")

    def share(index: int, value: int) -> float:
        return sum(detail.parts[index] == value for detail in details) / len(details)

    assert share(2, 0) > 0.18
    assert share(2, 0) > share(2, 1)
    assert share(2, 1) > share(2, 10)
    assert share(0, 20) < 0.03


def test_a_calendar_version_is_written_by_its_scheme_and_its_year_is_in_range() -> None:
    schemes = {scheme for scheme, _ in CALVER_SCHEMES}

    for detail in rand_version(format="calver", count=SAMPLE * 5, output="detail"):
        assert detail.format == "calver"
        assert detail.scheme in schemes
        assert detail.year is not None
        assert 2010 <= detail.year <= 2026

        tokens = detail.scheme.split(".")
        written = detail.version.split(".")

        assert len(written) == len(tokens), detail.version
        assert tuple(int(each) for each in written) == detail.parts

        for index, token in enumerate(tokens):
            if token == "YYYY":
                assert detail.parts[index] == detail.year
            if token == "YY":
                assert detail.parts[index] == detail.year - 2000
            if token in ("0M", "0D"):
                assert re.fullmatch(r"\d\d", written[index])
            if token in ("MM", "0M"):
                assert 1 <= detail.parts[index] <= 12

        if detail.scheme == "YYYY.0M.0D":
            year, month, day = detail.parts

            assert day <= calendar.monthrange(year, month)[1], f"{detail.version} is a real day"


def test_min_year_and_max_year_keep_a_calendar_version_inside_them() -> None:
    def years(**options: int) -> list[int | None]:
        details = rand_version(format="calver", count=SAMPLE, output="detail", **options)  # type: ignore[call-overload]

        return [detail.year for detail in details]

    assert all(2019 <= (year or 0) <= 2021 for year in years(min_year=2019, max_year=2021))
    assert set(years(min_year=2040)) == {2040}, "a bound left out moves aside"
    assert set(years(min_year=2024, max_year=2015)) == {2015}, "the wrong way round keeps max"
    assert all(2000 <= (year or 0) <= 2099 for year in years(min_year=1990, max_year=3000))


def test_a_single_number_version_keeps_inside_its_range() -> None:
    for detail in rand_version(format="number", count=SAMPLE * 5, output="detail"):
        assert detail.scheme == "MAJOR"
        assert detail.version == str(detail.parts[0])
        assert inside(detail.parts[0], VERSION_PARTS["number"])


def test_several_formats_or_all_of_them_are_drawn_evenly() -> None:
    details = rand_version(format="all", count=LARGE, output="detail")

    for format_ in VERSION_FORMATS:
        share = sum(detail.format == format_ for detail in details) / len(details)

        assert 0.28 < share < 0.39, format_

    two = rand_version(format=("calver", "number"), count=SAMPLE, output="detail")

    assert all(detail.format != "semver" for detail in two)


def test_include_prerelease_gives_about_one_semantic_version_in_four_a_prerelease() -> None:
    details = rand_version(include_prerelease=True, count=LARGE, output="detail")
    marked = sum(detail.prerelease is not None for detail in details) / len(details)

    assert 0.2 < marked < 0.3

    for detail in details:
        assert SEMVER.fullmatch(detail.version), detail.version

        if detail.prerelease:
            label, number = detail.prerelease.split(".")

            assert label in VERSION_PRERELEASES
            assert 1 <= int(number) <= 9
            assert detail.version.endswith(f"-{detail.prerelease}")

    calver = rand_version(format="calver", include_prerelease=True, count=SAMPLE, output="detail")

    assert all(detail.prerelease is None for detail in calver)


def test_prefix_is_written_in_front_of_every_version() -> None:
    for version in rand_version(format="all", prefix="v", count=SAMPLE):
        assert re.match(r"v\d", version)


def test_the_value_form_is_the_version_of_each_detail() -> None:
    values = rand_version(format="all", count=SAMPLE, random=Random(7).random)
    details = rand_version(format="all", count=SAMPLE, random=Random(7).random, output="detail")

    assert values == [detail.version for detail in details]


def test_unique_never_repeats_a_version() -> None:
    found = rand_version(format="number", unique=True, count=100)

    assert len(set(found)) == len(found)
    assert len(found) > 25
