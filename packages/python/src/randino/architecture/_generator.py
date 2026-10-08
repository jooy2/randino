"""The architecture generator: what a processor runs, by the name a toolchain writes it."""

from collections.abc import Callable

from randino._internal.generate import collect
from randino._internal.utils import pick_weighted, with_random
from randino._types import ArchitectureDetail
from randino.architecture.data import ARCHITECTURE_DATA, ARCHITECTURES


def generate_architecture_details(
    *,
    include_rare: bool = False,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[ArchitectureDetail]:
    """Generate `count` architectures, applied to every option."""
    # `is True` rather than truthiness, the way the npm package reads it.
    with_rare = include_rare is True
    candidates = [each for each in ARCHITECTURES if with_rare or not ARCHITECTURE_DATA[each].rare]

    def draw() -> ArchitectureDetail:
        architecture = pick_weighted(candidates, lambda each: ARCHITECTURE_DATA[each].weight)
        data = ARCHITECTURE_DATA[architecture]

        return ArchitectureDetail(
            architecture=architecture,
            aliases=data.aliases,
            bits=data.bits,
            family=data.family,
            rare=data.rare,
        )

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.architecture,
        )
