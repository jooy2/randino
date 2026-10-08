"""Resolutions: the screen sizes people really have, the common ones most often."""

import re
from random import Random

from randino import RAND_COUNT_MAX, SYSTEM_PLATFORMS, rand_resolution

# Internal, but it is what a result is checked against.
from randino.resolution.data import RESOLUTIONS

SAMPLE = 60
LARGE = 6000


def test_rand_resolution_returns_one_resolution_by_default() -> None:
    resolutions = rand_resolution()

    assert len(resolutions) == 1
    assert re.fullmatch(r"\d+x\d+", resolutions[0])


def test_returns_exactly_count_resolutions() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_resolution(count=count)) == count

    assert rand_resolution(count=-3) == []
    assert len(rand_resolution(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_size_is_listed_once_and_each_platforms_weights_add_up_to_a_hundred() -> None:
    seen: set[str] = set()

    for entry in RESOLUTIONS:
        key = f"{entry.platform} {entry.width}x{entry.height}"

        assert key not in seen, f"{key} is listed twice"
        seen.add(key)
        assert entry.platform in SYSTEM_PLATFORMS, key
        assert entry.weight > 0, key

    for platform in SYSTEM_PLATFORMS:
        total = sum(entry.weight for entry in RESOLUTIONS if entry.platform == platform)

        assert total == 100, platform


def test_every_resolution_is_one_the_table_holds_and_its_detail_is_the_two_numbers() -> None:
    sizes = {(entry.platform, entry.width, entry.height) for entry in RESOLUTIONS}

    for detail in rand_resolution(count=SAMPLE * 5, output="detail"):
        assert (detail.platform, detail.width, detail.height) in sizes, detail.resolution
        assert detail.resolution == f"{detail.width}x{detail.height}"


def test_a_desktop_is_wider_than_it_is_tall_and_a_phone_is_written_portrait() -> None:
    for detail in rand_resolution(platform="desktop", count=SAMPLE * 3, output="detail"):
        assert detail.width > detail.height, detail.resolution

    for detail in rand_resolution(platform="mobile", count=SAMPLE * 3, output="detail"):
        assert detail.width < detail.height, detail.resolution


def test_platform_keeps_to_one_kind_of_machine_and_all_draws_both_evenly() -> None:
    for platform in SYSTEM_PLATFORMS:
        details = rand_resolution(platform=platform, count=SAMPLE, output="detail")

        assert all(detail.platform == platform for detail in details)

    details = rand_resolution(count=LARGE, output="detail")
    desktop = sum(detail.platform == "desktop" for detail in details) / len(details)

    assert 0.45 < desktop < 0.55


def test_1920x1080_is_the_most_common_desktop_and_the_rare_sizes_rare() -> None:
    desktops = rand_resolution(platform="desktop", count=LARGE)

    def share(size: str) -> float:
        return desktops.count(size) / len(desktops)

    assert share("1920x1080") > 0.2
    assert share("1920x1080") > share("1366x768")
    assert share("1024x768") < 0.03


def test_separator_replaces_the_x() -> None:
    for resolution in rand_resolution(separator=" × ", count=SAMPLE):
        assert re.fullmatch(r"\d+ × \d+", resolution), resolution

    assert all(re.fullmatch(r"\d+", each) for each in rand_resolution(separator="", count=SAMPLE))


def test_the_value_form_is_the_resolution_of_each_detail() -> None:
    values = rand_resolution(count=SAMPLE, random=Random(7).random)
    details = rand_resolution(count=SAMPLE, random=Random(7).random, output="detail")

    assert values == [detail.resolution for detail in details]


def test_unique_never_repeats_a_resolution() -> None:
    found = rand_resolution(platform="desktop", unique=True, count=100)

    assert len(set(found)) == len(found)
    assert len(found) > 15
