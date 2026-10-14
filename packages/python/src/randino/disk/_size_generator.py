"""The disk size generator: a capacity a drive is really sold with, in a whole unit.

Each size is one its kind of storage is sold in, for a platform that uses that kind.
"""

from collections.abc import Callable

from randino._internal.capacity import CapacityCandidate, capacity_candidates, write_capacity
from randino._internal.generate import (
    collect_from,
    finite,
    kept_outcomes,
    resolve_many,
    resolve_option,
    resolve_platforms,
)
from randino._internal.utils import shares, with_random
from randino._types import (
    DiskSizeDetail,
    DiskType,
    DiskTypeOption,
    DiskUnit,
    DiskUnitOption,
    SystemPlatform,
    SystemPlatformOption,
)
from randino.disk.data import DISK_SCALE, DISK_SIZES, DISK_TYPE_WEIGHTS, DISK_TYPES, DISK_UNITS

_DISK_UNIT_OPTIONS: tuple[DiskUnitOption, ...] = (*DISK_UNITS, "auto")

_Kinds = list[tuple[DiskType, list[CapacityCandidate[DiskUnit]]]]
"""The kinds of storage a platform may land on, each with the sizes of it a call may write."""


def _candidates(
    platforms: tuple[SystemPlatform, ...],
    named: tuple[DiskType, ...],
    unit: str,
    min_size: object,
    max_size: object,
) -> list[tuple[SystemPlatform, _Kinds]]:
    """The kinds of storage each platform may land on, each with its sizes.

    Worked out once per call: a kind with no size left in the unit and the range asked for
    is left out, and so is a platform with no kind left, so `"all"` never draws a platform
    it then has nothing to write for.
    """
    candidates: list[tuple[SystemPlatform, _Kinds]] = []

    for platform in platforms:
        kinds: _Kinds = []

        for kind in named:
            if kind not in DISK_TYPE_WEIGHTS[platform]:
                continue

            sizes = capacity_candidates(DISK_SCALE, DISK_SIZES[kind], unit, min_size, max_size)

            if sizes:
                kinds.append((kind, sizes))

        if kinds:
            candidates.append((platform, kinds))

    return candidates


_KEPT: dict[
    str, list[tuple[tuple[SystemPlatform, DiskType, CapacityCandidate[DiskUnit]], float]]
] = {}
"""The sizes each set of options leaves, kept so a call does not work them out again."""


def generate_disk_size_details(
    *,
    type: DiskTypeOption = "all",
    platform: SystemPlatformOption = "all",
    unit: DiskUnitOption = "auto",
    include_unit: bool = True,
    min_size: float | None = None,
    max_size: float | None = None,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[DiskSizeDetail]:
    """Generate `count` drive capacities, applied to every option."""
    # `is not False` rather than truthiness, the way the npm package reads it.
    with_unit = include_unit is not False
    asked = resolve_option(unit, _DISK_UNIT_OPTIONS, "auto")
    # Without the unit there is nothing to tell `2` terabytes from `512` gigabytes, so a
    # size written bare is in one unit throughout.
    written = DISK_SCALE.reference if asked == "auto" and not with_unit else asked
    platforms = resolve_platforms(platform)
    kinds_asked = resolve_many(type, DISK_TYPES, DISK_TYPES)

    def listed() -> list[
        tuple[tuple[SystemPlatform, DiskType, CapacityCandidate[DiskUnit]], float]
    ]:
        candidates = _candidates(platforms, kinds_asked, written, min_size, max_size)
        outcomes: list[
            tuple[tuple[SystemPlatform, DiskType, CapacityCandidate[DiskUnit]], float]
        ] = []

        # The platform first, so `"all"` is half desktops and half phones, then the kind of
        # storage by how common it is there, then a size it is sold in.
        for each, kinds in candidates:
            kind_shares = shares([DISK_TYPE_WEIGHTS[each][kind] for kind, _ in kinds], float)

            for (kind, sizes), kind_share in zip(kinds, kind_shares, strict=True):
                for candidate, share in zip(
                    sizes, shares(sizes, lambda size: size.weight), strict=True
                ):
                    outcomes.append(((each, kind, candidate), kind_share * share / len(candidates)))

        return outcomes

    key = "|".join(
        (
            ",".join(platforms),
            ",".join(kinds_asked),
            written,
            str(finite(min_size)),
            str(finite(max_size)),
        )
    )
    outcomes = kept_outcomes(_KEPT, key, listed)

    def build(
        entry: tuple[SystemPlatform, DiskType, CapacityCandidate[DiskUnit]],
    ) -> DiskSizeDetail:
        drawn, kind, candidate = entry

        return DiskSizeDetail(
            size=write_capacity(candidate.value, candidate.unit, with_unit),
            value=candidate.value,
            unit=candidate.unit,
            bytes=candidate.size * DISK_SCALE.bytes,
            type=kind,
            platform=drawn,
        )

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=lambda entry: write_capacity(entry[2].value, entry[2].unit, with_unit),
            build=build,
        )
