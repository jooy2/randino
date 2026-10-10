"""Storage: the kind of drive a machine has, and how much it holds."""

import re
from random import Random

from randino import (
    DISK_TYPES,
    DISK_UNITS,
    RAND_COUNT_MAX,
    SYSTEM_PLATFORMS,
    DiskTypeDetail,
    DiskUnitOption,
    rand_disk_size,
    rand_disk_type,
)

# Internal, but they are what a result is checked against.
from randino._internal.capacity import fit_unit, in_unit
from randino.disk.data import DISK_SCALE, DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS

SAMPLE = 60
LARGE = 4000
GIGABYTE = 1000**3
SIZES = [size for size, _ in DISK_SCALE.pool]


def share(details: list[DiskTypeDetail], code: str) -> float:
    """The share of `details` that carry `code`, as a fraction."""
    return sum(1 for detail in details if detail.code == code) / len(details)


def test_rand_disk_type_returns_one_label_by_default() -> None:
    types = rand_disk_type()

    assert len(types) == 1
    assert isinstance(types[0], str)


def test_rand_disk_type_returns_exactly_count_labels() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_disk_type(count=count)) == count

    assert rand_disk_type(count=-3) == []
    assert len(rand_disk_type(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_kind_has_a_label_and_a_name_of_its_own_and_a_platform_that_uses_it() -> None:
    assert len({DISK_TYPE_LABELS[code][0] for code in DISK_TYPES}) == len(DISK_TYPES)
    assert len({DISK_TYPE_LABELS[code][1] for code in DISK_TYPES}) == len(DISK_TYPES)

    for code in DISK_TYPES:
        assert any(code in DISK_TYPE_WEIGHTS[platform] for platform in SYSTEM_PLATFORMS), code

    for platform in SYSTEM_PLATFORMS:
        assert sum(DISK_TYPE_WEIGHTS[platform].values()) == 100, platform


def test_the_label_is_the_one_its_code_is_written_with() -> None:
    for detail in rand_disk_type(count=SAMPLE * 3, output="detail"):
        assert (detail.disk_type, detail.name) == DISK_TYPE_LABELS[detail.code]
        assert detail.code in DISK_TYPE_WEIGHTS[detail.platform]


def test_platform_keeps_to_the_storage_of_one_kind_of_machine() -> None:
    desktop = rand_disk_type(platform="desktop", count=LARGE, output="detail")
    mobile = rand_disk_type(platform="mobile", count=LARGE, output="detail")

    assert all(detail.platform == "desktop" for detail in desktop)
    assert {detail.code for detail in mobile} == {"emmc", "ufs"}
    assert not any(detail.code == "ufs" for detail in desktop)
    assert (
        len({detail.platform for detail in rand_disk_type(count=SAMPLE * 3, output="detail")}) == 2
    )


def test_an_ssd_is_most_desktops_and_ufs_most_phones() -> None:
    desktop = rand_disk_type(platform="desktop", count=LARGE, output="detail")
    mobile = rand_disk_type(platform="mobile", count=LARGE, output="detail")

    assert share(desktop, "ssd") > 0.55
    assert share(desktop, "hdd") > share(desktop, "sshd")
    assert share(desktop, "sshd") > 0
    assert share(mobile, "ufs") > 0.6


def test_rand_disk_type_value_form_is_the_label_of_each_detail() -> None:
    values = rand_disk_type(count=SAMPLE, random=Random(7).random)
    details = rand_disk_type(count=SAMPLE, random=Random(7).random, output="detail")

    assert values == [detail.disk_type for detail in details]


def test_rand_disk_type_unique_stops_when_the_labels_run_out() -> None:
    assert sorted(rand_disk_type(platform="mobile", unique=True, count=10)) == ["UFS", "eMMC"]
    assert len(rand_disk_type(unique=True, count=10)) == len(DISK_TYPES)


def test_rand_disk_size_returns_one_size_by_default() -> None:
    sizes = rand_disk_size()

    assert len(sizes) == 1
    assert re.fullmatch(r"\d+ (GB|TB)", sizes[0])


def test_rand_disk_size_returns_exactly_count_sizes() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_disk_size(count=count)) == count

    assert rand_disk_size(count=-3) == []
    assert len(rand_disk_size(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_the_disk_pool_is_every_size_once_smallest_first() -> None:
    for i, (size, weight) in enumerate(DISK_SCALE.pool):
        assert size > 0
        assert weight > 0

        if i > 0:
            assert size > DISK_SCALE.pool[i - 1][0], f"{size} is out of order"


def test_a_disk_size_is_counted_in_powers_of_ten_in_the_largest_whole_unit() -> None:
    assert fit_unit(DISK_SCALE, 1000) == "TB"
    assert fit_unit(DISK_SCALE, 512) == "GB"
    assert in_unit(DISK_SCALE, 1000, "TB") == 1
    assert in_unit(DISK_SCALE, 500, "TB") == 0.5
    assert in_unit(DISK_SCALE, 512, "MB") == 512000

    for detail in rand_disk_size(count=LARGE, output="detail"):
        assert detail.unit == fit_unit(DISK_SCALE, detail.bytes // GIGABYTE), detail.size


def test_every_disk_size_is_one_the_pool_holds_and_the_detail_is_what_was_written() -> None:
    units: tuple[DiskUnitOption, ...] = ("auto", *DISK_UNITS)

    for unit in units:
        for detail in rand_disk_size(unit=unit, count=SAMPLE * 5, output="detail"):
            size = detail.bytes // GIGABYTE

            assert size in SIZES, detail.size
            assert detail.size == f"{detail.value} {detail.unit}"
            assert detail.value == in_unit(DISK_SCALE, size, detail.unit)


def test_a_named_disk_unit_keeps_to_the_sizes_whole_in_it() -> None:
    terabytes = rand_disk_size(unit="TB", count=LARGE, output="detail")

    assert all(detail.unit == "TB" for detail in terabytes)
    assert not any(detail.bytes == 500 * GIGABYTE for detail in terabytes)
    assert all(
        re.fullmatch(r"\d+ GB", size) for size in rand_disk_size(unit="GB", count=SAMPLE * 3)
    )
    assert not any("." in size for size in rand_disk_size(count=LARGE))


def test_a_bare_disk_size_is_in_gigabytes_throughout() -> None:
    for size in rand_disk_size(include_unit=False, count=SAMPLE * 5):
        assert re.fullmatch(r"\d+", size)
        assert int(size) in SIZES, size


def test_disk_bounds_are_read_in_the_unit_or_in_gigabytes_for_auto() -> None:
    for detail in rand_disk_size(min_size=500, max_size=2000, count=SAMPLE * 3, output="detail"):
        assert 500 <= detail.bytes // GIGABYTE <= 2000, detail.size

    for detail in rand_disk_size(unit="TB", min_size=8, count=SAMPLE * 3, output="detail"):
        assert detail.value >= 8, detail.size

    assert set(rand_disk_size(min_size=1000, max_size=1000, count=SAMPLE)) == {"1 TB"}


def test_a_disk_range_with_no_real_size_answers_with_nothing() -> None:
    assert rand_disk_size(min_size=600, max_size=900, count=5) == []
    assert rand_disk_size(min_size=100000, count=5) == []
    assert set(rand_disk_size(min_size=4000, max_size=256, count=SAMPLE)) == {"256 GB"}


def test_a_disk_bound_need_not_be_whole_and_is_not_rounded() -> None:
    # Floored, 1.5 TB read as 1 TB and let a 1 TB drive in under it.
    assert set(rand_disk_size(unit="TB", min_size=1.5, max_size=2.5, count=SAMPLE)) == {"2 TB"}


def test_256_gb_512_gb_and_1_tb_are_the_most_common() -> None:
    drives = rand_disk_size(count=LARGE)

    def share(size: str) -> float:
        return drives.count(size) / len(drives)

    assert share("256 GB") + share("512 GB") + share("1 TB") > 0.35
    assert share("1 TB") > share("8 TB")
    assert share("24 TB") < 0.01


def test_rand_disk_size_value_form_is_the_size_of_each_detail() -> None:
    values = rand_disk_size(count=SAMPLE, random=Random(7).random)
    details = rand_disk_size(count=SAMPLE, random=Random(7).random, output="detail")

    assert values == [detail.size for detail in details]


def test_rand_disk_size_unique_stops_when_the_sizes_run_out() -> None:
    drives = rand_disk_size(min_size=256, max_size=2000, unique=True, count=100)

    assert len(set(drives)) == len(drives)
    assert set(drives) == {"256 GB", "480 GB", "500 GB", "512 GB", "1 TB", "2 TB"}
