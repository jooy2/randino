"""The RAM generator: an amount of memory a machine is really sold with, in a whole unit."""

from collections.abc import Callable

from randino._internal.capacity import capacity_candidates, write_capacity
from randino._internal.generate import collect, resolve_option
from randino._internal.utils import pick_weighted, with_random
from randino._types import RamDetail, RamUnitOption
from randino.ram.data import RAM_SCALE, RAM_UNITS

_RAM_UNIT_OPTIONS: tuple[RamUnitOption, ...] = (*RAM_UNITS, "auto")


def generate_ram_details(
    *,
    unit: RamUnitOption = "auto",
    include_unit: bool = True,
    min_size: float | None = None,
    max_size: float | None = None,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[RamDetail]:
    """Generate `count` amounts of memory, applied to every option."""
    # `is not False` rather than truthiness, the way the npm package reads it.
    with_unit = include_unit is not False
    asked = resolve_option(unit, _RAM_UNIT_OPTIONS, "auto")
    # Without the unit there is nothing to tell `512` megabytes from `16` gigabytes, so a
    # size written bare is in one unit throughout.
    written = RAM_SCALE.reference if asked == "auto" and not with_unit else asked
    # Worked out once per call: at most a couple of dozen sizes, each with its unit
    # already decided.
    candidates = capacity_candidates(RAM_SCALE, written, min_size, max_size)

    def draw() -> RamDetail:
        candidate = pick_weighted(candidates, lambda each: each.weight)

        return RamDetail(
            ram=write_capacity(candidate.value, candidate.unit, with_unit),
            value=candidate.value,
            unit=candidate.unit,
            bytes=candidate.size * RAM_SCALE.bytes,
        )

    with with_random(random):
        return collect(
            count=count if candidates else 0,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.ram,
        )
