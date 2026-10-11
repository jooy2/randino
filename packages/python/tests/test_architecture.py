"""Architectures: mostly x86 and Arm, and the rarer ones only when asked for."""

from random import Random
from typing import Any

from randino import (
    ARCHITECTURE_NAMINGS,
    ARCHITECTURES,
    RAND_COUNT_MAX,
    SYSTEM_PLATFORMS,
    ArchitectureNaming,
    rand_architecture,
)

# Internal, but they are what a result is checked against.
from randino.architecture._generator import aliases_of, write_architecture
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
        assert len(data.weights) > 0, architecture
        assert all(weight > 0 for weight in data.weights.values()), architecture

        for name in (architecture, *data.aliases):
            assert name not in names, f"{name} is written twice"
            names.add(name)

        # Every naming writes a name the architecture goes by.
        for naming in ARCHITECTURE_NAMINGS:
            assert write_architecture(architecture, naming) in (architecture, *data.aliases), (
                f"{architecture} {naming}"
            )

    # The four common ones are what a hundred draws are split between, on each platform,
    # and the rare ones are a desktop's alone.
    common = [each for each in ARCHITECTURES if not ARCHITECTURE_DATA[each].rare]

    assert common == ["x86_64", "arm64", "x86", "armv7"]

    for platform in SYSTEM_PLATFORMS:
        assert sum(ARCHITECTURE_DATA[each].weights.get(platform, 0) for each in common) == 100, (
            platform
        )

    assert all(
        "mobile" not in ARCHITECTURE_DATA[each].weights
        for each in ARCHITECTURES
        if ARCHITECTURE_DATA[each].rare
    )


def test_the_detail_is_the_architectures_own_data() -> None:
    for detail in rand_architecture(include_rare=True, count=SAMPLE * 3, output="detail"):
        data = ARCHITECTURE_DATA[detail.code]

        assert detail.architecture == detail.code
        assert detail.aliases == data.aliases
        assert detail.platform in data.weights, detail.architecture
        assert detail.bits == data.bits
        assert detail.family == data.family
        assert detail.rare == data.rare


def test_x86_and_arm_alone_until_the_rare_ones_are_asked_for() -> None:
    assert set(rand_architecture(count=LARGE)) == {"x86_64", "arm64", "x86", "armv7"}
    assert len(set(rand_architecture(include_rare=True, count=LARGE))) == len(ARCHITECTURES)


def test_64_bit_x86_and_arm_are_nearly_every_draw_and_the_rare_ones_uncommon() -> None:
    details = rand_architecture(include_rare=True, count=LARGE, output="detail")
    wide = sum(1 for each in details if each.architecture in ("x86_64", "arm64")) / len(details)

    assert wide > 0.75

    # About one desktop draw in twenty, the rare ones being a desktop's alone.
    desktop = rand_architecture(platform="desktop", include_rare=True, count=LARGE, output="detail")
    rare = sum(1 for each in desktop if each.rare) / len(desktop)

    assert 0.02 < rare < 0.08, rare


def test_platform_keeps_to_the_architectures_of_one_kind_of_machine() -> None:
    mobile = rand_architecture(platform="mobile", include_rare=True, count=LARGE, output="detail")

    assert all(detail.platform == "mobile" for detail in mobile)
    # A phone is Arm nearly always, never 64-bit x86 and never a rare one.
    assert {detail.architecture for detail in mobile} == {"arm64", "armv7", "x86"}
    assert sum(1 for detail in mobile if detail.family == "arm") / len(mobile) > 0.9

    desktop = rand_architecture(platform="desktop", count=LARGE, output="detail")

    assert all(detail.platform == "desktop" for detail in desktop)
    assert sum(1 for detail in desktop if detail.architecture == "x86_64") / len(desktop) > 0.7

    both = {detail.platform for detail in rand_architecture(count=SAMPLE * 3, output="detail")}

    assert len(both) == len(SYSTEM_PLATFORMS)


def test_naming_writes_debians_gos_or_the_kernels_names() -> None:
    def written(naming: ArchitectureNaming) -> list[str]:
        return [write_architecture(each, naming) for each in ARCHITECTURES]

    assert written("common") == list(ARCHITECTURES)
    assert written("debian")[:4] == ["amd64", "arm64", "i386", "armhf"]
    assert written("go")[:4] == ["amd64", "arm64", "386", "arm"]
    assert written("kernel")[:4] == ["x86_64", "aarch64", "i686", "armv7l"]

    for naming in ARCHITECTURE_NAMINGS:
        for detail in rand_architecture(
            naming=naming, include_rare=True, count=SAMPLE * 3, output="detail"
        ):
            assert detail.architecture == write_architecture(detail.code, naming)
            # The common name is among the aliases whenever it is not the one written.
            assert detail.aliases == aliases_of(detail.code, detail.architecture)
            assert detail.architecture not in detail.aliases, detail.architecture
            assert (detail.code in detail.aliases) == (detail.architecture != detail.code), (
                detail.architecture
            )

    # An unknown naming reads as the common one.
    loose: Any = rand_architecture

    assert all(each in ARCHITECTURES for each in loose(naming="apple", count=SAMPLE))


def test_the_value_form_is_the_architecture_of_each_detail() -> None:
    values = rand_architecture(include_rare=True, count=SAMPLE, random=Random(7).random)
    details = rand_architecture(
        include_rare=True, count=SAMPLE, random=Random(7).random, output="detail"
    )

    assert values == [detail.architecture for detail in details]


def test_unique_never_repeats_an_architecture_and_stops_when_they_run_out() -> None:
    assert set(rand_architecture(unique=True, count=10)) == {"x86_64", "arm64", "x86", "armv7"}
