"""The architecture generator: what a processor runs, by the name a toolchain writes it."""

from collections.abc import Callable

from randino._internal.generate import (
    collect_from,
    kept_outcomes,
    resolve_option,
    resolve_platforms,
)
from randino._internal.utils import shares, with_random
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


_KEPT: dict[str, list[tuple[tuple[SystemPlatform, Architecture], float]]] = {}
"""The architectures each set of options leaves, kept so a call does not work them out again."""


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
    platforms = resolve_platforms(platform)

    def listed() -> list[tuple[tuple[SystemPlatform, Architecture], float]]:
        # The architectures each platform may land on. A platform none of them runs on is
        # left out, so `"all"` never draws a platform it then has nothing to write for.
        candidates: list[tuple[SystemPlatform, list[Architecture]]] = []

        for each in platforms:
            architectures = [
                architecture
                for architecture in ARCHITECTURES
                if each in ARCHITECTURE_DATA[architecture].weights
                and (with_rare or not ARCHITECTURE_DATA[architecture].rare)
            ]

            if architectures:
                candidates.append((each, architectures))

        # The platform first, so `"all"` is half desktops and half phones.
        outcomes: list[tuple[tuple[SystemPlatform, Architecture], float]] = []

        for each, architectures in candidates:
            weights = [ARCHITECTURE_DATA[one].weights[each] for one in architectures]

            for architecture, share in zip(architectures, shares(weights, float), strict=True):
                outcomes.append(((each, architecture), share / len(candidates)))

        return outcomes

    outcomes = kept_outcomes(_KEPT, f"{','.join(platforms)}|{with_rare}", listed)

    def build(entry: tuple[SystemPlatform, Architecture]) -> ArchitectureDetail:
        drawn, architecture = entry
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
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=lambda entry: write_architecture(entry[1], written_by),
            build=build,
        )
