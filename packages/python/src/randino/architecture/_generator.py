"""The architecture generator: what a processor runs, by the name a toolchain writes it."""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_option, resolve_platforms
from randino._internal.utils import pick, pick_weighted, with_random
from randino._types import (
    Architecture,
    ArchitectureDetail,
    ArchitectureNaming,
    SystemPlatform,
    SystemPlatformOption,
)
from randino.architecture.data import ARCHITECTURE_DATA, ARCHITECTURE_NAMINGS, ARCHITECTURES


def write_architecture(architecture: Architecture, naming: ArchitectureNaming) -> str:
    """Write `architecture` by the names `naming` writes."""
    return architecture if naming == "common" else ARCHITECTURE_DATA[architecture].names[naming]


def aliases_of(architecture: Architecture, written: str) -> tuple[str, ...]:
    """Every name `architecture` goes by but `written`, the common one first where it is not.

    Debian and Go share most of their names, so a name is listed once however many namings
    write it.
    """
    return tuple(
        name for name in (architecture, *ARCHITECTURE_DATA[architecture].aliases) if name != written
    )


def generate_architecture_details(
    *,
    platform: SystemPlatformOption = "all",
    include_rare: bool = False,
    naming: ArchitectureNaming = "common",
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[ArchitectureDetail]:
    """Generate `count` architectures, applied to every option."""
    # `is True` rather than truthiness, the way the npm package reads it.
    with_rare = include_rare is True
    written_by = resolve_option(naming, ARCHITECTURE_NAMINGS, "common")
    # The architectures each platform may land on, worked out once per call. A platform
    # none of them runs on is left out, so `"all"` never draws a platform it then has
    # nothing to write for.
    candidates: list[tuple[SystemPlatform, list[Architecture]]] = []

    for each in resolve_platforms(platform):
        architectures = [
            architecture
            for architecture in ARCHITECTURES
            if each in ARCHITECTURE_DATA[architecture].weights
            and (with_rare or not ARCHITECTURE_DATA[architecture].rare)
        ]

        if architectures:
            candidates.append((each, architectures))

    def draw() -> ArchitectureDetail:
        # The platform first, so `"all"` is half desktops and half phones.
        drawn, architectures = pick(candidates)
        architecture = pick_weighted(
            architectures, lambda each: ARCHITECTURE_DATA[each].weights[drawn]
        )
        data = ARCHITECTURE_DATA[architecture]
        written = write_architecture(architecture, written_by)

        return ArchitectureDetail(
            architecture=written,
            code=architecture,
            aliases=aliases_of(architecture, written),
            bits=data.bits,
            family=data.family,
            rare=data.rare,
            platform=drawn,
        )

    with with_random(random):
        return collect(
            count=count if candidates else 0,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.architecture,
        )
