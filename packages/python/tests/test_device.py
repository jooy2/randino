"""Devices: real phones, tablets and laptops, by the names their makers gave them."""

from random import Random

from randino import DEVICE_TYPES, RAND_COUNT_MAX, rand_device

# Internal, but they are what a result is checked against.
from randino.device._generator import write_device
from randino.device.data import DEVICES

SAMPLE = 60


def test_rand_device_returns_one_device_by_default() -> None:
    devices = rand_device()

    assert len(devices) == 1
    assert isinstance(devices[0], str)


def test_returns_exactly_count_devices() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_device(count=count)) == count

    assert rand_device(count=-3) == []
    assert len(rand_device(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_device_in_the_catalog_is_well_formed() -> None:
    seen: set[str] = set()

    for entry in DEVICES:
        key = f"{entry.vendor} {entry.model}"

        assert key not in seen, f"{key} is listed twice"
        seen.add(key)
        assert entry.type in DEVICE_TYPES, key
        assert 2007 <= entry.year <= 2025, key
        assert entry.vendor and entry.model, key
        assert entry.model == entry.model.strip(), key

    for kind in DEVICE_TYPES:
        assert sum(1 for entry in DEVICES if entry.type == kind) >= 40, kind


def test_every_device_is_one_the_catalog_holds_written_as_its_detail_says() -> None:
    for detail in rand_device(count=SAMPLE * 5, output="detail"):
        entry = next(
            each for each in DEVICES if each.vendor == detail.vendor and each.model == detail.model
        )

        assert detail.device == write_device(entry, True)
        assert detail.type == entry.type
        assert detail.year == entry.year


def test_the_maker_is_written_once_and_left_out_when_asked() -> None:
    for detail in rand_device(count=SAMPLE * 5, output="detail"):
        assert detail.device.startswith(detail.vendor), detail.device
        assert not detail.device.startswith(f"{detail.vendor} {detail.vendor}"), detail.device

    for detail in rand_device(include_vendor=False, count=SAMPLE * 5, output="detail"):
        assert detail.device == detail.model

    # A model that opens on its maker's name is the same either way.
    xiaomi = next(entry for entry in DEVICES if entry.model == "Xiaomi 14")

    assert write_device(xiaomi, True) == "Xiaomi 14"
    assert write_device(xiaomi, False) == "Xiaomi 14"


def test_type_keeps_to_one_kind_of_device_or_to_the_kinds_named() -> None:
    for kind in DEVICE_TYPES:
        details = rand_device(type=kind, count=SAMPLE, output="detail")

        assert all(detail.type == kind for detail in details)

    mobile = {
        detail.type
        for detail in rand_device(type=("phone", "tablet"), count=SAMPLE * 3, output="detail")
    }

    assert mobile == {"phone", "tablet"}

    every = {detail.type for detail in rand_device(count=SAMPLE * 5, output="detail")}

    assert len(every) == len(DEVICE_TYPES)


def test_a_year_range_keeps_to_the_devices_released_in_it() -> None:
    for detail in rand_device(min_year=2015, max_year=2018, count=SAMPLE * 3, output="detail"):
        assert 2015 <= detail.year <= 2018, detail.device

    as_of = rand_device(type="phone", max_year=2010, unique=True, count=100, include_vendor=False)

    assert "iPhone" in as_of
    assert "iPhone 4S" not in as_of


def test_a_year_range_nothing_came_out_in_answers_with_nothing() -> None:
    assert rand_device(max_year=2000, count=5) == []
    assert rand_device(min_year=2030, count=5) == []
    # The first laptop in the catalog is the 2008 MacBook Air.
    assert rand_device(type="laptop", max_year=2007) == []


def test_a_year_range_the_wrong_way_round_keeps_max_year() -> None:
    for detail in rand_device(min_year=2024, max_year=2016, count=SAMPLE, output="detail"):
        assert detail.year == 2016, detail.device


def test_the_value_form_is_the_device_of_each_detail() -> None:
    values = rand_device(count=SAMPLE, random=Random(7).random)
    details = rand_device(count=SAMPLE, random=Random(7).random, output="detail")

    assert values == [detail.device for detail in details]


def test_unique_never_repeats_a_device_and_stops_when_the_devices_run_out() -> None:
    expected = {
        write_device(entry, True)
        for entry in DEVICES
        if entry.type == "laptop" and entry.year == 2025
    }
    found = rand_device(type="laptop", min_year=2025, unique=True, count=100)

    assert len(set(found)) == len(found)
    assert set(found) == expected
