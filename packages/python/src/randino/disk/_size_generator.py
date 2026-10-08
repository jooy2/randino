"""The disk size generator: a capacity a drive is really sold with, in a whole unit."""

from collections.abc import Callable

from randino._internal.capacity import capacity_candidates, write_capacity
from randino._internal.generate import collect, resolve_option
from randino._internal.utils import pick_weighted, with_random
from randino._types import DiskSizeDetail, DiskUnitOption
from randino.disk.data import DISK_SCALE, DISK_UNITS

_DISK_UNIT_OPTIONS: tuple[DiskUnitOption, ...] = (*DISK_UNITS, "auto")


def generate_disk_size_details(
    *,
    unit: DiskUnitOption = "auto",
    include_unit: bool = True,
    min_size: int | None = None,
    max_size: int | None = None,
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
    # Worked out once per call: a couple of dozen sizes, each with its unit already
    # decided.
    candidates = capacity_candidates(DISK_SCALE, written, min_size, max_size)

    def draw() -> DiskSizeDetail:
        candidate = pick_weighted(candidates, lambda each: each.weight)

        return DiskSizeDetail(
            size=write_capacity(candidate.value, candidate.unit, with_unit),
            value=candidate.value,
            unit=candidate.unit,
            bytes=candidate.size * DISK_SCALE.bytes,
        )

    with with_random(random):
        return collect(
            count=count if candidates else 0,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.size,
        )
