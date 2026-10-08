"""Storage: the kind of drive a machine has, and how much it holds."""

from random import Random

from randino import DISK_TYPES, RAND_COUNT_MAX, SYSTEM_PLATFORMS, DiskTypeDetail, rand_disk_type

# Internal, but they are what a result is checked against.
from randino.disk.data import DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS

SAMPLE = 60
LARGE = 4000


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
