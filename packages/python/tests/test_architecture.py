"""Architectures: mostly x86 and Arm, and the rarer ones only when asked for."""

from random import Random

from randino import ARCHITECTURES, RAND_COUNT_MAX, rand_architecture

# Internal, but it is what a result is checked against.
from randino.architecture.data import ARCHITECTURE_DATA

SAMPLE = 60
LARGE = 6000


def test_rand_architecture_returns_one_architecture_by_default() -> None:
    architectures = rand_architecture()

    assert len(architectures) == 1
    assert architectures[0] in ARCHITECTURES


def test_returns_exactly_count_architectures() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_architecture(count=count)) == count

    assert rand_architecture(count=-3) == []
    assert len(rand_architecture(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_architecture_is_described_and_no_name_is_another_ones_alias() -> None:
    assert set(ARCHITECTURE_DATA) == set(ARCHITECTURES)

    names: set[str] = set()

    for architecture in ARCHITECTURES:
        data = ARCHITECTURE_DATA[architecture]

        assert data.bits in (32, 64), architecture
        assert data.weight > 0, architecture

        for name in (architecture, *data.aliases):
            assert name not in names, f"{name} is written twice"
            names.add(name)

    common = [each for each in ARCHITECTURES if not ARCHITECTURE_DATA[each].rare]

    assert common == ["x86_64", "arm64", "x86", "armv7"]
    assert sum(ARCHITECTURE_DATA[each].weight for each in common) == 100


def test_the_detail_is_the_architectures_own_data() -> None:
    for detail in rand_architecture(include_rare=True, count=SAMPLE * 3, output="detail"):
        data = ARCHITECTURE_DATA[detail.architecture]

        assert detail.aliases == data.aliases
        assert detail.bits == data.bits
        assert detail.family == data.family
        assert detail.rare == data.rare


def test_x86_and_arm_alone_until_the_rare_ones_are_asked_for() -> None:
    assert set(rand_architecture(count=LARGE)) == {"x86_64", "arm64", "x86", "armv7"}
    assert len(set(rand_architecture(include_rare=True, count=LARGE))) == len(ARCHITECTURES)


def test_64_bit_x86_and_arm_are_nearly_every_draw_and_the_rare_ones_uncommon() -> None:
    details = rand_architecture(include_rare=True, count=LARGE, output="detail")
    wide = sum(1 for each in details if each.architecture in ("x86_64", "arm64")) / len(details)
    rare = sum(1 for each in details if each.rare) / len(details)

    assert wide > 0.75
    assert 0.02 < rare < 0.08


def test_the_value_form_is_the_architecture_of_each_detail() -> None:
    values = rand_architecture(include_rare=True, count=SAMPLE, random=Random(7).random)
    details = rand_architecture(
        include_rare=True, count=SAMPLE, random=Random(7).random, output="detail"
    )

    assert values == [detail.architecture for detail in details]


def test_unique_never_repeats_an_architecture_and_stops_when_they_run_out() -> None:
    assert set(rand_architecture(unique=True, count=10)) == {"x86_64", "arm64", "x86", "armv7"}
