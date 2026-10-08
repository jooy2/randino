"""Processors: real parts, by the names their makers gave them."""

from random import Random

from randino import CPU_VENDORS, RAND_COUNT_MAX, SYSTEM_PLATFORMS, rand_cpu

# Internal, but they are what a result is checked against.
from randino.cpu._generator import write_cpu
from randino.cpu.data import CPUS

SAMPLE = 60


def test_rand_cpu_returns_one_processor_by_default() -> None:
    cpus = rand_cpu()

    assert len(cpus) == 1
    assert isinstance(cpus[0], str)


def test_returns_exactly_count_processors() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_cpu(count=count)) == count

    assert rand_cpu(count=-3) == []
    assert len(rand_cpu(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_processor_in_the_catalog_is_well_formed() -> None:
    seen: set[str] = set()

    for entry in CPUS:
        key = f"{entry.vendor} {entry.model}"

        assert key not in seen, f"{key} is listed twice"
        seen.add(key)
        assert entry.platform in SYSTEM_PLATFORMS, key
        assert 2000 <= entry.year <= 2025, key
        assert not entry.model.startswith(entry.vendor), key

    for platform in SYSTEM_PLATFORMS:
        assert sum(1 for entry in CPUS if entry.platform == platform) >= 60, platform


def test_every_processor_is_one_the_catalog_holds_written_as_its_detail_says() -> None:
    for detail in rand_cpu(count=SAMPLE * 5, output="detail"):
        entry = next(
            each for each in CPUS if each.vendor == detail.vendor and each.model == detail.model
        )

        assert detail.cpu == write_cpu(entry, True)
        assert detail.cpu == f"{detail.vendor} {detail.model}"
        assert detail.platform == entry.platform
        assert detail.year == entry.year

    for detail in rand_cpu(include_vendor=False, count=SAMPLE * 3, output="detail"):
        assert detail.cpu == detail.model


def test_platform_keeps_to_the_processors_of_one_kind_of_machine() -> None:
    for platform in SYSTEM_PLATFORMS:
        details = rand_cpu(platform=platform, count=SAMPLE * 3, output="detail")

        assert all(detail.platform == platform for detail in details)

    both = {detail.platform for detail in rand_cpu(count=SAMPLE * 3, output="detail")}

    assert len(both) == len(SYSTEM_PLATFORMS)


def test_a_year_range_keeps_to_the_processors_out_in_it() -> None:
    for detail in rand_cpu(min_year=2015, max_year=2018, count=SAMPLE * 3, output="detail"):
        assert 2015 <= detail.year <= 2018, detail.cpu

    as_of = rand_cpu(platform="desktop", max_year=2010, unique=True, count=100)

    assert "Intel Core i7-920" in as_of
    assert "Intel Core i5-2500K" not in as_of


def test_a_year_range_nothing_came_out_in_answers_with_nothing() -> None:
    assert rand_cpu(max_year=1999, count=5) == []
    assert rand_cpu(min_year=2030, count=5) == []
    # The first phone chip in the catalog is the 2010 Apple A4.
    assert rand_cpu(platform="mobile", max_year=2009) == []

    for detail in rand_cpu(min_year=2024, max_year=2016, count=SAMPLE, output="detail"):
        assert detail.year == 2016, detail.cpu


def test_the_value_form_is_the_processor_of_each_detail() -> None:
    values = rand_cpu(count=SAMPLE, random=Random(7).random)
    details = rand_cpu(count=SAMPLE, random=Random(7).random, output="detail")

    assert values == [detail.cpu for detail in details]


def test_unique_never_repeats_a_processor_and_stops_when_the_processors_run_out() -> None:
    expected = {
        write_cpu(entry, True)
        for entry in CPUS
        if entry.platform == "mobile" and entry.year == 2025
    }
    found = rand_cpu(platform="mobile", min_year=2025, unique=True, count=100)

    assert len(set(found)) == len(found)
    assert set(found) == expected


def test_vendor_keeps_to_the_makers_named_and_lists_every_maker_the_catalog_holds() -> None:
    assert {entry.vendor for entry in CPUS} == set(CPU_VENDORS)

    for vendor in CPU_VENDORS:
        details = rand_cpu(vendor=vendor, count=SAMPLE, output="detail")

        assert all(detail.vendor == vendor for detail in details), vendor

    two = rand_cpu(vendor=("Intel", "Apple"), count=SAMPLE, output="detail")

    assert all(detail.vendor in ("Intel", "Apple") for detail in two)


def test_a_maker_with_no_part_on_the_platform_asked_for_is_answered_with_nothing() -> None:
    assert rand_cpu(vendor="MediaTek", platform="desktop", count=5) == []
    assert rand_cpu(vendor="Intel", platform="mobile", count=5) == []
