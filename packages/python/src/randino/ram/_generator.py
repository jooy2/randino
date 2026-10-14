"""The RAM generator: an amount of memory a machine is really sold with, in a whole unit.

Each size comes with the kind of memory it was sold as on the platform it was drawn for.
"""

from collections.abc import Callable

from randino._internal.capacity import CapacityCandidate, capacity_candidates, write_capacity
from randino._internal.generate import (
    collect_from,
    finite,
    kept_outcomes,
    resolve_option,
    resolve_platforms,
    resolve_years,
)
from randino._internal.utils import shares, with_random
from randino._types import (
    RamDetail,
    RamType,
    RamUnit,
    RamUnitOption,
    SystemPlatform,
    SystemPlatformOption,
)
from randino.ram.data import RAM_SCALE, RAM_SIZES, RAM_TYPE_ENTRIES, RAM_UNITS, RamTypeEntry

_RAM_UNIT_OPTIONS: tuple[RamUnitOption, ...] = (*RAM_UNITS, "auto")

_Sizes = list[tuple[CapacityCandidate[RamUnit], tuple[RamTypeEntry, ...]]]
"""The sizes a platform may land on, each with the kinds of memory it was sold as."""


def write_ram(capacity: str, type: str, include_type: bool) -> str:
    """Write `capacity` with the kind of memory after it where the call asked for it."""
    return f"{capacity} {type}" if include_type else capacity


def _candidates(
    platforms: tuple[SystemPlatform, ...],
    years: tuple[int, int],
    unit: str,
    min_size: object,
    max_size: object,
) -> list[tuple[SystemPlatform, _Sizes]]:
    """The sizes each platform may land on, with the kinds of memory sold at each.

    Worked out once per call, and only the kinds sold on that platform in the years asked
    for. A platform left with no size is left out, so `"all"` never draws a platform it
    then has nothing to write for.
    """
    min_year, max_year = years
    candidates: list[tuple[SystemPlatform, _Sizes]] = []

    for platform in platforms:
        # A kind is in when it was sold at any point of the range.
        types = [
            entry
            for entry in RAM_TYPE_ENTRIES
            if entry.platform == platform
            and entry.first_year <= max_year
            and (max_year if entry.last_year is None else entry.last_year) >= min_year
        ]
        sizes: _Sizes = []

        for candidate in capacity_candidates(
            RAM_SCALE, RAM_SIZES[platform], unit, min_size, max_size
        ):
            # A kind is in at a size when that size was out by the end of the range.
            sold = tuple(
                entry
                for entry in types
                if any(
                    each.size == candidate.size and each.first_year <= max_year
                    for each in entry.sizes
                )
            )

            if sold:
                sizes.append((candidate, sold))

        if sizes:
            candidates.append((platform, sizes))

    return candidates


_KEPT: dict[
    str, list[tuple[tuple[SystemPlatform, CapacityCandidate[RamUnit], RamType], float]]
] = {}
"""The sizes each set of options leaves, kept so a call does not work them out again."""


def generate_ram_details(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    unit: RamUnitOption = "auto",
    include_unit: bool = True,
    min_size: float | None = None,
    max_size: float | None = None,
    include_type: bool = False,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[RamDetail]:
    """Generate `count` amounts of memory, applied to every option."""
    # `is not False` and `is True` rather than truthiness, the way the npm package reads
    # them.
    with_unit = include_unit is not False
    # A kind of memory belongs to a size written as a size, so a bare number goes without
    # it, the way `rand_os` drops the build along with the version.
    with_type = with_unit and include_type is True
    asked = resolve_option(unit, _RAM_UNIT_OPTIONS, "auto")
    # Without the unit there is nothing to tell `512` megabytes from `16` gigabytes, so a
    # size written bare is in one unit throughout.
    written = RAM_SCALE.reference if asked == "auto" and not with_unit else asked
    platforms = resolve_platforms(platform)
    years = resolve_years(min_year, max_year)

    def listed() -> list[tuple[tuple[SystemPlatform, CapacityCandidate[RamUnit], RamType], float]]:
        candidates = _candidates(platforms, years, written, min_size, max_size)
        outcomes: list[
            tuple[tuple[SystemPlatform, CapacityCandidate[RamUnit], RamType], float]
        ] = []

        # The platform first, so `"all"` is half desktops and half phones, then the size,
        # then the kind of memory that size was sold as.
        for each, sizes in candidates:
            size_shares = shares(sizes, lambda size: size[0].weight)

            for (candidate, types), size_share in zip(sizes, size_shares, strict=True):
                for entry, share in zip(types, shares(types, lambda one: one.weight), strict=True):
                    outcomes.append(
                        ((each, candidate, entry.type), size_share * share / len(candidates))
                    )

        return outcomes

    key = "|".join(
        (
            ",".join(platforms),
            f"{years[0]},{years[1]}",
            written,
            str(finite(min_size)),
            str(finite(max_size)),
        )
    )
    outcomes = kept_outcomes(_KEPT, key, listed)

    def write(entry: tuple[SystemPlatform, CapacityCandidate[RamUnit], RamType]) -> str:
        _, candidate, kind = entry

        return write_ram(
            write_capacity(candidate.value, candidate.unit, with_unit), kind, with_type
        )

    def build(entry: tuple[SystemPlatform, CapacityCandidate[RamUnit], RamType]) -> RamDetail:
        drawn, candidate, kind = entry

        return RamDetail(
            ram=write(entry),
            value=candidate.value,
            unit=candidate.unit,
            bytes=candidate.size * RAM_SCALE.bytes,
            type=kind,
            platform=drawn,
        )

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=write,
            build=build,
        )
