"""Memory: real sizes, written in a unit each one is a whole number of."""

import re
from random import Random

from randino import RAM_UNITS, RAND_COUNT_MAX, RamUnitOption, rand_ram

# Internal, but they are what a result is checked against.
from randino._internal.capacity import fit_unit, in_unit
from randino.ram.data import RAM_SCALE

SAMPLE = 60
LARGE = 4000
MEGABYTE = 1024 * 1024
SIZES = [size for size, _ in RAM_SCALE.pool]


def test_rand_ram_returns_one_size_by_default() -> None:
    ram = rand_ram()

    assert len(ram) == 1
    assert re.fullmatch(r"\d+ (MB|GB)", ram[0])


def test_returns_exactly_count_sizes() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_ram(count=count)) == count

    assert rand_ram(count=-3) == []
    assert len(rand_ram(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_the_pool_is_every_size_once_smallest_first() -> None:
    for i, (size, weight) in enumerate(RAM_SCALE.pool):
        assert size > 0
        assert weight > 0

        if i > 0:
            assert size > RAM_SCALE.pool[i - 1][0], f"{size} is out of order"


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

            assert size in SIZES, detail.ram
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


def test_unique_never_repeats_a_size_and_stops_when_the_sizes_run_out() -> None:
    # Kept to the common sizes, so every one of them is reached long before the draws
    # run out: the rarest of the whole pool is a draw in a thousand.
    ram = rand_ram(min_size=4, max_size=16, unique=True, count=100)

    assert len(set(ram)) == len(ram)
    assert set(ram) == {"4 GB", "6 GB", "8 GB", "12 GB", "16 GB"}
