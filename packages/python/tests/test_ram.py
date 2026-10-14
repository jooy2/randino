"""Memory: real sizes, written in a unit each one is a whole number of."""

import re
from random import Random

from randino import (
    RAM_TYPES,
    RAM_UNITS,
    RAND_COUNT_MAX,
    SYSTEM_PLATFORMS,
    RamDetail,
    RamUnitOption,
    rand_ram,
)

# Internal, but they are what a result is checked against.
from randino._internal.capacity import fit_unit, in_unit
from randino.ram.data import RAM_SCALE, RAM_SIZES, RAM_TYPE_ENTRIES, RamTypeEntry

SAMPLE = 60
LARGE = 4000
MEGABYTE = 1024 * 1024
GIGABYTE = 1024
SIZES = {size for platform in SYSTEM_PLATFORMS for size, _ in RAM_SIZES[platform]}
"""Every size either platform is sold with."""


def entry_of(detail: RamDetail) -> RamTypeEntry | None:
    """The entry `detail` says its memory is."""
    return next(
        (
            entry
            for entry in RAM_TYPE_ENTRIES
            if entry.type == detail.type and entry.platform == detail.platform
        ),
        None,
    )


def test_rand_ram_returns_one_size_by_default() -> None:
    ram = rand_ram()

    assert len(ram) == 1
    assert re.fullmatch(r"\d+ (MB|GB)", ram[0])


def test_returns_exactly_count_sizes() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_ram(count=count)) == count

    assert rand_ram(count=-3) == []
    assert len(rand_ram(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_each_pool_is_every_size_once_smallest_first() -> None:
    for platform in SYSTEM_PLATFORMS:
        pool = RAM_SIZES[platform]

        for i, (size, weight) in enumerate(pool):
            assert isinstance(size, int) and size > 0, f"{platform} {size}"
            assert weight > 0, f"{platform} {size}"

            if i > 0:
                assert size > pool[i - 1][0], f"{platform} {size} is out of order"

    # A phone's memory stops at 24 GB.
    assert RAM_SIZES["mobile"][-1][0] == 24 * GIGABYTE


def test_every_kind_of_memory_is_described_once_per_platform_at_sizes_it_is_sold_with() -> None:
    seen: set[str] = set()

    for entry in RAM_TYPE_ENTRIES:
        key = f"{entry.type} {entry.platform}"
        pool = [size for size, _ in RAM_SIZES[entry.platform]]

        assert key not in seen, f"{key} is listed twice"
        seen.add(key)
        assert entry.type in RAM_TYPES, key
        assert 2000 <= entry.first_year <= 2026, key
        assert entry.last_year is None or entry.first_year <= entry.last_year <= 2026, key
        assert entry.weight > 0, key
        assert entry.sizes, key

        for i, each in enumerate(entry.sizes):
            assert each.size in pool, f"{key} at {each.size} MB"
            # A size comes no earlier than its kind, and inside the years it was sold.
            last = 2026 if entry.last_year is None else entry.last_year
            assert entry.first_year <= each.first_year <= last, f"{key} at {each.size} MB"

            if i > 0:
                assert each.size > entry.sizes[i - 1].size, f"{key} is out of order"

    for kind in RAM_TYPES:
        assert any(entry.type == kind for entry in RAM_TYPE_ENTRIES), kind

    for platform in SYSTEM_PLATFORMS:
        entries = [entry for entry in RAM_TYPE_ENTRIES if entry.platform == platform]

        assert sum(entry.weight for entry in entries) == 100, platform

        # Every size a platform is sold with is one some kind of memory came in.
        for size, _ in RAM_SIZES[platform]:
            assert any(each.size == size for entry in entries for each in entry.sizes), (
                f"{platform} {size} MB"
            )

    # Only a desktop or a laptop is sold with DDR memory.
    assert all(
        entry.type.startswith("LPDDR") for entry in RAM_TYPE_ENTRIES if entry.platform == "mobile"
    )


def test_a_size_is_written_in_the_largest_unit_it_is_a_whole_number_of() -> None:
    assert fit_unit(RAM_SCALE, 512) == "MB"
    assert fit_unit(RAM_SCALE, 16384) == "GB"
    assert in_unit(RAM_SCALE, 16384, "GB") == 16
    assert in_unit(RAM_SCALE, 512, "GB") == 0.5

    for detail in rand_ram(count=LARGE, output="detail"):
        assert detail.unit == fit_unit(RAM_SCALE, detail.bytes // MEGABYTE), detail.ram


def test_every_size_is_one_the_pool_holds_and_the_detail_is_what_was_written() -> None:
    units: tuple[RamUnitOption, ...] = ("auto", *RAM_UNITS)

    for unit in units:
        for detail in rand_ram(unit=unit, count=SAMPLE * 5, output="detail"):
            size = detail.bytes // MEGABYTE

            assert any(each == size for each, _ in RAM_SIZES[detail.platform]), detail.ram
            assert detail.ram == f"{detail.value} {detail.unit}"
            assert detail.value == in_unit(RAM_SCALE, size, detail.unit)


def test_a_named_unit_keeps_to_the_sizes_whole_in_it_and_never_writes_a_decimal_point() -> None:
    gigabytes = rand_ram(unit="GB", count=LARGE, output="detail")

    assert all(detail.unit == "GB" for detail in gigabytes)
    assert not any(detail.bytes == 512 * MEGABYTE for detail in gigabytes)
    assert all(re.fullmatch(r"\d+ MB", ram) for ram in rand_ram(unit="MB", count=SAMPLE * 3))
    assert not any("." in ram for ram in rand_ram(count=LARGE))


def test_include_unit_false_writes_the_number_alone_in_one_unit_throughout() -> None:
    for ram in rand_ram(include_unit=False, count=SAMPLE * 5):
        assert re.fullmatch(r"\d+", ram)
        # In gigabytes throughout, so every bare number is a size in gigabytes.
        assert int(ram) * 1024 in SIZES, ram

    assert all(int(ram) >= 512 for ram in rand_ram(unit="MB", include_unit=False, count=SAMPLE))


def test_min_size_and_max_size_are_read_in_the_unit_or_in_gigabytes_for_auto() -> None:
    for detail in rand_ram(min_size=8, max_size=32, count=SAMPLE * 3, output="detail"):
        assert 8 <= detail.bytes // MEGABYTE // 1024 <= 32, detail.ram

    for detail in rand_ram(unit="MB", max_size=4096, count=SAMPLE * 3, output="detail"):
        assert detail.value <= 4096, detail.ram

    # Both ends are included.
    assert set(rand_ram(min_size=16, max_size=16, count=SAMPLE)) == {"16 GB"}


def test_a_range_no_real_size_is_inside_answers_with_nothing() -> None:
    assert rand_ram(min_size=5, max_size=5, count=5) == []
    assert rand_ram(min_size=5000, count=5) == []


def test_a_bound_need_not_be_whole_and_is_not_rounded() -> None:
    # Half a gigabyte is 512 MB, which is in range; floored, it was 0 GB.
    assert set(rand_ram(max_size=0.5, count=SAMPLE)) == {"512 MB"}
    assert rand_ram(min_size=0.6, max_size=0.9, count=5) == []


def test_a_range_the_wrong_way_round_keeps_max_size() -> None:
    assert set(rand_ram(min_size=64, max_size=8, count=SAMPLE)) == {"8 GB"}


def test_8_and_16_gb_are_the_most_common_and_the_largest_sizes_rare() -> None:
    ram = rand_ram(count=LARGE)

    def share(size: str) -> float:
        return ram.count(size) / len(ram)

    assert share("8 GB") + share("16 GB") > 0.3
    assert share("8 GB") > share("32 GB")
    assert share("1024 GB") < 0.01


def test_the_value_form_is_the_size_of_each_detail() -> None:
    values = rand_ram(count=SAMPLE, random=Random(7).random)
    details = rand_ram(count=SAMPLE, random=Random(7).random, output="detail")

    assert values == [detail.ram for detail in details]


def test_the_kind_of_memory_is_one_sold_at_that_size_on_that_platform() -> None:
    for detail in rand_ram(count=LARGE, output="detail"):
        entry = entry_of(detail)

        assert entry is not None, f"{detail.ram} {detail.type} {detail.platform}"
        assert any(each.size == detail.bytes // MEGABYTE for each in entry.sizes), (
            f"{detail.ram} {detail.type}"
        )


def test_platform_keeps_to_the_memory_of_one_kind_of_machine() -> None:
    mobile = rand_ram(platform="mobile", count=LARGE, output="detail")

    assert all(detail.platform == "mobile" for detail in mobile)
    assert all(detail.type.startswith("LPDDR") for detail in mobile)
    assert all(detail.bytes <= 24 * GIGABYTE * MEGABYTE for detail in mobile)

    desktop = rand_ram(platform="desktop", count=SAMPLE * 3, output="detail")

    assert all(detail.platform == "desktop" for detail in desktop)

    both = {detail.platform for detail in rand_ram(count=SAMPLE * 3, output="detail")}

    assert len(both) == len(SYSTEM_PLATFORMS)


def test_a_year_range_keeps_to_the_kinds_of_memory_sold_in_it() -> None:
    old = rand_ram(platform="desktop", max_year=2005, count=SAMPLE * 5, output="detail")

    assert {detail.type for detail in old} == {"DDR", "DDR2"}
    assert all(detail.bytes <= 8 * GIGABYTE * MEGABYTE for detail in old)

    for detail in rand_ram(min_year=2024, count=LARGE, output="detail"):
        entry = entry_of(detail)

        assert entry is not None
        assert entry.last_year is None or entry.last_year >= 2024, (
            f"{detail.type} {detail.platform}"
        )

    # No phone was sold with 512 MB before 2010, and nothing at all before 2000.
    assert rand_ram(platform="mobile", max_year=2009, count=5) == []
    assert rand_ram(max_year=1990, count=5) == []
    # A range the wrong way round keeps max_year.
    assert all(
        detail.type == "DDR"
        for detail in rand_ram(
            min_year=2024, max_year=2003, platform="desktop", count=SAMPLE, output="detail"
        )
    )


def test_a_year_range_keeps_to_the_sizes_out_by_then_not_only_to_the_kinds() -> None:
    for max_year in (2005, 2010, 2015, 2020, 2022):
        for detail in rand_ram(max_year=max_year, count=LARGE // 4, output="detail"):
            entry = entry_of(detail)

            assert entry is not None, detail.ram
            size = next(each for each in entry.sizes if each.size == detail.bytes // MEGABYTE)
            assert size.first_year <= max_year, f"{detail.ram} {detail.type} by {max_year}"

    # The largest a desktop of 2010 came with was 32 GB of DDR3: the half a terabyte of a
    # workstation came three years later.
    old = rand_ram(platform="desktop", max_year=2010, count=LARGE, output="detail")
    assert all(detail.bytes <= 32 * GIGABYTE * MEGABYTE for detail in old)


def test_include_type_writes_the_kind_of_memory_after_the_size() -> None:
    for detail in rand_ram(include_type=True, count=SAMPLE * 3, output="detail"):
        assert detail.ram == f"{detail.value} {detail.unit} {detail.type}"

    # A bare number goes without the kind, the way it goes without the unit, and the
    # detail still carries it.
    for detail in rand_ram(include_type=True, include_unit=False, count=SAMPLE, output="detail"):
        assert re.fullmatch(r"\d+", detail.ram), detail.ram
        assert detail.type

    for detail in rand_ram(count=SAMPLE, output="detail"):
        assert detail.ram == f"{detail.value} {detail.unit}"


def test_ddr4_and_ddr5_lead_the_desktops_and_lpddr4x_and_later_the_phones() -> None:
    def share(details: list[RamDetail], kinds: tuple[str, ...]) -> float:
        return sum(1 for detail in details if detail.type in kinds) / len(details)

    desktop = rand_ram(platform="desktop", count=LARGE, output="detail")
    mobile = rand_ram(platform="mobile", count=LARGE, output="detail")

    assert share(desktop, ("DDR4", "DDR5")) > 0.5
    assert share(mobile, ("LPDDR4X", "LPDDR5", "LPDDR5X")) > 0.6


def test_unique_never_repeats_a_size_and_stops_when_the_sizes_run_out() -> None:
    ram = rand_ram(min_size=4, max_size=16, unique=True, count=100)

    assert len(set(ram)) == len(ram)
    assert set(ram) == {"4 GB", "6 GB", "8 GB", "12 GB", "16 GB"}

    # The whole pool too, though its rarest size is a draw in a thousand.
    every = rand_ram(unique=True, count=100, output="detail")

    assert len({detail.ram for detail in every}) == len(every)
    assert {detail.bytes // MEGABYTE for detail in every} == SIZES
