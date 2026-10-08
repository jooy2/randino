"""Graphics processors: real parts, by the names their makers gave them."""

from random import Random

from randino import RAND_COUNT_MAX, SYSTEM_PLATFORMS, rand_gpu

# Internal, but they are what a result is checked against.
from randino.gpu._generator import write_gpu
from randino.gpu.data import GPUS

SAMPLE = 60


def test_rand_gpu_returns_one_graphics_processor_by_default() -> None:
    gpus = rand_gpu()

    assert len(gpus) == 1
    assert isinstance(gpus[0], str)


def test_returns_exactly_count_graphics_processors() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_gpu(count=count)) == count

    assert rand_gpu(count=-3) == []
    assert len(rand_gpu(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_graphics_processor_in_the_catalog_is_well_formed() -> None:
    seen: set[str] = set()

    for entry in GPUS:
        key = f"{entry.vendor} {entry.model}"

        assert key not in seen, f"{key} is listed twice"
        seen.add(key)
        assert entry.platform in SYSTEM_PLATFORMS, key
        assert 2006 <= entry.year <= 2025, key
        assert not entry.model.startswith(entry.vendor), key

    for platform in SYSTEM_PLATFORMS:
        assert sum(1 for entry in GPUS if entry.platform == platform) >= 40, platform


def test_every_graphics_processor_is_one_the_catalog_holds_written_as_its_detail_says() -> None:
    for detail in rand_gpu(count=SAMPLE * 5, output="detail"):
        entry = next(
            each for each in GPUS if each.vendor == detail.vendor and each.model == detail.model
        )

        assert detail.gpu == write_gpu(entry, True)
        assert detail.gpu == f"{detail.vendor} {detail.model}"
        assert detail.platform == entry.platform
        assert detail.year == entry.year

    for detail in rand_gpu(include_vendor=False, count=SAMPLE * 3, output="detail"):
        assert detail.gpu == detail.model


def test_platform_keeps_to_the_graphics_processors_of_one_kind_of_machine() -> None:
    for platform in SYSTEM_PLATFORMS:
        details = rand_gpu(platform=platform, count=SAMPLE * 3, output="detail")

        assert all(detail.platform == platform for detail in details)

    both = {detail.platform for detail in rand_gpu(count=SAMPLE * 3, output="detail")}

    assert len(both) == len(SYSTEM_PLATFORMS)


def test_a_year_range_keeps_to_the_graphics_processors_out_in_it() -> None:
    for detail in rand_gpu(min_year=2015, max_year=2018, count=SAMPLE * 3, output="detail"):
        assert 2015 <= detail.year <= 2018, detail.gpu

    as_of = rand_gpu(platform="desktop", max_year=2010, unique=True, count=100)

    assert "NVIDIA GeForce GTX 480" in as_of
    assert "NVIDIA GeForce GTX 560 Ti" not in as_of


def test_a_year_range_nothing_came_out_in_answers_with_nothing() -> None:
    assert rand_gpu(max_year=2005, count=5) == []
    assert rand_gpu(min_year=2030, count=5) == []
    # The first phone GPU in the catalog is the 2013 Adreno 330.
    assert rand_gpu(platform="mobile", max_year=2012) == []

    for detail in rand_gpu(min_year=2024, max_year=2016, count=SAMPLE, output="detail"):
        assert detail.year == 2016, detail.gpu


def test_the_value_form_is_the_graphics_processor_of_each_detail() -> None:
    values = rand_gpu(count=SAMPLE, random=Random(7).random)
    details = rand_gpu(count=SAMPLE, random=Random(7).random, output="detail")

    assert values == [detail.gpu for detail in details]


def test_unique_never_repeats_a_graphics_processor_and_stops_when_they_run_out() -> None:
    expected = {
        write_gpu(entry, True)
        for entry in GPUS
        if entry.platform == "mobile" and entry.year == 2025
    }
    found = rand_gpu(platform="mobile", min_year=2025, unique=True, count=100)

    assert len(set(found)) == len(found)
    assert set(found) == expected
