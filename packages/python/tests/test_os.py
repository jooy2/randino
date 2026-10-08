"""Operating systems: real releases, written at the level the caller asked for."""

from random import Random

from randino import RAND_COUNT_MAX, SYSTEM_PLATFORMS, OsDetail, rand_os

# Internal, but they are what a result is checked against.
from randino.os._generator import write_os
from randino.os.data import OS_FAMILIES, OS_RELEASES, OsBuild

SAMPLE = 60

LARGE = 4000
"""Large enough that a line weighted at three in a hundred still shows up."""


def every_writing() -> set[str]:
    """Every string a release can be written as, with every build and edition it has."""
    written: set[str] = set()

    for release in OS_RELEASES:
        written.add(release.name)
        builds: tuple[OsBuild | None, ...] = (None, *release.builds)
        editions: tuple[str | None, ...] = (None, *release.editions)

        for build in builds:
            for edition in editions:
                written.add(write_os(release, build, edition))

    return written


def test_rand_os_returns_one_system_by_default() -> None:
    systems = rand_os()

    assert len(systems) == 1
    assert isinstance(systems[0], str)


def test_returns_exactly_count_systems() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_os(count=count)) == count

    assert rand_os(count=-3) == []
    assert len(rand_os(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_release_is_well_formed() -> None:
    seen: set[str] = set()

    for release in OS_RELEASES:
        key = f"{release.family} {release.version}"

        assert key not in seen, f"{key} is listed twice"
        seen.add(key)
        assert release.family in OS_FAMILIES, key
        assert "{v}" in release.template, key
        assert 1995 <= release.year <= 2026, key
        # An edition needs somewhere to go, and a place for one needs editions.
        assert ("{e}" in release.template) == bool(release.editions), key

        last = release.year

        for build in release.builds:
            assert build.year >= last, f"{key} {build.text}"
            last = build.year

    for family in OS_FAMILIES:
        assert any(release.family == family for release in OS_RELEASES), family


def test_every_system_is_one_the_catalog_writes() -> None:
    written = every_writing()

    for system in [
        *rand_os(count=SAMPLE * 5),
        *rand_os(include_build=True, count=SAMPLE * 5),
        *rand_os(include_edition=True, count=SAMPLE * 5),
        *rand_os(include_build=True, include_edition=True, count=SAMPLE * 5),
        *rand_os(include_version=False, count=SAMPLE * 5),
    ]:
        assert system in written, system


def test_the_detail_is_what_the_value_was_written_from() -> None:
    for detail in rand_os(
        include_build=True, include_edition=True, count=SAMPLE * 5, output="detail"
    ):
        release = next(
            each
            for each in OS_RELEASES
            if each.name == detail.name and each.version == detail.version
        )
        build = next((each for each in release.builds if each.text == detail.build), None)

        assert detail.platform == OS_FAMILIES[release.family].platform
        assert (build is None) == (detail.build is None), detail.os
        # A release with builds always writes one when asked.
        assert (detail.build is not None) == bool(release.builds), detail.os
        assert (detail.edition is not None) == bool(release.editions), detail.os
        assert detail.os == write_os(release, build, detail.edition)
        assert detail.year == (build.year if build is not None else release.year)


def test_the_version_the_build_and_the_edition_are_left_out_unless_asked_for() -> None:
    for detail in rand_os(count=SAMPLE * 5, output="detail"):
        assert detail.build is None
        assert detail.edition is None
        assert detail.version is not None

    # Without a version there is nothing for a build or an edition to belong to.
    for detail in rand_os(
        include_version=False,
        include_build=True,
        include_edition=True,
        count=SAMPLE,
        output="detail",
    ):
        assert detail.os == detail.name
        assert detail.version is None
        assert detail.build is None
        assert detail.edition is None


def test_platform_keeps_to_the_systems_of_one_kind_of_machine() -> None:
    for platform in SYSTEM_PLATFORMS:
        details = rand_os(platform=platform, count=SAMPLE * 3, output="detail")

        assert all(detail.platform == platform for detail in details)

    both = {detail.platform for detail in rand_os(count=SAMPLE * 3, output="detail")}

    assert len(both) == len(SYSTEM_PLATFORMS)


def test_a_year_range_keeps_to_the_releases_out_in_it() -> None:
    for detail in rand_os(min_year=2010, max_year=2015, count=SAMPLE * 3, output="detail"):
        assert 2010 <= detail.year <= 2015, detail.os

    # As of 2015: no Windows 11, and Windows 10 at no feature update after 1511.
    as_of = rand_os(max_year=2015, platform="desktop", count=LARGE, include_build=True)

    assert not any(system.startswith("Windows 11") for system in as_of)
    assert any(system.startswith("Windows 10") for system in as_of)
    assert not any(system.startswith("Windows 10 1607") for system in as_of)


def test_with_include_build_the_year_is_the_builds_without_it_the_releases() -> None:
    # Windows 10 came out in 2015, and its 22H2 update in 2022.
    released = rand_os(min_year=2022, count=LARGE, platform="desktop")
    built = rand_os(min_year=2022, count=LARGE, platform="desktop", include_build=True)

    assert "Windows 10" not in released
    assert "Windows 10 22H2 (Build 19045)" in built


def test_a_year_range_nothing_came_out_in_answers_with_nothing() -> None:
    assert rand_os(max_year=1990, count=5) == []
    assert rand_os(min_year=2030, count=5) == []
    # The first iPhone OS is 2007, so mobile before it has nothing.
    assert rand_os(platform="mobile", max_year=2006) == []


def test_a_year_range_the_wrong_way_round_keeps_max_year() -> None:
    for detail in rand_os(min_year=2020, max_year=2005, count=SAMPLE, output="detail"):
        assert detail.year == 2005, detail.os


def test_windows_is_most_of_the_desktop_and_android_most_of_mobile() -> None:
    def share(details: list[OsDetail], name: str) -> float:
        return sum(1 for detail in details if detail.name == name) / len(details)

    desktop = rand_os(platform="desktop", count=LARGE, output="detail")
    mobile = rand_os(platform="mobile", count=LARGE, output="detail")

    assert share(desktop, "Windows") > 0.55
    assert share(mobile, "Android") > 0.52
    assert share(desktop, "Debian") > 0


def test_the_value_form_is_the_os_of_each_detail() -> None:
    values = rand_os(
        include_build=True, include_edition=True, count=SAMPLE, random=Random(7).random
    )
    details = rand_os(
        include_build=True,
        include_edition=True,
        count=SAMPLE,
        random=Random(7).random,
        output="detail",
    )

    assert values == [detail.os for detail in details]


def test_unique_never_repeats_a_system_and_stops_when_the_systems_run_out() -> None:
    names = rand_os(include_version=False, unique=True, count=100)

    assert len(set(names)) == len(names)
    assert set(names) == {release.name for release in OS_RELEASES}
